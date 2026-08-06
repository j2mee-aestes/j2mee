"use client";

import { FILTER_CHIP_CATEGORIES } from "@/constants/categories";
import { getCategoryIcon } from "@/constants/categoryIcons";
import { useTranslations } from "@/context/LocaleContext";
import { getCategoryLabel } from "@/lib/i18n/categoryLabels";
import type { CategoryFilter } from "@/types/map";

interface MapFilterChipsProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function MapFilterChips({
  selectedCategory,
  onCategoryChange,
}: MapFilterChipsProps) {
  const { t, locale } = useTranslations();

  return (
    <div
      className="flex max-w-full gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label={t("common.map")}
    >
      {FILTER_CHIP_CATEGORIES.map((category) => {
        const selected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onCategoryChange(category.id)}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-[var(--shadow-soft)] backdrop-blur-md transition duration-200 ${
              selected
                ? "border-transparent text-white shadow-[0_10px_24px_-12px_rgba(14,116,144,0.5)]"
                : "border-white/70 bg-white/85 text-[var(--color-text-primary)] hover:-translate-y-0.5 hover:bg-white"
            }`}
            style={selected ? { backgroundColor: category.color } : undefined}
          >
            <span
              aria-hidden
              style={{ color: selected ? "#fff" : category.color }}
            >
              {getCategoryIcon(category.id, "h-3.5 w-3.5")}
            </span>
            {getCategoryLabel(locale, category.id, "shortLabel")}
          </button>
        );
      })}
    </div>
  );
}
