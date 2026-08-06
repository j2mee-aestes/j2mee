import { LOCALE_INTL_TAGS, type SupportedLocale } from "@/i18n/config";

export function formatLocaleNumber(
  value: number,
  locale: SupportedLocale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_INTL_TAGS[locale], options).format(value);
}
