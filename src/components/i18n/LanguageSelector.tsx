"use client";

import {
  LOCALE_LABELS,
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
      <div
        className={`inline-flex items-center gap-0.5 rounded-full border border-white/50 bg-white/85 p-1 shadow-[0_8px_24px_-16px_rgba(10,26,47,0.45)] backdrop-blur-md ${className}`}
        role="group"
        aria-label={t("common.language")}
      >
        {SUPPORTED_LOCALES.map((code: SupportedLocale) => {
          const selected = locale === code;
          const label = code === "zh-CN" ? "中文" : code.toUpperCase();
          return (
            <button
              key={code}
              type="button"
              aria-pressed={selected}
              aria-label={LOCALE_LABELS[code]}
              onClick={() => setLocale(code)}
              className={`min-h-8 rounded-full px-2.5 text-[11px] font-bold tracking-wide transition ${
                selected
                  ? "bg-[#0b2447] text-white shadow-sm"
                  : "text-[#0b2447]/80 hover:bg-black/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1 ${className}`}
      role="group"
      aria-label={t("common.language")}
    >
      {SUPPORTED_LOCALES.map((code: SupportedLocale) => {
        const selected = locale === code;
        const label = compact
          ? code === "zh-CN"
            ? "中文"
            : code.toUpperCase()
          : LOCALE_LABELS[code];
        return (
          <button
            key={code}
            type="button"
            aria-pressed={selected}
            aria-label={LOCALE_LABELS[code]}
            onClick={() => setLocale(code)}
            className={`min-h-10 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
              selected
                ? "bg-[var(--color-ocean-600)] text-white"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
