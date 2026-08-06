import { mockWeatherProvider } from "@/lib/weather/mockWeatherProvider";
import { normalizeWeatherData } from "@/lib/weather/normalizeWeatherData";
import type { WeatherProvider } from "@/lib/weather/weatherProvider";
import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

const cache = new Map<string, { expiresAt: number; data: WeatherData }>();
const CACHE_TTL_MS = process.env.NODE_ENV === "development" ? 30_000 : 15 * 60_000;

function getWeatherProvider(): WeatherProvider {
  const hasRealConfig =
    Boolean(process.env.WEATHER_API_KEY?.trim()) &&
    Boolean(process.env.WEATHER_API_BASE_URL?.trim());

  if (hasRealConfig) {
    return mockWeatherProvider;
  }

  return mockWeatherProvider;
}

function cacheKey(coordinates: Coordinates, date?: string): string {
  return `${coordinates.latitude.toFixed(3)},${coordinates.longitude.toFixed(3)}:${date ?? "now"}`;
}

export async function getWeather(
  coordinates: Coordinates,
  date?: string,
): Promise<WeatherData> {
  const key = cacheKey(coordinates, date);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const provider = getWeatherProvider();
  const raw = await provider.getWeather(coordinates, date);
  const normalized = normalizeWeatherData(raw);

  cache.set(key, {
    data: normalized,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return normalized;
}
