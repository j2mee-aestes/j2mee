"use client";

import type { ReactNode } from "react";

interface CategoryButtonProps {
  label: string;
  description?: string;
  selected?: boolean;
  color: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CategoryButton({
  label,
  description,
  selected = false,
  color,
  icon,
  onClick,
  className = "",
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        selected
          ? "border-transparent text-white shadow-sm"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-slate-300 hover:bg-[var(--color-surface-muted)]"
      } ${className}`}
      style={selected ? { backgroundColor: color } : undefined}
    >
      <span
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: selected ? "rgba(255,255,255,0.2)" : `${color}1A`,
          color: selected ? "#fff" : color,
        }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        {description ? (
          <span
            className={`mt-0.5 block text-xs leading-relaxed ${
              selected ? "text-white/85" : "text-[var(--color-text-secondary)]"
            }`}
          >
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
