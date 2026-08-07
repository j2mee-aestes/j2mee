import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

/** Deterministic mock weather for UI verification around Gijang. */
export const mockWeatherProvider = {
  async getWeather(
    coordinates: Coordinates,
    date?: string,
  ): Promise<WeatherData> {
    const seed = Math.abs(
      Math.round(coordinates.latitude * 100) +
        Math.round(coordinates.longitude * 100) +
        (date ? Number(date.replace(/-/g, "")) % 17 : 0),
    );

    const windSpeedMs = 4 + (seed % 8) * 0.7;
    const waveHeightM = 0.4 + (seed % 5) * 0.15;
    const precip = seed % 10 === 0 ? 60 : seed % 5 === 0 ? 30 : 10;

    return {
      locationName: "기장 연안",
      forecastTime: new Date().toISOString(),
      temperatureC: 22 + (seed % 5),
      feelsLikeC: 21 + (seed % 4),
      condition: precip >= 50 ? "흐림·비" : precip >= 30 ? "구름많음" : "맑음",
      precipitationProbability: precip,
      precipitationMm: precip >= 50 ? 2.5 : 0,
      windSpeedMs: Number(windSpeedMs.toFixed(1)),
      windDirection: ["NE", "E", "SE", "S", "SW", "W"][seed % 6],
      windGustMs: Number((windSpeedMs + 2.2).toFixed(1)),
      waveHeightM: Number(waveHeightM.toFixed(1)),
      visibilityKm: 8 + (seed % 4),
      warnings:
        windSpeedMs >= 10
          ? [
              {
                type: "wind",
                title: "강풍 주의보",
                severity: "warning",
                description: "연안 강풍에 유의하세요.",
              },
            ]
          : [],
      fetchedAt: new Date().toISOString(),
      sourceName: "참고용 추정 정보 (실시간 연동 실패 시)",
    };
  },
};
