"use client";

import { TextButton } from "@/components/common/IconButton";
import {
  SCHEDULE_TYPE_COLORS,
  SCHEDULE_TYPE_LABELS,
} from "@/constants/scheduleDefaults";
import { calculateScheduleLegs } from "@/lib/schedule/calculateScheduleDistance";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import type { ScheduleItem, TravelMode } from "@/types/schedule";
import { ArrowDown, ArrowUp, MapPinned, Trash2 } from "lucide-react";

interface ScheduleItemCardProps {
  item: ScheduleItem;
  index: number;
  total: number;
  selected: boolean;
  travelMode: TravelMode;
  nextDistanceKm?: number;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onDurationChange: (minutes: number) => void;
  onStartTimeChange: (time: string) => void;
  onShowOnMap: () => void;
}

export function ScheduleItemCard({
  item,
  index,
  total,
  selected,
  nextDistanceKm,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDurationChange,
  onStartTimeChange,
  onShowOnMap,
}: ScheduleItemCardProps) {
  const color = SCHEDULE_TYPE_COLORS[item.type];

  return (
    <article
      className={`rounded-[var(--radius-md)] border p-3 ${
        selected
          ? "border-[var(--color-ocean-400)] bg-[var(--color-ocean-50)]"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {item.order}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold" style={{ color }}>
            {SCHEDULE_TYPE_LABELS[item.type]}
          </p>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            {item.title}
          </h3>
          {item.address ? (
            <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-muted)]">
              {item.address}
            </p>
          ) : null}
        </div>
      </button>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`start-${item.id}`}
            className="mb-1 block text-[11px] font-medium"
          >
            방문 시작시간
          </label>
          <input
            id={`start-${item.id}`}
            type="time"
            value={item.startTime ?? ""}
            onChange={(event) => onStartTimeChange(event.target.value)}
            className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor={`duration-${item.id}`}
            className="mb-1 block text-[11px] font-medium"
          >
            예상 체류시간(분)
          </label>
          <input
            id={`duration-${item.id}`}
            type="number"
            min={15}
            step={15}
            value={item.durationMinutes}
            onChange={(event) => onDurationChange(Number(event.target.value))}
            className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
          />
        </div>
      </div>

      <p className="mt-2 text-[11px] text-[var(--color-text-secondary)]">
        {item.startTime && item.endTime
          ? `${item.startTime}–${item.endTime}`
          : "시간 미설정"}
        {typeof nextDistanceKm === "number"
          ? ` · 다음 장소까지 ${formatDistanceKm(nextDistanceKm)}`
          : ""}
        {item.ploggingDistanceKm
          ? ` · 코스 ${formatDistanceKm(item.ploggingDistanceKm)}`
          : ""}
      </p>

      {item.sourceLastVerifiedAt ? (
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          데이터 확인: {item.sourceLastVerifiedAt}
        </p>
      ) : (
        <p className="mt-1 text-[11px] text-amber-800">확인일 미등록</p>
      )}

      {item.notes && item.notes.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-[11px] text-[var(--color-text-secondary)]">
          {item.notes.map((note) => (
            <li key={note}>· {note}</li>
          ))}
        </ul>
      ) : null}

      {item.warnings && item.warnings.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-[11px] text-amber-800">
          {item.warnings.map((warning) => (
            <li key={warning}>· {warning}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <TextButton
          variant="ghost"
          className="h-9 min-w-9 px-2"
          aria-label={`${item.title}을(를) 위로 이동`}
          disabled={index === 0}
          onClick={onMoveUp}
        >
          <ArrowUp className="h-4 w-4" />
        </TextButton>
        <TextButton
          variant="ghost"
          className="h-9 min-w-9 px-2"
          aria-label={`${item.title}을(를) 아래로 이동`}
          disabled={index === total - 1}
          onClick={onMoveDown}
        >
          <ArrowDown className="h-4 w-4" />
        </TextButton>
        <TextButton
          variant="secondary"
          className="h-9 text-xs"
          onClick={onShowOnMap}
        >
          <MapPinned className="h-3.5 w-3.5" aria-hidden />
          지도에서 보기
        </TextButton>
        <TextButton
          variant="ghost"
          className="h-9 text-xs text-red-700"
          aria-label={`${item.title} 일정에서 삭제`}
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          삭제
        </TextButton>
      </div>
    </article>
  );
}

export function getNextDistances(
  items: ScheduleItem[],
  travelMode: TravelMode,
): Record<string, number> {
  const legs = calculateScheduleLegs(items, travelMode);
  const map: Record<string, number> = {};
  legs.forEach((leg) => {
    map[leg.fromItemId] = leg.distanceKm;
  });
  return map;
}
