export type SupportedLocale = "ko" | "en" | "ja" | "zh-CN";

export const DEFAULT_LOCALE: SupportedLocale = "ko";
export const LOCALE_STORAGE_KEY = "badahankki.locale";
export const LOCALE_COOKIE_KEY = "badahankki.locale";

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  "ko",
  "en",
  "ja",
  "zh-CN",
];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
};

/** BCP 47 tags used by Intl formatters. */
export const LOCALE_INTL_TAGS: Record<SupportedLocale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  "zh-CN": "zh-CN",
};

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as string[]).includes(value)
  );
}

export function normalizeLocale(value: unknown): SupportedLocale {
  if (isSupportedLocale(value)) {
    return value;
  }
  // Legacy header codes
  if (value === "KR") return "ko";
  if (value === "EN") return "en";
  if (value === "JP") return "ja";
  if (value === "CN") return "zh-CN";
  return DEFAULT_LOCALE;
}

export function detectBrowserLocale(): SupportedLocale {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }
  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);
  for (const raw of candidates) {
    const lower = raw.toLowerCase();
    if (lower.startsWith("ko")) return "ko";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("ja")) return "ja";
    if (lower.startsWith("zh")) return "zh-CN";
  }
  return DEFAULT_LOCALE;
}
