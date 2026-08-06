import { mockFishingSpots } from "@/data/fishing-spots/mockFishingSpots";
import { normalizeFishingSpot } from "@/lib/fishing/normalizeFishingSpot";
import type { FishingSpot } from "@/types/fishing";

let cachedSpots: FishingSpot[] | null = null;

export function getAllFishingSpots(): FishingSpot[] {
  if (!cachedSpots) {
    cachedSpots = mockFishingSpots.map((spot) => normalizeFishingSpot(spot));
  }
  return cachedSpots;
}

export function getFishingSpotById(id: string): FishingSpot | null {
  return getAllFishingSpots().find((spot) => spot.id === id) ?? null;
}

export function searchFishingSpots(query: string): FishingSpot[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  return getAllFishingSpots().filter((spot) => {
    const haystack = `${spot.name} ${spot.address}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
