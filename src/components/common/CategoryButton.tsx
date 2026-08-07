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
      className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        selected
          ? "border-transparent text-white shadow-[0_12px_28px_-14px_rgba(11,36,71,0.45)]"
          : "border-[var(--color-border)] bg-white/75 text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-950"
      } ${className}`}
      style={selected ? { backgroundColor: color } : undefined}
    >
      <span
        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: selected ? "rgba(255,255,255,0.22)" : `${color}1A`,
          color: selected ? "#fff" : color,
        }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold tracking-tight">{label}</span>
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
