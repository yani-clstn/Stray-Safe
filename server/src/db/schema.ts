import { pgTable, text, timestamp, integer, real, boolean, serial } from "drizzle-orm/pg-core";

export const stations = pgTable("stations", {
  id: text("id").primaryKey(), // e.g., "station-01"
  name: text("name").notNull(),
  location: text("location").notNull(),
  apiKeyHash: text("api_key_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  foodLevel: integer("food_level").notNull(), // Percentage 0-100%
  waterLevel: integer("water_level").notNull(), // Percentage 0-100%
  solarVoltage: integer("solar_voltage").notNull(),
  batteryPercentage: real("battery_percentage").notNull(),
  motionEvent: boolean("motion_event").default(false),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const feedingSchedules = pgTable("feeding_schedules", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  timeOfDay: text("time_of_day").notNull(), // e.g., "08:00"
  portionGrams: integer("portion_grams").notNull(),
  active: boolean("active").default(true),
});

export const feedingEvents = pgTable("feeding_events", {
  id: serial("id").primaryKey(),
  stationId: text("station_id").references(() => stations.id),
  triggeredBy: text("triggered_by").notNull(), // "schedule" | "motion"
  occurredAt: timestamp("occurred_at").defaultNow(),
});