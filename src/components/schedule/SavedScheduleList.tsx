"use client";

import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import { ScheduleEmptyState } from "@/components/schedule/ScheduleEmptyState";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import { hybridScheduleRepository } from "@/lib/schedule/hybridScheduleRepository";
import type { DaySchedule } from "@/types/schedule";
import { useCallback, useEffect, useState } from "react";

interface SavedScheduleListProps {
  onOpen: (schedule: DaySchedule) => void;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return `${minutes}분`;
  }
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}

export function SavedScheduleList({ onOpen }: SavedScheduleListProps) {
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const list = await hybridScheduleRepository.getAll();
    setSchedules(list);
    setLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        const list = await hybridScheduleRepository.getAll();
        if (cancelled) {
          return;
        }
        setSchedules(list);
        setLoaded(true);
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (schedule: DaySchedule) => {
    const confirmed = window.confirm(
      `“${schedule.title}” 일정을 삭제할까요? 복구할 수 없습니다.`,
    );
    if (!confirmed) {
      return;
    }
    await hybridScheduleRepository.delete(schedule.id);
    await reload();
  };

  const handleCopy = async (schedule: DaySchedule) => {
    const copied: DaySchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`,
      title: `${schedule.title} (복사)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
    };
    await hybridScheduleRepository.save(copied);
    await reload();
  };

  if (!loaded) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">불러오는 중…</p>
    );
  }

  if (schedules.length === 0) {
    return <ScheduleEmptyState variant="saved" />;
  }

  return (
    <ul className="space-y-3">
      {schedules.map((schedule) => {
        const first = [...schedule.items].sort((a, b) => a.order - b.order)[0];
        return (
          <li key={schedule.id}>
            <Card className="space-y-2 p-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {schedule.title}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  {schedule.date} · {schedule.items.length}곳
                  {first ? ` · 시작 ${first.title}` : ""}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                  {formatDistanceKm(schedule.totalDistanceKm)} ·{" "}
                  {formatDuration(schedule.totalDurationMinutes)} · 수정{" "}
                  {new Intl.DateTimeFormat("ko-KR", {
                    timeZone: "Asia/Seoul",
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(schedule.updatedAt))}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TextButton
                  variant="primary"
                  className="h-9 text-xs"
                  onClick={() => onOpen(schedule)}
                >
                  열기
                </TextButton>
                <TextButton
                  variant="secondary"
                  className="h-9 text-xs"
                  onClick={() => void handleCopy(schedule)}
                >
                  복사
                </TextButton>
                <TextButton
                  variant="ghost"
                  className="h-9 text-xs text-red-700"
                  onClick={() => void handleDelete(schedule)}
                >
                  삭제
                </TextButton>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
