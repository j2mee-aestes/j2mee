"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
  className?: string;
}

export function SearchBar({ placeholder, className = "" }: SearchBarProps) {
  return (
    <label
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 shadow-sm focus-within:border-[var(--color-ocean-400)] focus-within:ring-2 focus-within:ring-[var(--color-ocean-100)] ${className}`}
    >
      <Search
        className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]"
        aria-hidden
      />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
      />
    </label>
  );
}
