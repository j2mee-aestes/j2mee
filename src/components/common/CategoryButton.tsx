"use client";

import type { ReactNode } from "react";

interface CategoryButtonProps {
  label: string;
  selected?: boolean;
  color: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function CategoryButton({
  label,
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
      className={`flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-transparent text-white shadow-sm"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
      } ${className}`}
      style={selected ? { backgroundColor: color } : undefined}
    >
      <span
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: selected ? "rgba(255,255,255,0.2)" : `${color}1A`,
          color: selected ? "#fff" : color,
        }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
