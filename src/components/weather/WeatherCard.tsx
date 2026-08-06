"use client";

import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";
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

function displayValue(
  value: string | number | undefined,
  suffix = "",
): string {
  if (value === undefined || value === null || value === "") {
    return "정보 없음";
  }
  return `${value}${suffix}`;
}

export function WeatherCard({
  weather,
  loading,
  error,
  onRetry,
}: WeatherCardProps) {
  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          날씨·해양정보
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{error}</p>
        <TextButton variant="secondary" className="mt-3" onClick={onRetry}>
          다시 시도
        </TextButton>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          날씨·해양정보
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          현재 날씨정보를 제공할 수 없습니다.
        </p>
      </Card>
    );
  }

  const stale = isStaleData(weather.fetchedAt, SAFETY_THRESHOLDS.weatherStaleMs);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            날씨·해양정보
          </h3>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {weather.locationName ?? "선택 지점"} · {weather.condition ?? "-"}
          </p>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {formatRelativeTime(weather.fetchedAt)}
        </p>
      </div>

      {stale ? (
        <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-800">
          현재 정보는 최신 데이터가 아닐 수 있습니다. 마지막 업데이트:{" "}
          {formatRelativeTime(weather.fetchedAt)}
        </p>
      ) : null}

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <InfoItem label="기온" value={displayValue(weather.temperatureC, "°C")} />
        <InfoItem label="체감" value={displayValue(weather.feelsLikeC, "°C")} />
        <InfoItem
          label="강수확률"
          value={displayValue(weather.precipitationProbability, "%")}
        />
        <InfoItem
          label="강수량"
          value={displayValue(weather.precipitationMm, "mm")}
        />
        <InfoItem label="풍향" value={displayValue(weather.windDirection)} />
        <InfoItem label="풍속" value={displayValue(weather.windSpeedMs, "m/s")} />
        <InfoItem label="돌풍" value={displayValue(weather.windGustMs, "m/s")} />
        <InfoItem label="파고" value={displayValue(weather.waveHeightM, "m")} />
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
        출처: {weather.sourceName}
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
