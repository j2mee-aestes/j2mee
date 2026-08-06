import type { FishingSpot } from "@/types/fishing";

export function normalizeFishingSpot(
  raw: Partial<FishingSpot> & {
    id: string;
    name: string;
    address: string;
    coordinates: FishingSpot["coordinates"];
  },
): FishingSpot {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    coordinates: raw.coordinates,
    spotType: raw.spotType ?? "other",
    description: raw.description,
    beginnerFriendly: raw.beginnerFriendly,
    parkingAvailable: raw.parkingAvailable,
    toiletAvailable: raw.toiletAvailable,
    lightingAvailable: raw.lightingAvailable,
    safetyFenceAvailable: raw.safetyFenceAvailable,
    targetFish: raw.targetFish,
    accessDescription: raw.accessDescription,
    cautionText: raw.cautionText,
    fishingAllowedStatus: raw.fishingAllowedStatus ?? "unknown",
    restrictionDescription: raw.restrictionDescription,
    weatherGridId: raw.weatherGridId,
    verificationStatus: raw.verificationStatus ?? "unverified",
    lastVerifiedAt: raw.lastVerifiedAt,
    sourceName: raw.sourceName ?? "미상",
    sourceUrl: raw.sourceUrl,
    nearbyMarket: raw.nearbyMarket,
    nearbyMarketDistanceKm: raw.nearbyMarketDistanceKm,
  };
}
