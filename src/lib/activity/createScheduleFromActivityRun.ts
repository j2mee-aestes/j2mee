import {
  applyScheduleMetrics,
  createEmptySchedule,
} from "@/lib/schedule/createScheduleItem";
import type { ActivityRun } from "@/types/activity";
import type { DaySchedule, ScheduleItem } from "@/types/schedule";

/** Copy places/order/durations into a new draft. Results and run status are not copied. */
export function createScheduleFromActivityRun(run: ActivityRun): DaySchedule {
  const now = new Date().toISOString();
  const base = createEmptySchedule({
    title: `${run.scheduleTitle} (다시 계획)`,
  });

  const items: ScheduleItem[] = [...run.items]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      id: `item-${item.sourceId}-${Date.now()}-${index}`,
      sourceId: item.sourceId,
      type: item.type,
      title: item.title,
      address: item.address,
      coordinates: item.coordinates,
      durationMinutes: item.plannedDurationMinutes,
      order: index + 1,
      notes: item.notes,
      warnings: item.warnings,
      ploggingDistanceKm: item.ploggingDistanceKm,
    }));

  return applyScheduleMetrics(
    {
      ...base,
      travelMode: run.travelMode,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    },
    items,
  );
}
