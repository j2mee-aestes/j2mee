"use client";

import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";
import { useTranslations } from "@/context/LocaleContext";
import { formatLocaleRelativeTime } from "@/lib/i18n/formatRelativeTime";
import {
  formatRelativeTime,
  isStaleData,
} from "@/lib/safety/evaluateActivityStatus";
import type { WeatherData } from "@/types/fishing";

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function WeatherCard({
  weather,
  loading,
  error,
  onRetry,
}: WeatherCardProps) {
  const { t, locale } = useTranslations();

  const displayValue = (
    value: string | number | undefined,
    suffix = "",
  ): string => {
    if (value === undefined || value === null || value === "") {
      return t("common.infoUnavailable");
    }
    return `${value}${suffix}`;
  };

  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("weather.marineTitle")}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{error}</p>
        <TextButton variant="secondary" className="mt-3" onClick={onRetry}>
          {t("common.retry")}
        </TextButton>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("weather.marineTitle")}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {t("weather.unavailable")}
        </p>
      </Card>
    );
  }

  const stale = isStaleData(weather.fetchedAt, SAFETY_THRESHOLDS.weatherStaleMs);
  const relative =
    formatLocaleRelativeTime(weather.fetchedAt, locale) ||
    formatRelativeTime(weather.fetchedAt);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            {t("weather.marineTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {weather.locationName ?? t("common.selectedPoint")} ·{" "}
            {weather.condition ?? "-"}
          </p>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">{relative}</p>
      </div>

      {stale ? (
        <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-800">
          {t("weather.staleDetail", { time: relative })}
        </p>
      ) : null}

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <InfoItem
          label={t("weather.temperature")}
          value={displayValue(weather.temperatureC, t("units.celsius"))}
        />
        <InfoItem
          label={t("weather.feelsLike")}
          value={displayValue(weather.feelsLikeC, t("units.celsius"))}
        />
        <InfoItem
          label={t("weather.precipProb")}
          value={displayValue(weather.precipitationProbability, "%")}
        />
        <InfoItem
          label={t("weather.precipAmount")}
          value={displayValue(weather.precipitationMm, "mm")}
        />
        <InfoItem
          label={t("weather.windDirection")}
          value={displayValue(weather.windDirection)}
        />
        <InfoItem
          label={t("weather.wind")}
          value={displayValue(
            weather.windSpeedMs,
            t("units.metersPerSecond"),
          )}
        />
        <InfoItem
          label={t("weather.windGust")}
          value={displayValue(weather.windGustMs, t("units.metersPerSecond"))}
        />
        <InfoItem
          label={t("weather.wave")}
          value={displayValue(weather.waveHeightM, t("units.m"))}
        />
      </dl>

      {weather.warnings && weather.warnings.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          {weather.warnings.map((warning) => (
            <p
              key={`${warning.type}-${warning.title}`}
              className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-2 text-[11px] text-orange-900"
            >
              <span className="font-semibold">{warning.title}</span>
              {warning.description ? ` · ${warning.description}` : ""}
            </p>
          ))}
        </div>
      ) : null}

      <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">
        {t("common.source")}: {weather.sourceName}
      </p>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-2">
      <dt className="text-[10px] text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-0.5 font-semibold text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  );
}
