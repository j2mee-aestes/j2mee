export type UserRole = "user" | "admin" | "superAdmin";

export type RecordStatus = "draft" | "active" | "inactive" | "archived";

export type ManagedEntityType =
  | "fishing"
  | "partner"
  | "waste"
  | "plogging";

export type ReportStatus =
  | "submitted"
  | "reviewing"
  | "resolved"
  | "rejected";

export type ReportType =
  | "locationError"
  | "facilityRemoved"
  | "facilityMissing"
  | "binFull"
  | "unavailable"
  | "routeHazard"
  | "accessRestricted"
  | "other";

export interface AuditLogEntry {
  id: string;
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  createdAt: string;
}

export interface ManagedPlaceSummary {
  id: string;
  entityType: ManagedEntityType;
  sourceId: string;
  recordStatus: RecordStatus;
  verificationStatus: string;
  name: string;
  lastVerifiedAt?: string | null;
  updatedAt: string;
  payload: Record<string, unknown>;
}
