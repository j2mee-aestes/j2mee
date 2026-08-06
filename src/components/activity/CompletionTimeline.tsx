"use client";

import { SCHEDULE_ITEM_TYPE_LABEL } from "@/constants/scheduleDefaults";
import type { ActivityExecutionItem } from "@/types/activity";

function formatClock(iso?: string): string | null {
  if (!iso) {
    return null;
  }
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

interface CompletionTimelineProps {
  items: ActivityExecutionItem[];
}

export function CompletionTimeline({ items }: CompletionTimelineProps) {
  const ordered = [...items]
    .sort((a, b) => a.order - b.order)
    .filter(
      (item) => item.status === "completed" || item.status === "skipped",
    );

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        표시할 타임라인이 없습니다.
      </p>
    );
  }

  return (
    <section aria-label="일정 타임라인">
      <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
        일정 타임라인
      </h2>
      <ol className="mt-3 space-y-3">
        {ordered.map((item) => {
          const planned = item.plannedStartTime ?? "—";
          const started = formatClock(item.startedAt);
          const completed = formatClock(item.completedAt);
          const memo =
            item.result && "memo" in item.result ? item.result.memo : undefined;
          const statusText =
            item.status === "skipped" ? "건너뜀" : "완료";

          return (
            <li
              key={item.id}
              className="relative border-l-2 border-[var(--color-ocean-200)] pl-4"
            >
              <span
                className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-ocean-600)]"
                aria-hidden
              />
              <p className="text-xs text-[var(--color-text-secondary)]">
                계획 {planned}
                {started ? ` · 시작 ${started}` : ""}
                {completed ? ` · 종료 ${completed}` : ""}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--color-text-primary)]">
                {item.title}{" "}
                <span className="font-medium text-[var(--color-text-secondary)]">
                  · {SCHEDULE_ITEM_TYPE_LABEL[item.type]} · {statusText}
                </span>
              </p>
              {memo ? (
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  메모: {memo}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
