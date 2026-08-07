import type { VerificationStatus } from "@/types/fishing";
import type { Coordinates } from "@/types/map";

export interface AttractionPlace {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  description: string;
  imageUrls?: string[];
  highlights?: string[];
  model3dUrl?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
  voteCount?: number;
}

export interface AttractionRepository {
  getAll(): Promise<AttractionPlace[]>;
  getById(id: string): Promise<AttractionPlace | null>;
}
