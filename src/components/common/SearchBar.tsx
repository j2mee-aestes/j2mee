"use client";

import { Search } from "lucide-react";
import { useTranslations } from "@/context/LocaleContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  className = "",
}: SearchBarProps) {
  const { t } = useTranslations();

  return (
    <form
      className={`flex min-w-0 flex-1 items-center gap-2 ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/85 px-3.5 py-2.5 shadow-[var(--shadow-soft)] transition focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-ocean-100)]">
        <Search
          className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(14,116,144,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
      >
        {t("search.button")}
      </button>
    </form>
  );
}
