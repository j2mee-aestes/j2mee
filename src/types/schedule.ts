import type { Coordinates } from "@/types/map";

export type ScheduleItemType =
  | "fishing"
  | "market"
  | "restaurant"
  | "processingShop"
  | "plogging";

export type ScheduleStatus = "draft" | "ready" | "completed";

export type TravelMode = "walking" | "driving";

export type ScheduleAvailabilityStatus =
  | "available"
  | "closingSoon"
  | "outsideHours"
  | "unknown";

export type ScheduleWarningSeverity = "info" | "warning" | "danger";

export interface ScheduleItem {
  id: string;
  sourceId: string;
  type: ScheduleItemType;
  title: string;
  address?: string;
  coordinates: Coordinates;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  order: number;
  notes?: string[];
  warnings?: string[];
  sourceLastVerifiedAt?: string;
  /** Plogging course self-distance when type is plogging */
  ploggingDistanceKm?: number;
}

export interface DaySchedule {
  id: string;
  title: string;
  date: string;
  items: ScheduleItem[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  /** Inter-place travel distance (excludes plogging course length) */
  travelDistanceKm: number;
  /** Sum of plogging course registered distances */
  ploggingDistanceKm: number;
  travelMode: TravelMode;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleWarning {
  id: string;
  itemId?: string;
  severity: ScheduleWarningSeverity;
  title: string;
  description: string;
}

export interface ScheduleRepository {
  getAll(): Promise<DaySchedule[]>;
  getById(id: string): Promise<DaySchedule | null>;
  save(schedule: DaySchedule): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ScheduleLeg {
  fromItemId: string;
  toItemId: string;
  distanceKm: number;
  travelMinutes: number;
}
