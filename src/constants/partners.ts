import type {
  CatchAcceptanceStatus,
  CookingMethod,
  PartnerType,
  PartnerVerificationStatus,
} from "@/types/partner";

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  market: "수산시장",
  marketStore: "시장 점포",
  restaurant: "식당·횟집",
  processingShop: "손질 점포",
};

export const PARTNER_VERIFICATION_LABELS: Record<
  PartnerVerificationStatus,
  string
> = {
  official: "공식 검증",
  partner: "파트너",
  admin: "관리자 확인",
  unverified: "미검증",
};

export const CATCH_ACCEPTANCE_LABELS: Record<CatchAcceptanceStatus, string> = {
  accepted: "외부 수산물 접수 가능",
  conditional: "외부 수산물 조건부 접수",
  notAccepted: "외부 수산물 접수 불가",
  unknown: "외부 수산물 접수 여부를 확인할 수 없습니다.",
};

export const COOKING_METHOD_LABELS: Record<CookingMethod, string> = {
  sashimi: "회",
  grill: "구이",
  soup: "탕",
  steam: "찜",
  cleaningOnly: "손질만",
  other: "기타 조리",
};

/** Marker colors for partner subtypes (all under 수산시장 map filter). */
export const PARTNER_MARKER_COLORS: Record<PartnerType, string> = {
  market: "#ea580c",
  marketStore: "#f97316",
  restaurant: "#c2410c",
  processingShop: "#9a3412",
};

export const DEFAULT_NEARBY_RADIUS_KM = 10;
export const EXPANDED_NEARBY_RADIUS_KM = 25;
export const DEFAULT_NEARBY_LIMIT = 5;
