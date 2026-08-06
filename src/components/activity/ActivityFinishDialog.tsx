"use client";

import { TextButton } from "@/components/common/IconButton";
import { calculateActivityProgress } from "@/lib/activity/calculateActivityProgress";
import type { ActivityRun } from "@/types/activity";
import { useEffect, useId, useRef } from "react";

interface ActivityFinishDialogProps {
  open: boolean;
  run: ActivityRun;
  missingResults: string[];
  missingDisposal: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSkipRemainingAndFinish?: () => void;
  hasRemaining: boolean;
}

export function ActivityFinishDialog({
  open,
  run,
  missingResults,
  missingDisposal,
  onConfirm,
  onCancel,
  onSkipRemainingAndFinish,
  hasRemaining,
}: ActivityFinishDialogProps) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const progress = calculateActivityProgress(run);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(() => confirmRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  const completedAt = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-base font-bold">
          오늘의 바다 일정 완료하기
        </h2>
        <ul className="mt-3 space-y-1.5 text-xs text-[var(--color-text-secondary)]">
          <li>완료한 일정: {progress.completed}개</li>
          <li>건너뛴 일정: {progress.skipped}개</li>
          <li>남은 일정: {progress.remaining}개</li>
          <li>완료 일시(예정): {completedAt}</li>
        </ul>
        {missingResults.length > 0 ? (
          <p className="mt-3 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            일부 활동 결과가 입력되지 않았습니다. 입력하지 않고 완료할 수도
            있습니다. ({missingResults.join(", ")})
          </p>
        ) : null}
        {missingDisposal ? (
          <p className="mt-2 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            쓰레기 배출 장소가 기록되지 않은 플로깅이 있습니다. 수거한 쓰레기는
            지정된 방법으로 배출해주세요.
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-2">
          {!hasRemaining ? (
            <button
              ref={confirmRef}
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
              onClick={onConfirm}
            >
              완료 확인
            </button>
          ) : null}
          {hasRemaining && onSkipRemainingAndFinish ? (
            <button
              ref={confirmRef}
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
              onClick={onSkipRemainingAndFinish}
            >
              남은 항목 건너뛰고 완료
            </button>
          ) : null}
          <TextButton variant="ghost" onClick={onCancel}>
            돌아가기
          </TextButton>
        </div>
      </div>
    </div>
  );
}
