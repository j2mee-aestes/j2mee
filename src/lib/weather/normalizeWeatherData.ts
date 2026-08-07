import type { WeatherData, WeatherWarning } from "@/types/fishing";

export function normalizeWeatherData(input: Partial<WeatherData> & {
  forecastTime: string;
  sourceName: string;
}): WeatherData {
  const warnings: WeatherWarning[] = (input.warnings ?? []).map((warning) => ({
    type: warning.type,
    title: warning.title,
    severity: warning.severity,
    description: warning.description,
    startedAt: warning.startedAt,
    endedAt: warning.endedAt,
  }));

  return {
    locationName: input.locationName,
    forecastTime: input.forecastTime,
    temperatureC: input.temperatureC,
    feelsLikeC: input.feelsLikeC,
    humidityPercent: input.humidityPercent,
    condition: input.condition,
    conditionIcon: input.conditionIcon,
    weatherCode: input.weatherCode,
    precipitationProbability: input.precipitationProbability,
    precipitationMm: input.precipitationMm,
    windSpeedMs: input.windSpeedMs,
    windDirection: input.windDirection,
    windGustMs: input.windGustMs,
    waveHeightM: input.waveHeightM,
    visibilityKm: input.visibilityKm,
    isDay: input.isDay,
    warnings,
    fetchedAt: input.fetchedAt ?? new Date().toISOString(),
    sourceName: input.sourceName,
  };
}
