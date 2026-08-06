import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import {
  DEFAULT_TRAVEL_MODE,
  SCHEDULE_TRAVEL_SPEED,
  WALKING_SUGGEST_MAX_KM,
} from "@/constants/scheduleDefaults";
import type {
  DaySchedule,
  ScheduleItem,
  ScheduleLeg,
  TravelMode,
} from "@/types/schedule";

export function estimateTravelMinutes(
  distanceKm: number,
  mode: TravelMode = DEFAULT_TRAVEL_MODE,
): number {
  const speed =
    mode === "walking"
      ? SCHEDULE_TRAVEL_SPEED.walkingKmPerHour
      : SCHEDULE_TRAVEL_SPEED.drivingKmPerHour;
  return Math.max(3, Math.round((distanceKm / speed) * 60));
}

export function suggestTravelMode(distanceKm: number): TravelMode {
  return distanceKm <= WALKING_SUGGEST_MAX_KM ? "walking" : "driving";
}

export function calculateScheduleLegs(
  items: ScheduleItem[],
  mode: TravelMode = DEFAULT_TRAVEL_MODE,
): ScheduleLeg[] {
  const ordered = [...items].sort((a, b) => a.order - b.order);
  const legs: ScheduleLeg[] = [];

  for (let index = 0; index < ordered.length - 1; index += 1) {
    const from = ordered[index];
    const to = ordered[index + 1];
    // For plogging, use end coordinates for outgoing leg when available via notes marker —
    // items store startPoint; distance between consecutive place anchors is reference only.
    const distanceKm = calculateDistanceKm(from.coordinates, to.coordinates);
    legs.push({
      fromItemId: from.id,
      toItemId: to.id,
      distanceKm,
      travelMinutes: estimateTravelMinutes(distanceKm, mode),
    });
  }

  return legs;
}

export function summarizeScheduleDistances(
  items: ScheduleItem[],
  mode: TravelMode = DEFAULT_TRAVEL_MODE,
): Pick<
  DaySchedule,
  "totalDistanceKm" | "travelDistanceKm" | "ploggingDistanceKm" | "totalDurationMinutes"
> {
  const legs = calculateScheduleLegs(items, mode);
  const travelDistanceKm = legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
  const ploggingDistanceKm = items.reduce(
    (sum, item) => sum + (item.ploggingDistanceKm ?? 0),
    0,
  );
  const travelMinutes = legs.reduce((sum, leg) => sum + leg.travelMinutes, 0);
  const dwellMinutes = items.reduce((sum, item) => sum + item.durationMinutes, 0);

  return {
    travelDistanceKm,
    ploggingDistanceKm,
    totalDistanceKm: travelDistanceKm + ploggingDistanceKm,
    totalDurationMinutes: dwellMinutes + travelMinutes,
  };
}
