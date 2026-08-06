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
}

export function LanguageSelector({
  className = "",
  compact = false,
}: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLocaleContext();

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
