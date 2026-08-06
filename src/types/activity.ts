import type { ScheduleItemType } from "@/types/schedule";

export type ActivityExecutionStatus =
  | "notStarted"
  | "inProgress"
  | "completed"
  | "skipped";

export type ActivityRunStatus =
  | "ready"
  | "inProgress"
  | "completed"
  | "cancelled";

export interface FishingActivityResult {
  type: "fishing";
  catchRecorded: boolean;
  /** none | caught | notCaught — UI choice mirrored into catchRecorded + flags */
  catchChoice?: "caught" | "notCaught" | "skipped";
  caughtSpecies?: string[];
  catchCount?: number;
  memo?: string;
}

export interface PartnerVisitResult {
  type: "market" | "restaurant" | "processingShop";
  visited: boolean;
  serviceUsed?: string[];
  memo?: string;
}

export interface PloggingActivityResult {
  type: "plogging";
  completedRoute: boolean;
  wasteTypes?: string[];
  bagCount?: number;
  disposalWastePointId?: string;
  disposalWastePointName?: string;
  memo?: string;
}

export type ActivityItemResult =
  | FishingActivityResult
  | PartnerVisitResult
  | PloggingActivityResult;

export interface ActivityExecutionItem {
  id: string;
  scheduleItemId: string;
  sourceId: string;
  type: ScheduleItemType;
  title: string;
  address?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  order: number;
  status: ActivityExecutionStatus;
  plannedStartTime?: string;
  plannedEndTime?: string;
  plannedDurationMinutes: number;
  ploggingDistanceKm?: number;
  notes?: string[];
  warnings?: string[];
  startedAt?: string;
  completedAt?: string;
  result?: ActivityItemResult;
}

export interface ActivityRun {
  id: string;
  scheduleId: string;
  scheduleTitle: string;
  date: string;
  status: ActivityRunStatus;
  items: ActivityExecutionItem[];
  plannedDistanceKm: number;
  plannedDurationMinutes: number;
  travelDistanceKm: number;
  ploggingDistanceKm: number;
  travelMode: "walking" | "driving";
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompletionPlaceSummary {
  id: string;
  type: ScheduleItemType;
  title: string;
  status: "completed" | "skipped";
  startedAt?: string;
  completedAt?: string;
  plannedStartTime?: string;
  memo?: string;
}

export interface FishingCompletionSummary {
  spotTitles: string[];
  recordedCatches: Array<{
    title: string;
    species: string[];
    count?: number;
    memo?: string;
  }>;
  notCaughtTitles: string[];
  unrecordedTitles: string[];
}

export interface PartnerCompletionSummary {
  visits: Array<{
    title: string;
    type: ScheduleItemType;
    status: "completed" | "skipped";
    serviceUsed: string[];
    memo?: string;
  }>;
}

export interface PloggingCompletionSummaryData {
  completedRouteCount: number;
  plannedDistanceKm: number;
  wasteTypes: string[];
  totalBagCount: number;
  disposalPointNames: string[];
  routeTitles: string[];
}

export interface ActivityCompletionSummary {
  activityRunId: string;
  scheduleId: string;
  title: string;
  date: string;
  completedItemCount: number;
  skippedItemCount: number;
  totalItemCount: number;
  plannedDistanceKm: number;
  plannedDurationMinutes: number;
  startedAt?: string;
  completedAt: string;
  visitedPlaces: CompletionPlaceSummary[];
  fishingSummary?: FishingCompletionSummary;
  partnerSummary?: PartnerCompletionSummary;
  ploggingSummary?: PloggingCompletionSummaryData;
}

export type CompletionBadgeId =
  | "firstCompletion"
  | "ploggingJoined"
  | "fishingAndPlogging"
  | "marketVisit";

export interface CompletionBadge {
  id: CompletionBadgeId;
  label: string;
  description: string;
}

export interface ActivityRunRepository {
  getAll(): Promise<ActivityRun[]>;
  getById(id: string): Promise<ActivityRun | null>;
  save(activityRun: ActivityRun): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ActivityProgress {
  total: number;
  completed: number;
  skipped: number;
  remaining: number;
  inProgress: number;
  percent: number;
}
