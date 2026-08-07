import {
  getCurrentWeather,
  type CurrentWeather,
} from "@/lib/weather/openMeteo";
import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

/** Default header weather point — Busan Gijang coast. */
export const DEFAULT_HEADER_WEATHER_COORDS: Coordinates = {
  latitude: 35.2435,
  longitude: 129.2188,
};

export const DEFAULT_HEADER_WEATHER_NAME = "기장";

function toWeatherData(
  current: CurrentWeather,
  locationName?: string,
): WeatherData {
  return {
    locationName,
    forecastTime: current.time,
    temperatureC: current.temperatureC,
    feelsLikeC: current.feelsLikeC,
    humidityPercent: current.humidityPercent,
    condition: current.condition,
    conditionIcon: current.conditionIcon,
    weatherCode: current.weatherCode,
    precipitationMm: current.precipitationMm,
    windSpeedMs: current.windSpeedMs,
    windDirection: current.windDirection,
    windGustMs: current.windGustMs,
    cloudCoverPercent: current.cloudCoverPercent,
    pressureHpa: current.pressureHpa,
    isDay: current.isDay,
    hourly: current.hourly,
    fetchedAt: current.fetchedAt,
    sourceName:
      current.sourceName === "Open-Meteo"
        ? "Open-Meteo (기상청 키 미설정 시 실시간 대체)"
        : current.sourceName,
  };
}

/**
 * Live weather for browser:
 * 1) `/api/weather` (기상청 우선 → Open-Meteo, 서버)
 * 2) Open-Meteo 직접 (GitHub Pages 등 API 없는 환경)
 */
export async function fetchLiveWeatherClient(options: {
  coordinates: Coordinates;
  locationName?: string;
  detail?: boolean;
  refresh?: boolean;
  signal?: AbortSignal;
}): Promise<WeatherData> {
  const { coordinates, locationName, detail, refresh, signal } = options;
  const params = new URLSearchParams({
    lat: String(coordinates.latitude),
    lng: String(coordinates.longitude),
  });
  if (detail) params.set("detail", "1");
  if (refresh) params.set("refresh", "1");

  try {
    const response = await fetch(`/api/weather?${params.toString()}`, {
      signal,
      cache: "no-store",
    });
    if (response.ok) {
      const payload = (await response.json()) as WeatherData;
      if (locationName) payload.locationName = locationName;
      return payload;
    }
  } catch {
    // fall through
  }

  // Optional: browser-direct KMA when public key is configured (Pages).
  try {
    const { fetchKmaWeather, hasKmaApiKey } = await import(
      "@/lib/weather/kmaClient"
    );
    if (hasKmaApiKey()) {
      const kma = await fetchKmaWeather(coordinates, { detail });
      if (locationName) kma.locationName = locationName;
      return kma;
    }
  } catch {
    // CORS or key issues → Open-Meteo
  }

  const current = await getCurrentWeather(
    coordinates.latitude,
    coordinates.longitude,
    { detail, signal, cache: "no-store" },
  );
  return toWeatherData(current, locationName);
}
