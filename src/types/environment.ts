import type { VerificationStatus } from "@/types/fishing";
import type { Coordinates } from "@/types/map";

export type WastePointType =
  | "generalTrash"
  | "recycling"
  | "fishingLine"
  | "fishingGear"
  | "ploggingCollection"
  | "other";

export type WastePointStatus =
  | "available"
  | "temporarilyUnavailable"
  | "removed"
  | "unknown";

export interface WastePoint {
  id: string;
  name: string;
  type: WastePointType;
  address?: string;
  coordinates: Coordinates;
  description?: string;
  acceptedWasteTypes?: string[];
  usageNotes?: string[];
  status: WastePointStatus;
  verificationStatus: VerificationStatus;
  availableHours?: string;
  lastVerifiedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export type PloggingDifficulty = "easy" | "normal" | "hard";

export interface PloggingRoute {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates[];
  startPoint: Coordinates;
  endPoint: Coordinates;
  distanceKm: number;
  estimatedMinutes: number;
  difficulty: PloggingDifficulty;
  connectedWastePointIds: string[];
  cautionNotes?: string[];
  facilities?: string[];
  recommendedTimeDescription?: string;
  walkingMinutes?: number;
  crosswalkCount?: number;
  crossingNotes?: string[];
  surfaceNotes?: string[];
  elevationGainM?: number;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export type PloggingSessionStatus =
  | "notStarted"
  | "inProgress"
  | "completed";

export interface PloggingSession {
  status: PloggingSessionStatus;
  routeId: string | null;
  startedAt?: string;
  completedAt?: string;
  collectedWasteTypes: string[];
  bagCount: number;
  disposalWastePointId?: string;
  memo: string;
}

export type LocationReportType =
  | "wrongLocation"
  | "removed"
  | "notFound"
  | "full"
  | "unavailable"
  | "routeHazard"
  | "other";

export interface LocationReportDraft {
  targetType: "wastePoint" | "ploggingRoute";
  targetId: string;
  targetName: string;
  reportType: LocationReportType;
  description: string;
  observedDate: string;
  photoName?: string;
}

export interface WastePointRepository {
  getAll(): Promise<WastePoint[]>;
  getById(id: string): Promise<WastePoint | null>;
}

export interface PloggingRouteRepository {
  getAll(): Promise<PloggingRoute[]>;
  getById(id: string): Promise<PloggingRoute | null>;
}

export interface NearbyWastePointResult {
  wastePoint: WastePoint;
  distanceKm: number;
}

export type WastePointTypeFilter = "all" | WastePointType;
