"use client";

import { SCHEDULE_ITEM_TYPE_LABEL } from "@/constants/scheduleDefaults";
import type { PartnerCompletionSummary } from "@/types/activity";

interface PartnerCompletionCardProps {
  summary?: PartnerCompletionSummary;
}

export function PartnerCompletionCard({
  summary,
}: PartnerCompletionCardProps) {
  if (!summary || summary.visits.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="시장·식당 방문 결과"
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
    >
      <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
        시장·식당·손질 방문 결과
      </h2>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        실제 예약 확정 상태가 아닙니다. 이용 문의가 있었다면 문의 작성으로만
        구분합니다.
      </p>
      <ul className="mt-3 space-y-3">
        {summary.visits.map((visit) => (
          <li
            key={`${visit.title}-${visit.type}`}
            className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm"
          >
            <p className="font-semibold">
              {visit.title}{" "}
              <span className="font-medium text-[var(--color-text-secondary)]">
                · {SCHEDULE_ITEM_TYPE_LABEL[visit.type]} ·{" "}
                {visit.status === "skipped" ? "건너뜀" : "완료"}
              </span>
            </p>
            {visit.serviceUsed.length > 0 ? (
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                이용 서비스: {visit.serviceUsed.join(", ")}
                {visit.serviceUsed.includes("문의만 진행")
                  ? " (이용 문의 작성됨)"
                  : ""}
              </p>
            ) : null}
            {visit.memo ? (
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                메모: {visit.memo}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
