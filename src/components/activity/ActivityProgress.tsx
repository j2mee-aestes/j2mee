"use client";

import type { ActivityProgress } from "@/types/activity";

interface ActivityProgressProps {
  progress: ActivityProgress;
  title: string;
  date: string;
  plannedDurationMinutes: number;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return `${minutes}분`;
  }
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}

export function ActivityProgressBar({
  progress,
  title,
  date,
  plannedDurationMinutes,
}: ActivityProgressProps) {
  return (
    <section
      aria-label="활동 진행률"
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            {title}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {date} · 예상 {formatDuration(plannedDurationMinutes)}
          </p>
        </div>
        <p className="text-sm font-semibold text-[var(--color-ocean-700)]" aria-live="polite">
          진행률 {progress.percent}%
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label={`전체 일정 ${progress.total}개 중 ${progress.completed}개 완료, 진행률 ${progress.percent}%`}
      >
        <div
          className="h-full rounded-full bg-[var(--color-ocean-600)] transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        전체 일정 {progress.total}개 중 {progress.completed}개 완료 · 건너뜀{" "}
        {progress.skipped}개 · 남음 {progress.remaining}개
      </p>
    </section>
  );
}
