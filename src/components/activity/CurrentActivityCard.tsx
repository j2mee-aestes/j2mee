"use client";

import type { ActivityExecutionItem } from "@/types/activity";
import { SCHEDULE_TYPE_LABELS } from "@/constants/scheduleDefaults";
import { TextButton } from "@/components/common/IconButton";
import { AlertTriangle } from "lucide-react";

function statusLabel(status: ActivityExecutionItem["status"]): string {
  switch (status) {
    case "notStarted":
      return "아직 시작하지 않음";
    case "inProgress":
      return "진행 중";
    case "completed":
      return "완료";
    case "skipped":
      return "건너뜀";
  }
}

type Props = {
  item: ActivityExecutionItem | null;
  safetyNotes?: string[];
  isRestricted?: boolean;
  isProhibited?: boolean;
  onStart: () => void;
  onComplete: () => void;
  onSkip: () => void;
  onEditResult?: () => void;
};

export function CurrentActivityCard({
  item,
  safetyNotes = [],
  isRestricted = false,
  isProhibited = false,
  onStart,
  onComplete,
  onSkip,
  onEditResult,
}: Props) {
  if (!item) {
    return (
      <section className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-text-secondary)]">
        진행할 활동이 없습니다. 남은 항목을 확인하거나 일정을 완료해주세요.
      </section>
    );
  }

  const typeLabel = SCHEDULE_TYPE_LABELS[item.type] ?? item.type;
  const canStart = item.status === "notStarted" || item.status === "skipped";
  const canComplete = item.status === "inProgress";
  const canSkip = item.status === "notStarted" || item.status === "inProgress";

  return (
    <section
      className="rounded-[var(--radius-lg)] border border-[var(--color-ocean-200)] bg-[var(--color-ocean-50)] p-4"
      aria-live="polite"
      aria-label={`현재 활동: ${item.title}, ${statusLabel(item.status)}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ocean-700)]">
        현재 활동 · {typeLabel}
      </p>
      <h2 className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">
        {item.title}
      </h2>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        계획 {item.plannedStartTime ?? "—"}
        {item.plannedEndTime ? `–${item.plannedEndTime}` : ""} ·{" "}
        {item.plannedDurationMinutes}분 · {statusLabel(item.status)}
      </p>

      {isProhibited ? (
        <div className="mt-3 flex gap-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            출입금지·낚시금지 장소입니다. 활동을 시작하지 말고 건너뛰는 것을
            권장합니다.
          </p>
        </div>
      ) : null}

      {isRestricted && !isProhibited ? (
        <div className="mt-3 flex gap-2 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>활동 비권장·주의 장소입니다. 시작 전 현장 안내를 확인해주세요.</p>
        </div>
      ) : null}

      {safetyNotes.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-[var(--color-text-primary)]">
          {safetyNotes.slice(0, 4).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {canStart ? (
          <TextButton
            type="button"
            variant="primary"
            onClick={onStart}
            disabled={isProhibited}
            aria-label={`${item.title} 시작`}
            className="min-h-11 min-w-[5.5rem]"
          >
            시작
          </TextButton>
        ) : null}
        {canComplete ? (
          <TextButton
            type="button"
            variant="primary"
            onClick={onComplete}
            aria-label={`${item.title} 완료`}
            className="min-h-11 min-w-[5.5rem]"
          >
            완료
          </TextButton>
        ) : null}
        {canSkip ? (
          <TextButton
            type="button"
            onClick={onSkip}
            aria-label={`${item.title} 건너뛰기`}
            className="min-h-11"
          >
            건너뛰기
          </TextButton>
        ) : null}
        {item.status === "completed" && onEditResult ? (
          <TextButton type="button" variant="ghost" onClick={onEditResult}>
            결과 수정
          </TextButton>
        ) : null}
      </div>
    </section>
  );
}
