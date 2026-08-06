import type { ReactNode } from "react";
import { Card } from "@/components/common/Card";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <Card
      className={`flex flex-col items-center justify-center gap-2 px-4 py-10 text-center ${className}`}
    >
      {icon ? (
        <div className="mb-1 text-[var(--color-ocean-500)]" aria-hidden>
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
        {title}
      </p>
      {description ? (
        <p className="max-w-xs text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      ) : null}
    </Card>
  );
}
