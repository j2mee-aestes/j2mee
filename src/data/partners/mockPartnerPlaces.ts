/**
 * Coastal seafood partners (markets, restaurants, processing) within ~15km of shoreline.
 * Map filter groups all of these under 수산시장.
 * Replace via partnerRepository when real store data is available.
 */
import type { PartnerPlace } from "@/types/partner";
import partnerPlacesJson from "@/data/partners/partnerPlaces.json";

export const mockPartnerPlaces: PartnerPlace[] = partnerPlacesJson as PartnerPlace[];
