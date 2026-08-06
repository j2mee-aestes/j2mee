import { mockTideProvider } from "@/lib/tide/mockTideProvider";
import { normalizeTideData } from "@/lib/tide/normalizeTideData";
import type { TideProvider } from "@/lib/tide/tideProvider";
import type { DailyTideData } from "@/types/fishing";

const cache = new Map<string, { expiresAt: number; data: DailyTideData }>();
const CACHE_TTL_MS = process.env.NODE_ENV === "development" ? 30_000 : 30 * 60_000;

function getTideProvider(): TideProvider {
  const hasRealConfig =
    Boolean(process.env.TIDE_API_KEY?.trim()) &&
    Boolean(process.env.TIDE_API_BASE_URL?.trim());

  if (hasRealConfig) {
    // Real provider will be plugged in when API credentials are available.
    // Fallback remains mock until implemented.
    return mockTideProvider;
  }

  return mockTideProvider;
}

export async function getDailyTide(
  stationId: string,
  date: string,
  distanceKmFromSpot?: number,
): Promise<DailyTideData> {
  const cacheKey = `${stationId}:${date}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      ...cached.data,
      distanceKmFromSpot: distanceKmFromSpot ?? cached.data.distanceKmFromSpot,
    };
  }

  const provider = getTideProvider();
  const raw = await provider.getDailyTide(stationId, date);
  const normalized = normalizeTideData({
    ...raw,
    distanceKmFromSpot,
  });

  cache.set(cacheKey, {
    data: normalized,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return normalized;
}
