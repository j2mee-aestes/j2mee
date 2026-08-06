"use client";

import type { ActivityExecutionItem } from "@/types/activity";
import { SCHEDULE_ITEM_TYPE_LABEL } from "@/constants/scheduleDefaults";
import { TextButton } from "@/components/common/IconButton";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";

type Props = {
  item: ActivityExecutionItem | null;
  distanceKm?: number | null;
  travelMinutes?: number | null;
  onShowOnMap?: () => void;
};

export function NextActivityCard({
  item,
  distanceKm,
  travelMinutes,
  onShowOnMap,
}: Props) {
  if (!item) {
    return (
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-text-secondary)]">
        다음 일정이 없습니다.
      </section>
    );
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        다음 활동 · {SCHEDULE_ITEM_TYPE_LABEL[item.type]}
      </p>
      <h3 className="mt-1 text-base font-bold text-[var(--color-text-primary)]">
        {item.title}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        예상 방문 {item.plannedStartTime ?? "—"}
        {distanceKm != null
          ? ` · 직선거리 ${formatDistanceKm(distanceKm)}`
          : ""}
        {travelMinutes != null ? ` · 예상 이동 ${travelMinutes}분` : ""}
      </p>
      <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
        거리는 일정 기준 직선 예상값입니다. 실제 GPS 이동은 측정하지 않습니다.
      </p>
      {onShowOnMap ? (
        <div className="mt-3">
          <TextButton type="button" onClick={onShowOnMap}>
            지도에서 보기
          </TextButton>
        </div>
      ) : null}
    </section>
  );
}
