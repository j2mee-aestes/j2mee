"use client";

import type { FishingCompletionSummary } from "@/types/activity";

interface FishingCompletionCardProps {
  summary?: FishingCompletionSummary;
}

export function FishingCompletionCard({ summary }: FishingCompletionCardProps) {
  if (!summary || summary.spotTitles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="낚시 활동 결과"
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
    >
      <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
        낚시 활동 결과
      </h2>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        사용자가 직접 기록한 내용입니다. 어종 판별 결과가 아닙니다.
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {summary.spotTitles.map((title) => (
          <li key={title} className="font-medium">
            방문 낚시터: {title}
          </li>
        ))}
      </ul>

      {summary.recordedCatches.map((entry) => (
        <div
          key={`${entry.title}-caught`}
          className="mt-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm"
        >
          <p className="font-semibold">{entry.title}</p>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            기록 어종: {entry.species.join(", ") || "—"}
            {entry.count != null ? ` · ${entry.count}마리` : ""}
          </p>
          {entry.memo ? (
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {entry.memo}
            </p>
          ) : null}
        </div>
      ))}

      {summary.notCaughtTitles.map((title) => (
        <p
          key={`${title}-none`}
          className="mt-3 text-sm text-[var(--color-text-secondary)]"
        >
          {title}: 이번 낚시에서는 잡은 수산물이 없었어요. 안전하게 활동을 마친
          것도 좋은 기록입니다.
        </p>
      ))}

      {summary.unrecordedTitles.map((title) => (
        <p
          key={`${title}-skip`}
          className="mt-3 text-sm text-[var(--color-text-secondary)]"
        >
          {title}: 낚시 결과를 기록하지 않았습니다.
        </p>
      ))}
    </section>
  );
}
