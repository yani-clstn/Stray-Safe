import { useEffect, useState } from "react";
import { CloudRain, AlertTriangle, CloudSun } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  isHighHeat: boolean;
  isRainy: boolean;
  isLive: boolean;
}

export function CampusWeatherCard() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 29,
    condition: "Optimal Conditions",
    isHighHeat: false,
    isRainy: false,
    isLive: false,
  });

  useEffect(() => {
    // Read the environment variable
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    // Fallback: If no API key is provided, default operational status remains
    if (!apiKey) return;

    // Fetch live weather data targeting CvSU - Imus Campus coordinates
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=14.4297&lon=120.9367&units=metric&appid=${apiKey}`
        );
        if (!response.ok) return;

        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const mainCondition = data.weather[0]?.main.toLowerCase() || "";

        const isHighHeat = temp >= 33;
        const isRainy = mainCondition.includes("rain") || mainCondition.includes("drizzle");

        let condition = "Optimal Conditions";
        if (isHighHeat) condition = "High Heat Advisory";
        if (isRainy) condition = "Rain / Storm Advisory";

        setWeather({
          temp,
          condition,
          isHighHeat,
          isRainy,
          isLive: true,
        });
      } catch (error) {
        console.warn("Weather fetch failed, falling back to default status.", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
            {weather.isRainy ? (
              <CloudRain className="w-5 h-5 text-blue-500" />
            ) : weather.isHighHeat ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <CloudSun className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">CvSU Imus Weather Risk</h4>
              {weather.isLive && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">
                  Live
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{weather.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold">{weather.temp}°C</span>
        </div>
      </div>
    </div>
  );
}