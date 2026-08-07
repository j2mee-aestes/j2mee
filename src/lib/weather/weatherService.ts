import { openMeteoWeatherProvider } from "@/lib/weather/openMeteoWeatherProvider";
import { kmaWeatherProvider } from "@/lib/weather/kmaWeatherProvider";
import { hasKmaApiKey } from "@/lib/weather/kmaClient";
import { toCoordinatesKey } from "@/lib/weather/openMeteo";
import { normalizeWeatherData } from "@/lib/weather/normalizeWeatherData";
import type { WeatherProvider } from "@/lib/weather/weatherProvider";
import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

const cache = new Map<string, { expiresAt: number; data: WeatherData }>();
const CACHE_TTL_MS = 15 * 60 * 1000;
const inFlight = new Map<string, Promise<WeatherData>>();

function getPreferredProvider(): WeatherProvider {
  return hasKmaApiKey() ? kmaWeatherProvider : openMeteoWeatherProvider;
}

function cacheKey(
  coordinates: Coordinates,
  date?: string,
  detail = false,
): string {
  return `${toCoordinatesKey(coordinates)}:${date ?? "now"}:${detail ? "detail" : "basic"}`;
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  return getWeather({ latitude, longitude });
}

export function invalidateWeatherCache(coordinates?: Coordinates): void {
  if (!coordinates) {
    cache.clear();
    return;
  }
  const prefix = toCoordinatesKey(coordinates);
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export async function getWeather(
  coordinates: Coordinates,
  date?: string,
  options?: { detail?: boolean; bypassCache?: boolean },
): Promise<WeatherData> {
  const detail = Boolean(options?.detail);
  const key = cacheKey(coordinates, date, detail);

  if (!options?.bypassCache) {
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
  }

  const pending = inFlight.get(key);
  if (pending && !options?.bypassCache) {
    return pending;
  }

  const request = (async () => {
    const preferred = getPreferredProvider();
    let raw: WeatherData;
    try {
      raw = await preferred.getWeather(coordinates, date, { detail });
    } catch {
      // Prefer KMA; if key missing/failed, fall back to live Open-Meteo.
      if (preferred !== openMeteoWeatherProvider) {
        raw = await openMeteoWeatherProvider.getWeather(coordinates, date, {
          detail,
        });
      } else {
        throw new Error("WEATHER_FETCH_FAILED");
      }
    }
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
