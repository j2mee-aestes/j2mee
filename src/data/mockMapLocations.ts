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

const positionById: Record<string, { x: number; y: number }> = {
  "loc-hakri": { x: 62, y: 38 },
  "loc-daebyeon": { x: 48, y: 52 },
  "loc-imrang": { x: 72, y: 28 },
  "loc-ilgwang-market": { x: 55, y: 44 },
  "loc-gijang-market": { x: 36, y: 58 },
  "loc-bada-restaurant": { x: 58, y: 50 },
  "loc-ugly-1": { x: 42, y: 46 },
  "loc-trash-1": { x: 70, y: 42 },
  "loc-trash-2": { x: 58, y: 62 },
  "loc-trash-line": { x: 45, y: 55 },
  "loc-tide-1": { x: 74, y: 30 },
  "loc-plogging-start": { x: 50, y: 30 },
};

function toMapLocation(detail: LocationDetail): MapLocation {
  return {
    id: detail.id,
    category: detail.category,
    name: detail.name,
    coordinates: detail.coordinates,
    position: positionById[detail.id] ?? { x: 50, y: 50 },
    description: detail.description,
    address: detail.address,
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
