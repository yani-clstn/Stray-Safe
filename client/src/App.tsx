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
  X,
  GitCommit,
  CheckCircle2,
  Calendar,
  LayoutDashboard,
  Menu,
  ChevronDown,
  ShieldCheck,
  Zap,
  Info,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
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
    return isDarkMode ? "bg-amber-950/30 border-amber-800/40" : "bg-amber-200/60 border-amber-300/60";
  }
  if (kg <= 2) {
    return isDarkMode ? "bg-amber-900/60 border-amber-700/60" : "bg-amber-300 border-amber-400";
  }
  if (kg <= 4) {
    return isDarkMode ? "bg-amber-700 border-amber-600" : "bg-amber-500 border-amber-600";
  }
  if (kg <= 6) {
    return isDarkMode ? "bg-amber-600 border-amber-500" : "bg-amber-600 border-amber-700";
  }
  return isDarkMode ? "bg-amber-500 border-amber-400 shadow-sm shadow-amber-500/30" : "bg-amber-700 border-amber-900 shadow-sm shadow-amber-700/30";
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
  operationHours: "6:00 AM – 6:00 PM",
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

function ContributionsPage() {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All Time");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dateOptions = ["All Time", "Sep 2, 2026", "Sep 1, 2026", "Aug 30, 2026"];

  const filteredLogs = selectedDateFilter === "All Time"
    ? MOCK_CONTRIBUTION_LOGS
    : MOCK_CONTRIBUTION_LOGS.filter((log) => log.date === selectedDateFilter);

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, typeof MOCK_CONTRIBUTION_LOGS>);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/15 dark:border-amber-200/20">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-amber-950 dark:text-amber-100">
            <GitCommit className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Restock Contributions Timeline
          </h2>
          <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium">
            Auditable history of verified food logs and station replenishment activities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="rounded-xl px-3.5 h-9 text-xs font-semibold border border-amber-900/20 dark:border-amber-700/50 bg-white dark:bg-[#2b1f17] shadow-sm gap-2 backdrop-blur-md transition-all hover:border-amber-600 dark:hover:border-amber-500 text-amber-950 dark:text-amber-100"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{selectedDateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-amber-900/20 dark:border-amber-800/50 bg-white dark:bg-[#241a14] backdrop-blur-xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800/70 dark:text-amber-400 border-b border-amber-900/10 dark:border-amber-800/40">
                  Filter by Date Window
                </div>
                {dateOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedDateFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedDateFilter === option
                        ? "bg-amber-600/15 dark:bg-amber-500/25 text-amber-950 dark:text-amber-50 font-bold"
                        : "hover:bg-amber-600/10 dark:hover:bg-amber-500/15 text-amber-900/80 dark:text-amber-200"
                    }`}
                  >
                    <span>{option}</span>
                    {selectedDateFilter === option && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-amber-900/20 dark:border-amber-800/40 bg-white dark:bg-[#241a14]/60 backdrop-blur-md">
            <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium">
              No contribution logs found for {selectedDateFilter}.
            </p>
          </div>
        ) : (
          Object.entries(groupedLogs).map(([dateGroup, logs]) => (
            <div key={dateGroup} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-1 text-amber-900 dark:text-amber-300">
                <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Restocks on {dateGroup}
              </h3>

              <Card className="rounded-3xl border border-amber-900/20 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-amber-600/40 dark:hover:border-amber-500/50 overflow-hidden">
                <CardContent className="p-0 divide-y divide-amber-900/10 dark:divide-amber-800/40">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors hover:bg-amber-600/10 dark:hover:bg-amber-500/10"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold tracking-tight text-amber-950 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer transition-colors">
                          {log.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-800/80 dark:text-amber-300">
                          <span className="text-amber-950 dark:text-amber-100 font-semibold">{log.author}</span>
                          <span>•</span>
                          <span>contributed {log.timeAgo}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <Badge className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-none">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {log.status}
                        </Badge>

                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl border border-amber-600/30 dark:border-amber-500/30 bg-amber-600/15 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200">
                          +{log.kg} kg
                        </span>

                        <code className="text-[11px] font-mono px-2 py-1 rounded-lg border border-amber-900/20 dark:border-amber-800/50 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200">
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

  const currentHour = new Date().getHours();
  const isStationOpen = currentHour >= 6 && currentHour < 18;

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
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans antialiased selection:bg-amber-600/30 selection:text-amber-900 dark:selection:text-amber-100 overflow-y-auto scroll-smooth ${isDarkMode ? "bg-[#18110c] text-amber-100" : "bg-[#fcf8f5] text-amber-950"}`}>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Sleek Floating Navigation Bar */}
        <header className="sticky top-4 z-50 backdrop-blur-2xl bg-white/90 dark:bg-[#241a14]/90 border border-amber-900/15 dark:border-amber-800/50 rounded-3xl p-3 shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            
            <div
              className="flex items-center gap-3 cursor-pointer group pl-2"
              onClick={() => {
                setCurrentPage("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform duration-300">
                <PawPrint className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-black tracking-tight flex items-center gap-1.5 text-amber-950 dark:text-amber-50">
                  STRAY SAFE
                </h1>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300 font-medium">
                  {station.name} ({station.subLocation})
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl border border-amber-900/10 dark:border-amber-800/40 bg-amber-50/80 dark:bg-[#1c140f]/70 backdrop-blur-xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("dashboard")}
                className={`rounded-xl px-4 h-9 text-xs font-bold transition-all duration-300 ${
                  currentPage === "dashboard"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 hover:bg-amber-700 hover:text-white"
                    : "text-amber-900/80 dark:text-amber-200 hover:text-amber-950 dark:hover:text-amber-50 hover:bg-amber-600/15"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                Dashboard
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("contributions")}
                className={`rounded-xl px-4 h-9 text-xs font-bold transition-all duration-300 ${
                  currentPage === "contributions"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 hover:bg-amber-700 hover:text-white"
                    : "text-amber-900/80 dark:text-amber-200 hover:text-amber-950 dark:hover:text-amber-50 hover:bg-amber-600/15"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 mr-1.5" />
                Contributions
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("donate")}
                className={`rounded-xl px-4 h-9 text-xs font-bold transition-all duration-300 ${
                  currentPage === "donate"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 hover:bg-amber-700 hover:text-white"
                    : "text-amber-900/80 dark:text-amber-200 hover:text-amber-950 dark:hover:text-amber-50 hover:bg-amber-600/15"
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
                Donate Food
              </Button>
            </nav>

            <div className="flex items-center gap-2.5 pr-1">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchWeather}
                className="rounded-2xl h-9 w-9 border border-amber-900/15 dark:border-amber-700/50 bg-white dark:bg-[#2b1f17] shadow-sm hover:border-amber-600 dark:hover:border-amber-500 transition-all text-amber-950 dark:text-amber-100"
                title="Refresh Telemetry & Weather"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${weather.isLoading ? "animate-spin" : ""}`} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-2xl h-9 w-9 border border-amber-900/15 dark:border-amber-700/50 bg-white dark:bg-[#2b1f17] shadow-sm hover:border-amber-600 dark:hover:border-amber-500 transition-all text-amber-950 dark:text-amber-100"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-800" />}
              </Button>

              <Badge className="hidden lg:flex px-3.5 py-1.5 rounded-2xl gap-2 text-xs font-semibold bg-amber-600/15 text-amber-900 dark:text-amber-200 border border-amber-600/30 shadow-none">
                <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse shadow-sm shadow-amber-600" />
                Station Online
              </Badge>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-2xl h-9 w-9 md:hidden border border-amber-900/15 dark:border-amber-700/50 bg-white dark:bg-[#2b1f17] shadow-sm text-amber-950 dark:text-amber-100"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-2 pt-4 mt-3 border-t border-amber-900/15 dark:border-amber-800/40 animate-in slide-in-from-top-2 duration-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start font-bold text-xs rounded-2xl ${
                  currentPage === "dashboard" ? "bg-amber-600/20 text-amber-950 dark:text-amber-50" : "text-amber-900/80 dark:text-amber-200"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Dashboard
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage("contributions");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start font-bold text-xs rounded-2xl ${
                  currentPage === "contributions" ? "bg-amber-600/20 text-amber-950 dark:text-amber-50" : "text-amber-900/80 dark:text-amber-200"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 mr-2" /> Contributions Timeline
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentPage("donate");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start font-bold text-xs rounded-2xl ${
                  currentPage === "donate" ? "bg-amber-600/20 text-amber-950 dark:text-amber-50" : "text-amber-900/80 dark:text-amber-200"
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 mr-2" /> Donate Cat Food
              </Button>
            </div>
          )}
        </header>

        <div className="transition-all duration-500 space-y-6">
        {currentPage === "donate" ? (
          <DonatePage isDarkMode={isDarkMode} />
        ) : currentPage === "contributions" ? (
          <ContributionsPage />
        ) : (
          <>
            <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300">
                    <Clock className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold tracking-tight text-amber-950 dark:text-amber-50">
                        Campus Operation Hours
                      </h3>
                      <span className="text-xs font-semibold text-amber-800/80 dark:text-amber-300">
                        ({station.operationHours})
                      </span>
                    </div>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium mt-0.5">
                      {isStationOpen
                        ? "Station is currently active and open for automated dispensing & student access."
                        : "Station is currently closed for the night (after-hours standby mode)."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <Badge className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-none border ${
                    isStationOpen
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-amber-600/20 text-amber-800 dark:text-amber-300 border-amber-600/40"
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 inline-block ${
                      isStationOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-600 dark:bg-amber-400"
                    }`} />
                    {isStationOpen ? "Station OPEN" : "Station CLOSED"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className={`rounded-3xl border backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${
              weather.isRainy
                ? "border-amber-600/40 bg-gradient-to-r from-amber-600/15 via-amber-200/40 dark:via-[#2b1f17]/80 to-white dark:to-[#241a14]"
                : weather.isHighHeat
                ? "border-amber-700/40 bg-gradient-to-r from-amber-700/15 via-amber-200/40 dark:via-[#2b1f17]/80 to-white dark:to-[#241a14]"
                : "border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80"
            }`}>
              <CardContent className="p-5 md:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-amber-950 dark:text-amber-50">
                      Campus Weather Risk Monitor (Live)
                    </h3>
                  </div>
                  <Badge className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-600/15 text-amber-900 dark:text-amber-200 border border-amber-600/30 shadow-none">
                    {weather.isLoading
                      ? "Fetching Live Data..."
                      : `${weather.condition} • ${weather.temp}°C`}
                  </Badge>
                </div>

                <p className="text-xs text-amber-900/80 dark:text-amber-200 font-medium leading-relaxed">
                  {weather.isRainy
                    ? "Rainfall detected or expected near CvSU Imus Campus. Relocate feeder to covered shelter."
                    : weather.isHighHeat
                    ? "High heat index detected. Ensure water level is topped off to keep strays hydrated."
                    : "Weather conditions at CvSU Imus are optimal. Feeder station operating normally."}
                </p>

                {weather.isRainy && (
                  <div className="p-3 rounded-2xl border bg-amber-600/15 border-amber-600/30 flex items-center gap-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Relocation Protocol Triggered: Notify Caretakers</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-amber-600/40 dark:hover:border-amber-500/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800/80 dark:text-amber-300">
                    Food Stock
                  </CardTitle>
                  <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300 transition-transform duration-300 group-hover:scale-110">
                    <Utensils className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="text-3xl font-black tracking-tight text-amber-950 dark:text-amber-50">
                    {station.foodLevel}%
                  </div>
                  <Progress
                    value={station.foodLevel}
                    className="h-2.5 rounded-full bg-amber-900/10 dark:bg-amber-950/80 [&>div]:bg-gradient-to-r [&>div]:from-amber-600 [&>div]:to-amber-800 dark:[&>div]:from-amber-500 dark:[&>div]:to-amber-600"
                  />
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-amber-600/40 dark:hover:border-amber-500/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800/80 dark:text-amber-300">
                    Water Level
                  </CardTitle>
                  <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300 transition-transform duration-300 group-hover:scale-110">
                    <Droplets className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="text-3xl font-black tracking-tight text-amber-950 dark:text-amber-50">
                    {station.waterLevel}%
                  </div>
                  <Progress
                    value={station.waterLevel}
                    className="h-2.5 rounded-full bg-amber-900/10 dark:bg-amber-950/80 [&>div]:bg-gradient-to-r [&>div]:from-amber-600 [&>div]:to-amber-800 dark:[&>div]:from-amber-500 dark:[&>div]:to-amber-600"
                  />
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-amber-600/40 dark:hover:border-amber-500/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800/80 dark:text-amber-300">
                    Battery Percentage
                  </CardTitle>
                  <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300 transition-transform duration-300 group-hover:scale-110">
                    <Battery className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-black tracking-tight mb-1 text-amber-950 dark:text-amber-50">
                    {station.batteryPercentage}%
                  </div>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Optimal Charge State
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-amber-600/40 dark:hover:border-amber-500/50 group">
                <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-800/80 dark:text-amber-300">
                    Solar Energy
                  </CardTitle>
                  <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300 transition-transform duration-300 group-hover:scale-110">
                    <Sun className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-black tracking-tight mb-1 text-amber-950 dark:text-amber-50">
                    {station.solarVoltage}V
                  </div>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Generating Power
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* RESTOCK CONTRIBUTION HEATMAP CALENDAR */}
            <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300">
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight text-amber-950 dark:text-amber-50">
                      Restock Contribution Heatmap
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-amber-800/80 dark:text-amber-300 font-medium mt-1">
                    Click on any tile to inspect daily restock logs and details
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage("contributions")}
                    className="rounded-2xl h-9 px-3.5 text-xs font-bold border border-amber-900/15 dark:border-amber-700/50 bg-white dark:bg-[#2b1f17] shadow-sm backdrop-blur-md hover:border-amber-600 dark:hover:border-amber-500 transition-all text-amber-950 dark:text-amber-100"
                  >
                    <GitCommit className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400" /> View Timeline Page
                  </Button>
                  <Badge className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-600/15 text-amber-900 dark:text-amber-200 border border-amber-600/30 shadow-none">
                    142.5 kg Restocked Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 md:p-6 rounded-3xl border border-amber-900/10 dark:border-amber-800/40 bg-amber-50/50 dark:bg-[#1c140f]/70 backdrop-blur-md shadow-inner space-y-3 overflow-x-auto">
                  
                  {/* Month Headers across columns */}
                  <div className="flex text-[11px] font-bold mb-1 text-amber-800/80 dark:text-amber-400 uppercase tracking-wider min-w-[720px]">
                    {monthsHeader.map((m, idx) => (
                      <div
                        key={`${m.name}-${idx}`}
                        style={{ flexGrow: m.colSpan, flexBasis: 0 }}
                      >
                        {m.name}
                      </div>
                    ))}
                  </div>

                  {/* Horizontal Column Matrix Layout with 7 full rows (Every Day Timeline) */}
                  <div className="flex gap-1 overflow-x-auto pb-2 min-w-[720px]">
                    {Array.from({ length: 53 }).map((_, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, rowIndex) => {
                          const dayData = calendarGrid[rowIndex][colIndex];
                          if (!dayData)
                            return (
                              <div
                                key={`empty-${rowIndex}-${colIndex}`}
                                className="w-3 h-3 opacity-0"
                              />
                            );

                          return (
                            <button
                              key={`${dayData.fullDate}-${rowIndex}-${colIndex}`}
                              onClick={() => setSelectedDay(dayData)}
                              title={`${dayData.fullDate}: ${dayData.kg} kg restocked`}
                              className={`w-3 h-3 rounded-full border cursor-pointer transition-all hover:scale-125 hover:z-20 focus:outline-none ${getHeatmapColor(
                                dayData.kg,
                                isDarkMode
                              )}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px] text-amber-800/80 dark:text-amber-300 font-medium">
                    <span>52 weeks contribution history</span>
                    <div className="flex items-center gap-1.5">
                      <span>Less</span>
                      <span className="w-3 h-3 rounded-full bg-amber-200/60 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-800/40" />
                      <span className="w-3 h-3 rounded-full bg-amber-300 dark:bg-amber-900/60" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-700" />
                      <span className="w-3 h-3 rounded-full bg-amber-600 dark:bg-amber-600" />
                      <span className="w-3 h-3 rounded-full bg-amber-700 dark:bg-amber-500" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight text-amber-950 dark:text-amber-50">
                      Weekly Stray Visits
                    </CardTitle>
                    <CardDescription className="text-xs text-amber-800/80 dark:text-amber-300 font-medium mt-1">
                      Motion events logged by PawGuard PIR sensors
                    </CardDescription>
                  </div>
                  <Badge className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-600/15 text-amber-900 dark:text-amber-200 border border-amber-600/30 shadow-none">
                    7-Day Overview
                  </Badge>
                </CardHeader>
                <CardContent className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.weeklyVisits}>
                      <defs>
                        <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        stroke="currentColor"
                        className="text-amber-800/80 dark:text-amber-300"
                        fontSize={11}
                        fontWeight="700"
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-amber-800/80 dark:text-amber-300"
                        fontSize={11}
                        fontWeight="700"
                        axisLine={false}
                        tickLine={false}
                        ticks={[0, 9, 18, 27, 36]}
                        domain={[0, 36]}
                        dx={-8}
                      />
                      <Tooltip
                        cursor={{ stroke: "#d97706", strokeWidth: 1, strokeDasharray: "4 4" }}
                        contentStyle={{
                          backgroundColor: isDarkMode ? "hsl(25 35% 12% / 0.95)" : "hsl(35 40% 96% / 0.95)",
                          backdropFilter: "blur(12px)",
                          borderRadius: "16px",
                          border: "1px solid rgba(217, 119, 6, 0.3)",
                          boxShadow: "0 20px 25px -5px rgb(0 0 / 0.1)",
                          color: "currentColor",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="visits"
                        stroke="#d97706"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#visitGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-amber-900/15 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300">
                      <BellRing className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight text-amber-950 dark:text-amber-50">
                      Station Alerts
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-6">
                  {MOCK_ALERTS.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-2xl border border-amber-900/10 dark:border-amber-800/40 bg-amber-50/70 dark:bg-[#1c140f]/70 backdrop-blur-md text-xs space-y-1.5 transition-all duration-300 hover:bg-amber-600/15 dark:hover:bg-amber-500/15 hover:border-amber-600/30"
                    >
                      <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-50">
                        <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 shadow-sm shadow-amber-600" />
                        <span>{alert.title}</span>
                      </div>
                      <p className="pl-4 font-medium text-amber-900/80 dark:text-amber-200 leading-relaxed">
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
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-900/20 dark:border-amber-800/50 bg-white dark:bg-[#241a14]/95 backdrop-blur-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl border border-amber-900/20 dark:border-amber-800/50 bg-amber-100/60 dark:bg-[#1c140f] hover:bg-amber-600/20 transition-colors text-amber-950 dark:text-amber-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-amber-950 dark:text-amber-50">
                  Restock Details
                </h3>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium pl-9">
                {selectedDay.fullDate}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-amber-900/15 dark:border-amber-800/40 bg-amber-50/70 dark:bg-[#1c140f]/70 backdrop-blur-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800/80 dark:text-amber-300">
                    Amount Restocked
                  </p>
                  <p className="text-3xl font-black tracking-tight text-amber-950 dark:text-amber-50">
                    {selectedDay.kg}{" "}
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">kg</span>
                  </p>
                </div>
                <Badge className="px-3.5 py-1 text-xs font-semibold rounded-full bg-amber-600/15 text-amber-900 dark:text-amber-200 border border-amber-600/30 shadow-none">
                  {selectedDay.kg > 0 ? "Active Restock" : "No Activity"}
                </Badge>
              </div>

              <div className="p-4 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-xs flex items-start gap-3 text-amber-900 dark:text-amber-200 font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                  {selectedDay.kg > 0
                    ? `Community volunteers replenished ${selectedDay.kg} kg of dry food on this date.`
                    : "No community food restock was recorded on this date."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full mt-12 py-6 px-4 md:px-8 border-t border-amber-900/15 dark:border-amber-800/40 bg-white/60 dark:bg-[#241a14]/60 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl border border-amber-600/30 bg-amber-600/15 text-amber-800 dark:text-amber-300 shadow-sm">
              <PawPrint className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold tracking-tight text-sm text-amber-950 dark:text-amber-50">
                StraySafe Public Transparency Initiative
              </h4>
              <p className="text-amber-800/80 dark:text-amber-300 font-medium">
                Empowering community animal welfare through IoT monitoring & open telemetry data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-bold text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 shadow-none">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Public Telemetry Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}