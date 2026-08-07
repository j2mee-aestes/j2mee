import { busanCoastalEvents } from "@/data/events/busanCoastalEvents";
import type { CoastalEvent } from "@/types/event";

export function getAllCoastalEvents(): CoastalEvent[] {
  return [...busanCoastalEvents].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
}

export function getCoastalEventById(id: string): CoastalEvent | null {
  return busanCoastalEvents.find((event) => event.id === id) ?? null;
}

export function searchCoastalEvents(query: string): CoastalEvent[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllCoastalEvents();
  return getAllCoastalEvents().filter((event) => {
    const haystack = [
      event.name,
      event.address,
      ...event.venues,
      event.summary,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getUpcomingCoastalEvents(
  fromDate = "2026-08-07",
): CoastalEvent[] {
  return getAllCoastalEvents().filter((event) => event.endDate >= fromDate);
}
