"use client";

import { TextButton } from "@/components/common/IconButton";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import { calculateActivityProgress } from "@/lib/activity/calculateActivityProgress";
import type { ActivityRun } from "@/types/activity";
import Link from "next/link";

interface ActivityHistoryListProps {
  runs: ActivityRun[];
  onDelete: (id: string) => void;
  onCopySchedule: (run: ActivityRun) => void;
}

function statusLabel(status: ActivityRun["status"]): string {
  switch (status) {
    case "ready":
      return "시작 전";
    case "inProgress":
      return "진행 중";
    case "completed":
      return "완료";
    case "cancelled":
      return "취소됨";
  }
}

export function ActivityHistoryList({
  runs,
  onDelete,
  onCopySchedule,
}: ActivityHistoryListProps) {
  if (runs.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-white p-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          아직 완료한 바다 일정이 없습니다. 새로운 일정을 만들어 활동을
          시작해보세요.
        </p>
        <Link
          href="/schedule"
          className="mt-4 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-4 text-sm font-medium text-white"
        >
          새 일정 만들기
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
                  {run.date} · {statusLabel(run.status)}
                </p>
                <h2 className="mt-0.5 text-base font-bold text-[var(--color-text-primary)]">
                  {run.scheduleTitle}
                </h2>
              </div>
              <p className="text-xs font-semibold text-[var(--color-ocean-700)]">
                완료 {progress.completed} · 건너뜀 {progress.skipped}
              </p>
            </div>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              계획 거리 {formatDistanceKm(run.plannedDistanceKm)}
              {hasPlogging ? " · 플로깅 포함" : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={detailHref}
                className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
              >
                {run.status === "completed" ? "완료 상세보기" : "이어서 진행"}
              </Link>
              <TextButton type="button" onClick={() => onCopySchedule(run)}>
                일정 복사
              </TextButton>
              <TextButton
                type="button"
                variant="ghost"
                onClick={() => {
                  if (
                    window.confirm(
                      "이 활동 기록을 삭제할까요? 삭제 후에는 복구할 수 없습니다.",
                    )
                  ) {
                    onDelete(run.id);
                  }
                }}
              >
                기록 삭제
              </TextButton>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
