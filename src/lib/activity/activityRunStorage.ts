import {
  ACTIVITY_RUN_STORAGE_KEY,
  MAX_SAVED_ACTIVITY_RUNS,
} from "@/constants/activityDefaults";
import type { ActivityRun } from "@/types/activity";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function isValidActivityRun(value: unknown): value is ActivityRun {
  if (!value || typeof value !== "object") {
    return false;
  }
  const run = value as ActivityRun;
  return (
    typeof run.id === "string" &&
    typeof run.scheduleId === "string" &&
    typeof run.scheduleTitle === "string" &&
    typeof run.date === "string" &&
    typeof run.status === "string" &&
    Array.isArray(run.items)
  );
}

export function loadSavedActivityRuns(): ActivityRun[] {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(ACTIVITY_RUN_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidActivityRun);
  } catch {
    return [];
  }
}

export function persistSavedActivityRuns(runs: ActivityRun[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(
    ACTIVITY_RUN_STORAGE_KEY,
    JSON.stringify(runs.slice(0, MAX_SAVED_ACTIVITY_RUNS)),
  );
}

export function isLocalStorageAvailable(): boolean {
  if (!isBrowser()) {
    return false;
  }
  try {
    const key = "__padopado_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
