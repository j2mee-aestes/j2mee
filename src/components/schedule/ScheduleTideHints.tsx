"use client";

import { Card } from "@/components/common/Card";
import { useTideData } from "@/hooks/useSpotEnvironmentData";
import type { ScheduleItem } from "@/types/schedule";

interface ScheduleTideHintsProps {
  fishingItem: ScheduleItem | null;
  date: string;
}

export function ScheduleTideHints({ fishingItem, date }: ScheduleTideHintsProps) {
  const tide = useTideData(fishingItem?.sourceId ?? null, date);

  if (!fishingItem) {
    return null;
  }

  const events = tide.data?.events ?? [];
  const visitStart = fishingItem.startTime;
  const visitEnd = fishingItem.endTime;

  let tideHint =
    "조석정보는 참고용입니다. 조석만으로 낚시 가능 여부를 확정하지 마세요.";
  if (events.length >= 2 && visitStart && visitEnd) {
    const rising = events.some(
      (event, index) =>
        event.type === "low" &&
        events[index + 1]?.type === "high" &&
        event.time <= visitEnd &&
        (events[index + 1]?.time ?? "") >= visitStart,
    );
    if (rising) {
      tideHint = "낚시 예정시간 중 조위가 상승하는 시간대가 포함됩니다.";
    }
  }

  const endHour = visitEnd ? Number(visitEnd.slice(0, 2)) : null;
  const sunsetHint =
    endHour !== null && endHour >= 19
      ? "낚시 종료 예정시간이 일몰 이후일 수 있습니다. 현장 조명과 출입 통제를 확인해주세요."
      : null;

  return (
    <Card className="space-y-2 p-4">
      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
        물때 참고 ({fishingItem.title})
      </h3>
      {tide.loading ? (
        <p className="text-xs text-[var(--color-text-muted)]">불러오는 중…</p>
      ) : null}
      {tide.error ? (
        <p className="text-xs text-amber-800">{tide.error}</p>
      ) : null}
      {tide.data ? (
        <>
          <p className="text-xs text-[var(--color-text-secondary)]">
            관측소: {tide.data.stationName ?? "연결 관측소"}
          </p>
          <ul className="space-y-0.5 text-xs text-[var(--color-text-secondary)]">
            {events.map((event) => (
              <li key={`${event.type}-${event.time}`}>
                · {event.type === "high" ? "만조" : "간조"} {event.time}
                {event.heightCm !== undefined ? ` (${event.heightCm}cm)` : ""}
              </li>
            ))}
          </ul>
          {tide.data.fetchedAt ? (
            <p className="text-[11px] text-[var(--color-text-muted)]">
              업데이트: {tide.data.fetchedAt}
            </p>
          ) : null}
        </>
      ) : null}
      <p className="text-xs text-[var(--color-text-secondary)]">{tideHint}</p>
      {sunsetHint ? (
        <p className="text-xs text-amber-800">{sunsetHint}</p>
      ) : null}
    </Card>
  );
}
