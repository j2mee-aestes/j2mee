import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import type { Coordinates } from "@/types/map";
import type {
  NearbyPartnerResult,
  PartnerPlace,
  PartnerServiceFilter,
  PartnerSortOption,
  PartnerType,
} from "@/types/partner";
import { getBusinessStatus } from "@/lib/partners/getBusinessStatus";

export interface FindNearbyPartnersOptions {
  origin: Coordinates;
  partners: PartnerPlace[];
  radiusKm: number;
  services?: PartnerServiceFilter;
  types?: PartnerType[];
  sortBy?: PartnerSortOption;
  limit?: number;
}

function matchesServiceFilter(
  partner: PartnerPlace,
  filter: PartnerServiceFilter,
): boolean {
  switch (filter) {
    case "cleaning":
      return partner.services.catchCleaning;
    case "cooking":
      return partner.services.catchCooking;
    case "outsideCatch":
      return (
        partner.services.outsideCatchAccepted ||
        partner.catchPolicy?.acceptanceStatus === "accepted" ||
        partner.catchPolicy?.acceptanceStatus === "conditional"
      );
    case "seafoodSales":
      return partner.services.seafoodSales;
    default:
      return true;
  }
}

/** Rough drive-time estimate from straight-line distance (reference only). */
export function estimateDriveMinutes(distanceKm: number): number {
  return Math.max(3, Math.round((distanceKm / 30) * 60));
}

export function findNearbyPartners(
  options: FindNearbyPartnersOptions,
): NearbyPartnerResult[] {
  const {
    origin,
    partners,
    radiusKm,
    services = "all",
    types,
    sortBy = "distance",
    limit,
  } = options;

  let results: NearbyPartnerResult[] = partners
    .filter((partner) => (types ? types.includes(partner.type) : true))
    .filter((partner) => matchesServiceFilter(partner, services))
    .map((partner) => {
      const distanceKm = calculateDistanceKm(origin, partner.coordinates);
      return {
        partner,
        distanceKm,
        estimatedDriveMinutes: estimateDriveMinutes(distanceKm),
      };
    })
    .filter((item) => item.distanceKm <= radiusKm);

  results = sortNearbyPartners(results, sortBy);

  if (limit !== undefined) {
    return results.slice(0, limit);
  }
  return results;
}

export function sortNearbyPartners(
  results: NearbyPartnerResult[],
  sortBy: PartnerSortOption,
): NearbyPartnerResult[] {
  const cloned = [...results];
  switch (sortBy) {
    case "name":
      return cloned.sort((a, b) => a.partner.name.localeCompare(b.partner.name, "ko"));
    case "openFirst":
      return cloned.sort((a, b) => {
        const aOpen = getBusinessStatus(a.partner.businessHours).status === "open" ? 0 : 1;
        const bOpen = getBusinessStatus(b.partner.businessHours).status === "open" ? 0 : 1;
        if (aOpen !== bOpen) {
          return aOpen - bOpen;
        }
        return a.distanceKm - b.distanceKm;
      });
    case "services": {
      const score = (partner: PartnerPlace) =>
        Object.values(partner.services).filter(Boolean).length;
      return cloned.sort((a, b) => {
        const diff = score(b.partner) - score(a.partner);
        return diff !== 0 ? diff : a.distanceKm - b.distanceKm;
      });
    }
    default:
      return cloned.sort((a, b) => a.distanceKm - b.distanceKm);
  }
}

export function filterPartnersByKeyword(
  partners: PartnerPlace[],
  query: string,
): PartnerPlace[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const serviceKeywords: Array<{ key: string; test: (p: PartnerPlace) => boolean }> = [
    { key: "손질", test: (p) => p.services.catchCleaning },
    { key: "조리", test: (p) => p.services.catchCooking },
    { key: "접수", test: (p) => p.services.outsideCatchAccepted },
    { key: "외부 수산물", test: (p) => p.services.outsideCatchAccepted },
    { key: "식당", test: (p) => p.type === "restaurant" },
    { key: "시장", test: (p) => p.type === "market" || p.type === "marketStore" },
    { key: "횟집", test: (p) => p.type === "restaurant" },
  ];

  return partners.filter((partner) => {
    const haystack = [
      partner.name,
      partner.address,
      partner.description ?? "",
      partner.type,
      ...(partner.catchPolicy?.acceptedSpecies ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(normalized)) {
      return true;
    }

    return serviceKeywords.some(
      (item) => normalized.includes(item.key) && item.test(partner),
    );
  });
}
