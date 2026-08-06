"use client";

import { TextButton } from "@/components/common/IconButton";
import { useEffect, useId, useRef } from "react";

interface ActivityStopDialogProps {
  open: boolean;
  onContinue: () => void;
  onSaveAndExit: () => void;
  onCancelRun: () => void;
}

export function ActivityStopDialog({
  open,
  onContinue,
  onSaveAndExit,
  onCancelRun,
}: ActivityStopDialogProps) {
  const titleId = useId();
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(() => firstRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onContinue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onContinue]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center"
      role="presentation"
      onClick={onContinue}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-base font-bold">
          일정을 중단할까요?
        </h2>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          현재 상태로 저장하면 나중에 이어서 진행할 수 있습니다. 취소하면 완료
          결과에 포함되지 않습니다.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            ref={firstRef}
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
            onClick={onSaveAndExit}
          >
            현재 상태로 저장하고 나가기
          </button>
          <TextButton variant="secondary" onClick={onCancelRun}>
            일정 취소
          </TextButton>
          <TextButton variant="ghost" onClick={onContinue}>
            계속 진행
          </TextButton>
        </div>
      </div>
    </div>
  );
}
