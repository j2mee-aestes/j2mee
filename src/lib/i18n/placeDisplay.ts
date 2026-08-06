import type { SupportedLocale } from "@/i18n/config";
import { getLocalizedText } from "@/lib/i18n/getLocalizedText";
import { findFishSpeciesByKoreanName } from "@/data/i18n/fishSpecies";
import type { FishingSpot } from "@/types/fishing";

export function getFishingSpotDisplayName(
  spot: FishingSpot,
  locale: SupportedLocale,
): string {
  return getLocalizedText({
    value: spot.names ?? { ko: spot.name },
    locale,
  });
}

export function getFishingSpotDescription(
  spot: FishingSpot,
  locale: SupportedLocale,
): string {
  return getLocalizedText({
    value: spot.descriptions ?? (spot.description ? { ko: spot.description } : null),
    locale,
  });
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
