"use client";

import { ActivityStartConfirmation } from "@/components/activity/ActivityStartConfirmation";
import { TextButton } from "@/components/common/IconButton";
import { RecommendedScheduleButton } from "@/components/schedule/RecommendedScheduleButton";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { ScheduleItemList } from "@/components/schedule/ScheduleItemList";
import { ScheduleMapPreview } from "@/components/schedule/ScheduleMapPreview";
import { ScheduleShareButton } from "@/components/schedule/ScheduleShareButton";
import { ScheduleSummary } from "@/components/schedule/ScheduleSummary";
import { ScheduleWarnings } from "@/components/schedule/ScheduleWarnings";
import { useTranslations } from "@/context/LocaleContext";
import { useScheduleContext } from "@/context/ScheduleContext";
import {
  getLocationDetailById,
  isFishingSpot,
} from "@/data/mockMapLocations";
import { createActivityRunFromSchedule } from "@/lib/activity/createActivityRun";
import { localActivityRunRepository } from "@/lib/activity/localActivityRunRepository";
import { validateActivityStart } from "@/lib/activity/validateActivityStart";
import { localScheduleRepository } from "@/lib/schedule/localScheduleRepository";
import { persistDraftSchedule } from "@/lib/schedule/scheduleStorage";
import type { FishingSpot } from "@/types/fishing";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface ScheduleBuilderProps {
  seedFishingSpotId?: string | null;
}

export function ScheduleBuilder({
  seedFishingSpotId = null,
}: ScheduleBuilderProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const scheduleApi = useScheduleContext();
  const [focusItemId, setFocusItemId] = useState<string | null>(null);
  const [localNotice, setLocalNotice] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [starting, setStarting] = useState(false);

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

  const startValidation = useMemo(
    () => validateActivityStart(scheduleApi.schedule),
    [scheduleApi.schedule],
  );

  const notice = localNotice ?? scheduleApi.notice;

  const handleOpenStart = () => {
    scheduleApi.clearNotice();
    if (scheduleApi.schedule.items.length === 0) {
      setLocalNotice(t("schedule.needItems"));
      return;
    }
    setStartOpen(true);
  };

  const handleConfirmStart = async () => {
    if (!startValidation.canStart || starting) {
      return;
    }
    setStarting(true);
    try {
      const readySchedule = {
        ...scheduleApi.schedule,
        status: "ready" as const,
        updatedAt: new Date().toISOString(),
      };
      scheduleApi.loadSchedule(readySchedule);
      persistDraftSchedule(readySchedule);
      await localScheduleRepository.save(readySchedule);
      const run = createActivityRunFromSchedule(readySchedule);
      await localActivityRunRepository.save(run);
      setStartOpen(false);
      router.push(`/activity/${run.id}`);
    } catch {
      setLocalNotice(t("schedule.saveFailed"));
      setStarting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            {t("schedule.title")}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {t("schedule.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            {t("schedule.toMap")}
          </Link>
          <Link
            href="/schedules"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            {t("schedule.savedList")}
          </Link>
          <Link
            href="/activities"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            {t("schedule.activityHistory")}
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

      <ScheduleWarnings warnings={scheduleApi.warnings} />

      <section className="space-y-3 pb-24">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
            {t("schedule.places")}
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row">
          <TextButton
            variant="secondary"
            className="w-full"
            onClick={scheduleApi.resetSchedule}
          >
            {t("schedule.reset")}
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
            {t("schedule.save")}
          </TextButton>
          <TextButton
            variant="primary"
            className="w-full"
            onClick={handleOpenStart}
          >
            {t("schedule.start")}
          </TextButton>
        </div>
      </div>

      <ActivityStartConfirmation
        open={startOpen}
        title={scheduleApi.schedule.title}
        date={scheduleApi.schedule.date}
        canStart={startValidation.canStart && !starting}
        blocking={startValidation.blocking}
        warnings={startValidation.warnings}
        info={startValidation.info}
        onConfirm={() => void handleConfirmStart()}
        onCancel={() => setStartOpen(false)}
      />
    </div>
  );
}
