"use client";

import { Card } from "@/components/common/Card";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import type { DaySchedule } from "@/types/schedule";

interface ScheduleSummaryProps {
  schedule: DaySchedule;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return `${minutes}분`;
  }
  if (minutes === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${minutes}분`;
}

export function ScheduleSummary({ schedule }: ScheduleSummaryProps) {
  return (
    <Card className="space-y-2 p-4">
      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
        일정 요약
      </h3>
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2">
          <dt className="text-[var(--color-text-muted)]">장소 수</dt>
          <dd className="font-semibold">{schedule.items.length}곳</dd>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2">
          <dt className="text-[var(--color-text-muted)]">상태</dt>
          <dd className="font-semibold">{schedule.status}</dd>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2">
          <dt className="text-[var(--color-text-muted)]">총 참고 거리</dt>
          <dd className="font-semibold">
            {formatDistanceKm(schedule.totalDistanceKm)}
          </dd>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2">
          <dt className="text-[var(--color-text-muted)]">예상 소요</dt>
          <dd className="font-semibold">
            {formatDuration(schedule.totalDurationMinutes)}
          </dd>
        </div>
      </dl>
      <p className="text-[11px] text-[var(--color-text-muted)]">
        장소 간 {formatDistanceKm(schedule.travelDistanceKm)} · 플로깅 코스{" "}
        {formatDistanceKm(schedule.ploggingDistanceKm)}
      </p>
      <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
        표시된 이동거리는 좌표를 기준으로 계산한 참고 거리입니다. 실제 도로
        이동거리와 다를 수 있습니다. 교통 상황을 반영하지 않은 예상
        이동시간입니다.
      </p>
    </Card>
  );
}
