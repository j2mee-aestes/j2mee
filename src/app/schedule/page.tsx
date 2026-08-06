"use client";

import { ScheduleBuilder } from "@/components/schedule/ScheduleBuilder";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SchedulePageInner() {
  const searchParams = useSearchParams();
  const seed = searchParams.get("spot");
  return <ScheduleBuilder seedFishingSpotId={seed} />;
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          일정을 불러오는 중…
        </div>
      }
    >
      <SchedulePageInner />
    </Suspense>
  );
}
