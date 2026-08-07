export type SupportedLocale =
  | "ko"
  | "en"
  | "ja"
  | "zh-CN"
  | "vi"
  | "es"
  | "de"
  | "fr";

export const DEFAULT_LOCALE: SupportedLocale = "ko";
export const LOCALE_STORAGE_KEY = "badahankki.locale";
export const LOCALE_COOKIE_KEY = "badahankki.locale";

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  "ko",
  "en",
  "ja",
  "zh-CN",
  "vi",
  "es",
  "de",
  "fr",
];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  vi: "Tiếng Việt",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
};

/** Short labels for compact language chips. */
export const LOCALE_SHORT_LABELS: Record<SupportedLocale, string> = {
  ko: "KO",
  en: "EN",
  ja: "JA",
  "zh-CN": "中文",
  vi: "VI",
  es: "ES",
  de: "DE",
  fr: "FR",
};

/** BCP 47 tags used by Intl formatters. */
export const LOCALE_INTL_TAGS: Record<SupportedLocale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  "zh-CN": "zh-CN",
  vi: "vi-VN",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
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
  if (value === "VN") return "vi";
  if (value === "ES") return "es";
  if (value === "DE") return "de";
  if (value === "FR") return "fr";
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
    if (lower.startsWith("vi")) return "vi";
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("de")) return "de";
    if (lower.startsWith("fr")) return "fr";
  }
  return DEFAULT_LOCALE;
}
