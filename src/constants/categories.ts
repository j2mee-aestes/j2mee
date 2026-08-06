import type { CategoryFilter, MapCategory } from "@/types/map";

export interface CategoryConfig {
  id: CategoryFilter;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  /** Shown in map filter chips */
  showInFilterChips?: boolean;
}

export const CATEGORY_COLORS: Record<MapCategory, string> = {
  fishing: "#0284c7",
  market: "#ea580c",
  restaurant: "#ea580c",
  trash: "#16a34a",
  plogging: "#0d9488",
};

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "all",
    label: "전체",
    shortLabel: "전체",
    description: "모든 장소를 한눈에",
    color: "#0ea5e9",
    showInFilterChips: true,
  },
  {
    id: "fishing",
    label: "낚시 장소",
    shortLabel: "낚시 포인트",
    description: "포인트 정보와 주요 어종",
    color: CATEGORY_COLORS.fishing,
    showInFilterChips: true,
  },
  {
    id: "market",
    label: "수산시장",
    shortLabel: "수산시장",
    description: "수산시장·손질·식당을 한곳에서",
    color: CATEGORY_COLORS.market,
    showInFilterChips: true,
  },
  {
    id: "trash",
    label: "쓰레기통·수거함",
    shortLabel: "수거함",
    description: "쓰레기통·폐낚싯줄·폐어구 수거 장소",
    color: CATEGORY_COLORS.trash,
    showInFilterChips: true,
  },
  {
    id: "plogging",
    label: "플로깅 코스",
    shortLabel: "플로깅 코스",
    description: "해안 정화 산책 코스",
    color: CATEGORY_COLORS.plogging,
    showInFilterChips: true,
  },
];

export const FILTER_CHIP_CATEGORIES = CATEGORIES.filter(
  (category) => category.showInFilterChips,
);

export const CATEGORY_TYPE_LABELS: Record<MapCategory, string> = {
  fishing: "낚시 장소",
  market: "수산시장",
  restaurant: "수산시장·식당",
  trash: "쓰레기통·수거함",
  plogging: "플로깅 코스",
};

export function getCategoryConfig(id: CategoryFilter): CategoryConfig {
  const found = CATEGORIES.find((category) => category.id === id);
  if (!found) {
    return CATEGORIES[0];
  }
  return found;
}
