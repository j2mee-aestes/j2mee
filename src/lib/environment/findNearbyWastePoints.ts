import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import type { Coordinates } from "@/types/map";
import type {
  NearbyWastePointResult,
  WastePoint,
  WastePointType,
} from "@/types/environment";

export interface FindNearbyWastePointsOptions {
  origin: Coordinates;
  wastePoints: WastePoint[];
  radiusKm: number;
  types?: WastePointType[];
  availableOnly?: boolean;
  limit?: number;
}

export function findNearbyWastePoints(
  options: FindNearbyWastePointsOptions,
): NearbyWastePointResult[] {
  const {
    origin,
    wastePoints,
    radiusKm,
    types,
    availableOnly = false,
    limit,
  } = options;

  let results = wastePoints
    .filter((point) => (types ? types.includes(point.type) : true))
    .filter((point) => (availableOnly ? point.status === "available" : true))
    .map((wastePoint) => ({
      wastePoint,
      distanceKm: calculateDistanceKm(origin, wastePoint.coordinates),
    }))
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (limit !== undefined) {
    results = results.slice(0, limit);
  }
  return results;
}
