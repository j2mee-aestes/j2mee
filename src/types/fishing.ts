import type { Coordinates } from "./map";

export type FishingSpotType =
  | "breakwater"
  | "port"
  | "rock"
  | "beach"
  | "pier"
  | "paid"
  | "other";

export type VerificationStatus =
  | "official"
  | "partner"
  | "admin"
  | "user"
  | "unverified";

export type FishingAllowedStatus =
  | "allowed"
  | "restricted"
  | "prohibited"
  | "unknown";

export interface FishingSpot {
  id: string;
  name: string;
  /** Optional localized display names. Falls back to `name` (Korean). */
  names?: import("@/i18n/types").LocalizedText;
  address: string;
  coordinates: Coordinates;
  spotType: FishingSpotType;
  description?: string;
  descriptions?: import("@/i18n/types").LocalizedText;
  beginnerFriendly?: boolean;
  parkingAvailable?: boolean;
  toiletAvailable?: boolean;
  lightingAvailable?: boolean;
  safetyFenceAvailable?: boolean;
  targetFish?: string[];
  accessDescription?: string;
  cautionText?: string[];
  fishingAllowedStatus: FishingAllowedStatus;
  restrictionDescription?: string;
  weatherGridId?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
  nearbyMarket?: string;
  nearbyMarketDistanceKm?: number;
  imageUrls?: string[];
}

/** Non-fishing map places (market, trash, etc.) */
export interface LocationDetail {
  id: string;
  category: import("./map").MapCategory;
  name: string;
  address: string;
  description: string;
  beginnerFriendly?: boolean;
  parkingAvailable?: boolean;
  toiletAvailable?: boolean;
  safetyFacilities?: boolean;
  targetFish?: string[];
  nearbyMarket?: string;
  nearbyMarketDistanceKm?: number;
  distanceLabel?: string;
  coordinates: Coordinates;
  isVerified?: boolean;
}

export interface WeatherWarning {
  type: string;
  title: string;
  severity: "info" | "warning" | "danger";
  description?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface WeatherData {
  locationName?: string;
  forecastTime: string;
  temperatureC?: number;
  feelsLikeC?: number;
  condition?: string;
  precipitationProbability?: number;
  precipitationMm?: number;
  windSpeedMs?: number;
  windDirection?: string;
  windGustMs?: number;
  waveHeightM?: number;
  visibilityKm?: number;
  warnings?: WeatherWarning[];
  fetchedAt: string;
  sourceName: string;
}

export type ActivityStatus =
  | "normal"
  | "caution"
  | "notRecommended"
  | "restricted"
  | "unknown";

export interface ActivityEvaluation {
  status: ActivityStatus;
  label: string;
  reasons: string[];
  evaluatedAt: string;
}

export interface WeatherSummary {
  location: string;
  temperature: number;
  condition: string;
  windSpeed: number;
}
