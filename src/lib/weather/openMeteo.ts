import type { Coordinates } from "@/types/map";

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  is_day: 0 | 1;
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone?: string;
  current: OpenMeteoCurrent;
}

export interface WeatherCondition {
  label: string;
  icon: string;
}

export interface CurrentWeather {
  temperatureC: number;
  feelsLikeC: number;
  humidityPercent: number;
  precipitationMm: number;
  weatherCode: number;
  condition: string;
  conditionIcon: string;
  windSpeedMs: number;
  windDirectionDeg: number;
  windDirection: string;
  isDay: boolean;
  time: string;
  fetchedAt: string;
  sourceName: string;
}

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export function getWeatherCondition(
  weatherCode: number,
  isDay = true,
): WeatherCondition {
  const clearIcon = isDay ? "☀️" : "🌙";

  if (weatherCode === 0) return { label: "맑음", icon: clearIcon };
  if (weatherCode === 1) return { label: "대체로 맑음", icon: clearIcon };
  if (weatherCode === 2) return { label: "구름 조금", icon: "⛅" };
  if (weatherCode === 3) return { label: "흐림", icon: "☁️" };
  if (weatherCode === 45 || weatherCode === 48) {
    return { label: "안개", icon: "🌫️" };
  }
  if (weatherCode >= 51 && weatherCode <= 57) {
    return { label: "이슬비", icon: "🌦️" };
  }
  if (weatherCode === 61 || weatherCode === 63 || weatherCode === 66) {
    return { label: "비", icon: "🌧️" };
  }
  if (weatherCode === 65 || weatherCode === 67) {
    return { label: "강한 비", icon: "🌧️" };
  }
  if (weatherCode >= 71 && weatherCode <= 77) {
    return { label: "눈", icon: "🌨️" };
  }
  if (weatherCode >= 80 && weatherCode <= 82) {
    return { label: "소나기", icon: "🌦️" };
  }
  if (weatherCode === 85 || weatherCode === 86) {
    return { label: "눈", icon: "🌨️" };
  }
  if (weatherCode >= 95 && weatherCode <= 99) {
    return { label: "천둥번개", icon: "⛈️" };
  }
  return { label: "흐림", icon: "☁️" };
}

export function getWindDirection(degree: number): string {
  const normalized = ((degree % 360) + 360) % 360;
  const directions = [
    "북",
    "북동",
    "동",
    "남동",
    "남",
    "남서",
    "서",
    "북서",
  ];
  const index = Math.round(normalized / 45) % 8;
  return directions[index] ?? "북";
}

function assertValidCoordinates(latitude: number, longitude: number): void {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("INVALID_COORDINATES");
  }
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  init?: RequestInit,
): Promise<CurrentWeather> {
  assertValidCoordinates(latitude, longitude);

  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
    ].join(","),
  );
  url.searchParams.set("wind_speed_unit", "ms");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error("WEATHER_FETCH_FAILED");
  }

  const payload = (await response.json()) as OpenMeteoForecastResponse;
  const current = payload.current;
  if (!current) {
    throw new Error("WEATHER_FETCH_FAILED");
  }

  const isDay = current.is_day === 1;
  const condition = getWeatherCondition(current.weather_code, isDay);

  return {
    temperatureC: current.temperature_2m,
    feelsLikeC: current.apparent_temperature,
    humidityPercent: current.relative_humidity_2m,
    precipitationMm: current.precipitation,
    weatherCode: current.weather_code,
    condition: condition.label,
    conditionIcon: condition.icon,
    windSpeedMs: current.wind_speed_10m,
    windDirectionDeg: current.wind_direction_10m,
    windDirection: getWindDirection(current.wind_direction_10m),
    isDay,
    time: current.time,
    fetchedAt: new Date().toISOString(),
    sourceName: "Open-Meteo",
  };
}

export function toCoordinatesKey(coordinates: Coordinates): string {
  return `${coordinates.latitude.toFixed(4)},${coordinates.longitude.toFixed(4)}`;
}
