import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Sample station data
app.get("/api/stations/station-01", (_req, res) => {
  res.json({
    id: "station-01",
    name: "PawStation Alpha",
    location: "Central Park Gate 3",
    foodLevel: 78,
    waterLevel: 42,
    batteryVoltage: 12.6,
    solarPercent: 89,
    status: "online"
  });
});

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
    ]
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