import type { TideDaySummary, WeatherSummary } from "@/types/fishing";

export const mockWeather: WeatherSummary = {
  location: "기장",
  temperature: 24,
  condition: "맑음",
  windSpeed: 3.2,
};

export const mockTideData: TideDaySummary = {
  mul: "7물",
  status: "조금",
  currentTimeLabel: "14:20",
  times: [
    { type: "high", time: "05:34", height: 118 },
    { type: "low", time: "11:45", height: 32 },
    { type: "high", time: "17:58", height: 126 },
    { type: "low", time: "23:54", height: 28 },
  ],
  chartPoints: [
    { time: "00:00", height: 40 },
    { time: "03:00", height: 72 },
    { time: "05:34", height: 92, kind: "high" },
    { time: "08:00", height: 68 },
    { time: "11:45", height: 22, kind: "low" },
    { time: "14:20", height: 48, kind: "now" },
    { time: "17:58", height: 95, kind: "high" },
    { time: "20:30", height: 58 },
    { time: "23:54", height: 18, kind: "low" },
  ],
};
