import type { MapCategory, MapLocation } from "@/types/map";
import type { PartnerPlace, PartnerType } from "@/types/partner";

/**
 * All partner places (market / restaurant / processing) share the 수산시장
 * map category so handouts and restaurants appear under one filter.
 */
export function partnerTypeToMapCategory(_type?: PartnerType): MapCategory {
  void _type;
  return "market";
}

export function partnerPlaceToMapLocation(partner: PartnerPlace): MapLocation {
  return {
    id: partner.id,
    category: "market",
    name: partner.name,
    address: partner.address,
    coordinates: partner.coordinates,
    description: partner.description,
    isVerified: partner.verificationStatus !== "unverified",
    partnerType: partner.type,
  };
}
