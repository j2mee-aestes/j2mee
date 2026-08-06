"use client";

import { ActivityHistoryList } from "@/components/activity/ActivityHistoryList";
import { useScheduleContext } from "@/context/ScheduleContext";
import { createScheduleFromActivityRun } from "@/lib/activity/createScheduleFromActivityRun";
import { localActivityRunRepository } from "@/lib/activity/localActivityRunRepository";
import { isLocalStorageAvailable } from "@/lib/activity/activityRunStorage";
import type { ActivityRun } from "@/types/activity";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ActivitiesPage() {
  const router = useRouter();
  const scheduleApi = useScheduleContext();
  const [runs, setRuns] = useState<ActivityRun[]>([]);
  const [storageOk, setStorageOk] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await localActivityRunRepository.getAll();
    setRuns(all.filter((run) => run.status !== "cancelled"));
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setStorageOk(isLocalStorageAvailable());
      void refresh();
    });
  }, [refresh]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            활동 기록
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            이 브라우저에 임시 저장된 진행·완료 기록입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/schedule"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            일정 만들기
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            지도
          </Link>
        </div>
      </div>

      {!storageOk ? (
        <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          이 브라우저에서는 활동 기록을 저장할 수 없습니다. 현재 화면을 닫으면
          기록이 사라질 수 있습니다.
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">불러오는 중…</p>
      ) : (
        <ActivityHistoryList
          runs={runs}
          onDelete={(id) => {
            void localActivityRunRepository.delete(id).then(() => refresh());
          }}
          onCopySchedule={(run) => {
            scheduleApi.loadSchedule(createScheduleFromActivityRun(run));
            router.push("/schedule");
          }}
        />
      )}
    </div>
  );
}
