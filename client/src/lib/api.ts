const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(body || res.statusText, res.status);
  }

  return res.json() as Promise<T>;
}

export type Reading = {
  id: number;
  stationId: string;
  foodLevel: number;
  waterLevel: number;
  solarVoltage: number | null;
  batteryPercentage: number | null;
  motionEvent: boolean;
  recordedAt: string;
  status: "online" | "offline";
};

export type Station = {
  id: string;
  name: string;
  location: string | null;
  createdAt: string;
};

export type Alert = {
  id: number;
  stationId: string;
  type: "low_food" | "low_water" | "low_battery" | "offline";
  message: string;
  resolved: boolean;
  createdAt: string;
};

export type ScheduleEntry = {
  id: number;
  stationId: string;
  timeOfDay: string;
  portionGrams: number;
  active: boolean;
};

export type AnalyticsResponse = {
  dailyVisits: { day: string; visits: number }[];
  trend: {
    recordedAt: string;
    foodLevel: number;
    waterLevel: number;
    solarVoltage: number | null;
    batteryPercentage: number | null;
  }[];
};

export const api = {
  stations: {
    list: () => request<Station[]>("/api/stations"),
    get: (id: string) => request<Station>(`/api/stations/${id}`),
  },
  readings: {
    latest: (stationId: string) => request<Reading>(`/api/stations/${stationId}/latest`),
  },
  alerts: {
    list: (stationId: string, resolved?: boolean) =>
      request<Alert[]>(
        `/api/stations/${stationId}/alerts${resolved !== undefined ? `?resolved=${resolved}` : ""}`
      ),
    resolve: (stationId: string, alertId: number) =>
      request(`/api/stations/${stationId}/alerts/${alertId}/resolve`, { method: "POST" }),
  },
  schedule: {
    list: (stationId: string) => request<ScheduleEntry[]>(`/api/stations/${stationId}/schedule`),
    update: (stationId: string, entries: Omit<ScheduleEntry, "id" | "stationId">[]) =>
      request(`/api/stations/${stationId}/schedule`, {
        method: "PUT",
        body: JSON.stringify(entries),
      }),
  },
  analytics: {
    get: (stationId: string, range = "7d") =>
      request<AnalyticsResponse>(`/api/stations/${stationId}/analytics?range=${range}`),
  },
};
