"use client";

import { SavedScheduleList } from "@/components/schedule/SavedScheduleList";
import { useScheduleContext } from "@/context/ScheduleContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SchedulesPage() {
  const router = useRouter();
  const { loadSchedule } = useScheduleContext();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            저장된 일정
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            이 브라우저에만 저장됩니다. 다른 기기에서는 확인할 수 없습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
          >
            지도로
          </Link>
          <Link
            href="/schedule"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
          >
            새 일정
          </Link>
        </div>
      </div>

      <SavedScheduleList
        onOpen={(schedule) => {
          loadSchedule(schedule);
          router.push("/schedule");
        }}
      />
    </div>
  );
}
