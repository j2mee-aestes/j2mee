"use client";

import type { WastePointType } from "@/types/environment";
import { WASTE_POINT_TYPE_LABELS } from "@/constants/environmentData";

interface WastePointFiltersProps {
  typeFilter: "all" | WastePointType;
  onTypeFilterChange: (value: "all" | WastePointType) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
}

const TYPE_OPTIONS: Array<{ id: "all" | WastePointType; label: string }> = [
  { id: "all", label: "전체" },
  { id: "generalTrash", label: WASTE_POINT_TYPE_LABELS.generalTrash },
  { id: "recycling", label: WASTE_POINT_TYPE_LABELS.recycling },
  { id: "fishingLine", label: WASTE_POINT_TYPE_LABELS.fishingLine },
  { id: "fishingGear", label: WASTE_POINT_TYPE_LABELS.fishingGear },
  {
    id: "ploggingCollection",
    label: WASTE_POINT_TYPE_LABELS.ploggingCollection,
  },
];

export function WastePointFilters({
  typeFilter,
  onTypeFilterChange,
  availableOnly,
  onAvailableOnlyChange,
}: WastePointFiltersProps) {
  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="수거 장소 유형 필터"
      >
        {TYPE_OPTIONS.map((option) => {
          const active = typeFilter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onTypeFilterChange(option.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                active
                  ? "bg-emerald-700 text-white ring-emerald-700"
                  : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <label className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(event) => onAvailableOnlyChange(event.target.checked)}
          className="h-3.5 w-3.5 rounded border-[var(--color-border)]"
        />
        현재 이용 가능한 장소만
      </label>
    </div>
  );
}
