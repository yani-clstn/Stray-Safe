import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "./components/ThemeToggle";
import { useState } from "react";
import {
  PawPrint,
  Utensils,
  Droplets,
  Sun,
  Battery,
  Wifi,
  BellRing,
  Heart,
  RefreshCw,
  HeartHandshake,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock fallback data for preview when backend API is unavailable
const MOCK_STATION = {
  id: "station-01",
  name: "PawStation Alpha",
  location: "Central Park Gate 3",
  foodLevel: 78,
  waterLevel: 42,
  batteryVoltage: 12.6,
  solarPercent: 89,
  status: "online",
};

const MOCK_ANALYTICS = {
  weeklyVisits: [
    { day: "Mon", visits: 12 },
    { day: "Tue", visits: 19 },
    { day: "Wed", visits: 15 },
    { day: "Thu", visits: 22 },
    { day: "Fri", visits: 28 },
    { day: "Sat", visits: 34 },
    { day: "Sun", visits: 25 },
  ],
};

const API_BASE_URL = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const FETCH_URL = `${API_BASE_URL}/api/stations/station-01`;
const ANALYTICS_URL = `${API_BASE_URL}/api/stations/station-01/analytics`;

export default function Dashboard() {
  const [isDonateOPEN, setIsDonateOPEN] = useState(false);

  const {
    data: station = MOCK_STATION,
    isLoading,
    isFetching: isFetchingStation,
    refetch: refetchStation,
  } = useQuery({
    queryKey: ["station"],
    queryFn: async () => {
      try {
        const res = await fetch(FETCH_URL);
        if (!res.ok) throw new Error("API returned non-200 status");
        return await res.json();
      } catch {
        return MOCK_STATION;
      }
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const {
    data: analytics = MOCK_ANALYTICS,
    isFetching: isFetchingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      try {
        const res = await fetch(ANALYTICS_URL);
        if (!res.ok) throw new Error("API returned non-200 status");
        return await res.json();
      } catch {
        return MOCK_ANALYTICS;
      }
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const isRefreshing = isFetchingStation || isFetchingAnalytics;

  const handleManualRefresh = () => {
    refetchStation();
    refetchAnalytics();
  };

  const DONATION_URL = "https://www.buymeacoffee.com/straysafe";

  const handleDonateRedirect = () => {
    window.open(DONATION_URL, "_blank", "noopener,noreferrer");
  };

  // Extract telemetry metrics with camelCase and lowercase fallbacks
  const foodLevel = station?.foodLevel ?? station?.foodlevel ?? 0;
  const waterLevel = station?.waterLevel ?? station?.waterlevel ?? 0;
  const batteryVoltage = station?.batteryVoltage ?? station?.batteryvoltage ?? 0;
  const solarPercent = station?.solarPercent ?? station?.solarpercent ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-primary font-bold text-lg animate-bounce">
          <PawPrint className="w-8 h-8" />
          <span>Loading StraySafe Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-md">
            <PawPrint className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              STRAY SAFE <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Station:{" "}
              <span className="text-foreground font-semibold">
                {station?.name || "Station 01"}
              </span>{" "}
              ({station?.location || "Main Gate"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Donation Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDonateOPEN(true)}
            className="rounded-2xl h-11 font-bold shadow-md bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          >
            <HeartHandshake className="w-5 h-5" />
            Donate Cat Food Now!
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="rounded-full gap-2 text-xs font-semibold shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>

          <ThemeToggle />

          <Badge
            variant="outline"
            className="px-3 py-1.5 rounded-full bg-card gap-2 text-xs font-semibold"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Station Online
          </Badge>
        </div>
      </header>

      {/* Donation Modal / Dialog */}
      {isDonateOPEN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsDonateOPEN(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 text-primary rounded-2xl">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold">Donate to Stray Safe</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Your donation directly funds cat & dog food refills and keeps automated feeding stations powered and operational!
            </p>

            <div className="p-4 bg-muted/60 rounded-2xl border space-y-2">
              <p className="text-xs space-y-1 text-foreground">
                Support automated feeding and water refills across stations.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDonateOPEN(false)}
                className="flex-1 rounded-2xl h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDonateRedirect}
                className="flex-1 rounded-2xl h-11 font-bold bg-primary text-primary-foreground"
              >
                Donate to Stray Safe Now!
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="rounded-3xl shadow-sm border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Food Level
              </CardTitle>
              <div className="p-2 bg-amber-50 rounded-xl text-primary">
                <Utensils className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-3">
                {foodLevel}%
              </div>
              <Progress
                value={foodLevel}
                className="h-2.5 bg-muted [&>div]:bg-primary"
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Water Bowl
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                <Droplets className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-3">
                {waterLevel}%
              </div>
              <Progress
                value={waterLevel}
                className="h-2.5 bg-muted [&>div]:bg-blue-500"
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Battery Voltage
              </CardTitle>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <Battery className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">
                {batteryVoltage}V
              </div>
              <p className="text-xs font-semibold text-emerald-600">
                Optimal Charge
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Solar Efficiency
              </CardTitle>
              <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                <Sun className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">
                {solarPercent}%
              </div>
              <p className="text-xs font-semibold text-orange-500">
                Generating Power
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl shadow-sm border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Weekly Stray Visits
                </CardTitle>
                <CardDescription>
                  Motion events logged by PawGuard PIR sensors
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="rounded-full px-3 font-semibold"
              >
                7-Day Overview
              </Badge>
            </CardHeader>
            <CardContent className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.weeklyVisits || []}>
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      borderColor: "#fef3c7",
                    }}
                    cursor={{ fill: "hsl(var(--secondary))" }}
                  />
                  <Bar
                    dataKey="visits"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-amber-100 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold">
                  Station Alerts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div className="p-3 bg-secondary/60 rounded-2xl border border-amber-200/50 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold">Water Bowl Low</p>
                  <p className="text-[11px] text-muted-foreground">
                    Current level is below 45%. Pump refill cycle queued.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-2xl border flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-slate-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Scheduled Feed Executed</p>
                  <p className="text-[11px] text-muted-foreground">
                    Dispensed 150g portion at 12:00 PM.
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="p-6 pt-0">
              <Button className="w-full rounded-2xl h-11 font-bold shadow-md">
                Manual Trigger Food Gate
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}