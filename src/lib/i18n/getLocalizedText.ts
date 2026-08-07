import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/i18n/config";
import { lookupMessage } from "@/i18n/messages";
import type { LocalizedText } from "@/i18n/types";

function localeFallbackChain(
  locale: SupportedLocale,
  fallbackLocale: SupportedLocale,
): SupportedLocale[] {
  const preferred: SupportedLocale[] =
    locale === "ko"
      ? [locale, fallbackLocale, "ko", "en"]
      : [locale, fallbackLocale, "en", "ko"];
  const rest: SupportedLocale[] = [
    "ja",
    "zh-CN",
    "vi",
    "es",
    "de",
    "fr",
  ];
  const seen = new Set<SupportedLocale>();
  const order: SupportedLocale[] = [];
  for (const code of [...preferred, ...rest]) {
    if (seen.has(code)) continue;
    seen.add(code);
    order.push(code);
  }
  return order;
}

export function getLocalizedText(options: {
  value?: LocalizedText | string | null;
  locale: SupportedLocale;
  fallbackLocale?: SupportedLocale;
}): string {
  const { value, locale } = options;
  // Prefer English over Korean when the active locale has no translation.
  const fallbackLocale =
    options.fallbackLocale ?? (locale === "ko" ? DEFAULT_LOCALE : "en");
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

  const order = localeFallbackChain(locale, fallbackLocale);
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
  const { value, locale } = options;
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  const resolvedFallback =
    options.fallbackLocale ?? (locale === "ko" ? DEFAULT_LOCALE : "en");
  const order = localeFallbackChain(locale, resolvedFallback);
  for (const code of order) {
    const list = value[code];
    if (list && list.length > 0) {
      return list;
    }
  }
  return [];
}
