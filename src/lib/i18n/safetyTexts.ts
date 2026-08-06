import type { SupportedLocale } from "@/i18n/config";
import type { LocalizedSafetyText } from "@/i18n/types";
import { translate } from "@/lib/i18n/translate";

/** Safety copy with review metadata. Non-Korean defaults are machineTranslated. */
export function getSafetyStatusText(
  locale: SupportedLocale,
  status:
    | "normal"
    | "caution"
    | "notRecommended"
    | "restricted"
    | "unknown",
): LocalizedSafetyText {
  return {
    locale,
    text: translate(locale, `safety.status.${status}`),
    reviewStatus: locale === "ko" ? "reviewed" : "machineTranslated",
    reviewedAt: locale === "ko" ? "2026-08-06" : undefined,
  };
}

export function getFishingAllowedText(
  locale: SupportedLocale,
  status: "allowed" | "restricted" | "prohibited" | "unknown",
): LocalizedSafetyText {
  return {
    locale,
    text: translate(locale, `safety.fishingAllowed.${status}`),
    reviewStatus: locale === "ko" ? "reviewed" : "machineTranslated",
    reviewedAt: locale === "ko" ? "2026-08-06" : undefined,
  };
}
