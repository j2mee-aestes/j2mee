"use client";

import { CategoryButton } from "@/components/common/CategoryButton";
import { TextButton } from "@/components/common/IconButton";
import { CATEGORIES } from "@/constants/categories";
import { getCategoryIcon } from "@/constants/categoryIcons";
import { UI_TEXT } from "@/constants/uiText";
import type { CategoryFilter } from "@/types/map";

interface DesktopSidebarProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  mobileOpen?: boolean;
}

export function DesktopSidebar({
  selectedCategory,
  onCategoryChange,
  mobileOpen = false,
}: DesktopSidebarProps) {
  return (
    <aside
      className={`${
        mobileOpen ? "flex" : "hidden"
      } w-full shrink-0 flex-col border-b border-[var(--color-border)] bg-white lg:flex lg:h-[calc(100vh-7.5rem)] lg:w-64 lg:border-b-0 lg:border-r xl:w-72`}
    >
      <nav
        aria-label="카테고리"
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-3"
      >
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            label={category.label}
            description={category.description}
            color={category.color}
            selected={selectedCategory === category.id}
            icon={getCategoryIcon(category.id)}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(145deg,#ecfdf5_0%,#e0f2fe_100%)] p-4">
          <p className="text-sm font-bold text-[var(--color-ocean-800)]">
            {UI_TEXT.ploggingPromoTitle}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {UI_TEXT.ploggingPromoBody}
          </p>
          <TextButton
            variant="primary"
            className="mt-3 w-full"
            onClick={() => onCategoryChange("plogging")}
          >
            {UI_TEXT.ploggingPromoCta}
          </TextButton>
        </div>
      </div>
    </aside>
  );
}
