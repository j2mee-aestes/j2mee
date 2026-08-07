import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/i18n/config";
import { lookupMessage } from "@/i18n/messages";
import type { LocalizedText } from "@/i18n/types";

export function getLocalizedText(options: {
  value?: LocalizedText | string | null;
  locale: SupportedLocale;
  fallbackLocale?: SupportedLocale;
}): string {
  const { value, locale, fallbackLocale = DEFAULT_LOCALE } = options;
  const unavailable =
    lookupMessage(locale, "common.infoUnavailable") ??
    lookupMessage(fallbackLocale, "common.infoUnavailable") ??
    "정보 없음";

  if (!value) {
    return unavailable;
  }
  if (typeof value === "string") {
    return value.trim() ? value : unavailable;
  }

  const order: SupportedLocale[] = [
    locale,
    fallbackLocale,
    "ko",
    "en",
    "ja",
    "zh-CN",
    "vi",
    "es",
    "de",
    "fr",
  ];
  for (const code of order) {
    const text = value[code]?.trim();
    if (text) {
      return text;
    }
  }
  const first = Object.values(value).find(
    (entry) => typeof entry === "string" && entry.trim(),
  );
  return first?.trim() || unavailable;
}

export function getLocalizedTextList(options: {
  value?: Partial<Record<SupportedLocale, string[]>> | string[] | null;
  locale: SupportedLocale;
  fallbackLocale?: SupportedLocale;
}): string[] {
  const { value, locale, fallbackLocale = DEFAULT_LOCALE } = options;
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  const order: SupportedLocale[] = [
    locale,
    fallbackLocale,
    "ko",
    "en",
    "ja",
    "zh-CN",
    "vi",
    "es",
    "de",
    "fr",
  ];
  for (const code of order) {
    const list = value[code];
    if (list && list.length > 0) {
      return list;
    }
  }
  return [];
}
