"use client";

import type { ReactNode } from "react";
import {
  Fish,
  Footprints,
  LayoutGrid,
  Leaf,
  ShoppingBasket,
  Trash2,
  Waves,
} from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import type { LanguageCode } from "@/constants/languages";
import { t } from "@/constants/uiText";
import type { CategoryFilter } from "@/types/map";

const categoryIcons: Record<CategoryFilter, ReactNode> = {
  all: <LayoutGrid className="h-4 w-4" />,
  fishing: <Fish className="h-4 w-4" />,
  tide: <Waves className="h-4 w-4" />,
  market: <ShoppingBasket className="h-4 w-4" />,
  uglySeafood: <Leaf className="h-4 w-4" />,
  trash: <Trash2 className="h-4 w-4" />,
  plogging: <Footprints className="h-4 w-4" />,
};

interface MobileCategoryBarProps {
  language: LanguageCode;
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function MobileCategoryBar({
  language,
  selectedCategory,
  onCategoryChange,
}: MobileCategoryBarProps) {
  return (
    <div className="border-b border-[var(--color-border)] bg-white lg:hidden">
      <div
        className="flex gap-2 overflow-x-auto px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Categories"
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
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                selected
                  ? "border-transparent text-white shadow-sm"
                  : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)]"
              }`}
              style={selected ? { backgroundColor: category.color } : undefined}
            >
              <span aria-hidden style={{ color: selected ? "#fff" : category.color }}>
                {categoryIcons[category.id]}
              </span>
              {t(language, category.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
