"use client";

import { Search } from "lucide-react";
import { UI_TEXT } from "@/constants/uiText";

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
  return (
    <form
      className={`flex min-w-0 flex-1 items-center gap-2 ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2.5 shadow-sm focus-within:border-[var(--color-ocean-400)] focus-within:ring-2 focus-within:ring-[var(--color-ocean-100)]">
        <Search
          className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={UI_TEXT.searchPlaceholder}
          aria-label={UI_TEXT.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-semibold text-white hover:bg-[var(--color-ocean-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
      >
        {UI_TEXT.searchButton}
      </button>
    </form>
  );
}
