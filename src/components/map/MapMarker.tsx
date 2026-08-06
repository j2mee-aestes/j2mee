"use client";

import { getMapCategoryIcon } from "@/constants/categoryIcons";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { MapCategory } from "@/types/map";

interface MapMarkerProps {
  category: MapCategory;
  label: string;
  x: number;
  y: number;
  selected?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
}

export function MapMarker({
  category,
  label,
  x,
  y,
  selected = false,
  showLabel = false,
  onClick,
}: MapMarkerProps) {
  const color = CATEGORY_COLORS[category];

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {showLabel || selected ? (
        <div className="absolute bottom-full left-1/2 mb-2 w-max max-w-[140px] -translate-x-1/2 rounded-md border border-[var(--color-border)] bg-white px-2 py-1 text-[10px] font-semibold text-[var(--color-text-primary)] shadow-sm">
          {label}
        </div>
      ) : null}
      <button
        type="button"
        aria-label={label}
        aria-pressed={selected}
        title={label}
        onClick={onClick}
        className={`rounded-full border-2 border-white p-1.5 text-white shadow-md transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
          selected ? "scale-125 ring-2 ring-offset-2" : ""
        }`}
        style={{
          backgroundColor: color,
          boxShadow: selected
            ? `0 0 0 2px ${color}, 0 4px 12px rgba(15, 23, 42, 0.2)`
            : undefined,
        }}
      >
        {getMapCategoryIcon(category)}
      </button>
    </div>
  );
}
