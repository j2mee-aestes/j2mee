import type { PloggingRoute } from "@/types/environment";

function isValidCoordinate(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export interface ValidatePloggingRouteOptions {
  knownWastePointIds: Set<string>;
}

/** Validate plogging route geometry and linked waste point IDs. */
export function validatePloggingRoute(
  route: PloggingRoute,
  options: ValidatePloggingRouteOptions,
): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!route.id || !route.name) {
    return { ok: false, warnings: ["missing id or name"] };
  }
  if (!route.coordinates || route.coordinates.length < 2) {
    return { ok: false, warnings: ["coordinates require at least 2 points"] };
  }
  if (!route.startPoint || !route.endPoint) {
    return { ok: false, warnings: ["start/end points required"] };
  }
  if (route.distanceKm < 0 || route.estimatedMinutes < 0) {
    return { ok: false, warnings: ["distance/time must be non-negative"] };
  }

  for (const point of [
    ...route.coordinates,
    route.startPoint,
    route.endPoint,
  ]) {
    if (
      !isValidCoordinate(point.latitude, -90, 90) ||
      !isValidCoordinate(point.longitude, -180, 180)
    ) {
      return { ok: false, warnings: ["invalid coordinates"] };
    }
  }

  for (const wasteId of route.connectedWastePointIds ?? []) {
    if (!options.knownWastePointIds.has(wasteId)) {
      warnings.push(`unknown waste point id: ${wasteId}`);
    }
  }

  return { ok: true, warnings };
}

export function normalizePloggingRoute(route: PloggingRoute): PloggingRoute {
  return {
    ...route,
    connectedWastePointIds: route.connectedWastePointIds ?? [],
    cautionNotes: route.cautionNotes ?? [],
    facilities: route.facilities ?? [],
    crossingNotes: route.crossingNotes ?? [],
    surfaceNotes: route.surfaceNotes ?? [],
  };
}
