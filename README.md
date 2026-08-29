# STRAY SAFE

> **An IoT-Powered Smart Feeding and Telemetry Monitoring Dashboard for Stray Animal Welfare Stations.**

STRAY SAFE is an end-to-end IoT platform designed to automate, monitor, and manage outdoor stray animal feeding stations in real time. It features an **ESP32 microcontroller** for sensor reading and actuator control, a **Hono / Express backend API**, a **Neon Postgres database**, and a **React + Vite dashboard** with data visualisations and manual hardware control.

---

## Architecture & Tech Stack


```

[ ESP32 + Sensors & Actuators ]
│
│  HTTPS POST (Sensor Telemetry & Events)
▼
[ Express / Hono API Server ] ──► [ Neon Postgres (Drizzle ORM) ]
▲
│  HTTPS GET / POST (Manual Triggers & Polling)
│
[ React + Vite Dashboard ]

```

### **Hardware & Firmware**
* **Microcontroller:** ESP32 Dev Board (Built-in Wi-Fi)
* **Firmware:** C++ / Arduino Framework via **PlatformIO**
* **Sensors:** PIR Motion Sensor (PawGuard), HC-SR04 Ultrasonic ×2 (Food & Water Level), DS3231 RTC, INA219 Power Monitor
* **Actuators:** SG90 / MG996R Servo Motor (Food Gate), 5V Mini Submersible Water Pump (Relay/MOSFET Driver), Buzzer & LED Indicator
* **Power Chain:** Solar Panel + Charge Controller + 12V Li-ion/SLA Battery + Buck Converter (12V → 5V)

### **Software & Cloud**
* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, TanStack Query
* **Backend:** Express / Hono, Node.js, TypeScript
* **Database & ORM:** Neon Postgres (Serverless) with Drizzle ORM
* **Authentication:** Per-station API Keys (Bearer Tokens) for devices; Better Auth for caretakers
* **Hosting:** Vercel (Monorepo setup using `@vercel/node` and static builds)

---

## Repository Structure

```text
stray-safe/
├── client/                   # Vite + React dashboard web client
│   ├── src/
│   │   ├── components/ui/    # Tailwind & shadcn UI components
│   │   ├── App.tsx           # Dashboard view & data fetching logic
│   │   └── index.css         # Global Tailwind CSS configurations
│   ├── package.json
│   └── vite.config.ts
├── server/                   # Express / Hono REST API backend
│   ├── src/
│   │   └── index.ts          # API endpoints & serverless entrypoint
│   ├── package.json
│   └── tsconfig.json
├── firmware/                 # ESP32 C++ C code (PlatformIO project)
│   ├── src/
│   └── platformio.ini
├── vercel.json               # Monorepo Vercel deployment configuration
└── README.md

```

---

## API Reference

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/readings` | Pushes telemetry data (food, water, battery, motion) | Station API Key |
| `GET` | `/api/stations/:id` | Returns current telemetry metrics for a station | User Session |
| `GET` | `/api/stations/:id/analytics` | Retrieves 7-day visit analytics for Recharts | User Session |
| `GET` | `/api/stations/:id/schedule` | Station fetches current active feeding schedule | Station API Key |
| `POST` | `/api/stations/:id/trigger` | Manually dispenses food or activates water pump | User Session |

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* [PlatformIO IDE](https://platformio.org/) (VS Code Extension) *for ESP32 flashing*

---

### 1. Installation

Clone the repository and install dependencies for both `client` and `server`:

```bash
git clone [https://github.com/YOUR_USERNAME/stray-safe.git](https://github.com/YOUR_USERNAME/stray-safe.git)
cd stray-safe

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

```

---

### 2. Running the Local Development Environment

You will need **two separate terminal windows** running concurrently:

#### **Terminal 1: Backend API (`server/`)**

```bash
cd server
npx tsx watch src/index.ts

```

> Server runs locally on **`http://localhost:3000`**.

#### **Terminal 2: Frontend Web Client (`client/`)**

```bash
cd client
npm run dev

```

> Web client runs locally on **`http://localhost:5173`**.

---

### 3. Environment Variables Configuration

Create a `.env` file inside the `client/` directory:

```env
# client/.env
VITE_API_BASE_URL=http://localhost:3000

```

---

## Features & UI Overview

* **Real-Time Telemetry Cards:** Live metrics for Food Hoppers (%), Water Bowls (%), Battery Voltage (V), and Solar Charge Efficiency (%).
* **Activity Analytics:** 7-day bar charts logging motion-activated stray visits.
* **Alert System:** Real-time system warnings for low water reserves and scheduled feed execution.
* **Manual Trigger Controls:** On-demand dispensing triggers for feeding mechanisms directly from the dashboard.
* **Manual Data Refresh:** On-demand fetching with loading state feedback to minimize unnecessary background refetches.

---

## Deployment to Vercel

This repository is configured to deploy as a unified monorepo on **Vercel**.

1. Commit and push your changes to GitHub.
2. Import the root `stray-safe` project into your [Vercel Dashboard](https://vercel.com).
3. Vercel will automatically detect `vercel.json` and build both the client and serverless function endpoints under a single domain.

---


## Academic Credit & License

This repository is developed as a final project requirement for **COSC 111B - Internet of Things**. 

All rights reserved. Released for academic evaluation and non-commercial educational purposes.
