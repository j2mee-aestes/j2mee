/**
 * Aggregated mock map locations for Kakao marker rendering.
 * Replace with real facility datasets in a later phase.
 */
import type { MapLocation } from "@/types/map";
import { mockFishingSpots } from "@/data/mockFishingSpots";
import {
  mockMarkets,
  mockRestaurants,
  mockTideStations,
  mockTrashBins,
  mockUglySeafood,
} from "@/data/mockMarkets";
import { mockPloggingLocations } from "@/data/mockPloggingRoutes";
import type { LocationDetail } from "@/types/fishing";

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

export const allLocationDetails: LocationDetail[] = [
  ...mockFishingSpots,
  ...mockMarkets,
  ...mockRestaurants,
  ...mockUglySeafood,
  ...mockTrashBins,
  ...mockTideStations,
  ...mockPloggingLocations,
];

export const mockMapLocations: MapLocation[] = allLocationDetails.map(toMapLocation);

export function getLocationDetailById(id: string): LocationDetail | null {
  return allLocationDetails.find((item) => item.id === id) ?? null;
}

export function searchMockLocations(query: string): LocationDetail[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return allLocationDetails.filter((location) => {
    const haystack = `${location.name} ${location.address}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
