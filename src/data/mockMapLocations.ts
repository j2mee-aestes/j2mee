/**
 * Aggregated mock map locations for Kakao marker rendering.
 * Fishing, partners, waste points, and plogging come from repositories.
 */
import type { MapLocation } from "@/types/map";
import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";
import {
  getAllPartners,
  getPartnerById,
  searchPartners,
} from "@/lib/partners/partnerRepository";
import { partnerPlaceToMapLocation } from "@/lib/map/partnerMapLocation";
import {
  ploggingRouteToMapLocations,
  wastePointToMapLocation,
} from "@/lib/map/environmentMapLocation";
import {
  getAllPloggingRoutes,
  getPloggingRouteById,
  searchPloggingRoutes,
} from "@/lib/environment/ploggingRouteRepository";
import {
  getAllWastePoints,
  getWastePointById,
  searchWastePoints,
} from "@/lib/environment/wastePointRepository";
import type { FishingSpot } from "@/types/fishing";
import type { PartnerPlace } from "@/types/partner";
import type { PloggingRoute, WastePoint } from "@/types/environment";

export type SearchablePlace =
  | FishingSpot
  | PartnerPlace
  | WastePoint
  | PloggingRoute;

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

export const mockMapLocations: MapLocation[] = [
  ...getAllFishingSpots().map(fishingSpotToMapLocation),
  ...getAllPartners().map(partnerPlaceToMapLocation),
  ...getAllWastePoints().map(wastePointToMapLocation),
  ...getAllPloggingRoutes().flatMap(ploggingRouteToMapLocations),
];

export function getLocationDetailById(
  id: string,
): SearchablePlace | null {
  const fishing = getAllFishingSpots().find((spot) => spot.id === id);
  if (fishing) {
    return fishing;
  }
  const partner = getPartnerById(id);
  if (partner) {
    return partner;
  }
  const waste = getWastePointById(id);
  if (waste) {
    return waste;
  }
  const routeId = id.endsWith("-end") ? id.replace(/-end$/, "") : id;
  const route = getPloggingRouteById(routeId);
  if (route) {
    return route;
  }
  return null;
}

export function searchMockLocations(query: string): SearchablePlace[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const fishingMatches = getAllFishingSpots().filter((spot) => {
    const haystack = `${spot.name} ${spot.address}`.toLowerCase();
    return haystack.includes(normalized);
  });

  return [
    ...fishingMatches,
    ...searchPartners(query),
    ...searchWastePoints(query),
    ...searchPloggingRoutes(query),
  ];
}

export function isFishingSpot(
  value: SearchablePlace | null,
): value is FishingSpot {
  return Boolean(value && "fishingAllowedStatus" in value && "spotType" in value);
}

export function isPartnerPlace(
  value: SearchablePlace | null,
): value is PartnerPlace {
  return Boolean(value && "services" in value);
}

export function isWastePoint(
  value: SearchablePlace | null,
): value is WastePoint {
  return Boolean(value && "status" in value && "type" in value && !("services" in value));
}

export function isPloggingRoute(
  value: SearchablePlace | null,
): value is PloggingRoute {
  return Boolean(
    value &&
      "startPoint" in value &&
      "endPoint" in value &&
      "difficulty" in value &&
      Array.isArray((value as PloggingRoute).coordinates),
  );
}
