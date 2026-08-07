import type { SupportedLocale } from "@/i18n/config";
import { getLocalizedText } from "@/lib/i18n/getLocalizedText";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import { findFishSpeciesByKoreanName } from "@/data/i18n/fishSpecies";
import type { FishingSpot } from "@/types/fishing";

export function getFishingSpotDisplayName(
  spot: FishingSpot,
  locale: SupportedLocale,
): string {
  const name = getLocalizedText({
    value: spot.names ?? { ko: spot.name },
    locale,
  });
  return locale === "ko" ? name : localizePlaceText(name, locale);
}

export function getFishingSpotDescription(
  spot: FishingSpot,
  locale: SupportedLocale,
): string {
  const fromFields = getLocalizedText({
    value:
      spot.descriptions ??
      (spot.description ? { ko: spot.description } : null),
    locale,
  });
  return locale === "ko"
    ? fromFields
    : localizePlaceText(fromFields || spot.description || "", locale);
}

export function getFishDisplayName(
  koreanName: string,
  locale: SupportedLocale,
): string {
  const species = findFishSpeciesByKoreanName(koreanName);
  if (!species) {
    return koreanName;
  }
  return getLocalizedText({ value: species.names, locale });
}
