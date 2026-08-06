import type { WeatherSummary } from "@/types/fishing";

/** Header summary mock (not station-linked). */
export const mockWeather: WeatherSummary = {
  location: "기장",
  temperature: 24,
  condition: "맑음",
  windSpeed: 3.2,
};

export const mockTideData = {
  mul: "7물",
  status: "조금",
  currentTimeLabel: "14:20",
};
