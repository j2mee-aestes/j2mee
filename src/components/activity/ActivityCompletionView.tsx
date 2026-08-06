"use client";

import { CompletionBadges } from "@/components/activity/CompletionBadges";
import { CompletionHero } from "@/components/activity/CompletionHero";
import { CompletionMetrics } from "@/components/activity/CompletionMetrics";
import { CompletionShareButton } from "@/components/activity/CompletionShareButton";
import { CompletionTimeline } from "@/components/activity/CompletionTimeline";
import { ActivityMapPreview } from "@/components/activity/ActivityMapPreview";
import { FishingCompletionCard } from "@/components/activity/FishingCompletionCard";
import { PartnerCompletionCard } from "@/components/activity/PartnerCompletionCard";
import { PloggingCompletionCard } from "@/components/activity/PloggingCompletionCard";
import { TextButton } from "@/components/common/IconButton";
import { useScheduleContext } from "@/context/ScheduleContext";
import { useActivityRun } from "@/hooks/useActivityRun";
import { buildCompletionSummary } from "@/lib/activity/buildCompletionSummary";
import { createScheduleFromActivityRun } from "@/lib/activity/createScheduleFromActivityRun";
import { generateCompletionBadges } from "@/lib/activity/generateCompletionBadges";
import { createEmptySchedule } from "@/lib/schedule/createScheduleItem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface ActivityCompletionViewProps {
  activityRunId: string;
}

export function ActivityCompletionView({
  activityRunId,
}: ActivityCompletionViewProps) {
  const router = useRouter();
  const scheduleApi = useScheduleContext();
  const { run, loading, error, storageOk } = useActivityRun(activityRunId);

  const summary = useMemo(
    () => (run && run.status === "completed" ? buildCompletionSummary(run) : null),
    [run],
  );
  const badges = useMemo(
    () => (run && run.status === "completed" ? generateCompletionBadges(run) : []),
    [run],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-8 text-sm text-[var(--color-text-secondary)]">
        완료 결과를 불러오는 중…
      </div>
    );
  }

  if (error || !run) {
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

  if (run.status !== "completed" || !summary) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-3 py-8">
        <p className="text-sm text-[var(--color-text-secondary)]">
          아직 완료되지 않은 활동입니다. 진행 화면에서 이어서 진행해주세요.
        </p>
        <Link
          href={`/activity/${run.id}`}
          className="text-sm text-[var(--color-ocean-700)] underline"
        >
          활동 진행으로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-3 py-4 pb-10 sm:px-4">
      {!storageOk ? (
        <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          이 브라우저에서는 활동 기록을 저장할 수 없습니다. 현재 화면을 닫으면
          기록이 사라질 수 있습니다.
        </p>
      ) : null}

      <CompletionHero title={summary.title} date={summary.date} />
      <CompletionMetrics summary={summary} />
      <CompletionTimeline items={run.items} />
      <FishingCompletionCard summary={summary.fishingSummary} />
      <PartnerCompletionCard summary={summary.partnerSummary} />
      <PloggingCompletionCard summary={summary.ploggingSummary} />
      <CompletionBadges badges={badges} />

      <section aria-label="지도 경로 요약">
        <h2 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">
          지도 경로 요약
        </h2>
        <ActivityMapPreview
          run={run}
          showDisposalPoints
          interactive={false}
          className="h-72 sm:h-96"
        />
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <CompletionShareButton run={run} />
        <TextButton
          type="button"
          variant="primary"
          className="w-full min-h-11"
          onClick={() => {
            const draft = createScheduleFromActivityRun(run);
            scheduleApi.loadSchedule(draft);
            router.push("/schedule");
          }}
        >
          이 일정으로 다시 계획하기
        </TextButton>
        <TextButton
          type="button"
          className="w-full min-h-11"
          onClick={() => {
            scheduleApi.loadSchedule(createEmptySchedule());
            router.push("/schedule");
          }}
        >
          새 일정 만들기
        </TextButton>
        <Link
          href="/?activityCompleted=true"
          className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm font-medium"
        >
          지도로 돌아가기
        </Link>
      </div>
    </div>
  );
}
