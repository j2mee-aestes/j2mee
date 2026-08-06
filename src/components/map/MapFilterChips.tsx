"use client";

import { FILTER_CHIP_CATEGORIES } from "@/constants/categories";
import { getCategoryIcon } from "@/constants/categoryIcons";
import type { CategoryFilter } from "@/types/map";

interface MapFilterChipsProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function MapFilterChips({
  selectedCategory,
  onCategoryChange,
}: MapFilterChipsProps) {
  return (
    <div
      className="flex max-w-full gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label="지도 필터"
    >
      {FILTER_CHIP_CATEGORIES.map((category) => {
        const selected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onCategoryChange(category.id)}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
              selected
                ? "border-transparent text-white"
                : "border-white/80 bg-white/95 text-[var(--color-text-primary)] hover:bg-white"
            }`}
            style={selected ? { backgroundColor: category.color } : undefined}
          >
            <span
              aria-hidden
              style={{ color: selected ? "#fff" : category.color }}
            >
              {getCategoryIcon(category.id, "h-3.5 w-3.5")}
            </span>
            {category.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
