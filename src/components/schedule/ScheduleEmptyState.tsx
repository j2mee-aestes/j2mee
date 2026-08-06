"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { useTranslations } from "@/context/LocaleContext";
import { CalendarDays } from "lucide-react";

interface ScheduleEmptyStateProps {
  variant?: "builder" | "saved" | "recommend";
}

export function ScheduleEmptyState({
  variant = "builder",
}: ScheduleEmptyStateProps) {
  const { t } = useTranslations();

  if (variant === "saved") {
    return (
      <EmptyState
        title={t("schedule.emptySaved")}
        description={t("schedule.emptySavedBody")}
        icon={<CalendarDays className="h-6 w-6" />}
      />
    );
  }
  if (variant === "recommend") {
    return (
      <EmptyState
        title={t("schedule.emptyRecommend")}
        description={t("schedule.emptyRecommendBody")}
        icon={<CalendarDays className="h-6 w-6" />}
      />
    );
  }
  return (
    <EmptyState
      title={t("schedule.emptyTitle")}
      description={t("schedule.emptyBody")}
      icon={<CalendarDays className="h-6 w-6" />}
    />
  );
}
