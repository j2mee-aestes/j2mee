import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";
import type { WeatherProvider } from "@/lib/weather/weatherProvider";
import { fetchKmaWeather, hasKmaApiKey } from "@/lib/weather/kmaClient";

/**
 * Korea Meteorological Administration (기상청) ultra-short observation provider.
 * Uses 공공데이터포털 VilageFcstInfoService_2.0 when KMA_API_KEY is set.
 */
export const kmaWeatherProvider: WeatherProvider = {
  async getWeather(
    coordinates: Coordinates,
    _date?: string,
    options?: { detail?: boolean },
  ): Promise<WeatherData> {
    if (!hasKmaApiKey()) {
      throw new Error("KMA_API_KEY_MISSING");
    }
    return fetchKmaWeather(coordinates, { detail: options?.detail });
  },
};
