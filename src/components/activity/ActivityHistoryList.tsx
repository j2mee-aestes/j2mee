"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { calculateActivityProgress } from "@/lib/activity/calculateActivityProgress";
import { formatLocaleDistanceKm } from "@/lib/i18n/formatDistance";
import type { ActivityRun } from "@/types/activity";
import Link from "next/link";

interface ActivityHistoryListProps {
  runs: ActivityRun[];
  onDelete: (id: string) => void;
  onCopySchedule: (run: ActivityRun) => void;
}

export function ActivityHistoryList({
  runs,
  onDelete,
  onCopySchedule,
}: ActivityHistoryListProps) {
  const { t, locale } = useTranslations();

  if (runs.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-white p-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("activity.emptyHistory")}
        </p>
        <Link
          href="/schedule"
          className="mt-4 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-4 text-sm font-medium text-white"
        >
          {t("activity.createNew")}
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {runs.map((run) => {
        const progress = calculateActivityProgress(run);
        const hasPlogging = run.items.some((item) => item.type === "plogging");
        const detailHref =
          run.status === "completed"
            ? `/activity/${run.id}/complete`
            : `/activity/${run.id}`;

        return (
          <li
            key={run.id}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {run.date} · {t(`activity.status.${run.status}`)}
                </p>
                <h2 className="mt-0.5 text-base font-bold text-[var(--color-text-primary)]">
                  {run.scheduleTitle}
                </h2>
              </div>
              <p className="text-xs font-semibold text-[var(--color-ocean-700)]">
                {t("activity.completedSkipped", {
                  completed: progress.completed,
                  skipped: progress.skipped,
                })}
              </p>
            </div>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              {t("activity.plannedDistance")}{" "}
              {formatLocaleDistanceKm(run.plannedDistanceKm, locale)}
              {hasPlogging ? ` · ${t("activity.includesPlogging")}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={detailHref}
                className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
              >
                {run.status === "completed"
                  ? t("activity.completeDetail")
                  : t("activity.resume")}
              </Link>
              <TextButton type="button" onClick={() => onCopySchedule(run)}>
                {t("activity.copySchedule")}
              </TextButton>
              <TextButton
                type="button"
                variant="ghost"
                onClick={() => {
                  if (window.confirm(t("activity.deleteConfirmDetail"))) {
                    onDelete(run.id);
                  }
                }}
              >
                {t("activity.deleteRecord")}
              </TextButton>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
