"use client";

import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { useTranslations } from "@/context/LocaleContext";
import type { WeatherData } from "@/types/fishing";
import { ChevronRight } from "lucide-react";

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenDetail?: () => void;
}

function formatClock(isoOrLocal: string | undefined): string {
  if (!isoOrLocal) return "";
  const date = new Date(isoOrLocal);
  if (Number.isNaN(date.getTime())) {
    const match = isoOrLocal.match(/T(\d{2}:\d{2})/);
    return match?.[1] ?? isoOrLocal;
  }
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function WeatherCard({
  weather,
  loading,
  error,
  onRetry,
  onOpenDetail,
}: WeatherCardProps) {
  const { t } = useTranslations();

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
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("weather.title")}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {t("weather.loading")}
        </p>
        <div className="mt-3">
          <SkeletonCard />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("weather.title")}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {t("weather.loadFailed")}
        </p>
        <TextButton
          variant="secondary"
          className="mt-3"
          onClick={onRetry}
          aria-label={t("common.retry")}
        >
          {t("common.retry")}
        </TextButton>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("weather.title")}
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {t("weather.unavailable")}
        </p>
      </Card>
    );
  }

  const icon = weather.conditionIcon ?? "☁️";
  const condition = weather.condition ?? t("common.infoUnavailable");
  const windLabel =
    weather.windDirection && weather.windSpeedMs !== undefined
      ? `${weather.windDirection}풍 ${Number(weather.windSpeedMs).toFixed(1)} ${t("units.metersPerSecond")}`
      : displayValue(weather.windDirection);

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-[var(--color-text-primary)]">
            <span aria-hidden="true">{icon}</span>{" "}
            <span>{condition}</span>
          </p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {displayValue(weather.temperatureC, t("units.celsius"))}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {weather.locationName ?? t("common.selectedPoint")}
          </p>
          {onOpenDetail ? (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--color-accent-strong)]">
              {t("weather.detailHint")}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          ) : null}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <InfoItem
          label={t("weather.feelsLike")}
          value={displayValue(weather.feelsLikeC, t("units.celsius"))}
        />
        <InfoItem
          label={t("weather.humidity")}
          value={displayValue(weather.humidityPercent, "%")}
        />
        <InfoItem
          label={t("weather.precipAmount")}
          value={displayValue(weather.precipitationMm, " mm")}
        />
        <InfoItem label={t("weather.windSummary")} value={windLabel} />
      </dl>

      <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">
        {t("weather.updatedAt", {
          time: formatClock(weather.forecastTime || weather.fetchedAt),
        })}
      </p>
    </>
  );

  if (onOpenDetail) {
    return (
      <button
        type="button"
        onClick={onOpenDetail}
        aria-label={t("weather.openDetail")}
        className="w-full rounded-[var(--radius-xl)] text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
      >
        <Card className="p-4">{body}</Card>
      </button>
    );
  }

  return <Card className="p-4">{body}</Card>;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/70 px-2.5 py-2">
      <dt className="text-[10px] text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-0.5 font-semibold text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  );
}
