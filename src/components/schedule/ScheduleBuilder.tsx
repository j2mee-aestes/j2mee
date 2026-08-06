"use client";

import { TextButton } from "@/components/common/IconButton";
import { RecommendedScheduleButton } from "@/components/schedule/RecommendedScheduleButton";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleItemList } from "@/components/schedule/ScheduleItemList";
import { ScheduleMapPreview } from "@/components/schedule/ScheduleMapPreview";
import { ScheduleShareButton } from "@/components/schedule/ScheduleShareButton";
import { ScheduleSummary } from "@/components/schedule/ScheduleSummary";
import { ScheduleTideHints } from "@/components/schedule/ScheduleTideHints";
import { ScheduleWarnings } from "@/components/schedule/ScheduleWarnings";
import { useScheduleContext } from "@/context/ScheduleContext";
import {
  getLocationDetailById,
  isFishingSpot,
} from "@/data/mockMapLocations";
import type { FishingSpot } from "@/types/fishing";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ScheduleBuilderProps {
  seedFishingSpotId?: string | null;
}

export function ScheduleBuilder({
  seedFishingSpotId = null,
}: ScheduleBuilderProps) {
  const scheduleApi = useScheduleContext();
  const [focusItemId, setFocusItemId] = useState<string | null>(null);
  const [localNotice, setLocalNotice] = useState<string | null>(null);

  const fishingItem = useMemo(
    () =>
      scheduleApi.schedule.items.find((item) => item.type === "fishing") ?? null,
    [scheduleApi.schedule.items],
  );

  const recommendSpot: FishingSpot | null = useMemo(() => {
    if (fishingItem) {
      const place = getLocationDetailById(fishingItem.sourceId);
      return place && isFishingSpot(place) ? place : null;
    }
    if (seedFishingSpotId) {
      const place = getLocationDetailById(seedFishingSpotId);
      return place && isFishingSpot(place) ? place : null;
    }
    return null;
  }, [fishingItem, seedFishingSpotId]);

  const notice = localNotice ?? scheduleApi.notice;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            하루 일정 만들기
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            낚시 → 시장·식당·손질 → 플로깅 순서를 권장하지만 자유롭게 수정할 수
            있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            지도로
          </Link>
          <Link
            href="/schedules"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            저장된 일정
          </Link>
        </div>
      </div>

      {notice ? (
        <p
          className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          role="status"
        >
          {notice}
        </p>
      ) : null}

      <ScheduleHeader
        schedule={scheduleApi.schedule}
        onTitleChange={scheduleApi.setTitle}
        onDateChange={scheduleApi.setDate}
        onTravelModeChange={scheduleApi.setTravelMode}
        onFirstStartChange={scheduleApi.setFirstStartTime}
      />

      <ScheduleSummary schedule={scheduleApi.schedule} />

      <ScheduleMapPreview
        items={scheduleApi.schedule.items}
        selectedItemId={scheduleApi.selectedItemId}
        focusItemId={focusItemId}
        onSelectItem={(id) => {
          scheduleApi.setSelectedItemId(id);
          setFocusItemId(id);
        }}
      />

      <ScheduleTideHints
        fishingItem={fishingItem}
        date={scheduleApi.schedule.date}
      />

      <ScheduleWarnings warnings={scheduleApi.warnings} />

      <section className="space-y-3 pb-24">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
            방문 장소
          </h2>
          <RecommendedScheduleButton
            fishingSpot={recommendSpot}
            date={scheduleApi.schedule.date}
            onApply={scheduleApi.replaceWithRecommended}
            onMessage={(message) => {
              setLocalNotice(message);
              scheduleApi.clearNotice();
            }}
          />
        </div>

        <ScheduleItemList
          items={scheduleApi.schedule.items}
          travelMode={scheduleApi.schedule.travelMode}
          selectedItemId={scheduleApi.selectedItemId}
          onSelect={scheduleApi.setSelectedItemId}
          onMoveUp={(id) => scheduleApi.moveItem(id, "up")}
          onMoveDown={(id) => scheduleApi.moveItem(id, "down")}
          onRemove={scheduleApi.removeItem}
          onDurationChange={scheduleApi.updateItemDuration}
          onStartTimeChange={scheduleApi.updateItemStartTime}
          onShowOnMap={(id) => {
            scheduleApi.setSelectedItemId(id);
            setFocusItemId(id);
          }}
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 p-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row">
          <TextButton
            variant="secondary"
            className="w-full"
            onClick={scheduleApi.resetSchedule}
          >
            전체 초기화
          </TextButton>
          <ScheduleShareButton
            schedule={scheduleApi.schedule}
            onMessage={setLocalNotice}
          />
          <TextButton
            variant="secondary"
            className="w-full"
            onClick={() => void scheduleApi.saveToBrowser()}
          >
            일정 저장
          </TextButton>
          <TextButton
            variant="primary"
            className="w-full"
            onClick={() => {
              const result = scheduleApi.markReady();
              if (!result.ok) {
                setLocalNotice(
                  "위험 경고가 있습니다. 경고를 확인한 뒤 다시 시도해주세요.",
                );
              }
            }}
          >
            이 일정으로 시작하기
          </TextButton>
        </div>
      </div>
    </div>
  );
}
