import { calculateScheduleLegs } from "@/lib/schedule/calculateScheduleDistance";
import type { ScheduleItem, TravelMode } from "@/types/schedule";

function parseHm(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatHm(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Recalculate start/end times from the first item's start and dwell + travel. */
export function calculateScheduleTimes(
  items: ScheduleItem[],
  options: {
    firstStartTime: string;
    travelMode: TravelMode;
    /** When true, keep manually set start times if present on later items. */
    preserveManualStarts?: boolean;
  },
): ScheduleItem[] {
  const ordered = [...items].sort((a, b) => a.order - b.order);
  if (ordered.length === 0) {
    return [];
  }

  const legs = calculateScheduleLegs(ordered, options.travelMode);
  let cursor = parseHm(options.firstStartTime) ?? parseHm("09:00") ?? 9 * 60;

  return ordered.map((item, index) => {
    if (index === 0) {
      const start = options.firstStartTime;
      const startMinutes = parseHm(start) ?? cursor;
      const end = formatHm(startMinutes + item.durationMinutes);
      cursor = startMinutes + item.durationMinutes;
      return { ...item, startTime: start, endTime: end };
    }

    const leg = legs[index - 1];
    cursor += leg?.travelMinutes ?? 0;

    if (
      options.preserveManualStarts &&
      item.startTime &&
      parseHm(item.startTime) !== null
    ) {
      const manual = parseHm(item.startTime)!;
      cursor = Math.max(cursor, manual);
    }

    const startTime = formatHm(cursor);
    const endTime = formatHm(cursor + item.durationMinutes);
    cursor += item.durationMinutes;
    return { ...item, startTime, endTime };
  });
}

export function addMinutesToTime(time: string, minutes: number): string {
  const base = parseHm(time);
  if (base === null) {
    return time;
  }
  return formatHm(base + minutes);
}
