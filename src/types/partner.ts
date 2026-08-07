import type { Coordinates } from "./map";

export type PartnerType =
  | "market"
  | "marketStore"
  | "restaurant"
  | "processingShop";

export type PartnerVerificationStatus =
  | "official"
  | "partner"
  | "admin"
  | "unverified";

export type CatchAcceptanceStatus =
  | "accepted"
  | "conditional"
  | "notAccepted"
  | "unknown";

export type CookingMethod =
  | "sashimi"
  | "grill"
  | "soup"
  | "steam"
  | "cleaningOnly"
  | "other";

export interface BusinessHours {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

export interface PartnerServices {
  seafoodSales: boolean;
  catchCleaning: boolean;
  catchCooking: boolean;
  outsideCatchAccepted: boolean;
  dineIn: boolean;
  takeaway: boolean;
  reservationAvailable: boolean;
}

export interface CatchProcessingPolicy {
  acceptanceStatus: CatchAcceptanceStatus;
  acceptedSpecies?: string[];
  rejectedSpecies?: string[];
  acceptedCookingMethods?: CookingMethod[];
  minimumWeightKg?: number;
  maximumWeightKg?: number;
  refrigerationRequired?: boolean;
  reservationRequired?: boolean;
  pricingDescription?: string;
  additionalNotes?: string[];
  finalInspectionRequired: boolean;
}

export interface PartnerPlace {
  id: string;
  type: PartnerType;
  name: string;
  address: string;
  coordinates: Coordinates;
  description?: string;
  phone?: string;
  imageUrl?: string;
  imageUrls?: string[];
  businessHours?: BusinessHours[];
  closedDays?: string[];
  services: PartnerServices;
  catchPolicy?: CatchProcessingPolicy;
  supportedLanguages?: string[];
  paymentMethods?: string[];
  verificationStatus: PartnerVerificationStatus;
  lastVerifiedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export type BusinessStatus = "open" | "closingSoon" | "closed" | "unknown";

export type PartnerServiceFilter =
  | "all"
  | "cleaning"
  | "cooking"
  | "outsideCatch"
  | "seafoodSales";

export type PartnerSortOption =
  | "distance"
  | "name"
  | "openFirst"
  | "services";

export interface NearbyPartnerResult {
  partner: PartnerPlace;
  distanceKm: number;
  estimatedDriveMinutes: number | null;
}

export interface PartnerInquiryDraft {
  visitDate: string;
  visitTime: string;
  partySize: number;
  catchSpecies: string;
  estimatedWeightKg: string;
  requestedServices: string[];
  notes: string;
}

export interface PartnerRepository {
  getAll(): Promise<PartnerPlace[]>;
  getById(id: string): Promise<PartnerPlace | null>;
  findNearby(
    coordinates: Coordinates,
    radiusKm: number,
  ): Promise<PartnerPlace[]>;
}
