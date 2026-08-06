import { lookupMessage } from "@/i18n/messages";
import type { SupportedLocale } from "@/i18n/config";
import { formatLocaleNumber } from "@/lib/i18n/formatNumber";

/** Format planned/reference distance in km without unit conversion. */
export function formatLocaleDistanceKm(
  distanceKm: number,
  locale: SupportedLocale,
): string {
  const kmLabel = lookupMessage(locale, "units.km") ?? "km";
  const mLabel = lookupMessage(locale, "units.m") ?? "m";
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${formatLocaleNumber(meters, locale)}${mLabel}`;
  }
  return `${formatLocaleNumber(distanceKm, locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}${kmLabel}`;
}
