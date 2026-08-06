"use client";

import { CATEGORIES } from "@/constants/categories";
import { getCategoryIcon } from "@/constants/categoryIcons";
import { useTranslations } from "@/context/LocaleContext";
import { getCategoryLabel } from "@/lib/i18n/categoryLabels";
import type { CategoryFilter } from "@/types/map";

interface MobileCategoryBarProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function MobileCategoryBar({
  selectedCategory,
  onCategoryChange,
}: MobileCategoryBarProps) {
  const { t, locale } = useTranslations();

  return (
    <div className="border-b border-[var(--color-border)] bg-white lg:hidden">
      <div
        className="flex gap-2 overflow-x-auto px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={t("categories.all.label")}
      >
        {CATEGORIES.map((category) => {
          const selected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onCategoryChange(category.id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                selected
                  ? "border-transparent text-white shadow-sm"
                  : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)]"
              }`}
              style={selected ? { backgroundColor: category.color } : undefined}
            >
              <span aria-hidden>{getCategoryIcon(category.id, "h-3.5 w-3.5")}</span>
              {getCategoryLabel(locale, category.id, "shortLabel")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
