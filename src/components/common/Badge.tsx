import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "blue" | "teal" | "green" | "orange" | "purple" | "gray";
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  blue: "bg-[var(--color-ocean-50)] text-[var(--color-ocean-700)] ring-[var(--color-ocean-200)]",
  teal: "bg-[var(--color-teal-50)] text-[var(--color-teal-700)] ring-[var(--color-teal-200)]",
  green: "bg-[var(--color-green-50)] text-[var(--color-green-700)] ring-[var(--color-green-200)]",
  orange: "bg-[var(--color-orange-50)] text-[var(--color-orange-600)] ring-orange-200",
  purple: "bg-[var(--color-purple-50)] text-[var(--color-purple-600)] ring-purple-200",
  gray: "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] ring-[var(--color-border)]",
};

export function Badge({ children, tone = "blue", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
