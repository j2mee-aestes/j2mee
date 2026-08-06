import type { ScheduleItemType, TravelMode } from "@/types/schedule";

/** Default dwell times (minutes) by place type. */
export const DEFAULT_DURATION_MINUTES: Record<ScheduleItemType, number> = {
  fishing: 150,
  market: 60,
  restaurant: 90,
  processingShop: 90,
  plogging: 60,
};

export const DEFAULT_SCHEDULE_START_TIME = "09:00";

export const SCHEDULE_TRAVEL_SPEED = {
  walkingKmPerHour: 4,
  drivingKmPerHour: 30,
} as const;

export const DEFAULT_TRAVEL_MODE: TravelMode = "driving";

/** Walking is suggested when straight-line distance is below this. */
export const WALKING_SUGGEST_MAX_KM = 1.2;

export const MAX_SAVED_SCHEDULES = 20;

export const SCHEDULE_STORAGE_KEY = "padopado-day-schedules-v1";
export const SCHEDULE_DRAFT_STORAGE_KEY = "padopado-day-schedule-draft-v1";

export const SCHEDULE_TYPE_LABELS: Record<ScheduleItemType, string> = {
  fishing: "낚시",
  market: "수산시장",
  restaurant: "식당·횟집",
  processingShop: "손질 점포",
  plogging: "플로깅",
};

export const SCHEDULE_TYPE_COLORS: Record<ScheduleItemType, string> = {
  fishing: "#0284c7",
  market: "#ea580c",
  restaurant: "#c2410c",
  processingShop: "#9a3412",
  plogging: "#16a34a",
};
