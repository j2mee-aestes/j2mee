/**
 * UI-verification mock partner places (markets, restaurants, processing shops).
 * Replace via partnerRepository when real store data is available.
 */
import type { PartnerPlace } from "@/types/partner";
import partnerPlacesJson from "@/data/partners/partnerPlaces.json";

export const mockPartnerPlaces: PartnerPlace[] = partnerPlacesJson as PartnerPlace[];
