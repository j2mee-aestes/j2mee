"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { CalendarDays } from "lucide-react";

interface ScheduleEmptyStateProps {
  variant?: "builder" | "saved" | "recommend";
}

export function ScheduleEmptyState({
  variant = "builder",
}: ScheduleEmptyStateProps) {
  if (variant === "saved") {
    return (
      <EmptyState
        title="저장된 일정이 없습니다."
        description="새로운 바다 일정을 만들어보세요."
        icon={<CalendarDays className="h-6 w-6" />}
      />
    );
  }
  if (variant === "recommend") {
    return (
      <EmptyState
        title="주변에 일정으로 추천할 수 있는 장소가 부족합니다."
        description="직접 장소를 추가해주세요."
        icon={<CalendarDays className="h-6 w-6" />}
      />
    );
  }
  return (
    <EmptyState
      title="아직 일정에 추가된 장소가 없습니다."
      description="지도에서 낚시터, 시장·식당 또는 플로깅 코스를 추가해주세요."
      icon={<CalendarDays className="h-6 w-6" />}
    />
  );
}
