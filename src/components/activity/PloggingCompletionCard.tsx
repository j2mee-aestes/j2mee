"use client";

import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import type { PloggingCompletionSummaryData } from "@/types/activity";

interface PloggingCompletionCardProps {
  summary?: PloggingCompletionSummaryData;
}

export function PloggingCompletionCard({
  summary,
}: PloggingCompletionCardProps) {
  if (!summary || summary.routeTitles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="플로깅 결과"
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
    >
      <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
        플로깅 결과
      </h2>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        사용자가 직접 입력한 기록입니다. 환경 효과를 탄소량·금액으로 환산하지
        않습니다.
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {summary.routeTitles.map((title) => (
          <li key={title} className="font-semibold">
            {title}
            {summary.completedRouteCount > 0 ? " 완료" : ""}
          </li>
        ))}
      </ul>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2">
          <dt className="text-[11px] text-[var(--color-text-secondary)]">
            코스 등록 거리
          </dt>
          <dd className="font-semibold">
            {formatDistanceKm(summary.plannedDistanceKm)}
          </dd>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2">
          <dt className="text-[11px] text-[var(--color-text-secondary)]">
            수거 봉투
          </dt>
          <dd className="font-semibold">{summary.totalBagCount}개</dd>
        </div>
      </dl>
      {summary.wasteTypes.length > 0 ? (
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          수거 종류: {summary.wasteTypes.join(", ")}
        </p>
      ) : null}
      <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm">
        <p className="text-[11px] text-[var(--color-text-secondary)]">
          쓰레기 배출 장소
        </p>
        {summary.disposalPointNames.length > 0 ? (
          <p className="mt-0.5 font-medium">
            {summary.disposalPointNames.join(", ")}
          </p>
        ) : (
          <p className="mt-0.5 text-amber-800">
            쓰레기 배출 장소가 기록되지 않았습니다. 수거한 쓰레기는 지정된
            방법으로 배출해주세요.
          </p>
        )}
      </div>
    </section>
  );
}
