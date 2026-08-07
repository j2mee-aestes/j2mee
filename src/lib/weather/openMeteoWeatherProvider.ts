import {
  getCurrentWeather,
  type CurrentWeather,
} from "@/lib/weather/openMeteo";
import type { WeatherProvider } from "@/lib/weather/weatherProvider";
import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

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
    isDay: current.isDay,
    fetchedAt: current.fetchedAt,
    sourceName: current.sourceName,
  };
}

export const openMeteoWeatherProvider: WeatherProvider = {
  async getWeather(coordinates: Coordinates): Promise<WeatherData> {
    const current = await getCurrentWeather(
      coordinates.latitude,
      coordinates.longitude,
    );
    return toWeatherData(current);
  },
};
