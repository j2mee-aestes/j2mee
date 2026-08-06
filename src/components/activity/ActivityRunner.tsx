"use client";

import { ActivityFinishDialog } from "@/components/activity/ActivityFinishDialog";
import { ActivityItemList } from "@/components/activity/ActivityItemList";
import { ActivityMapPreview } from "@/components/activity/ActivityMapPreview";
import { ActivityProgressBar } from "@/components/activity/ActivityProgress";
import { ActivityStopDialog } from "@/components/activity/ActivityStopDialog";
import { CurrentActivityCard } from "@/components/activity/CurrentActivityCard";
import { FishingResultForm } from "@/components/activity/FishingResultForm";
import { NextActivityCard } from "@/components/activity/NextActivityCard";
import { PartnerVisitResultForm } from "@/components/activity/PartnerVisitResultForm";
import { PloggingResultForm } from "@/components/activity/PloggingResultForm";
import { TextButton } from "@/components/common/IconButton";
import { useActivityRun } from "@/hooks/useActivityRun";
import { calculateActivityProgress } from "@/lib/activity/calculateActivityProgress";
import {
  formatDelayHint,
  getScheduleDelayMinutes,
} from "@/lib/activity/compareScheduleTiming";
import {
  cancelActivityRun,
  canCompleteRun,
  completeActivityItem,
  finishActivityRun,
  getCurrentActivityItem,
  getNextActivityItem,
  reopenActivityItem,
  skipActivityItem,
  startActivityItem,
  updateActivityItemResult,
} from "@/lib/activity/updateActivityItemStatus";
import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import { estimateTravelMinutes } from "@/lib/schedule/calculateScheduleDistance";
import { getFishingSpotById } from "@/lib/fishing/fishingSpotRepository";
import { getPloggingRouteById } from "@/lib/environment/ploggingRouteRepository";
import { getAllWastePoints, getWastePointById } from "@/lib/environment/wastePointRepository";
import type {
  ActivityExecutionItem,
  ActivityItemResult,
  ActivityRun,
  FishingActivityResult,
  PartnerVisitResult,
  PloggingActivityResult,
} from "@/types/activity";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ActivityRunnerProps {
  activityRunId: string;
}

type ResultMode = "complete" | "edit" | null;

function collectSafetyNotes(item: ActivityExecutionItem): string[] {
  return [...(item.warnings ?? []), ...(item.notes ?? [])];
}

function missingResultTitles(run: ActivityRun): string[] {
  return run.items
    .filter(
      (item) =>
        item.status === "completed" &&
        (item.type === "fishing" ||
          item.type === "market" ||
          item.type === "restaurant" ||
          item.type === "processingShop" ||
          item.type === "plogging") &&
        !item.result,
    )
    .map((item) => item.title);
}

function hasMissingDisposal(run: ActivityRun): boolean {
  return run.items.some(
    (item) =>
      item.type === "plogging" &&
      item.status === "completed" &&
      item.result?.type === "plogging" &&
      !item.result.disposalWastePointId,
  );
}

export function ActivityRunner({ activityRunId }: ActivityRunnerProps) {
  const router = useRouter();
  const { run, loading, error, storageOk, persist } =
    useActivityRun(activityRunId);
  const [focusItemId, setFocusItemId] = useState<string | null>(null);
  const [stopOpen, setStopOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [resultMode, setResultMode] = useState<ResultMode>(null);
  const [resultItemId, setResultItemId] = useState<string | null>(null);
  const [orderWarning, setOrderWarning] = useState<string | null>(null);
  const [delayHint, setDelayHint] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const progress = useMemo(
    () => (run ? calculateActivityProgress(run) : null),
    [run],
  );

  const current = useMemo(
    () => (run ? getCurrentActivityItem(run) : null),
    [run],
  );
  const next = useMemo(
    () => (run ? getNextActivityItem(run, current?.id) : null),
    [run, current?.id],
  );

  useEffect(() => {
    if (current?.id) {
      setFocusItemId(current.id);
    }
  }, [current?.id]);

  useEffect(() => {
    if (!current?.plannedStartTime) {
      return;
    }
    queueMicrotask(() => {
      setDelayHint(
        formatDelayHint(getScheduleDelayMinutes(current.plannedStartTime)),
      );
    });
  }, [current?.plannedStartTime, current?.id]);

  useEffect(() => {
    if (run?.status === "completed") {
      router.replace(`/activity/${run.id}/complete`);
    }
  }, [run, router]);

  const fishingFlags = useMemo(() => {
    if (!current || current.type !== "fishing") {
      return { restricted: false, prohibited: false };
    }
    const spot = getFishingSpotById(current.sourceId);
    return {
      restricted: spot?.fishingAllowedStatus === "restricted",
      prohibited: spot?.fishingAllowedStatus === "prohibited",
    };
  }, [current]);

  const nextDistance = useMemo(() => {
    if (!current || !next) {
      return { distanceKm: null as number | null, travelMinutes: null as number | null };
    }
    const distanceKm = calculateDistanceKm(
      current.coordinates,
      next.coordinates,
    );
    return {
      distanceKm,
      travelMinutes: estimateTravelMinutes(distanceKm, run?.travelMode),
    };
  }, [current, next, run?.travelMode]);

  const resultItem = useMemo(
    () => run?.items.find((item) => item.id === resultItemId) ?? null,
    [run, resultItemId],
  );

  const disposalOptions = useMemo(() => {
    if (!resultItem || resultItem.type !== "plogging") {
      return [];
    }
    const route = getPloggingRouteById(resultItem.sourceId);
    if (!route) {
      return getAllWastePoints().slice(0, 8);
    }
    const linked = route.connectedWastePointIds
      .map((id) => getWastePointById(id))
      .filter((point): point is NonNullable<typeof point> => Boolean(point));
    return linked.length > 0 ? linked : getAllWastePoints().slice(0, 8);
  }, [resultItem]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-8 text-sm text-[var(--color-text-secondary)]">
        활동 기록을 불러오는 중…
      </div>
    );
  }

  if (error || !run || !progress) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-3 py-8">
        <p className="text-sm text-red-700" role="alert">
          {error ??
            "활동 기록을 찾을 수 없습니다. 저장된 일정 목록에서 다시 확인해주세요."}
        </p>
        <Link href="/activities" className="text-sm text-[var(--color-ocean-700)] underline">
          활동 기록 목록
        </Link>
      </div>
    );
  }

  if (run.status === "completed") {
    return (
      <div className="mx-auto max-w-3xl px-3 py-8 text-sm text-[var(--color-text-secondary)]">
        완료 화면으로 이동 중…
      </div>
    );
  }

  if (run.status === "cancelled") {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-3 py-8">
        <p className="text-sm text-[var(--color-text-secondary)]">
          취소된 일정입니다. 완료 결과에 포함되지 않습니다.
        </p>
        <Link href="/schedule" className="text-sm text-[var(--color-ocean-700)] underline">
          새 일정 만들기
        </Link>
      </div>
    );
  }

  const openResultForm = (itemId: string, mode: ResultMode) => {
    setResultItemId(itemId);
    setResultMode(mode);
  };

  const handleStart = async (item: ActivityExecutionItem) => {
    const incompleteBefore = run.items.some(
      (entry) =>
        entry.order < item.order &&
        entry.status !== "completed" &&
        entry.status !== "skipped",
    );
    if (incompleteBefore) {
      setOrderWarning(
        "이전 활동이 아직 완료되지 않았습니다. 순서를 바꿔 시작할 수 있지만 일정 시간이 어긋날 수 있습니다.",
      );
    } else {
      setOrderWarning(null);
    }
    if (item.type === "fishing") {
      const spot = getFishingSpotById(item.sourceId);
      if (spot?.fishingAllowedStatus === "prohibited") {
        setNotice(
          "출입금지·낚시금지 장소는 시작할 수 없습니다. 건너뛰거나 일정에서 제거해주세요.",
        );
        return;
      }
      if (spot?.fishingAllowedStatus === "restricted") {
        setNotice("주의: 활동 비권장 장소입니다. 현장 안내를 우선 확인하세요.");
      }
    }
    await persist(startActivityItem(run, item.id));
  };

  const handleCompleteClick = (item: ActivityExecutionItem) => {
    openResultForm(item.id, "complete");
  };

  const applyResult = async (
    item: ActivityExecutionItem,
    result: ActivityItemResult,
  ) => {
    if (resultMode === "edit" || item.status === "completed") {
      await persist(updateActivityItemResult(run, item.id, result));
    } else {
      await persist(completeActivityItem(run, item.id, result));
    }
    setResultMode(null);
    setResultItemId(null);
    setNotice(null);
  };

  const handleSkip = async (item: ActivityExecutionItem) => {
    await persist(skipActivityItem(run, item.id));
    setResultMode(null);
    setResultItemId(null);
  };

  const finishNow = async (base: ActivityRun) => {
    const finished = finishActivityRun(base);
    await persist(finished);
    router.push(`/activity/${finished.id}/complete`);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 pb-28 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/activities"
          className="text-xs font-medium text-[var(--color-ocean-700)]"
        >
          활동 기록
        </Link>
        <TextButton type="button" variant="ghost" onClick={() => setStopOpen(true)}>
          일정 중단하기
        </TextButton>
      </div>

      {!storageOk ? (
        <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="status">
          이 브라우저에서는 활동 기록을 저장할 수 없습니다. 현재 화면을 닫으면
          기록이 사라질 수 있습니다.
        </p>
      ) : null}

      {notice ? (
        <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="status">
          {notice}
        </p>
      ) : null}
      {orderWarning ? (
        <p className="rounded-[var(--radius-md)] border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900" role="status">
          {orderWarning}
        </p>
      ) : null}
      {delayHint ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-xs text-[var(--color-text-secondary)]" role="status">
          {delayHint} 안내만 제공하며 일정 시간은 자동 변경되지 않습니다.
        </p>
      ) : null}

      <ActivityProgressBar
        progress={progress}
        title={run.scheduleTitle}
        date={run.date}
        plannedDurationMinutes={run.plannedDurationMinutes}
      />

      <CurrentActivityCard
        item={current}
        safetyNotes={current ? collectSafetyNotes(current) : []}
        isRestricted={fishingFlags.restricted}
        isProhibited={fishingFlags.prohibited}
        onStart={() => current && void handleStart(current)}
        onComplete={() => current && handleCompleteClick(current)}
        onSkip={() => current && void handleSkip(current)}
        onEditResult={
          current?.status === "completed"
            ? () => openResultForm(current.id, "edit")
            : undefined
        }
      />

      {resultItem && resultMode ? (
        <div className="space-y-2">
          {resultItem.type === "fishing" ? (
            <FishingResultForm
              initial={
                resultItem.result?.type === "fishing"
                  ? resultItem.result
                  : undefined
              }
              onSubmit={(result: FishingActivityResult) =>
                void applyResult(resultItem, result)
              }
              onCancel={() => {
                setResultMode(null);
                setResultItemId(null);
              }}
            />
          ) : null}
          {resultItem.type === "market" ||
          resultItem.type === "restaurant" ||
          resultItem.type === "processingShop" ? (
            <PartnerVisitResultForm
              placeType={resultItem.type}
              initial={
                resultItem.result &&
                resultItem.result.type !== "fishing" &&
                resultItem.result.type !== "plogging"
                  ? resultItem.result
                  : undefined
              }
              onSubmit={(result: PartnerVisitResult) => {
                if (!result.visited) {
                  void handleSkip(resultItem);
                  return;
                }
                void applyResult(resultItem, result);
              }}
              onSkip={() => void handleSkip(resultItem)}
              onCancel={() => {
                setResultMode(null);
                setResultItemId(null);
              }}
            />
          ) : null}
          {resultItem.type === "plogging" ? (
            <PloggingResultForm
              disposalOptions={disposalOptions}
              initial={
                resultItem.result?.type === "plogging"
                  ? resultItem.result
                  : undefined
              }
              onSubmit={(result: PloggingActivityResult) =>
                void applyResult(resultItem, result)
              }
              onCancel={() => {
                setResultMode(null);
                setResultItemId(null);
              }}
            />
          ) : null}
        </div>
      ) : null}

      <NextActivityCard
        item={next}
        distanceKm={nextDistance.distanceKm}
        travelMinutes={nextDistance.travelMinutes}
        onShowOnMap={next ? () => setFocusItemId(next.id) : undefined}
      />

      <ActivityMapPreview
        run={run}
        focusItemId={focusItemId}
        nextItemId={next?.id ?? null}
        onSelectItem={setFocusItemId}
      />

      <ActivityItemList
        items={run.items}
        onSelectItem={(id) => {
          setFocusItemId(id);
          const item = run.items.find((entry) => entry.id === id);
          if (!item) {
            return;
          }
          if (item.status === "completed") {
            openResultForm(id, "edit");
          } else if (item.status === "notStarted" || item.status === "skipped") {
            void handleStart(item);
          } else if (item.status === "inProgress") {
            setNotice(`현재 진행 중: ${item.title}`);
          }
        }}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row">
          <TextButton
            type="button"
            className="w-full min-h-11"
            onClick={() => setStopOpen(true)}
          >
            일정 중단하기
          </TextButton>
          <TextButton
            type="button"
            variant="primary"
            className="w-full min-h-11"
            onClick={() => setFinishOpen(true)}
          >
            오늘의 바다 일정 완료하기
          </TextButton>
        </div>
      </div>

      <ActivityStopDialog
        open={stopOpen}
        onContinue={() => setStopOpen(false)}
        onSaveAndExit={() => {
          setStopOpen(false);
          router.push("/activities");
        }}
        onCancelRun={() => {
          void persist(cancelActivityRun(run)).then(() => {
            setStopOpen(false);
            router.push("/activities");
          });
        }}
      />

      <ActivityFinishDialog
        open={finishOpen}
        run={run}
        missingResults={missingResultTitles(run)}
        missingDisposal={hasMissingDisposal(run)}
        hasRemaining={!canCompleteRun(run)}
        onCancel={() => setFinishOpen(false)}
        onConfirm={() => void finishNow(run)}
        onSkipRemainingAndFinish={() => {
          let nextRun = run;
          nextRun.items
            .filter(
              (item) =>
                item.status === "notStarted" || item.status === "inProgress",
            )
            .forEach((item) => {
              nextRun = skipActivityItem(nextRun, item.id);
            });
          void finishNow(nextRun);
        }}
      />
    </div>
  );
}
