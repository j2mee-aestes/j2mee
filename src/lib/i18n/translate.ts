import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/i18n/config";
import { lookupMessage } from "@/i18n/messages";

export type TranslateValues = Record<string, string | number>;

function interpolate(template: string, values?: TranslateValues): string {
  if (!values) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

export function translate(
  locale: SupportedLocale,
  key: string,
  values?: TranslateValues,
  options?: { warnMissing?: boolean },
): string {
  const direct = lookupMessage(locale, key);
  if (direct !== undefined) {
    return interpolate(direct, values);
  }
  const fallback = lookupMessage(DEFAULT_LOCALE, key);
  if (fallback !== undefined) {
    if (
      options?.warnMissing !== false &&
      process.env.NODE_ENV !== "production" &&
      locale !== DEFAULT_LOCALE
    ) {
      console.warn(`[i18n] missing key "${key}" for locale "${locale}"`);
    }
    return interpolate(fallback, values);
  }
  if (options?.warnMissing !== false && process.env.NODE_ENV !== "production") {
    console.warn(`[i18n] missing key "${key}" in all locales`);
  }
  return key;
}
