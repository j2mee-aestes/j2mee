import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";
import type { WeatherProvider } from "@/lib/weather/weatherProvider";
import { mockWeatherProvider } from "@/lib/weather/mockWeatherProvider";

/**
 * Korea Meteorological Administration (기상청) style provider.
 * Uses KMA_API_KEY + KMA_API_BASE_URL when configured; otherwise falls back to mock.
 * Wire the official ultra-short forecast / marine endpoints once keys are provided.
 */
export const kmaWeatherProvider: WeatherProvider = {
  async getWeather(coordinates: Coordinates, date?: string): Promise<WeatherData> {
    const key = process.env.KMA_API_KEY?.trim() || process.env.WEATHER_API_KEY?.trim();
    const base =
      process.env.KMA_API_BASE_URL?.trim() ||
      process.env.WEATHER_API_BASE_URL?.trim();

    if (!key || !base) {
      return mockWeatherProvider.getWeather(coordinates, date);
    }

    try {
      // Placeholder request shape — replace with real KMA query params (nx/ny grid, auth).
      const url = new URL(base);
      url.searchParams.set("serviceKey", key);
      url.searchParams.set("lat", String(coordinates.latitude));
      url.searchParams.set("lng", String(coordinates.longitude));
      if (date) url.searchParams.set("date", date);

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        return mockWeatherProvider.getWeather(coordinates, date);
      }

      const payload = (await response.json()) as Partial<WeatherData>;
      const mock = await mockWeatherProvider.getWeather(coordinates, date);
      return {
        ...mock,
        ...payload,
        sourceName: payload.sourceName ?? "기상청 API",
        fetchedAt: payload.fetchedAt ?? new Date().toISOString(),
      };
    } catch {
      return mockWeatherProvider.getWeather(coordinates, date);
    }
  },
};
