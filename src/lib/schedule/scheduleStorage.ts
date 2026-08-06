import {
  MAX_SAVED_SCHEDULES,
  SCHEDULE_DRAFT_STORAGE_KEY,
  SCHEDULE_STORAGE_KEY,
} from "@/constants/scheduleDefaults";
import type { DaySchedule, ScheduleItem, TravelMode } from "@/types/schedule";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isScheduleItem(value: unknown): value is ScheduleItem {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as ScheduleItem;
  return (
    typeof item.id === "string" &&
    typeof item.sourceId === "string" &&
    typeof item.type === "string" &&
    typeof item.title === "string" &&
    typeof item.durationMinutes === "number" &&
    typeof item.order === "number" &&
    item.coordinates &&
    typeof item.coordinates.latitude === "number" &&
    typeof item.coordinates.longitude === "number"
  );
}

export function isValidDaySchedule(value: unknown): value is DaySchedule {
  if (!value || typeof value !== "object") {
    return false;
  }
  const schedule = value as DaySchedule;
  if (
    typeof schedule.id !== "string" ||
    typeof schedule.title !== "string" ||
    typeof schedule.date !== "string" ||
    !Array.isArray(schedule.items) ||
    typeof schedule.totalDistanceKm !== "number" ||
    typeof schedule.totalDurationMinutes !== "number"
  ) {
    return false;
  }
  if (!schedule.items.every(isScheduleItem)) {
    return false;
  }
  return true;
}

export function loadSavedSchedules(): DaySchedule[] {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidDaySchedule);
  } catch {
    return [];
  }
}

export function persistSavedSchedules(schedules: DaySchedule[]): void {
  if (!isBrowser()) {
    return;
  }
  const limited = schedules.slice(0, MAX_SAVED_SCHEDULES);
  window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(limited));
}

export function loadDraftSchedule(): DaySchedule | null {
  if (!isBrowser()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(SCHEDULE_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    return isValidDaySchedule(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistDraftSchedule(schedule: DaySchedule): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(
    SCHEDULE_DRAFT_STORAGE_KEY,
    JSON.stringify(schedule),
  );
}

export function clearDraftSchedule(): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(SCHEDULE_DRAFT_STORAGE_KEY);
}

export function normalizeTravelMode(value: unknown): TravelMode {
  return value === "walking" ? "walking" : "driving";
}
