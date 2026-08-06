"use client";

import { ActivityHistoryList } from "@/components/activity/ActivityHistoryList";
import { useTranslations } from "@/context/LocaleContext";
import { useScheduleContext } from "@/context/ScheduleContext";
import { createScheduleFromActivityRun } from "@/lib/activity/createScheduleFromActivityRun";
import { hybridActivityRunRepository } from "@/lib/activity/hybridActivityRunRepository";
import { isLocalStorageAvailable } from "@/lib/activity/activityRunStorage";
import type { ActivityRun } from "@/types/activity";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ActivitiesPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const scheduleApi = useScheduleContext();
  const [runs, setRuns] = useState<ActivityRun[]>([]);
  const [storageOk, setStorageOk] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await hybridActivityRunRepository.getAll();
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
            {t("activity.historyTitle")}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {t("activity.historySubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/schedule"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            {t("activity.createNew")}
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            {t("common.map")}
          </Link>
        </div>
      </div>

      {!storageOk ? (
        <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {t("activity.storageUnavailable")}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("common.loading")}
        </p>
      ) : (
        <ActivityHistoryList
          runs={runs}
          onDelete={(id) => {
            void hybridActivityRunRepository.delete(id).then(() => refresh());
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
