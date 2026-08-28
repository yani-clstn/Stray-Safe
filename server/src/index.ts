import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use("*", cors());

// --- IN-MEMORY MOCK DATA STORAGE (For immediate UI dev) ---
let mockStation = {
  id: "station-01",
  name: "Community PawStation #1",
  location: "Central Park West",
  status: "online",
  foodLevel: 75,
  waterLevel: 42,
  batteryVoltage: 12.4,
  solarPercent: 88,
  lastSeen: new Date().toISOString(),
};

let mockVisits = [
  { day: "Mon", visits: 12 },
  { day: "Tue", visits: 19 },
  { day: "Wed", visits: 15 },
  { day: "Thu", visits: 22 },
  { day: "Fri", visits: 30 },
  { day: "Sat", visits: 25 },
  { day: "Sun", visits: 18 },
];

// --- HARDWARE / API ROUTES ---

// Dashboard fetches live telemetry
app.get("/api/stations/:id", (c) => {
  return c.json({
    ...mockStation,
    lastSeen: new Date().toISOString(),
  });
});

// Analytics Chart Data
app.get("/api/stations/:id/analytics", (c) => {
  return c.json({
    weeklyVisits: mockVisits,
  });
});

// ESP32 POST Endpoint (Hardware will talk to this later)
app.post("/api/readings", async (c) => {
  const body = await c.req.json();
  
  // Update mock state with hardware readings
  mockStation.foodLevel = body.foodLevel;
  mockStation.waterLevel = body.waterLevel;
  mockStation.batteryVoltage = body.batteryVoltage;
  mockStation.solarPercent = body.solarPercent;

  return c.json({ success: true, message: "Telemetry recorded successfully" });
});

export default app;