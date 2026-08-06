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
import { CategoryButton } from "@/components/common/CategoryButton";
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

interface SidebarProps {
  language: LanguageCode;
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  mobileOpen?: boolean;
}

export function Sidebar({
  language,
  selectedCategory,
  onCategoryChange,
  mobileOpen = false,
}: SidebarProps) {
  return (
    <aside
      className={`${
        mobileOpen ? "block" : "hidden"
      } w-full shrink-0 border-b border-[var(--color-border)] bg-white p-3 lg:block lg:w-56 lg:border-b-0 lg:border-r xl:w-64`}
    >
      <nav aria-label="Categories" className="flex flex-col gap-2">
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            label={t(language, category.labelKey)}
            color={category.color}
            selected={selectedCategory === category.id}
            icon={categoryIcons[category.id]}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
