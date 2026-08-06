"use client";

import { useMemo } from "react";
import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { TideChart } from "@/components/tide/TideChart";
import { TideTimeItem } from "@/components/tide/TideTimeItem";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import {
  formatRelativeTime,
  isStaleData,
} from "@/lib/safety/evaluateActivityStatus";
import type { DailyTideData, TideChartPoint } from "@/types/fishing";

interface TidePanelProps {
  tide: DailyTideData | null;
  loading: boolean;
  error: string | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onRetry: () => void;
  chartExpanded?: boolean;
  onToggleChart?: () => void;
}

function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function toChartPoints(tide: DailyTideData): TideChartPoint[] {
  if (tide.hourly.length === 0) {
    return [];
  }

  const heights = tide.hourly.map((point) => point.heightCm);
  const min = Math.min(...heights);
  const max = Math.max(...heights);
  const range = Math.max(1, max - min);
  const nowLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  return tide.hourly.map((point) => {
    const timeLabel = point.time.slice(11, 16);
    const event = tide.events.find((item) => item.time.slice(11, 16) === timeLabel);
    let kind: TideChartPoint["kind"];
    if (event) {
      kind = event.type;
    } else if (tide.date === todayKst() && timeLabel === nowLabel.slice(0, 2) + ":00") {
      kind = "now";
    }
    return {
      time: timeLabel,
      height: ((point.heightCm - min) / range) * 100,
      kind,
    };
  });
}

export function TidePanel({
  tide,
  loading,
  error,
  selectedDate,
  onDateChange,
  onRetry,
  chartExpanded = true,
  onToggleChart,
}: TidePanelProps) {
  const today = todayKst();
  const tomorrow = addDays(today, 1);
  const maxDate = addDays(today, SAFETY_THRESHOLDS.maxTideDateOffsetDays);
  const chartPoints = useMemo(() => (tide ? toChartPoints(tide) : []), [tide]);
  const currentTimeLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card id="tide-summary-card" as="section" className="scroll-mt-24 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          조석정보
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <DateChip
            label="오늘"
            active={selectedDate === today}
            onClick={() => onDateChange(today)}
          />
          <DateChip
            label="내일"
            active={selectedDate === tomorrow}
            onClick={() => onDateChange(tomorrow)}
          />
          <input
            type="date"
            value={selectedDate}
            min={today}
            max={maxDate}
            aria-label="조석 날짜 선택"
            onChange={(event) => onDateChange(event.target.value)}
            className="h-8 rounded-md border border-[var(--color-border)] bg-white px-2 text-xs"
          />
        </div>
      </div>

      {error ? (
        <div>
          <p className="text-xs text-[var(--color-text-secondary)]">{error}</p>
          <TextButton variant="secondary" className="mt-3" onClick={onRetry}>
            다시 시도
          </TextButton>
        </div>
      ) : null}

      {!error && !tide ? (
        <p className="text-xs text-[var(--color-text-secondary)]">
          이 장소의 조석정보를 찾지 못했습니다.
        </p>
      ) : null}

      {tide ? (
        <>
          <p className="mb-2 text-xs text-[var(--color-text-secondary)]">
            {tide.stationName}
            {tide.distanceKmFromSpot !== undefined
              ? ` · 약 ${formatDistanceKm(tide.distanceKmFromSpot)}`
              : ""}
            {" · "}
            {selectedDate}
          </p>

          {isStaleData(tide.fetchedAt, SAFETY_THRESHOLDS.tideStaleMs) ? (
            <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-800">
              현재 정보는 최신 데이터가 아닐 수 있습니다. 마지막 업데이트:{" "}
              {formatRelativeTime(tide.fetchedAt)}
            </p>
          ) : null}

          <ul className="mb-3 grid grid-cols-2 gap-2">
            {tide.events.map((event) => (
              <TideTimeItem
                key={`${event.type}-${event.time}`}
                tide={{
                  type: event.type,
                  time: event.time.slice(11, 16),
                  height: event.heightCm,
                }}
              />
            ))}
          </ul>

          {onToggleChart ? (
            <button
              type="button"
              className="mb-2 text-xs font-semibold text-[var(--color-ocean-700)] lg:hidden"
              onClick={onToggleChart}
            >
              {chartExpanded ? "조위 그래프 접기" : "조위 그래프 펼치기"}
            </button>
          ) : null}

          <div className={chartExpanded ? "block" : "hidden lg:block"}>
            {chartPoints.length === 0 ? (
              <p className="text-xs text-[var(--color-text-secondary)]">
                시간별 조위 데이터가 없습니다.
              </p>
            ) : (
              <TideChart
                points={chartPoints}
                currentTimeLabel={currentTimeLabel}
                unitLabel="cm"
                dateLabel={selectedDate}
              />
            )}
          </div>

          <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">
            출처: {tide.sourceName} · 업데이트 {formatRelativeTime(tide.fetchedAt)}
          </p>
        </>
      ) : null}
    </Card>
  );
}

function DateChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-full px-3 text-xs font-semibold ${
        active
          ? "bg-[var(--color-ocean-600)] text-white"
          : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
      }`}
    >
      {label}
    </button>
  );
}
