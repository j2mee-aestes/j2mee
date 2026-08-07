import { openMeteoWeatherProvider } from "@/lib/weather/openMeteoWeatherProvider";
import { toCoordinatesKey } from "@/lib/weather/openMeteo";
import { normalizeWeatherData } from "@/lib/weather/normalizeWeatherData";
import type { WeatherProvider } from "@/lib/weather/weatherProvider";
import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

const cache = new Map<string, { expiresAt: number; data: WeatherData }>();
const CACHE_TTL_MS = 15 * 60 * 1000;
const inFlight = new Map<string, Promise<WeatherData>>();

function getWeatherProvider(): WeatherProvider {
  return openMeteoWeatherProvider;
}

function cacheKey(coordinates: Coordinates, date?: string): string {
  return `${toCoordinatesKey(coordinates)}:${date ?? "now"}`;
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  return getWeather({ latitude, longitude });
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

  const pending = inFlight.get(key);
  if (pending) {
    return pending;
  }

  const request = (async () => {
    const provider = getWeatherProvider();
    const raw = await provider.getWeather(coordinates, date);
    const normalized = normalizeWeatherData(raw);
    cache.set(key, {
      data: normalized,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return normalized;
  })();

  inFlight.set(key, request);
  try {
    return await request;
  } finally {
    inFlight.delete(key);
  }
}
