import type { UiTextKey } from "@/constants/uiText";
import type { CategoryFilter, MapCategory } from "@/types/map";

export interface CategoryItem {
  id: CategoryFilter;
  labelKey: UiTextKey;
  color: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", labelKey: "categoryAll", color: "#0ea5e9" },
  { id: "fishing", labelKey: "categoryFishing", color: "#0284c7" },
  { id: "tide", labelKey: "categoryTide", color: "#06b6d4" },
  { id: "market", labelKey: "categoryMarket", color: "#0d9488" },
  { id: "uglySeafood", labelKey: "categoryUglySeafood", color: "#16a34a" },
  { id: "trash", labelKey: "categoryTrash", color: "#65a30d" },
  { id: "plogging", labelKey: "categoryPlogging", color: "#059669" },
];

export const CATEGORY_COLORS: Record<MapCategory, string> = {
  fishing: "#0284c7",
  tide: "#06b6d4",
  market: "#0d9488",
  uglySeafood: "#16a34a",
  trash: "#65a30d",
  plogging: "#059669",
};
