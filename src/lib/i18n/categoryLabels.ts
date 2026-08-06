import type { SupportedLocale } from "@/i18n/config";
import { translate } from "@/lib/i18n/translate";
import type { CategoryFilter } from "@/types/map";

export function getCategoryLabel(
  locale: SupportedLocale,
  id: CategoryFilter,
  field: "label" | "shortLabel" | "description" = "label",
): string {
  if (id === "restaurant") {
    return translate(locale, `categories.market.${field}`);
  }
  return translate(locale, `categories.${id}.${field}`);
}
