import { mockPartnerPlaces } from "@/data/partners/mockPartnerPlaces";
import { normalizePartnerPlace } from "@/lib/partners/normalizePartnerPlace";
import {
  filterPartnersByKeyword,
  findNearbyPartners,
} from "@/lib/partners/filterPartners";
import type { Coordinates } from "@/types/map";
import type {
  NearbyPartnerResult,
  PartnerPlace,
  PartnerRepository,
  PartnerServiceFilter,
  PartnerSortOption,
  PartnerType,
} from "@/types/partner";

let cached: PartnerPlace[] | null = null;

export function getAllPartners(): PartnerPlace[] {
  if (!cached) {
    cached = mockPartnerPlaces.map((place) => normalizePartnerPlace(place));
  }
  return cached;
}

export function getPartnerById(id: string): PartnerPlace | null {
  return getAllPartners().find((partner) => partner.id === id) ?? null;
}

export function searchPartners(query: string): PartnerPlace[] {
  return filterPartnersByKeyword(getAllPartners(), query);
}

export async function findNearbyPartnersAsync(options: {
  coordinates: Coordinates;
  radiusKm: number;
  services?: PartnerServiceFilter;
  types?: PartnerType[];
  sortBy?: PartnerSortOption;
  limit?: number;
}): Promise<NearbyPartnerResult[]> {
  return findNearbyPartners({
    origin: options.coordinates,
    partners: getAllPartners(),
    radiusKm: options.radiusKm,
    services: options.services,
    types: options.types,
    sortBy: options.sortBy,
    limit: options.limit,
  });
}

export const localPartnerRepository: PartnerRepository = {
  async getAll() {
    return getAllPartners();
  },
  async getById(id) {
    return getPartnerById(id);
  },
  async findNearby(coordinates, radiusKm) {
    const results = await findNearbyPartnersAsync({
      coordinates,
      radiusKm,
    });
    return results.map((item) => item.partner);
  },
};
