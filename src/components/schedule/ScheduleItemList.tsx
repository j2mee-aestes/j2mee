"use client";

import { ScheduleEmptyState } from "@/components/schedule/ScheduleEmptyState";
import {
  ScheduleItemCard,
  getNextDistances,
} from "@/components/schedule/ScheduleItemCard";
import type { ScheduleItem, TravelMode } from "@/types/schedule";

interface ScheduleItemListProps {
  items: ScheduleItem[];
  travelMode: TravelMode;
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
  onMoveUp: (itemId: string) => void;
  onMoveDown: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onDurationChange: (itemId: string, minutes: number) => void;
  onStartTimeChange: (itemId: string, time: string) => void;
  onShowOnMap: (itemId: string) => void;
}

export function ScheduleItemList({
  items,
  travelMode,
  selectedItemId,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDurationChange,
  onStartTimeChange,
  onShowOnMap,
}: ScheduleItemListProps) {
  const ordered = [...items].sort((a, b) => a.order - b.order);
  const distances = getNextDistances(ordered, travelMode);

  if (ordered.length === 0) {
    return <ScheduleEmptyState />;
  }

  return (
    <ul className="space-y-3">
      {ordered.map((item, index) => (
        <li key={item.id}>
          <ScheduleItemCard
            item={item}
            index={index}
            total={ordered.length}
            selected={selectedItemId === item.id}
            travelMode={travelMode}
            nextDistanceKm={distances[item.id]}
            onSelect={() => onSelect(item.id)}
            onMoveUp={() => onMoveUp(item.id)}
            onMoveDown={() => onMoveDown(item.id)}
            onRemove={() => onRemove(item.id)}
            onDurationChange={(minutes) => onDurationChange(item.id, minutes)}
            onStartTimeChange={(time) => onStartTimeChange(item.id, time)}
            onShowOnMap={() => onShowOnMap(item.id)}
          />
        </li>
      ))}
    </ul>
  );
}
