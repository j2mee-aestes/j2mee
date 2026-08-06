import type { VerificationStatus } from "@/types/fishing";
import type { Coordinates } from "@/types/map";

export type LeisureActivityType =
  | "surfing"
  | "yacht"
  | "diving"
  | "kayak"
  | "bike"
  | "other";

export interface LeisurePlace {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  description: string;
  activityType: LeisureActivityType;
  imageUrls?: string[];
  seasonNote?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export interface LeisureRepository {
  getAll(): Promise<LeisurePlace[]>;
  getById(id: string): Promise<LeisurePlace | null>;
}
