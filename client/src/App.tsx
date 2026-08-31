import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
  Moon,
  CloudRain,
  AlertTriangle,
  ShieldAlert,
  PackageCheck,
  TrendingUp,
  Lock,
  Activity,
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
  name: "CvSU - Imus",
  location: "Campus Gate 2",
  foodLevel: 78,
  waterLevel: 42,
  batteryPercentage: 92,
  solarVoltage: 12.6,
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

// Mock donation transparency analytics
const MOCK_DONATION_ANALYTICS = {
  totalRestockedKg: 42.5,
  monthlyGoalKg: 50,
  recentDonations: [
    {
      id: 1,
      donor: "Anonymous Student",
      amount: "3.5 kg Dry Kibble",
      date: "2 hrs ago",
    },
    {
      id: 2,
      donor: "Anonymous Student",
      amount: "5.0 kg Cat Food",
      date: "Yesterday",
    },
    {
      id: 3,
      donor: "Anonymous Student",
      amount: "2.0 kg Dog Kibble",
      date: "2 days ago",
    },
  ],
};

const API_BASE_URL = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const FETCH_URL = `${API_BASE_URL}/api/stations/station-01`;
const ANALYTICS_URL = `${API_BASE_URL}/api/stations/station-01/analytics`;

// Live Weather Advisory Component
function CampusWeatherCard({ isDarkMode }: { isDarkMode: boolean }) {
  const [weather, setWeather] = useState({
    condition: "Checking Forecast...",
    temp: 31,
    isSevere: false,
    message: "Fetching local campus meteorological data...",
  });

  useEffect(() => {
    const fetchCampusWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        // Coordinates for Cavite / Imus campus area
        const lat = 14.4297;
        const lon = 120.9367;

        if (!apiKey) {
          // Fallback advisory state if API key is not configured
          setWeather({
            condition: "Fair / Moderate",
            temp: 31,
            isSevere: false,
            message: "Campus grounds clear. Optimal outdoor station operation.",
          });
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        );
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();

        const mainCondition = data.weather[0]?.main?.toLowerCase() || "";
        const temp = Math.round(data.main?.temp || 30);

        if (
          mainCondition.includes("rain") ||
          mainCondition.includes("thunderstorm")
        ) {
          setWeather({
            condition: "Heavy Rain Forecasted",
            temp,
            isSevere: true,
            message:
              "Rainfall expected in campus area. Relocate feeder to covered shelter.",
          });
        } else if (temp >= 36) {
          setWeather({
            condition: "High Heat Index",
            temp,
            isSevere: true,
            message:
              "Extreme heat detected. Monitor water reservoir level frequently.",
          });
        } else {
          setWeather({
            condition: "Optimal Weather",
            temp,
            isSevere: false,
            message:
              "Campus conditions are normal. Outdoor feeder safe in current spot.",
          });
        }
      } catch {
        setWeather({
          condition: "Fair / Good",
          temp: 31,
          isSevere: false,
          message: "Campus grounds clear. Optimal outdoor station operation.",
        });
      }
    };

    fetchCampusWeather();
  }, []);

  return (
    <Card
      className={`rounded-3xl shadow-sm border transition-colors ${
        weather.isSevere
          ? isDarkMode
            ? "border-amber-600/60 bg-amber-950/20"
            : "border-amber-400 bg-amber-50"
          : isDarkMode
            ? "border-[#3d2314] bg-[#25160f]"
            : "border-[#e6d5c3] bg-[#fffcf7]"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          {weather.isSevere ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
          ) : (
            <CloudRain
              className={`w-5 h-5 ${isDarkMode ? "text-[#d4a373]" : "text-[#3d2314]"}`}
            />
          )}
          <CardTitle
            className={`text-sm font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
          >
            Campus Weather Risk Monitor
          </CardTitle>
        </div>
        <Badge
          className={
            weather.isSevere
              ? "bg-amber-500 text-black font-bold"
              : isDarkMode
                ? "bg-[#3d2314] text-[#d4a373]"
                : "bg-[#f3e5d8] text-[#3d2314]"
          }
        >
          {weather.condition} • {weather.temp}°C
        </Badge>
      </CardHeader>
      <CardContent>
        <p
          className={`text-xs ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
        >
          {weather.message}
        </p>

        {weather.isSevere && (
          <div className="mt-3 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              Relocation Protocol Triggered: Notify Caretakers
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [isDonateOPEN, setIsDonateOPEN] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark class on document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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

  // Extract telemetry metrics
  const foodLevel = station?.foodLevel ?? station?.foodlevel ?? 0;
  const waterLevel = station?.waterLevel ?? station?.waterlevel ?? 0;
  const batteryPercentage =
    station?.batteryPercentage ?? station?.batteryPercentage ?? 0;
  const solarVoltage = station?.solarVoltage ?? station?.solarVoltage ?? 0;

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#1a0f0a]" : "bg-[#fcf8f2]"}`}
      >
        <div
          className={`flex items-center gap-2 font-bold text-lg animate-bounce ${isDarkMode ? "text-[#f3e5d8]" : "text-[#3d2314]"}`}
        >
          <PawPrint
            className={`w-8 h-8 ${isDarkMode ? "text-[#d4a373]" : "text-[#4a2c11]"}`}
          />
          <span>Loading StraySafe Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDarkMode ? "bg-[#1a0f0a] text-[#f3e5d8]" : "bg-[#fcf8f2] text-[#2b180d]"}`}
    >
      {/* Header */}
      <header
        className={`max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b mb-8 gap-4 ${isDarkMode ? "border-[#3d2314]" : "border-[#e6d5c3]"}`}
      >
        <div className="flex items-center gap-3">
          {/* Choco Icon Badge */}
          <div
            className={`p-3 rounded-2xl shadow-md ${isDarkMode ? "bg-[#d4a373] text-[#1a0f0a]" : "bg-[#3d2314] text-[#fcf8f2]"}`}
          >
            <PawPrint className="w-8 h-8" />
          </div>
          <div>
            <h1
              className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
            >
              STRAY SAFE{" "}
              <Heart
                className={`w-5 h-5 ${isDarkMode ? "text-[#d4a373] fill-[#d4a373]" : "text-[#4a2c11] fill-[#4a2c11]"}`}
              />
            </h1>
            <p
              className={`text-sm font-medium ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
            >
              Station:{" "}
              <span
                className={`font-semibold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#3d2314]"}`}
              >
                {station?.name || "Station 01"}
              </span>{" "}
              ({station?.location || "Main Gate"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Choco Donate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDonateOPEN(true)}
            className={`rounded-2xl h-11 font-bold shadow-md border-none flex items-center gap-2 ${isDarkMode ? "bg-[#d4a373] hover:bg-[#bc8a5f] text-[#1a0f0a]" : "bg-[#3d2314] hover:bg-[#2b180d] text-[#fcf8f2]"}`}
          >
            <HeartHandshake className="w-5 h-5" />
            Donate Cat Food Now!
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`rounded-full gap-2 text-xs font-semibold shadow-sm bg-transparent ${isDarkMode ? "border-[#4a2c11] text-[#f3e5d8] hover:bg-[#2b180d]" : "border-[#d2ba9e] text-[#3d2314] hover:bg-[#f3e5d8]"}`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`rounded-full h-9 w-9 border ${isDarkMode ? "border-[#4a2c11] text-[#d4a373] bg-[#2b180d] hover:bg-[#3d2314]" : "border-[#d2ba9e] text-[#3d2314] bg-[#f3e5d8] hover:bg-[#e6d5c3]"}`}
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <Badge
            variant="outline"
            className={`px-3 py-1.5 rounded-full gap-2 text-xs font-semibold ${isDarkMode ? "bg-[#2b180d] border-[#4a2c11] text-[#d4a373]" : "bg-[#f3e5d8] border-[#d2ba9e] text-[#3d2314]"}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8c5638] opacity-75"></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDarkMode ? "bg-[#d4a373]" : "bg-[#4a2c11]"}`}
              ></span>
            </span>
            <Wifi
              className={`w-3.5 h-3.5 ${isDarkMode ? "text-[#d4a373]" : "text-[#4a2c11]"}`}
            />{" "}
            Station Online
          </Badge>
        </div>
      </header>

      {/* Donation Modal / Dialog */}
      {isDonateOPEN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f0a]/70 backdrop-blur-sm p-4">
          <div
            className={`border rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 ${isDarkMode ? "bg-[#25160f] text-[#f3e5d8] border-[#3d2314]" : "bg-[#fcf8f2] text-[#2b180d] border-[#e6d5c3]"}`}
          >
            <button
              onClick={() => setIsDonateOPEN(false)}
              className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? "hover:bg-[#3d2314] text-[#f3e5d8]" : "hover:bg-[#f3e5d8] text-[#3d2314]"}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
              >
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h2
                className={`text-xl font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
              >
                Donate to Stray Safe
              </h2>
            </div>

            <p
              className={`text-sm ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
            >
              Your donation directly funds cat & dog food refills and keeps
              automated feeding stations powered and operational.
            </p>

            <div
              className={`p-4 rounded-2xl border space-y-2 ${isDarkMode ? "bg-[#1a0f0a]/60 border-[#3d2314]" : "bg-[#f3e5d8]/60 border-[#e6d5c3]"}`}
            >
              <p
                className={`text-xs ${isDarkMode ? "text-[#d4a373]" : "text-[#4a2c11]"}`}
              >
                Support automated feeding and water refills across stations.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDonateOPEN(false)}
                className={`flex-1 rounded-2xl h-11 ${isDarkMode ? "border-[#4a2c11] text-[#f3e5d8]" : "border-[#d2ba9e] text-[#3d2314]"}`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDonateRedirect}
                className={`flex-1 rounded-2xl h-11 font-bold ${isDarkMode ? "bg-[#d4a373] hover:bg-[#bc8a5f] text-[#1a0f0a]" : "bg-[#3d2314] hover:bg-[#2b180d] text-[#fcf8f2]"}`}
              >
                Donate to Stray Safe Now!
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Weather Risk Banner */}
        <CampusWeatherCard isDarkMode={isDarkMode} />

        {/* Primary Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Food Level Card */}
          <Card
            className={`rounded-3xl shadow-sm ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle
                className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
              >
                Food Stock
              </CardTitle>
              <div
                className={`p-2 rounded-xl ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
              >
                <Utensils className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-black mb-3 ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
              >
                {foodLevel}%
              </div>
              <Progress
                value={foodLevel}
                className={`h-2.5 ${isDarkMode ? "bg-[#3d2314] [&>div]:bg-amber-300" : "bg-[#f3e5d8] [&>div]:bg-amber-400"}`}
              />
            </CardContent>
          </Card>

          {/* Water Bowl Card */}
          <Card
            className={`rounded-3xl shadow-sm ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle
                className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
              >
                Water Level
              </CardTitle>
              <div
                className={`p-2 rounded-xl ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
              >
                <Droplets className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-black mb-3 ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
              >
                {waterLevel}%
              </div>
              <Progress
                value={waterLevel}
                className={`h-2.5 ${isDarkMode ? "bg-[#3d2314] [&>div]:bg-sky-400" : "bg-[#f3e5d8] [&>div]:bg-blue-700"}`}
              />
            </CardContent>
          </Card>

          {/* Battery Voltage Card */}
          <Card
            className={`rounded-3xl shadow-sm ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle
                className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
              >
                Battery Percentage
              </CardTitle>
              <div
                className={`p-2 rounded-xl ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
              >
                <Battery className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-black mb-1 ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
              >
                {batteryPercentage}%
              </div>
              <p
                className={`text-xs font-semibold ${isDarkMode ? "text-[#d4a373]" : "text-[#4a2c11]"}`}
              >
                Optimal Charge State
              </p>
            </CardContent>
          </Card>

          {/* Solar Efficiency Card */}
          <Card
            className={`rounded-3xl shadow-sm ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle
                className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
              >
                Solar Energy
              </CardTitle>
              <div
                className={`p-2 rounded-xl ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
              >
                <Sun className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-black mb-1 ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
              >
                {solarVoltage}V
              </div>
              <p
                className={`text-xs font-semibold ${isDarkMode ? "text-[#d4a373]" : "text-[#4a2c11]"}`}
              >
                Generating Power
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Donation Analytics Section */}
        <Card
          className={`rounded-3xl shadow-sm ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
        >
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PackageCheck
                  className={`w-5 h-5 ${isDarkMode ? "text-[#d4a373]" : "text-[#3d2314]"}`}
                />
                <CardTitle
                  className={`text-lg font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
                >
                  Real-Time Donation & Supply Analytics
                </CardTitle>
              </div>
              <CardDescription
                className={isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}
              >
                Transparent log of restocked pet food supplies vs. hopper
                inventory
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={`rounded-full px-3 py-1 font-bold flex items-center gap-1.5 ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> 85% Monthly Restock Goal
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span
                  className={isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}
                >
                  Monthly Food Supply Restocked:{" "}
                  {MOCK_DONATION_ANALYTICS.totalRestockedKg} kg
                </span>
                <span
                  className={isDarkMode ? "text-[#d4a373]" : "text-[#3d2314]"}
                >
                  Goal: {MOCK_DONATION_ANALYTICS.monthlyGoalKg} kg
                </span>
              </div>
              <Progress
                value={
                  (MOCK_DONATION_ANALYTICS.totalRestockedKg /
                    MOCK_DONATION_ANALYTICS.monthlyGoalKg) *
                  100
                }
                className={`h-3 ${isDarkMode ? "bg-[#3d2314] [&>div]:bg-[#d4a373]" : "bg-[#f3e5d8] [&>div]:bg-[#3d2314]"}`}
              />
            </div>

            <div>
              <h4
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
              >
                Recent Verified Community Contributions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MOCK_DONATION_ANALYTICS.recentDonations.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border flex flex-col justify-between ${
                      isDarkMode
                        ? "bg-[#1a0f0a]/60 border-[#3d2314]"
                        : "bg-[#f3e5d8]/40 border-[#e6d5c3]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
                      >
                        {item.donor}
                      </span>
                      <span
                        className={`text-[10px] ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
                      >
                        {item.date}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold mt-1 ${isDarkMode ? "text-[#d4a373]" : "text-[#4a2c11]"}`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card
            className={`lg:col-span-2 rounded-3xl shadow-sm ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle
                  className={`text-lg font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
                >
                  Weekly Stray Visits
                </CardTitle>
                <CardDescription
                  className={isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}
                >
                  Motion events logged by PawGuard PIR sensors
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className={`rounded-full px-3 font-semibold ${isDarkMode ? "bg-[#3d2314] text-[#d4a373] border-[#4a2c11]" : "bg-[#f3e5d8] text-[#3d2314] border-[#d2ba9e]"}`}
              >
                7-Day Overview
              </Badge>
            </CardHeader>
            <CardContent className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.weeklyVisits || []}>
                  <XAxis
                    dataKey="day"
                    stroke={isDarkMode ? "#d4a373" : "#8c5638"}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#d4a373" : "#8c5638"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#25160f" : "#f3e5d8",
                      borderRadius: "12px",
                      borderColor: isDarkMode ? "#d4a373" : "#3d2314",
                      color: isDarkMode ? "#f3e5d8" : "#2b180d",
                    }}
                    cursor={{
                      fill: isDarkMode
                        ? "rgba(212, 163, 115, 0.1)"
                        : "rgba(61, 35, 20, 0.08)",
                    }}
                  />
                  <Bar
                    dataKey="visits"
                    fill={isDarkMode ? "#d4a373" : "#3d2314"}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card
            className={`rounded-3xl shadow-sm flex flex-col justify-between ${isDarkMode ? "border-[#3d2314] bg-[#25160f]" : "border-[#e6d5c3] bg-[#fffcf7]"}`}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <BellRing
                  className={`w-5 h-5 ${isDarkMode ? "text-[#d4a373]" : "text-[#3d2314]"}`}
                />
                <CardTitle
                  className={`text-lg font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
                >
                  Station Alerts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${isDarkMode ? "bg-[#3d2314]/50 border-[#4a2c11]" : "bg-[#f3e5d8]/80 border-[#d2ba9e]"}`}
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full shrink-0 ${isDarkMode ? "bg-[#d4a373]" : "bg-[#3d2314]"}`}
                />
                <div>
                  <p
                    className={`text-xs font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
                  >
                    Water Bowl Low
                  </p>
                  <p
                    className={`text-[11px] ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
                  >
                    Current level is below 45%. Pump refill cycle queued.
                  </p>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${isDarkMode ? "bg-[#1a0f0a]/50 border-[#3d2314]" : "bg-[#f3e5d8]/40 border-[#e6d5c3]"}`}
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-[#8c5638] shrink-0" />
                <div>
                  <p
                    className={`text-xs font-bold ${isDarkMode ? "text-[#d4a373]" : "text-[#3d2314]"}`}
                  >
                    Scheduled Feed Executed
                  </p>
                  <p
                    className={`text-[11px] ${isDarkMode ? "text-[#c4a997]" : "text-[#6b4a36]"}`}
                  >
                    Dispensed 150g portion at 12:00 PM.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Dashboard Footer */}
      {/* Dashboard Footer */}
      <footer
        className={`mt-16 border-t py-8 transition-colors ${isDarkMode ? "border-[#3d2314] bg-[#1a0f0a] text-[#c4a997]" : "border-[#e6d5c3] bg-[#fcf8f2] text-[#6b4a36]"}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Branding & Mission */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div
              className={`p-2.5 rounded-2xl ${isDarkMode ? "bg-[#3d2314] text-[#d4a373]" : "bg-[#f3e5d8] text-[#3d2314]"}`}
            >
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-sm font-bold ${isDarkMode ? "text-[#f3e5d8]" : "text-[#2b180d]"}`}
              >
                StraySafe Public Transparency Initiative
              </p>
              <p className="text-xs">
                Empowering community animal welfare through IoT monitoring &
                open telemetry data.
              </p>
            </div>
          </div>

          {/* Center / Right: Quick Info & Admin Link */}
          <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Public Telemetry Active
            </span>
            <span>•</span>

            {/* Discreet Admin Login Trigger */}
            <button
              onClick={() =>
                alert(
                  "Redirecting to Caretaker / Admin Authentication Portal...",
                )
              }
              className={`flex items-center gap-1 font-semibold hover:underline transition-colors ${isDarkMode ? "text-[#d4a373]" : "text-[#3d2314]"}`}
            >
              <Lock className="w-3.5 h-3.5" />
              Caretaker Access
            </button>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div
          className={`max-w-7xl mx-auto px-4 mt-6 pt-4 border-t text-center text-[11px] ${isDarkMode ? "border-[#2d1a10] text-[#8c6b58]" : "border-[#f3e5d8] text-[#a0826e]"}`}
        >
          © {new Date().getFullYear()} StraySafe Project. Built for stray animal
          care & transparent community support.
        </div>
      </footer>
    </div>
  );
}
