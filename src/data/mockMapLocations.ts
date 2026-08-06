/**
 * Aggregated mock map locations for Kakao marker rendering.
 * Fishing spots and partners come from repositories; trash/plogging remain facility mocks.
 */
import type { MapLocation } from "@/types/map";
import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";
import { getAllPartners, getPartnerById, searchPartners } from "@/lib/partners/partnerRepository";
import { partnerPlaceToMapLocation } from "@/lib/map/partnerMapLocation";
import {
  mockTrashBins,
  mockUglySeafood,
} from "@/data/mockMarkets";
import { mockPloggingLocations } from "@/data/mockPloggingRoutes";
import type { FishingSpot, LocationDetail } from "@/types/fishing";
import type { PartnerPlace } from "@/types/partner";

export type SearchablePlace = LocationDetail | FishingSpot | PartnerPlace;

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
  ...mockUglySeafood,
  ...mockTrashBins,
  ...mockPloggingLocations,
];

export const allLocationDetails: LocationDetail[] = facilityDetails;

export const mockMapLocations: MapLocation[] = [
  ...getAllFishingSpots().map(fishingSpotToMapLocation),
  ...getAllPartners().map(partnerPlaceToMapLocation),
  ...facilityDetails.map(toMapLocation),
];

export function getLocationDetailById(
  id: string,
): LocationDetail | FishingSpot | PartnerPlace | null {
  const fishing = getAllFishingSpots().find((spot) => spot.id === id);
  if (fishing) {
    return fishing;
  }
  const partner = getPartnerById(id);
  if (partner) {
    return partner;
  }
  return facilityDetails.find((item) => item.id === id) ?? null;
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

  const partnerMatches = searchPartners(query);

  const facilityMatches = facilityDetails.filter((location) => {
    const haystack = `${location.name} ${location.address}`.toLowerCase();
    return haystack.includes(normalized);
  });

  return [...fishingMatches, ...partnerMatches, ...facilityMatches];
}

export function isFishingSpot(
  value: SearchablePlace | null,
): value is FishingSpot {
  return Boolean(value && "fishingAllowedStatus" in value && "spotType" in value);
}

export function isPartnerPlace(
  value: SearchablePlace | null,
): value is PartnerPlace {
  return Boolean(value && "services" in value && "type" in value && "verificationStatus" in value);
}

export function isFacilityLocation(
  value: SearchablePlace | null,
): value is LocationDetail {
  return Boolean(
    value &&
      "category" in value &&
      !isFishingSpot(value) &&
      !isPartnerPlace(value),
  );
}
