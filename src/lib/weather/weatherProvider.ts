import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

export interface WeatherProvider {
  getWeather(
    coordinates: Coordinates,
    date?: string,
    options?: { detail?: boolean },
  ): Promise<WeatherData>;
}
