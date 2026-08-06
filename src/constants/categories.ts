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
  tide: "#06b6d4",
  market: "#ea580c",
  restaurant: "#7c3aed",
  uglySeafood: "#db2777",
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
    id: "tide",
    label: "물때",
    shortLabel: "물때",
    description: "만조·간조와 시간별 조위",
    color: CATEGORY_COLORS.tide,
  },
  {
    id: "market",
    label: "수산시장",
    shortLabel: "수산시장",
    description: "주변 수산시장 정보",
    color: CATEGORY_COLORS.market,
    showInFilterChips: true,
  },
  {
    id: "restaurant",
    label: "손질·식당",
    shortLabel: "음식점",
    description: "잡은 수산물 손질·조리 장소",
    color: CATEGORY_COLORS.restaurant,
    showInFilterChips: true,
  },
  {
    id: "uglySeafood",
    label: "못난이 수산물",
    shortLabel: "못난이",
    description: "할인 판매 중인 수산물",
    color: CATEGORY_COLORS.uglySeafood,
  },
  {
    id: "trash",
    label: "쓰레기통",
    shortLabel: "쓰레기통",
    description: "공공 쓰레기통과 수거함",
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
  tide: "물때 관측",
  market: "수산시장",
  restaurant: "손질·식당",
  uglySeafood: "못난이 수산물",
  trash: "쓰레기통",
  plogging: "플로깅 코스",
};

export function getCategoryConfig(id: CategoryFilter): CategoryConfig {
  const found = CATEGORIES.find((category) => category.id === id);
  if (!found) {
    return CATEGORIES[0];
  }
  return found;
}
