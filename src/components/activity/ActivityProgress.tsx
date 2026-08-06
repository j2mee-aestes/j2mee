"use client";

import { useTranslations } from "@/context/LocaleContext";
import type { ActivityProgress } from "@/types/activity";

interface ActivityProgressProps {
  progress: ActivityProgress;
  title: string;
  date: string;
  plannedDurationMinutes: number;
}

function formatDuration(
  totalMinutes: number,
  t: (key: string, values?: Record<string, string | number>) => string,
): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return t("schedule.durationMinutes", { minutes });
  }
  if (minutes === 0) {
    return `${hours}${t("units.hours")}`;
  }
  return `${hours}${t("units.hours")} ${t("schedule.durationMinutes", { minutes })}`;
}

export function ActivityProgressBar({
  progress,
  title,
  date,
  plannedDurationMinutes,
}: ActivityProgressProps) {
  const { t } = useTranslations();
  const duration = formatDuration(plannedDurationMinutes, t);

  return (
    <section
      aria-label={t("activity.progressAria")}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            {title}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {date} · {t("activity.expectedDuration", { duration })}
          </p>
        </div>
        <p
          className="text-sm font-semibold text-[var(--color-ocean-700)]"
          aria-live="polite"
        >
          {t("activity.progress", { percent: progress.percent })}
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label={t("activity.progressDetail", {
          total: progress.total,
          completed: progress.completed,
          skipped: progress.skipped,
          remaining: progress.remaining,
        })}
      >
        <div
          className="h-full rounded-full bg-[var(--color-ocean-600)] transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {t("activity.progressDetail", {
          total: progress.total,
          completed: progress.completed,
          skipped: progress.skipped,
          remaining: progress.remaining,
        })}
      </p>
    </section>
  );
}
