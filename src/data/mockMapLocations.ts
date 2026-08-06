/**
 * Aggregated mock map locations for Kakao marker rendering.
 * Fishing spots come from the fishing repository; other facilities remain mock.
 */
import type { MapLocation } from "@/types/map";
import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";
import {
  mockMarkets,
  mockRestaurants,
  mockTrashBins,
  mockUglySeafood,
} from "@/data/mockMarkets";
import { mockPloggingLocations } from "@/data/mockPloggingRoutes";
import type { FishingSpot, LocationDetail } from "@/types/fishing";

function fishingSpotToMapLocation(spot: FishingSpot): MapLocation {
  return {
    id: spot.id,
    category: "fishing",
    name: spot.name,
    address: spot.address,
    coordinates: spot.coordinates,
    description: spot.description,
    isVerified: spot.verificationStatus !== "unverified",
    fishingAllowedStatus: spot.fishingAllowedStatus,
  };
}

function toMapLocation(detail: LocationDetail): MapLocation {
  return {
    id: detail.id,
    category: detail.category,
    name: detail.name,
    address: detail.address,
    coordinates: detail.coordinates,
    description: detail.description,
    isVerified: detail.isVerified,
  };
}

const facilityDetails: LocationDetail[] = [
  ...mockMarkets,
  ...mockRestaurants,
  ...mockUglySeafood,
  ...mockTrashBins,
  ...mockPloggingLocations,
];

export const allLocationDetails: LocationDetail[] = facilityDetails;

export const mockMapLocations: MapLocation[] = [
  ...getAllFishingSpots().map(fishingSpotToMapLocation),
  ...facilityDetails.map(toMapLocation),
];

export function getLocationDetailById(id: string): LocationDetail | FishingSpot | null {
  const fishing = getAllFishingSpots().find((spot) => spot.id === id);
  if (fishing) {
    return fishing;
  }
  return facilityDetails.find((item) => item.id === id) ?? null;
}

export function searchMockLocations(query: string): Array<LocationDetail | FishingSpot> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const fishingMatches = getAllFishingSpots().filter((spot) => {
    const haystack = `${spot.name} ${spot.address}`.toLowerCase();
    return haystack.includes(normalized);
  });

  const facilityMatches = facilityDetails.filter((location) => {
    const haystack = `${location.name} ${location.address}`.toLowerCase();
    return haystack.includes(normalized);
  });

  return [...fishingMatches, ...facilityMatches];
}

export function isFishingSpot(
  value: LocationDetail | FishingSpot | null,
): value is FishingSpot {
  return Boolean(value && "fishingAllowedStatus" in value && "spotType" in value);
}
