import type { WastePoint } from "@/types/environment";

const VALID_TYPES = new Set([
  "generalTrash",
  "recycling",
  "fishingLine",
  "fishingGear",
  "ploggingCollection",
  "other",
]);

const VALID_STATUS = new Set([
  "available",
  "temporarilyUnavailable",
  "removed",
  "unknown",
]);

function isValidCoordinate(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

function isValidDateString(value: string | undefined): boolean {
  if (!value) {
    return true;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Returns true when the waste point can safely be shown on the map. */
export function isValidWastePoint(point: WastePoint): boolean {
  if (!point.id || !point.name) {
    return false;
  }
  if (!VALID_TYPES.has(point.type) || !VALID_STATUS.has(point.status)) {
    return false;
  }
  if (
    !isValidCoordinate(point.coordinates.latitude, -90, 90) ||
    !isValidCoordinate(point.coordinates.longitude, -180, 180)
  ) {
    return false;
  }
  if (!isValidDateString(point.lastVerifiedAt)) {
    return false;
  }
  return true;
}

export function normalizeWastePoint(point: WastePoint): WastePoint {
  return {
    ...point,
    acceptedWasteTypes: point.acceptedWasteTypes ?? [],
    usageNotes: point.usageNotes ?? [],
  };
}
