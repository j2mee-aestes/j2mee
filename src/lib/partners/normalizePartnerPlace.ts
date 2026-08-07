import type { PartnerPlace } from "@/types/partner";

export function normalizePartnerPlace(
  raw: Partial<PartnerPlace> &
    Pick<PartnerPlace, "id" | "type" | "name" | "address" | "coordinates" | "services">,
): PartnerPlace {
  return {
    id: raw.id,
    type: raw.type,
    name: raw.name,
    address: raw.address,
    coordinates: raw.coordinates,
    description: raw.description,
    phone: raw.phone,
    imageUrl: raw.imageUrl,
    imageUrls: raw.imageUrls,
    businessHours: raw.businessHours,
    closedDays: raw.closedDays,
    services: {
      seafoodSales: Boolean(raw.services.seafoodSales),
      catchCleaning: Boolean(raw.services.catchCleaning),
      catchCooking: Boolean(raw.services.catchCooking),
      outsideCatchAccepted: Boolean(raw.services.outsideCatchAccepted),
      dineIn: Boolean(raw.services.dineIn),
      takeaway: Boolean(raw.services.takeaway),
      reservationAvailable: Boolean(raw.services.reservationAvailable),
    },
    catchPolicy: raw.catchPolicy
      ? {
          ...raw.catchPolicy,
          finalInspectionRequired: Boolean(
            raw.catchPolicy.finalInspectionRequired,
          ),
        }
      : undefined,
    supportedLanguages: raw.supportedLanguages,
    paymentMethods: raw.paymentMethods,
    verificationStatus: raw.verificationStatus ?? "unverified",
    lastVerifiedAt: raw.lastVerifiedAt,
    sourceName: raw.sourceName ?? "미상",
    sourceUrl: raw.sourceUrl,
  };
}
