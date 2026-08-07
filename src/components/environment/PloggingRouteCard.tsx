"use client";

import { Card } from "@/components/common/Card";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
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
  const { t, locale } = useTranslations();
  const name = localizePlaceText(route.name, locale);
  const difficultyKey =
    route.difficulty === "normal" ? "normal" : route.difficulty;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={name}
      onClick={() => onSelect(route.id)}
      className={`w-full rounded-[var(--radius-md)] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
        selected
          ? "border-teal-400 bg-teal-50"
          : "border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-muted)]"
      }`}
    >
      <Card className="border-0 p-0 shadow-none">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {name}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {route.distanceKm}km ·{" "}
          {t("common.approxMinutes", { count: route.estimatedMinutes })} ·{" "}
          {t(`environment.difficulty.${difficultyKey}`)}
        </p>
        {route.description ? (
          <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-text-muted)]">
            {localizePlaceText(route.description, locale)}
          </p>
        ) : null}
      </Card>
    </button>
  );
}
