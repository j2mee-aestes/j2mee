/**
 * Aggregated mock map locations for Kakao marker rendering.
 * Fishing, partners, waste points, plogging, attractions, and leisure come from repositories.
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
  attractionPlaceToMapLocation,
  leisurePlaceToMapLocation,
} from "@/lib/map/attractionLeisureMapLocation";
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
import {
  getAllAttractions,
  getAttractionById,
  searchAttractions,
} from "@/lib/attractions/attractionRepository";
import {
  getAllLeisurePlaces,
  getLeisurePlaceById,
  searchLeisurePlaces,
} from "@/lib/leisure/leisureRepository";
import {
  getAllCoastalEvents,
  getCoastalEventById,
  searchCoastalEvents,
} from "@/lib/events/eventRepository";
import { coastalEventToMapLocation } from "@/lib/map/eventMapLocation";
import type { CoastalEvent } from "@/types/event";
import type { AttractionPlace } from "@/types/attraction";
import type { LeisurePlace } from "@/types/leisure";
import type { FishingSpot } from "@/types/fishing";
import type { PartnerPlace } from "@/types/partner";
import type { PloggingRoute, WastePoint } from "@/types/environment";

export type SearchablePlace =
  | FishingSpot
  | PartnerPlace
  | WastePoint
  | PloggingRoute
  | AttractionPlace
  | LeisurePlace
  | CoastalEvent;

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
  ...getAllAttractions().map(attractionPlaceToMapLocation),
  ...getAllLeisurePlaces().map(leisurePlaceToMapLocation),
  ...getAllCoastalEvents().map(coastalEventToMapLocation),
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
  const attraction = getAttractionById(id);
  if (attraction) {
    return attraction;
  }
  const leisure = getLeisurePlaceById(id);
  if (leisure) {
    return leisure;
  }
  const event = getCoastalEventById(id);
  if (event) {
    return event;
  }
  return null;
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function searchMockLocations(query: string): SearchablePlace[] {
  const normalized = normalizeSearch(query);
  if (!normalized) {
    return [];
  }

  const fishingMatches = getAllFishingSpots().filter((spot) => {
    const localizedNames = spot.names
      ? Object.values(spot.names).filter(Boolean).join(" ")
      : "";
    const fish = (spot.targetFish ?? []).join(" ");
    const haystack = normalizeSearch(
      `${spot.name} ${localizedNames} ${spot.address} ${fish} ${spot.description ?? ""}`,
    );
    return haystack.includes(normalized);
  });

  return [
    ...fishingMatches,
    ...searchPartners(query),
    ...searchWastePoints(query),
    ...searchPloggingRoutes(query),
    ...searchAttractions(query),
    ...searchLeisurePlaces(query),
    ...searchCoastalEvents(query),
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

export function isAttraction(
  value: SearchablePlace | null,
): value is AttractionPlace {
  return Boolean(
    value &&
      "verificationStatus" in value &&
      !("activityType" in value) &&
      !("services" in value) &&
      !("spotType" in value) &&
      !("status" in value) &&
      !("startPoint" in value) &&
      !("difficulty" in value) &&
      !("coastalRelation" in value),
  );
}

export function isLeisure(
  value: SearchablePlace | null,
): value is LeisurePlace {
  return Boolean(value && "activityType" in value);
}

export function isCoastalEvent(
  value: SearchablePlace | null,
): value is CoastalEvent {
  return Boolean(value && "coastalRelation" in value && "startDate" in value);
}
