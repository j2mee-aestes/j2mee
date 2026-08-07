import type { Coordinates } from "@/types/map";

export type WaveData = {
  waveHeightM: number;
  wavePeriodSec: number;
  fetchedAt: string;
  sourceName: string;
  locationName?: string;
};

const MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";

interface MarineResponse {
  current?: {
    time?: string;
    wave_height?: number;
    wave_period?: number;
  };
}

/**
 * Live wave snapshot.
 * 1) KMA marine endpoint when a key is configured
 * 2) Open-Meteo Marine API (no key, realtime model data)
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
      // fall through to Open-Meteo Marine
    }
  }

  const url = new URL(MARINE_URL);
  url.searchParams.set("latitude", String(coordinates.latitude));
  url.searchParams.set("longitude", String(coordinates.longitude));
  url.searchParams.set("current", "wave_height,wave_period");
  url.searchParams.set("timezone", "Asia/Seoul");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
  });
  if (!response.ok) {
    throw new Error("WAVE_FETCH_FAILED");
  }
  const payload = (await response.json()) as MarineResponse;
  const current = payload.current;
  if (current?.wave_height == null) {
    throw new Error("WAVE_FETCH_FAILED");
  }
  return {
    waveHeightM: Number(current.wave_height),
    wavePeriodSec: Number(current.wave_period ?? 0),
    fetchedAt: new Date().toISOString(),
    sourceName: "Open-Meteo Marine (실시간 파고)",
  };
}
