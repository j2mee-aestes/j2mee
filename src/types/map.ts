export type MapCategory =
  | "fishing"
  | "tide"
  | "market"
  | "restaurant"
  | "uglySeafood"
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
}

export interface PloggingRoute {
  id: string;
  name: string;
  /** Ordered path coordinates (mock, for UI verification) */
  coordinates: Coordinates[];
  distanceKm: number;
  estimatedMinutes: number;
  startLabel: string;
  endLabel: string;
}
