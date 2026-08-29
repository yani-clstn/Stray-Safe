import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();

app.use(cors());
app.use(express.json());

// Initialize PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Endpoint for station telemetry
app.get("/api/stations/station-01", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, foodlevel, waterlevel, batteryvoltage, solarpercent FROM stations WHERE id = $1",
      ["station-01"]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Station not found" });
    }

    const station = result.rows[0];

    // Map database lowercase columns to camelCase expected by frontend
    res.json({
      id: station.id,
      name: station.name,
      location: station.location,
      foodLevel: Number(station.foodlevel) || 0,
      waterLevel: Number(station.waterlevel) || 0,
      batteryVoltage: Number(station.batteryvoltage) || 0,
      solarPercent: Number(station.solarpercent) || 0,
      status: "online",
    });
  } catch (error) {
    console.error("Error fetching station data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for weekly analytics
app.get("/api/stations/station-01/analytics", (_req, res) => {
  res.json({
    weeklyVisits: [
      { day: "Mon", visits: 12 },
      { day: "Tue", visits: 19 },
      { day: "Wed", visits: 15 },
      { day: "Thu", visits: 22 },
      { day: "Fri", visits: 28 },
      { day: "Sat", visits: 34 },
      { day: "Sun", visits: 25 },
    ],
  });
});

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;