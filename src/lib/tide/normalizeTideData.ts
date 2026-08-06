import type { DailyTideData, TideEvent, TideHourlyPoint } from "@/types/fishing";

export function normalizeTideData(input: {
  stationId: string;
  stationName: string;
  date: string;
  events: TideEvent[];
  hourly: TideHourlyPoint[];
  fetchedAt?: string;
  sourceName: string;
  distanceKmFromSpot?: number;
}): DailyTideData {
  return {
    stationId: input.stationId,
    stationName: input.stationName,
    date: input.date,
    events: [...input.events].sort((a, b) => a.time.localeCompare(b.time)),
    hourly: [...input.hourly].sort((a, b) => a.time.localeCompare(b.time)),
    fetchedAt: input.fetchedAt ?? new Date().toISOString(),
    sourceName: input.sourceName,
    distanceKmFromSpot: input.distanceKmFromSpot,
  };
}
