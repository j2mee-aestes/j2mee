"use client";

import { Card } from "@/components/common/Card";
import type { PloggingRoute, PloggingSession } from "@/types/environment";

interface PloggingCompletionSummaryProps {
  route: PloggingRoute;
  session: PloggingSession;
  disposalName?: string;
  onReset: () => void;
}

export function PloggingCompletionSummary({
  route,
  session,
  disposalName,
  onReset,
}: PloggingCompletionSummaryProps) {
  if (session.status !== "completed") {
    return null;
  }

  const completedLabel = session.completedAt
    ? new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(session.completedAt))
    : "-";

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div role="status">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          플로깅 완료 요약
        </h3>
      </div>
      <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
        <li>코스: {route.name}</li>
        <li>코스 거리: {route.distanceKm}km</li>
        <li>예상 활동시간: 약 {route.estimatedMinutes}분</li>
        <li>
          수거한 쓰레기: {session.collectedWasteTypes.join(", ") || "-"}
        </li>
        <li>봉투 수: {session.bagCount}</li>
        <li>배출 장소: {disposalName ?? "미선택"}</li>
        <li>완료 일시: {completedLabel}</li>
      </ul>
      <p className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] px-3 py-2 text-[11px] text-[var(--color-text-muted)]">
        코스에 등록된 예상 거리와 시간입니다.
        실제 이동 기록은 저장되지 않습니다.
      </p>
      {session.memo ? (
        <p className="text-xs text-[var(--color-text-secondary)]">
          메모: {session.memo}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onReset}
        className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface-muted)]"
      >
        활동 초기화
      </button>
    </Card>
  );
}
