import type { DaySchedule } from "@/types/schedule";
import type {
  ActivityExecutionItem,
  ActivityRun,
} from "@/types/activity";

export function createActivityRunFromSchedule(
  schedule: DaySchedule,
): ActivityRun {
  const now = new Date().toISOString();
  const items: ActivityExecutionItem[] = [...schedule.items]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      id: `exec-${item.id}-${index}`,
      scheduleItemId: item.id,
      sourceId: item.sourceId,
      type: item.type,
      title: item.title,
      address: item.address,
      coordinates: item.coordinates,
      order: index + 1,
      status: "notStarted",
      plannedStartTime: item.startTime,
      plannedEndTime: item.endTime,
      plannedDurationMinutes: item.durationMinutes,
      ploggingDistanceKm: item.ploggingDistanceKm,
      notes: item.notes,
      warnings: item.warnings,
    }));

  return {
    id: `run-${schedule.id}-${Date.now()}`,
    scheduleId: schedule.id,
    scheduleTitle: schedule.title,
    date: schedule.date,
    status: "ready",
    items,
    plannedDistanceKm: schedule.totalDistanceKm,
    plannedDurationMinutes: schedule.totalDurationMinutes,
    travelDistanceKm: schedule.travelDistanceKm,
    ploggingDistanceKm: schedule.ploggingDistanceKm,
    travelMode: schedule.travelMode,
    createdAt: now,
    updatedAt: now,
  };
}
