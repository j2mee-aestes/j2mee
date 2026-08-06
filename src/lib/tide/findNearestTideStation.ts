import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import { mockTideStations } from "@/data/mockTideStations";
import type { Coordinates } from "@/types/map";
import type { TideStation } from "@/types/fishing";

export interface NearestTideStationResult {
  station: TideStation;
  distanceKm: number;
}

export function findNearestTideStation(
  coordinates: Coordinates,
  stations: TideStation[] = mockTideStations,
): NearestTideStationResult | null {
  if (stations.length === 0) {
    return null;
  }

  let nearest = stations[0];
  let nearestDistance = calculateDistanceKm(coordinates, nearest.coordinates);

  for (let i = 1; i < stations.length; i += 1) {
    const station = stations[i];
    const distance = calculateDistanceKm(coordinates, station.coordinates);
    if (distance < nearestDistance) {
      nearest = station;
      nearestDistance = distance;
    }
  }

  return { station: nearest, distanceKm: nearestDistance };
}

export function resolveTideStationForSpot(options: {
  coordinates: Coordinates;
  nearestTideStationId?: string;
  stations?: TideStation[];
}): NearestTideStationResult | null {
  const stations = options.stations ?? mockTideStations;

  if (options.nearestTideStationId) {
    const matched = stations.find(
      (station) => station.id === options.nearestTideStationId,
    );
    if (matched) {
      return {
        station: matched,
        distanceKm: calculateDistanceKm(options.coordinates, matched.coordinates),
      };
    }
  }

  return findNearestTideStation(options.coordinates, stations);
}
