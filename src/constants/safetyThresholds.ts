export const SAFETY_THRESHOLDS = {
  /** Wind speed (m/s) above which activity is not recommended */
  windNotRecommendedMs: 12,
  /** Wind speed (m/s) above which caution is advised */
  windCautionMs: 7,
  /** Wave height (m) above which activity is not recommended */
  waveNotRecommendedM: 1.5,
  /** Wave height (m) above which caution is advised */
  waveCautionM: 0.8,
  /** Precipitation probability (%) for caution */
  precipCautionPercent: 50,
  /** Weather data older than this (ms) is considered stale */
  weatherStaleMs: 3 * 60 * 60 * 1000,
  /** Max selectable forecast date offset from today (days) */
  maxWeatherDateOffsetDays: 7,
} as const;

export const ACTIVITY_STATUS_LABELS = {
  normal: "활동 가능",
  caution: "주의 필요",
  notRecommended: "활동 비권장",
  restricted: "출입 또는 낚시 제한",
  unknown: "정보 확인 필요",
} as const;

export const FISHING_ALLOWED_LABELS = {
  allowed: "낚시 가능",
  restricted: "일부 제한",
  prohibited: "낚시금지",
  unknown: "확인 필요",
} as const;

export const FISHING_SPOT_TYPE_LABELS = {
  breakwater: "방파제",
  port: "항구",
  rock: "갯바위",
  beach: "해안",
  pier: "잔교·피어",
  paid: "유료낚시터",
  other: "기타",
} as const;

export const VERIFICATION_STATUS_LABELS = {
  official: "공식 확인",
  partner: "제휴 확인",
  admin: "관리자 확인",
  user: "사용자 제보",
  unverified: "미검증",
} as const;

export const FISHING_ALLOWED_COLORS = {
  allowed: "#0284c7",
  restricted: "#ea580c",
  prohibited: "#dc2626",
  unknown: "#64748b",
} as const;
