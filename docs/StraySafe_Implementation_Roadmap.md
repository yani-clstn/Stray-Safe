# STRAY SAFE — Full Implementation Roadmap

An end-to-end build plan: hardware → firmware → database → backend API → web dashboard → analytics → deployment.

Since you already built [Offerly](#) with **React + Vite + TypeScript + Neon + Drizzle + Hono**, deployed as two separate Vercel projects, this plan reuses that exact stack. Less to learn, and you already know the deployment pattern.

---

## 1. Tech Stack at a Glance

| Layer | Technology | Why |
|---|---|---|
| Microcontroller | **ESP32 Dev Board** (single board) | Has Wi-Fi built in — no need for a separate Arduino + ESP32; one board reads sensors, drives actuators, and talks to the internet |
| Firmware language | **C++ (Arduino framework)** via **PlatformIO** (VS Code extension) or Arduino IDE | PlatformIO gives you library management + version control friendly project structure |
| Sensors | PIR motion, HC-SR04 ultrasonic ×2 (food/water level), DS3231 RTC, INA219 (optional, for solar/battery current-voltage monitoring) | Matches your lab document's component list |
| Actuators | SG90/MG996R servo (food gate), 5V mini submersible pump, buzzer/LED | — |
| Power | Solar panel + PWM/MPPT charge controller + 12V Li-ion or SLA battery, buck converter down to 5V for the ESP32 | — |
| Connectivity | Wi-Fi (ESP32 built-in), **HTTPS REST calls** (not MQTT) | Simplest to pair with a serverless backend — no broker to host |
| Backend | **Hono** (TypeScript, same as Offerly) | You already know it; deploys natively as Vercel Functions |
| Database | **Neon Postgres** (serverless Postgres) | You already use it; scales to zero, free tier is enough for this project |
| ORM | **Drizzle ORM** | Same as Offerly |
| Auth (dashboard users) | **Better Auth** (email/password) | Same as Offerly |
| Device auth | Simple per-station API key (bearer token) checked in the API route | Devices don't need full user auth, just a shared secret |
| Frontend | **React + Vite + TypeScript + Tailwind CSS** | Same as Offerly |
| Data fetching | **TanStack Query** (React Query) with polling (`refetchInterval`) | Gives you "near real-time" updates without needing WebSockets |
| Charts | **Recharts** | Matches the bar chart in your wireframe (Figure 2) |
| Hosting | **Vercel** — two projects, frontend + backend, exactly like Offerly | See §7 for why this works well here |
| Repo structure | Monorepo: `firmware/`, `client/` (Vite), `server/` (Hono) | Keeps everything in one GitHub repo for your portfolio |

---

## 2. System Architecture (data path)

```
[ESP32 + sensors/actuators]
        │  HTTPS POST every N seconds/minutes
        ▼
[Hono API on Vercel Functions]  ── validates API key, writes row
        ▼
[Neon Postgres via Drizzle]
        ▲
        │  HTTPS GET (polling every ~10–30s)
[React dashboard on Vercel]
```

The ESP32 never talks to the database directly — it only ever calls your API. The dashboard never talks to the ESP32 directly either — it only ever calls your API and reads from Postgres. This is the same shape as Offerly's client → server → Neon pattern, just with a device added as a second "client."

---

## 3. Phase 1 — Hardware Assembly

1. **Gather components**: ESP32 dev board, PIR sensor, 2× HC-SR04, DS3231 RTC, servo motor, mini water pump + relay/MOSFET driver (pumps draw more current than a GPIO pin can supply), buzzer, solar panel (10–20W), PWM/MPPT charge controller, 12V rechargeable battery, buck converter (12V→5V), weatherproof enclosure, food hopper, water reservoir, mounting frame.
2. **Wire the low-power sensors first** (breadboard stage, no motors yet):
   - PIR → digital GPIO (interrupt-capable pin, e.g. GPIO 27)
   - HC-SR04 (food) → Trig/Echo on GPIO 5/18
   - HC-SR04 (water) → Trig/Echo on GPIO 19/21
   - DS3231 → I2C (SDA/SCL, GPIO 21/22 — note: pick non-conflicting pins if also using I2C elsewhere)
3. **Add actuators through drivers**, not directly off GPIO:
   - Servo → GPIO 13 (PWM), powered from the 5V rail, **not** the ESP32's 3V3 pin
   - Water pump → via a relay module or logic-level MOSFET, GPIO 25 controls the gate/relay coil
   - Buzzer/LED → GPIO 26
4. **Wire the power chain**: Solar panel → charge controller → battery → buck converter → ESP32 VIN + actuator rail. Add a multimeter check here before connecting the ESP32 — confirm the buck converter outputs a clean 5V under load.
5. **Bench-test each subsystem individually** (a sensor sketch that just prints to Serial Monitor) before combining into the full firmware. This isolates wiring problems early.
6. **Final assembly**: mount everything in the weatherproof enclosure, cable-glands for sensor wires that exit the box, solar panel mounted at an angle facing the sun, hopper/reservoir plumbed to the servo gate and pump outlet.

---

## 4. Phase 2 — Firmware / IoT Setup

1. **Install PlatformIO** (VS Code extension) — create a new project, board `esp32dev`, framework `arduino`.
2. **Get Wi-Fi connectivity working first**:
   ```cpp
   #include <WiFi.h>
   WiFi.begin(ssid, password);
   ```
   Confirm it can reconnect after a drop (outdoor Wi-Fi will be flaky) — wrap connection logic in a retry loop with backoff.
3. **Read sensors into a struct** every loop iteration (or on a timer) — motion, food %, water %, RTC time.
4. **Implement the feeding logic on-device**:
   - On motion detected + cooldown expired (PawGuard) → trigger servo → log a "feeding event" flag to send up.
   - On RTC match with a scheduled time slot (fetched from the server, see below) → trigger scheduled feed.
5. **Fetch the feeding schedule from your API** on boot and periodically (e.g. every hour) via `HTTPClient` `GET /api/stations/:id/schedule` — this lets caretakers change the schedule from the dashboard without re-flashing the device.
6. **Push readings to the backend** via `HTTPClient` `POST /api/readings` with a JSON body:
   ```json
   {
     "stationId": "station-01",
     "foodLevel": 38,
     "waterLevel": 64,
     "solarPercent": 30,
     "batteryVoltage": 12.6,
     "motionEvent": false,
     "timestamp": "2026-08-28T10:15:00Z"
   }
   ```
   Send this every 1–5 minutes normally, and immediately after any feeding event.
7. **Authenticate the device** by sending a per-station API key in an `Authorization: Bearer <key>` header — generate this key when you register the station in your database, store it as a secret on the device (not hardcoded in a public repo — use a `secrets.h` file that's gitignored).
8. **Power-saving**: between reading cycles, consider `esp_sleep` light-sleep modes to stretch battery life on cloudy days, since it's solar-powered.

---

## 5. Phase 3 — Database Schema (Neon + Drizzle)

Set this up exactly like Offerly's `server/` package — same `drizzle.config.ts` pattern, same `DATABASE_URL` env var from Neon.

```ts
// schema.ts (Drizzle)
export const stations = pgTable("stations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  apiKeyHash: text("api_key_hash").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  foodLevel: integer("food_level"),
  waterLevel: integer("water_level"),
  solarPercent: integer("solar_percent"),
  batteryVoltage: real("battery_voltage"),
  motionEvent: boolean("motion_event").default(false),
  recordedAt: timestamp("recorded_at").notNull(),
});

export const feedingSchedules = pgTable("feeding_schedules", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  timeOfDay: text("time_of_day"), // "06:00", "12:00", "18:00"
  portionGrams: integer("portion_grams"),
  active: boolean("active").default(true),
});

export const feedingEvents = pgTable("feeding_events", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  triggeredBy: text("triggered_by"), // "schedule" | "motion"
  occurredAt: timestamp("occurred_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  type: text("type"), // "low_food" | "low_water" | "low_battery" | "offline"
  message: text("message"),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  // Better Auth's standard fields, same as Offerly
});
```

Run `drizzle-kit push` against your Neon branch, same workflow you used for Offerly.

---

## 6. Phase 4 — Backend API (Hono)

Mirror Offerly's `server/` folder structure. Key routes:

| Method & Path | Purpose | Auth |
|---|---|---|
| `POST /api/readings` | Device pushes a sensor reading | Station API key |
| `GET /api/stations/:id/schedule` | Device fetches its current feeding schedule | Station API key |
| `POST /api/stations/:id/feeding-event` | Device logs that it dispensed food | Station API key |
| `GET /api/stations/:id` | Dashboard fetches latest status | User session (Better Auth) |
| `GET /api/stations/:id/analytics?range=7d` | Dashboard fetches aggregated chart data | User session |
| `PUT /api/stations/:id/schedule` | Caretaker edits the schedule | User session |
| `GET /api/stations/:id/alerts` | Dashboard fetches unresolved alerts | User session |

Add a small piece of **server-side logic on every `POST /api/readings`**: if `foodLevel < 20` or `waterLevel < 20` or `batteryVoltage` below a threshold, insert a row into `alerts` (only if one isn't already open, to avoid spamming). This is what powers the notification card in your wireframe.

---

## 7. Phase 5 — Web Dashboard (React + Vite)

1. Scaffold with Vite (`npm create vite@latest client -- --template react-ts`), Tailwind, same as Offerly's client setup.
2. Pages/routes (React Router, same as Offerly): `/login`, `/dashboard`, `/dashboard/:stationId`, `/schedule`, `/reports`, `/settings`.
3. Use **TanStack Query** with `refetchInterval: 15000` (15s) on the station status query — this gives you a live-feeling dashboard without WebSockets, which fits the serverless/Vercel model well.
4. Build the cards from Figure 1's wireframe: Food Level, Water Level, Solar Energy Used, Animal Visits (with the weekly Recharts bar chart), Station Status, Next Scheduled Feeding, Notifications panel, Feeding Schedule editor.
5. Protect dashboard routes with Better Auth's session check, same pattern as Offerly.

---

## 8. Phase 6 — Data Analytics Display

- **Weekly visits chart**: `GROUP BY date_trunc('day', recorded_at)` on `feeding_events` where `triggered_by = 'motion'`, last 7 days — feed this array into Recharts `<BarChart>`.
- **Food/water trend**: line chart of `readings.foodLevel`/`waterLevel` over time, useful for spotting a consumption pattern (e.g., "empties faster on weekends").
- **Solar/battery health**: line chart of `solarPercent`/`batteryVoltage` over a day, useful for tuning panel angle or spotting a failing battery.
- **"Online/Offline" status**: derive this in the API, not stored as a column — if the latest reading's `recordedAt` is older than ~10 minutes, mark the station offline. A daily Vercel Cron job (see below) can also sweep for stale stations and raise an "offline" alert.
- **Daily summary job** (optional, nice for a capstone defense): a Vercel Cron job once a day that computes yesterday's totals (visits, avg food level, feeding events) into a `daily_summaries` table, so your "Reports" page loads instantly instead of aggregating raw rows every time.

---

## 9. Phase 7 — Deployment: Yes, Vercel Works Well Here

**Short answer: yes**, and it's actually a good fit — with one architectural choice already baked into this plan that makes it work cleanly.

**Why it fits:**
- Vercel Functions are stateless HTTP endpoints. Your ESP32 doing an `HTTPClient.POST()` every few minutes is exactly the traffic pattern serverless functions are built for — there's no persistent connection to maintain.
- Neon Postgres is itself serverless and scales to zero, so it pairs naturally with Vercel's model (no server for you to keep running or paying for 24/7).
- You've already deployed this exact shape (separate frontend + backend Vercel projects) for Offerly, so the deployment steps are the same: push to GitHub, import both folders as separate Vercel projects, set `DATABASE_URL` and your Better Auth secrets as environment variables.

**What Vercel is *not* a good fit for, and why this plan avoids it:**
- **MQTT / persistent sockets** — Vercel Functions don't keep long-lived connections open, so a traditional MQTT-broker architecture wouldn't work here. That's why this plan uses plain HTTPS REST calls from the ESP32 instead — sidesteps the problem entirely.
- **Sub-daily background jobs on the free Hobby plan** — Vercel Cron jobs on Hobby can only run once per day. That's fine for the optional "daily summary" job above, but if you ever wanted, say, an automated check every 5 minutes, you'd either upgrade to Pro ($20/mo) or trigger that route from a free external scheduler (e.g., cron-job.org) hitting your API URL — your API route itself has no restriction on how often it's called, only Vercel's *built-in* scheduler does.

**Deployment checklist** (same as your Offerly flow):
1. Push `client/` and `server/` to the same GitHub repo (or separate repos, your call).
2. Import `server/` as one Vercel project → set `DATABASE_URL` (from Neon), Better Auth secret, and a `DEVICE_API_KEY_SALT` env var.
3. Import `client/` as a second Vercel project → set `VITE_API_URL` pointing at the deployed backend URL.
4. In the ESP32 firmware, hardcode (or store in `secrets.h`) the deployed backend's HTTPS URL and the station's API key.
5. Optional: add `vercel.json` with a daily cron for the summary job.

---

## Suggested Build Order

1. Get one ESP32 reading one sensor and printing to Serial — confirms hardware basics.
2. Stand up the Hono + Neon backend with just `POST /api/readings` and `GET /api/stations/:id` — confirms the cloud side independently of hardware.
3. Get the ESP32 posting real sensor data to that live endpoint — confirms the full loop end to end.
4. Build the React dashboard against real data.
5. Add the servo/pump actuator logic and the schedule-fetching behavior.
6. Add alerts, analytics aggregation, and the solar power monitoring last — these are refinements on top of a working core loop.
