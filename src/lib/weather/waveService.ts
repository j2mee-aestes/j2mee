import type { Coordinates } from "@/types/map";
import { mockWeatherProvider } from "@/lib/weather/mockWeatherProvider";

export type WaveData = {
  waveHeightM: number;
  wavePeriodSec: number;
  fetchedAt: string;
  sourceName: string;
  locationName?: string;
};

/**
 * Live wave snapshot. Prefers KMA marine key when present; else derives from mock weather.
 */
export async function getWaveData(
  coordinates: Coordinates,
): Promise<WaveData> {
  const key =
    process.env.KMA_MARINE_API_KEY?.trim() ||
    process.env.MARINE_WEATHER_API_KEY?.trim();
  const base = process.env.KMA_MARINE_API_BASE_URL?.trim();

  if (key && base) {
    try {
      const url = new URL(base);
      url.searchParams.set("serviceKey", key);
      url.searchParams.set("lat", String(coordinates.latitude));
      url.searchParams.set("lng", String(coordinates.longitude));
      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });
      if (response.ok) {
        const payload = (await response.json()) as Partial<WaveData>;
        if (payload.waveHeightM != null) {
          return {
            waveHeightM: Number(payload.waveHeightM),
            wavePeriodSec: Number(payload.wavePeriodSec ?? 0),
            fetchedAt: payload.fetchedAt ?? new Date().toISOString(),
            sourceName: payload.sourceName ?? "기상청 해양기상",
            locationName: payload.locationName,
          };
        }
      }
    } catch {
      // fall through to mock
    }
  }

  const weather = await mockWeatherProvider.getWeather(coordinates);
  return {
    waveHeightM: weather.waveHeightM ?? 0.6,
    wavePeriodSec: 6.5,
    fetchedAt: weather.fetchedAt,
    sourceName: "기상청 해양기상 (mock)",
    locationName: weather.locationName,
  };
}
