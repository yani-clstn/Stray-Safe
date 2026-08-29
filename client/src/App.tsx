import { useQuery } from "@tanstack/react-query";
import { 
  Dog, 
  Utensils, 
  Droplets, 
  Sun, 
  Battery, 
  Wifi, 
  BellRing,
  Heart,
  RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const FETCH_URL = `${API_BASE_URL}/api/stations/station-01`;
const ANALYTICS_URL = `${API_BASE_URL}/api/stations/station-01/analytics`;

export default function Dashboard() {
  const { data: station, isLoading, isFetching: isFetchingStation, refetch: refetchStation } = useQuery({
    queryKey: ["station"],
    queryFn: () => fetch(FETCH_URL).then((res) => res.json()),
  });

  const { data: analytics, isFetching: isFetchingAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetch(ANALYTICS_URL).then((res) => res.json()),
  });

  const isRefreshing = isFetchingStation || isFetchingAnalytics;

  const handleManualRefresh = () => {
    refetchStation();
    refetchAnalytics();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-primary font-bold text-lg animate-bounce">
          <Dog className="w-8 h-8" />
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
            <Dog className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              STRAY SAFE <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Station: <span className="text-foreground font-semibold">{station?.name}</span> ({station?.location})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="rounded-full gap-2 text-xs font-semibold shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>

          <Badge variant="outline" className="px-3 py-1.5 rounded-full bg-card gap-2 text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Station Online
          </Badge>
        </div>
      </header>

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
              <div className="text-3xl font-black mb-3">{station?.foodLevel}%</div>
              <Progress value={station?.foodLevel} className="h-2.5 bg-muted [&>div]:bg-primary" />
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
              <div className="text-3xl font-black mb-3">{station?.waterLevel}%</div>
              <Progress value={station?.waterLevel} className="h-2.5 bg-muted [&>div]:bg-blue-500" />
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
              <div className="text-3xl font-black mb-1">{station?.batteryVoltage}V</div>
              <p className="text-xs font-semibold text-emerald-600">Optimal Charge</p>
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
              <div className="text-3xl font-black mb-1">{station?.solarPercent}%</div>
              <p className="text-xs font-semibold text-orange-500">Generating Power</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl shadow-sm border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Weekly Stray Visits</CardTitle>
                <CardDescription>Motion events logged by PawGuard PIR sensors</CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 font-semibold">
                7-Day Overview
              </Badge>
            </CardHeader>
            <CardContent className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.weeklyVisits || []}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", borderColor: "#fef3c7" }}
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                  />
                  <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-amber-100 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold">Station Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div className="p-3 bg-secondary/60 rounded-2xl border border-amber-200/50 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold">Water Bowl Low</p>
                  <p className="text-[11px] text-muted-foreground">Current level is below 45%. Pump refill cycle queued.</p>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-2xl border flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-slate-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Scheduled Feed Executed</p>
                  <p className="text-[11px] text-muted-foreground">Dispensed 150g portion at 12:00 PM.</p>
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