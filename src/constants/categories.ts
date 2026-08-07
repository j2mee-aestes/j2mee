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
  fishing: "#0ea5e9",
  market: "#f59e0b",
  restaurant: "#fb923c",
  trash: "#34d399",
  plogging: "#2dd4bf",
  attraction: "#fbbf24",
  leisure: "#38bdf8",
  event: "#a78bfa",
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
  {
    id: "attraction",
    label: "관광 명소",
    shortLabel: "관광",
    description: "해안 명소와 산책 포인트",
    color: CATEGORY_COLORS.attraction,
    showInFilterChips: true,
  },
  {
    id: "leisure",
    label: "해양 레저",
    shortLabel: "레저",
    description: "서핑·요트·카약·자전거 등 해안 레저",
    color: CATEGORY_COLORS.leisure,
    showInFilterChips: true,
  },
  {
    id: "event",
    label: "해안 행사",
    shortLabel: "행사",
    description: "부산 해안 대규모 행사·축제 일정",
    color: CATEGORY_COLORS.event,
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
  attraction: "관광 명소",
  leisure: "해양 레저",
  event: "해안 행사",
};

export function getCategoryConfig(id: CategoryFilter): CategoryConfig {
  const found = CATEGORIES.find((category) => category.id === id);
  if (!found) {
    return CATEGORIES[0];
  }
  return found;
}
