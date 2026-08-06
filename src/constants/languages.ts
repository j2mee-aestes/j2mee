import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/config";

/** @deprecated Prefer SupportedLocale from `@/i18n/config`. */
export type LanguageCode = SupportedLocale;

export interface LanguageOption {
  code: SupportedLocale;
  label: string;
}

export const LANGUAGES: LanguageOption[] = SUPPORTED_LOCALES.map((code) => ({
  code,
  label: LOCALE_LABELS[code],
}));

export type { SupportedLocale };
