"use client";

import { Card } from "@/components/common/Card";
import { PLOGGING_DIFFICULTY_LABELS } from "@/constants/environmentData";
import type { PloggingRoute } from "@/types/environment";

interface PloggingRouteCardProps {
  route: PloggingRoute;
  selected?: boolean;
  onSelect: (routeId: string) => void;
}

export function PloggingRouteCard({
  route,
  selected = false,
  onSelect,
}: PloggingRouteCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${route.name} 코스 선택`}
      onClick={() => onSelect(route.id)}
      className={`w-full rounded-[var(--radius-md)] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        selected
          ? "border-teal-400 bg-teal-50"
          : "border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-muted)]"
      }`}
    >
      <Card className="border-0 p-0 shadow-none">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {route.name}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {route.distanceKm}km · 약 {route.estimatedMinutes}분 ·{" "}
          {PLOGGING_DIFFICULTY_LABELS[route.difficulty]}
        </p>
        {route.description ? (
          <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-text-muted)]">
            {route.description}
          </p>
        ) : null}
      </Card>
    </button>
  );
}
