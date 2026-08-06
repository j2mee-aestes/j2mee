"use client";

import { TextButton } from "@/components/common/IconButton";
import { generateRecommendedSchedule } from "@/lib/schedule/generateRecommendedSchedule";
import type { FishingSpot } from "@/types/fishing";
import type { DaySchedule } from "@/types/schedule";
import { useState } from "react";

interface RecommendedScheduleButtonProps {
  fishingSpot: FishingSpot | null;
  date: string;
  onApply: (schedule: DaySchedule) => void;
  onMessage: (message: string) => void;
}

export function RecommendedScheduleButton({
  fishingSpot,
  date,
  onApply,
  onMessage,
}: RecommendedScheduleButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleClick = () => {
    if (!fishingSpot) {
      onMessage("추천 일정을 만들려면 먼저 낚시터를 선택하거나 추가해주세요.");
      return;
    }
    setBusy(true);
    try {
      const result = generateRecommendedSchedule({
        fishingSpot,
        date,
      });
      if (!result.schedule) {
        onMessage(
          result.message ??
            "주변에 일정으로 추천할 수 있는 장소가 부족합니다. 직접 장소를 추가해주세요.",
        );
        return;
      }
      onApply(result.schedule);
    } finally {
      setBusy(false);
    }
  };

  return (
    <TextButton
      variant="secondary"
      className="w-full"
      disabled={busy}
      onClick={handleClick}
    >
      추천 일정 만들기
    </TextButton>
  );
}
