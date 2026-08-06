"use client";

import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import type { ActivityCompletionSummary } from "@/types/activity";

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return `${minutes}분`;
  }
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}

interface CompletionMetricsProps {
  summary: ActivityCompletionSummary;
}

export function CompletionMetrics({ summary }: CompletionMetricsProps) {
  const cards = [
    {
      label: "계획 거리",
      value: formatDistanceKm(summary.plannedDistanceKm),
    },
    {
      label: "계획 시간",
      value: formatDuration(summary.plannedDurationMinutes),
    },
    {
      label: "완료 장소",
      value: `${summary.completedItemCount}곳`,
    },
    {
      label: "건너뛴 장소",
      value: `${summary.skippedItemCount}곳`,
    },
    {
      label: "플로깅 코스",
      value: `${summary.ploggingSummary?.completedRouteCount ?? 0}개`,
    },
    {
      label: "수거 봉투",
      value: `${summary.ploggingSummary?.totalBagCount ?? 0}개`,
    },
  ];

  return (
    <section aria-label="핵심 수치 요약">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.label}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-3"
          >
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {card.label}
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">
              {card.value}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        거리와 시간은 일정에 등록된 예상값입니다. 실제 GPS 이동기록은 측정되지
        않았습니다.
      </p>
    </section>
  );
}
