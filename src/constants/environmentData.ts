/** Thresholds and defaults for waste points and plogging environment data. */

/** Days since lastVerifiedAt after which a location is considered stale. */
export const WASTE_DATA_STALE_DAYS = 90;

export const DEFAULT_WASTE_SEARCH_RADIUS_KM = 3;
export const EXPANDED_WASTE_SEARCH_RADIUS_KM = 8;
export const DEFAULT_NEARBY_WASTE_LIMIT = 5;

export const WASTE_POINT_TYPE_LABELS: Record<
  import("@/types/environment").WastePointType,
  string
> = {
  generalTrash: "일반 쓰레기",
  recycling: "재활용",
  fishingLine: "폐낚싯줄",
  fishingGear: "폐어구",
  ploggingCollection: "플로깅 집하 장소",
  other: "기타 수거",
};

export const WASTE_POINT_STATUS_LABELS: Record<
  import("@/types/environment").WastePointStatus,
  string
> = {
  available: "이용 가능",
  temporarilyUnavailable: "일시 이용 불가",
  removed: "철거됨",
  unknown: "확인 필요",
};

export const PLOGGING_DIFFICULTY_LABELS: Record<
  import("@/types/environment").PloggingDifficulty,
  string
> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

export const LOCATION_REPORT_TYPE_LABELS: Record<
  import("@/types/environment").LocationReportType,
  string
> = {
  wrongLocation: "위치가 잘못됨",
  removed: "시설이 철거됨",
  notFound: "시설을 찾을 수 없음",
  full: "쓰레기통이 가득 참",
  unavailable: "이용이 불가능함",
  routeHazard: "코스가 위험하거나 통제됨",
  other: "기타",
};

/** Marker colors by waste subtype (category trash remains green overall). */
export const WASTE_MARKER_COLORS: Record<
  import("@/types/environment").WastePointType,
  string
> = {
  generalTrash: "#16a34a",
  recycling: "#15803d",
  fishingLine: "#0f766e",
  fishingGear: "#115e59",
  ploggingCollection: "#047857",
  other: "#65a30d",
};
