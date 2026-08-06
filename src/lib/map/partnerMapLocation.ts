import type { MapCategory, MapLocation } from "@/types/map";
import type { PartnerPlace, PartnerType } from "@/types/partner";

/** Map filter category for a partner type. processingShop joins restaurant filter. */
export function partnerTypeToMapCategory(type: PartnerType): MapCategory {
  if (type === "market" || type === "marketStore") {
    return "market";
  }
  return "restaurant";
}

export function partnerPlaceToMapLocation(partner: PartnerPlace): MapLocation {
  return {
    id: partner.id,
    category: partnerTypeToMapCategory(partner.type),
    name: partner.name,
    address: partner.address,
    coordinates: partner.coordinates,
    description: partner.description,
    isVerified: partner.verificationStatus !== "unverified",
    partnerType: partner.type,
  };
}
