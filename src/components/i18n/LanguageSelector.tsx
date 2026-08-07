"use client";

import {
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/config";
import { useLocaleContext } from "@/context/LocaleContext";

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
  /** Pill style matching the landing mockup */
  variant?: "default" | "pill";
}

export function LanguageSelector({
  className = "",
  compact = false,
  variant = "default",
}: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLocaleContext();

  if (variant === "pill") {
    return (
      <label
        className={`inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/85 px-3 py-1.5 text-[#0b2447] shadow-[0_8px_24px_-16px_rgba(10,26,47,0.45)] backdrop-blur-md ${className}`}
      >
        <span className="sr-only">{t("common.language")}</span>
        <select
          aria-label={t("common.language")}
          value={locale}
          onChange={(event) =>
            setLocale(event.target.value as SupportedLocale)
          }
          className="min-h-8 appearance-none bg-transparent pr-1 text-[11px] font-bold tracking-wide outline-none"
        >
          {SUPPORTED_LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_SHORT_LABELS[code]} · {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label
      className={`inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2.5 ${className}`}
    >
      <span className="sr-only">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        value={locale}
        onChange={(event) => setLocale(event.target.value as SupportedLocale)}
        className="min-h-9 w-full min-w-[8.5rem] appearance-none bg-transparent text-xs font-semibold text-[var(--color-text-primary)] outline-none"
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {compact ? LOCALE_SHORT_LABELS[code] : LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
