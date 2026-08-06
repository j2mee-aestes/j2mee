"use client";

import { Card } from "@/components/common/Card";
import { useTranslations } from "@/context/LocaleContext";
import type { DaySchedule, TravelMode } from "@/types/schedule";

interface ScheduleHeaderProps {
  schedule: DaySchedule;
  onTitleChange: (title: string) => void;
  onDateChange: (date: string) => void;
  onTravelModeChange: (mode: TravelMode) => void;
  onFirstStartChange: (time: string) => void;
}

export function ScheduleHeader({
  schedule,
  onTitleChange,
  onDateChange,
  onTravelModeChange,
  onFirstStartChange,
}: ScheduleHeaderProps) {
  const { t } = useTranslations();
  const firstStart =
    schedule.items.find((item) => item.order === 1)?.startTime ?? "09:00";

  return (
    <Card className="space-y-3 p-4">
      <div>
        <label
          htmlFor="schedule-title"
          className="mb-1 block text-xs font-medium"
        >
          {t("schedule.titleLabel")}
        </label>
        <input
          id="schedule-title"
          type="text"
          value={schedule.title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="schedule-date"
            className="mb-1 block text-xs font-medium"
          >
            {t("schedule.dateLabel")}
          </label>
          <input
            id="schedule-date"
            type="date"
            value={schedule.date}
            onChange={(event) => onDateChange(event.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="schedule-first-start"
            className="mb-1 block text-xs font-medium"
          >
            {t("schedule.firstStartLabel")}
          </label>
          <input
            id="schedule-first-start"
            type="time"
            value={firstStart}
            onChange={(event) => onFirstStartChange(event.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="schedule-travel-mode"
            className="mb-1 block text-xs font-medium"
          >
            {t("schedule.travelModeLabel")}
          </label>
          <select
            id="schedule-travel-mode"
            value={schedule.travelMode}
            onChange={(event) =>
              onTravelModeChange(event.target.value as TravelMode)
            }
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          >
            <option value="driving">{t("schedule.driving")}</option>
            <option value="walking">{t("schedule.walking")}</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
