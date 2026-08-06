export type MapCategory =
  | "fishing"
  | "tide"
  | "market"
  | "restaurant"
  | "trash"
  | "plogging";

export type CategoryFilter = "all" | MapCategory;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Map pin used by KakaoMap. Coordinates are UI-verification mock values. */
export interface MapLocation {
  id: string;
  category: MapCategory;
  name: string;
  address: string;
  coordinates: Coordinates;
  description?: string;
  isVerified?: boolean;
  fishingAllowedStatus?: import("./fishing").FishingAllowedStatus;
  /** Present when the pin represents a partner place (market/restaurant/processing). */
  partnerType?: import("./partner").PartnerType;
  /** Present when the pin represents a waste collection point. */
  wastePointType?: import("./environment").WastePointType;
  wasteStatus?: import("./environment").WastePointStatus;
}

/** @deprecated Import from `@/types/environment` instead. */
export type { PloggingRoute } from "./environment";
