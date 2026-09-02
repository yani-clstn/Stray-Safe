import { useState, useEffect } from "react";
import {
  PawPrint,
  Utensils,
  Droplets,
  Sun,
  Battery,
  BellRing,
  RefreshCw,
  HeartHandshake,
  Moon,
  AlertTriangle,
  Activity,
  PackageCheck,
  Calendar as CalendarIcon,
  Info,
  X,
  GitCommit,
  CheckCircle2,
  Calendar,
  LayoutDashboard,
  Menu,
  ChevronDown,
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

import { DonatePage } from "@/components/DonatePage";

interface HeatmapDay {
  dayOfWeek: number;
  weekIndex: number;
  dateStr: string;
  fullDate: string;
  kg: number;
}

interface WeatherState {
  temp: number;
  condition: string;
  isRainy: boolean;
  isHighHeat: boolean;
  isLoading: boolean;
}

const generateGithubCalendarData = () => {
  const days: HeatmapDay[] = [];
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const totalDays = 371;
  const mockWeights = [0, 0, 1.5, 0, 3.0, 0, 5.2, 0, 0, 2.0, 4.5, 0, 1.0, 0, 6.0, 0, 0, 3.5, 0, 0, 2.5, 0, 4.0, 0, 0, 1.5, 0, 3.5, 7.0];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const isFuture = currentDate > today;
    const kg = isFuture ? 0 : mockWeights[i % mockWeights.length];

    const dateStr = currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullDateStr = currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

    days.push({
      dayOfWeek: currentDate.getDay(),
      weekIndex: Math.floor(i / 7),
      dateStr,
      fullDate: fullDateStr,
      kg,
    });
  }

  const calendarGrid: (HeatmapDay | null)[][] = Array.from({ length: 7 }, () => Array(53).fill(null));
  days.forEach((day) => {
    if (day.weekIndex < 53) {
      calendarGrid[day.dayOfWeek][day.weekIndex] = day;
    }
  });

  const monthsHeader: { name: string; colSpan: number }[] = [];
  let currentMonth = "";
  let currentSpan = 0;

  for (let week = 0; week < 53; week++) {
    const sampleDay = calendarGrid[3][week] || calendarGrid[0][week];
    if (sampleDay) {
      const monthName = sampleDay.dateStr.split(" ")[0];
      if (monthName !== currentMonth) {
        if (currentMonth !== "") {
          monthsHeader.push({ name: currentMonth, colSpan: currentSpan });
        }
        currentMonth = monthName;
        currentSpan = 1;
      } else {
        currentSpan++;
      }
    }
  }
  if (currentSpan > 0) {
    monthsHeader.push({ name: currentMonth, colSpan: currentSpan });
  }

  return { calendarGrid, monthsHeader };
};

const getHeatmapColor = (kg: number, isDarkMode: boolean) => {
  if (kg === 0) {
    return isDarkMode
      ? "bg-[#2d180c] border-[#382013]"
      : "bg-[#fbf4eb] border-[#ebdcd0]";
  }
  if (kg <= 2) {
    return isDarkMode
      ? "bg-[#78350f] border-[#92400e]"
      : "bg-[#fde68a] border-[#fcd34d]";
  }
  if (kg <= 4) {
    return isDarkMode
      ? "bg-[#b45309] border-[#d97706]"
      : "bg-[#f59e0b] border-[#d97706]";
  }
  if (kg <= 6) {
    return isDarkMode
      ? "bg-[#d97706] border-[#f59e0b]"
      : "bg-[#d97706] border-[#b45309]";
  }
  return isDarkMode
    ? "bg-[#f59e0b] border-[#fef3c7]"
    : "bg-[#381c0d] border-[#251208]";
};

const MOCK_STATION = {
  id: "station-01",
  name: "CvSU - Imus",
  subLocation: "Campus Gate 2",
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

const MOCK_ALERTS = [
  {
    id: 1,
    title: "Water Bowl Low",
    description: "Current level is below 45%. Pump refill cycle queued.",
  },
  {
    id: 2,
    title: "Scheduled Feed Executed",
    description: "Dispensed 150g portion at 12:00 PM.",
  },
];

const MOCK_CONTRIBUTION_LOGS = [
  {
    id: "log-1",
    date: "Sep 2, 2026",
    title: "restock: added 3.5 kg Whiskas Dry Kibble from Maria Santos",
    author: "Maria Santos",
    timeAgo: "15 minutes ago",
    kg: 3.5,
    status: "Verified",
    hash: "e7bc5ae",
  },
  {
    id: "log-2",
    date: "Sep 2, 2026",
    title: "restock: added 2 cans wet food and 1kg dry kibble (Anonymous donor)",
    author: "Anonymous",
    timeAgo: "2 hours ago",
    kg: 2.0,
    status: "Verified",
    hash: "53ec37d",
  },
  {
    id: "log-3",
    date: "Sep 1, 2026",
    title: "restock: bulk donation 7.0 kg Aozi Cat Food via Student Council",
    author: "CvSU Student Council",
    timeAgo: "1 day ago",
    kg: 7.0,
    status: "Verified",
    hash: "4a60cb6",
  },
  {
    id: "log-4",
    date: "Aug 30, 2026",
    title: "restock: added 4.0 kg Pedigree / generic mix by Juan Dela Cruz",
    author: "Juan Dela Cruz",
    timeAgo: "3 days ago",
    kg: 4.0,
    status: "Verified",
    hash: "9b12fe2",
  },
];

// Dedicated Contributions Timeline Page Component with Date Filter Dropdown
function ContributionsPage({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All Time");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dateOptions = ["All Time", "Sep 2, 2026", "Sep 1, 2026", "Aug 30, 2026"];

  const filteredLogs = selectedDateFilter === "All Time"
    ? MOCK_CONTRIBUTION_LOGS
    : MOCK_CONTRIBUTION_LOGS.filter((log) => log.date === selectedDateFilter);

  // Group filtered logs by date for display
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, typeof MOCK_CONTRIBUTION_LOGS>);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dashed">
        <div>
          <h2
            className={`text-xl font-black flex items-center gap-2 ${
              isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
            }`}
          >
            <GitCommit className="w-5 h-5 text-amber-600" /> Restock
            Contributions Timeline
          </h2>
          <p
            className={`text-xs font-medium ${
              isDarkMode ? "text-[#a38272]" : "text-[#785948]"
            }`}
          >
            History of verified food logs and station replenishment activities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Badge
            className={`px-3 py-1 text-xs font-extrabold rounded-full hidden md:inline-flex ${
              isDarkMode
                ? "bg-[#382013] text-amber-300"
                : "bg-[#f8efe6] text-[#78350f]"
            }`}
          >
            Branch: main
          </Badge>

          {/* GitHub-style Date Window Filter Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`rounded-xl px-3.5 h-9 text-xs font-bold border gap-2 shadow-sm ${
                isDarkMode
                  ? "border-[#382013] bg-[#261309] text-[#fff1e6] hover:bg-[#331c0e]"
                  : "border-[#ebdcd0] bg-white text-[#2e170a] hover:bg-[#fbf7f2]"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedDateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Button>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-150 ${
                  isDarkMode
                    ? "bg-[#261309] border-[#382013] text-[#fff1e6]"
                    : "bg-white border-[#ebdcd0] text-[#2e170a]"
                }`}
              >
                <div
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border-b ${
                    isDarkMode ? "border-[#382013] text-[#a38272]" : "border-[#f4e2d8] text-[#785948]"
                  }`}
                >
                  Filter by Date Window
                </div>
                {dateOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedDateFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedDateFilter === option
                        ? isDarkMode
                          ? "bg-[#382013] text-amber-300 font-bold"
                          : "bg-[#f8efe6] text-amber-800 font-bold"
                        : isDarkMode
                        ? "hover:bg-[#2e170e] text-[#d1b2a3]"
                        : "hover:bg-[#fbf7f2] text-[#5e4334]"
                    }`}
                  >
                    <span>{option}</span>
                    {selectedDateFilter === option && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedLogs).length === 0 ? (
          <div
            className={`p-8 text-center rounded-2xl border ${
              isDarkMode ? "border-[#382013] bg-[#261309]" : "border-[#ebdcd0] bg-white"
            }`}
          >
            <p className={`text-sm font-bold ${isDarkMode ? "text-[#a38272]" : "text-[#785948]"}`}>
              No contribution logs found for {selectedDateFilter}.
            </p>
          </div>
        ) : (
          Object.entries(groupedLogs).map(([dateGroup, logs]) => (
            <div key={dateGroup} className="space-y-3">
              <h3
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 px-1 ${
                  isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Restocks on {dateGroup}
              </h3>

              <Card
                className={`rounded-2xl border overflow-hidden ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardContent className="p-0 divide-y divide-inherit">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors ${
                        isDarkMode ? "hover:bg-[#2e170e]" : "hover:bg-[#fbf7f2]"
                      }`}
                    >
                      <div className="space-y-1">
                        <p
                          className={`text-sm font-extrabold hover:text-amber-600 cursor-pointer ${
                            isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                          }`}
                        >
                          {log.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <span
                            className={
                              isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                            }
                          >
                            {log.author}
                          </span>
                          <span>•</span>
                          <span
                            className={
                              isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                            }
                          >
                            contributed {log.timeAgo}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <Badge className="bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {log.status}
                        </Badge>

                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                            isDarkMode
                              ? "bg-[#1c0f08] border-[#382013] text-amber-400"
                              : "bg-[#fdfbf7] border-[#ebdcd0] text-amber-700"
                          }`}
                        >
                          +{log.kg} kg
                        </span>

                        <code
                          className={`text-[11px] font-mono px-2 py-1 rounded border ${
                            isDarkMode
                              ? "bg-[#1c0f08] border-[#382013] text-[#a38272]"
                              : "bg-[#f5eeeb] border-[#e2d5ca] text-[#785948]"
                          }`}
                        >
                          {log.hash}
                        </code>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "donate" | "contributions">("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [weather, setWeather] = useState<WeatherState>({
    temp: 28,
    condition: "Loading live weather...",
    isRainy: false,
    isHighHeat: false,
    isLoading: true,
  });

  const { calendarGrid, monthsHeader } = generateGithubCalendarData();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const fetchWeather = async () => {
    setWeather((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=14.4297&longitude=120.9367&current_weather=true"
      );
      const data = await response.json();
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;

      const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
      const isHighHeat = temp >= 33;

      let condition = "Clear / Fair Weather";
      if (isRainy) condition = "Rain Expected / Ongoing";
      else if (isHighHeat) condition = "High Heat Advisory";
      else if (code >= 1 && code <= 3) condition = "Partly Cloudy";

      setWeather({
        temp,
        condition,
        isRainy,
        isHighHeat,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch live weather", err);
      setWeather({
        temp: 30,
        condition: "Weather Unavailable",
        isRainy: false,
        isHighHeat: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const station = MOCK_STATION;
  const analytics = MOCK_ANALYTICS;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans ${
        isDarkMode
          ? "bg-[#1d1009] text-[#fceee6]"
          : "bg-[#fdfbf7] text-[#331c0e]"
      }`}
    >
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header with Professional Responsive Navigation */}
        <header
          className={`flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b-2 gap-4 ${
            isDarkMode ? "border-[#382013]" : "border-[#f4e2d8]"
          }`}
        >
          <div className="flex items-center justify-between w-full md:w-auto">
            <div
              className="flex items-center gap-3.5 cursor-pointer"
              onClick={() => {
                setCurrentPage("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              <div
                className={`p-3.5 rounded-2xl shadow-sm ${
                  isDarkMode
                    ? "bg-[#331c0e] text-[#fca5a5]"
                    : "bg-[#381c0d] text-[#fff8f0]"
                }`}
              >
                <PawPrint className="w-7 h-7" />
              </div>
              <div>
                <h1
                  className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 ${
                    isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                  }`}
                >
                  STRAY SAFE <HeartHandshake className="w-5 h-5 text-amber-700 fill-amber-700" />
                </h1>
                <p className={`text-xs md:text-sm font-semibold ${isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"}`}>
                  Station:{" "}
                  <span className="font-bold">
                    {station.name} ({station.subLocation})
                  </span>
                </p>
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`rounded-full h-9 w-9 border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#29160b] text-amber-400"
                    : "border-[#e2d5ca] bg-[#f8efe6] text-[#52301c]"
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`rounded-full h-9 w-9 border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#29160b] text-[#fceee6]"
                    : "border-[#e2d5ca] bg-white text-[#3e2314]"
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-2.5 flex-wrap">
            <nav
              className={`flex items-center gap-1 p-1 rounded-full border ${
                isDarkMode
                  ? "bg-[#261309] border-[#382013]"
                  : "bg-[#f8efe6] border-[#ebdcd0]"
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("dashboard")}
                className={`rounded-full px-4 h-9 text-xs font-bold transition-all ${
                  currentPage === "dashboard"
                    ? isDarkMode
                      ? "bg-[#382013] text-amber-300 shadow-sm"
                      : "bg-[#381c0d] text-[#fff8f0] shadow-sm"
                    : isDarkMode
                    ? "text-[#c2a293] hover:text-[#fff1e6]"
                    : "text-[#6e4e3d] hover:text-[#2e170a]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("contributions")}
                className={`rounded-full px-4 h-9 text-xs font-bold transition-all ${
                  currentPage === "contributions"
                    ? isDarkMode
                      ? "bg-[#382013] text-amber-300 shadow-sm"
                      : "bg-[#381c0d] text-[#fff8f0] shadow-sm"
                    : isDarkMode
                    ? "text-[#c2a293] hover:text-[#fff1e6]"
                    : "text-[#6e4e3d] hover:text-[#2e170a]"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 mr-1.5" />
                Contributions
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("donate")}
                className={`rounded-full px-4 h-9 text-xs font-bold transition-all ${
                  currentPage === "donate"
                    ? isDarkMode
                      ? "bg-[#382013] text-amber-300 shadow-sm"
                      : "bg-[#381c0d] text-[#fff8f0] shadow-sm"
                    : isDarkMode
                    ? "text-[#c2a293] hover:text-[#fff1e6]"
                    : "text-[#6e4e3d] hover:text-[#2e170a]"
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
                Donate Food
              </Button>
            </nav>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchWeather}
              className={`rounded-full h-10 w-10 border ${
                isDarkMode
                  ? "border-[#382013] bg-[#29160b] text-[#fceee6]"
                  : "border-[#e2d5ca] bg-white text-[#3e2314]"
              }`}
              title="Refresh Telemetry & Weather"
            >
              <RefreshCw className={`w-4 h-4 ${weather.isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-full h-10 w-10 border ${
                isDarkMode
                  ? "border-[#382013] bg-[#29160b] text-amber-400"
                  : "border-[#e2d5ca] bg-[#f8efe6] text-[#52301c]"
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Badge
              variant="outline"
              className={`px-3 py-1.5 rounded-full gap-2 text-xs font-bold border ${
                isDarkMode
                  ? "bg-[#2d180c] border-[#d97706]/40 text-[#fcd34d]"
                  : "bg-[#fbf4eb] border-[#e2c7b5] text-[#4a2815]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              Station Online
            </Badge>
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div
              className={`w-full md:hidden flex flex-col gap-2 p-4 rounded-2xl border animate-in slide-in-from-top-2 duration-200 ${
                isDarkMode
                  ? "bg-[#261309] border-[#382013]"
                  : "bg-white border-[#ebdcd0]"
              }`}
            >
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start font-bold rounded-xl ${
                  currentPage === "dashboard"
                    ? isDarkMode
                      ? "bg-[#382013] text-amber-300"
                      : "bg-[#f8efe6] text-[#78350f]"
                    : ""
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage("contributions");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start font-bold rounded-xl ${
                  currentPage === "contributions"
                    ? isDarkMode
                      ? "bg-[#382013] text-amber-300"
                      : "bg-[#f8efe6] text-[#78350f]"
                    : ""
                }`}
              >
                <GitCommit className="w-4 h-4 mr-2" /> Contributions Timeline
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage("donate");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start font-bold rounded-xl ${
                  currentPage === "donate"
                    ? isDarkMode
                      ? "bg-[#382013] text-amber-300"
                      : "bg-[#f8efe6] text-[#78350f]"
                    : ""
                }`}
              >
                <HeartHandshake className="w-4 h-4 mr-2" /> Donate Cat Food
              </Button>

              <div className="pt-2 border-t border-dashed flex items-center justify-between">
                <span className="text-xs font-semibold opacity-75">Telemetry Actions</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchWeather}
                  className="rounded-lg h-8 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${weather.isLoading ? "animate-spin" : ""}`} /> Refresh Data
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic Page Content Router */}
        {currentPage === "donate" ? (
          <DonatePage isDarkMode={isDarkMode} />
        ) : currentPage === "contributions" ? (
          <ContributionsPage isDarkMode={isDarkMode} />
        ) : (
          <>
            {/* Live Weather Risk Monitor Banner */}
            <Card
              className={`rounded-2xl border transition-colors ${
                weather.isRainy
                  ? isDarkMode
                    ? "border-[#b45309]/50 bg-[#29160c]"
                    : "border-[#f59e0b]/60 bg-[#fffbeb]"
                  : weather.isHighHeat
                  ? isDarkMode
                    ? "border-red-900/50 bg-[#2b1010]"
                    : "border-red-300 bg-red-50"
                  : isDarkMode
                  ? "border-[#382013] bg-[#261309]"
                  : "border-[#ebdcd0] bg-white"
              }`}
            >
              <CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-5 h-5 shrink-0 ${
                        weather.isRainy || weather.isHighHeat
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    />
                    <h3
                      className={`text-sm font-extrabold ${
                        isDarkMode ? "text-[#fef3c7]" : "text-[#2e170a]"
                      }`}
                    >
                      Campus Weather Risk Monitor (Live)
                    </h3>
                  </div>
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
                    {weather.isLoading
                      ? "Fetching Live Data..."
                      : `${weather.condition} • ${weather.temp}°C`}
                  </Badge>
                </div>

                <p
                  className={`text-xs md:text-sm font-medium ${
                    isDarkMode ? "text-[#d1b2a3]" : "text-[#5e4334]"
                  }`}
                >
                  {weather.isRainy
                    ? "Rainfall detected or expected near CvSU Imus Campus. Relocate feeder to covered shelter."
                    : weather.isHighHeat
                    ? "High heat index detected. Ensure water level is topped off to keep strays hydrated."
                    : "Weather conditions at CvSU Imus are optimal. Feeder station operating normally."}
                </p>

                {weather.isRainy && (
                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                      isDarkMode
                        ? "bg-[#331a0b] border-[#5e3215] text-amber-400"
                        : "bg-[#fef3c7]/60 border-[#fde68a] text-amber-900"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Relocation Protocol Triggered: Notify Caretakers</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Telemetry Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className={`rounded-2xl border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle
                    className={`text-xs font-black uppercase tracking-wider ${
                      isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                    }`}
                  >
                    Food Stock
                  </CardTitle>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isDarkMode
                        ? "bg-[#382013] text-amber-400"
                        : "bg-[#f8efe6] text-[#78350f]"
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className={`text-3xl font-black ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    {station.foodLevel}%
                  </div>
                  <Progress
                    value={station.foodLevel}
                    className={`h-2.5 rounded-full ${
                      isDarkMode ? "bg-[#382013]" : "bg-[#f4e8df]"
                    } [&>div]:bg-amber-500`}
                  />
                </CardContent>
              </Card>

              <Card
                className={`rounded-2xl border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle
                    className={`text-xs font-black uppercase tracking-wider ${
                      isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                    }`}
                  >
                    Water Level
                  </CardTitle>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isDarkMode
                        ? "bg-[#382013] text-sky-400"
                        : "bg-[#f8efe6] text-[#78350f]"
                    }`}
                  >
                    <Droplets className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className={`text-3xl font-black ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    {station.waterLevel}%
                  </div>
                  <Progress
                    value={station.waterLevel}
                    className={`h-2.5 rounded-full ${
                      isDarkMode ? "bg-[#382013]" : "bg-[#f4e8df]"
                    } [&>div]:bg-sky-500`}
                  />
                </CardContent>
              </Card>

              <Card
                className={`rounded-2xl border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle
                    className={`text-xs font-black uppercase tracking-wider ${
                      isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                    }`}
                  >
                    Battery Percentage
                  </CardTitle>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isDarkMode
                        ? "bg-[#382013] text-emerald-400"
                        : "bg-[#f8efe6] text-[#78350f]"
                    }`}
                  >
                    <Battery className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-black mb-1 ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    {station.batteryPercentage}%
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                    }`}
                  >
                    Optimal Charge State
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`rounded-2xl border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle
                    className={`text-xs font-black uppercase tracking-wider ${
                      isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                    }`}
                  >
                    Solar Energy
                  </CardTitle>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isDarkMode
                        ? "bg-[#382013] text-amber-400"
                        : "bg-[#f8efe6] text-[#78350f]"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-black mb-1 ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    {station.solarVoltage}V
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                    }`}
                  >
                    Generating Power
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* RESTOCK CONTRIBUTION HEATMAP CALENDAR */}
            <Card
              className={`rounded-2xl border ${
                isDarkMode
                  ? "border-[#382013] bg-[#261309]"
                  : "border-[#ebdcd0] bg-white"
              }`}
            >
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-amber-600" />
                    <CardTitle
                      className={`text-base font-extrabold ${
                        isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                      }`}
                    >
                      Restock Contribution Heatmap
                    </CardTitle>
                  </div>
                  <CardDescription
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                    }`}
                  >
                    Click on any tile to inspect daily restock logs and details
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage("contributions")}
                    className={`rounded-full h-8 px-3 text-xs font-bold border ${
                      isDarkMode
                        ? "border-[#382013] bg-[#1f0e06] text-amber-400"
                        : "border-[#ebdcd0] bg-white text-amber-800"
                    }`}
                  >
                    <GitCommit className="w-3.5 h-3.5 mr-1" /> View Timeline Page
                  </Button>
                  <Badge
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-[#382013] text-amber-300"
                        : "bg-[#381c0d] text-[#fff8f0]"
                    }`}
                  >
                    142.5 kg Restocked Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-xl border overflow-x-auto ${
                    isDarkMode
                      ? "bg-[#1f0e06] border-[#382013]"
                      : "bg-[#fbf7f2] border-[#ebdcd0]"
                  }`}
                >
                  <div className="min-w-[720px]">
                    <div
                      className={`flex text-[11px] font-bold mb-2 pl-7 ${
                        isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                      }`}
                    >
                      {monthsHeader.map((m, idx) => (
                        <div
                          key={`${m.name}-${idx}`}
                          style={{ flexGrow: m.colSpan, flexBasis: 0 }}
                        >
                          {m.name}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <div
                        className={`flex flex-col justify-between text-[10px] font-bold py-1 ${
                          isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                        }`}
                      >
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      <div className="grid grid-rows-7 grid-flow-col gap-[3px] flex-1">
                        {Array.from({ length: 7 }).map((_, rowIndex) =>
                          Array.from({ length: 53 }).map((_, colIndex) => {
                            const dayData = calendarGrid[rowIndex][colIndex];
                            if (!dayData)
                              return (
                                <div
                                  key={`empty-${rowIndex}-${colIndex}`}
                                  className="w-2.5 h-2.5 opacity-0"
                                />
                              );

                            return (
                              <button
                                key={`${dayData.fullDate}-${rowIndex}-${colIndex}`}
                                onClick={() => setSelectedDay(dayData)}
                                title={`${dayData.fullDate}: ${dayData.kg} kg restocked`}
                                className={`w-2.5 h-2.5 rounded-[2px] border cursor-pointer transition-transform hover:scale-125 focus:outline-none ${getHeatmapColor(
                                  dayData.kg,
                                  isDarkMode
                                )}`}
                              />
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics & Station Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card
                className={`lg:col-span-2 rounded-2xl border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle
                      className={`text-base font-extrabold ${
                        isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                      }`}
                    >
                      Weekly Stray Visits
                    </CardTitle>
                    <CardDescription
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                      }`}
                    >
                      Motion events logged by PawGuard PIR sensors
                    </CardDescription>
                  </div>
                  <Badge
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-[#382013] text-amber-300"
                        : "bg-[#f8efe6] text-[#6e4e3d]"
                    }`}
                  >
                    7-Day Overview
                  </Badge>
                </CardHeader>
                <CardContent className="h-56 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.weeklyVisits}>
                      <XAxis
                        dataKey="day"
                        stroke={isDarkMode ? "#a38272" : "#785948"}
                        fontSize={11}
                        fontWeight="700"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={isDarkMode ? "#a38272" : "#785948"}
                        fontSize={11}
                        fontWeight="700"
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: isDarkMode ? "#382013" : "#fbf4eb" }}
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#1d1009" : "#ffffff",
                          borderRadius: "10px",
                          borderColor: "#d97706",
                          color: isDarkMode ? "#fff1e6" : "#2e170a",
                        }}
                      />
                      <Bar
                        dataKey="visits"
                        fill={isDarkMode ? "#d97706" : "#381c0d"}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card
                className={`rounded-2xl border ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-600" />
                    <CardTitle
                      className={`text-base font-extrabold ${
                        isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                      }`}
                    >
                      Station Alerts
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MOCK_ALERTS.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isDarkMode
                          ? "bg-[#1f0e06] border-[#3d2315] text-[#fceee6]"
                          : "bg-[#fdf8f3] border-[#f2e3d8] text-[#3e2314]"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>{alert.title}</span>
                      </div>
                      <p
                        className={`pl-3.5 font-medium ${
                          isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                        }`}
                      >
                        {alert.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* HEATMAP TILE DETAILS MODAL */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-xl space-y-4 ${
              isDarkMode
                ? "bg-[#231209] border-[#382013] text-[#fceee6]"
                : "bg-white border-[#ebdcd0] text-[#331c0e]"
            }`}
          >
            <button
              onClick={() => setSelectedDay(null)}
              className={`absolute top-4 right-4 p-1 rounded-lg border transition-colors ${
                isDarkMode
                  ? "border-[#382013] hover:bg-[#331c0e] text-[#c2a293]"
                  : "border-[#f4e2d8] hover:bg-[#fbf7f2] text-[#6e4e3d]"
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-600" />
                <h3
                  className={`text-lg font-extrabold ${
                    isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                  }`}
                >
                  Restock Details
                </h3>
              </div>
              <p
                className={`text-xs font-semibold ${
                  isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                }`}
              >
                {selectedDay.fullDate}
              </p>
            </div>

            <div className="space-y-4 py-2">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDarkMode
                    ? "bg-[#1a0c06] border-[#382013]"
                    : "bg-[#fbf7f2] border-[#ebdcd0]"
                }`}
              >
                <div className="space-y-0.5">
                  <p
                    className={`text-xs font-bold ${
                      isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                    }`}
                  >
                    Amount Restocked
                  </p>
                  <p
                    className={`text-2xl font-black ${
                      isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                    }`}
                  >
                    {selectedDay.kg}{" "}
                    <span className="text-sm font-bold text-amber-600">kg</span>
                  </p>
                </div>
                <Badge
                  className={`px-3 py-1 font-extrabold text-xs rounded-full ${
                    selectedDay.kg > 0
                      ? "bg-amber-600 text-[#fff8f0]"
                      : isDarkMode
                      ? "bg-[#382013] text-[#a38272]"
                      : "bg-[#ebdcd0] text-[#785948]"
                  }`}
                >
                  {selectedDay.kg > 0 ? "Active Restock" : "No Activity"}
                </Badge>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  isDarkMode
                    ? "bg-[#2a160c] border-[#3d2315] text-[#d1b2a3]"
                    : "bg-[#fffbeb] border-[#fde68a] text-[#5e4334]"
                }`}
              >
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  {selectedDay.kg > 0
                    ? `Community volunteers replenished ${selectedDay.kg} kg of dry food on this date.`
                    : "No community food restock was recorded on this date."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Transparency Footer */}
      <footer
        className={`w-full mt-8 py-5 px-4 md:px-8 border-t transition-colors ${
          isDarkMode
            ? "border-[#382013] bg-[#170c07] text-[#c2a293]"
            : "border-[#f2e3d8] bg-[#fbf7f2] text-[#6e4e3d]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isDarkMode ? "bg-[#29160c]" : "bg-[#f0e4d8]"
              }`}
            >
              <PawPrint className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h4
                className={`font-black text-sm ${
                  isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                }`}
              >
                StraySafe Public Transparency Initiative
              </h4>
              <p className="font-semibold">
                Empowering community animal welfare through IoT monitoring & open
                telemetry data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-3.5 h-3.5" /> Public Telemetry Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}