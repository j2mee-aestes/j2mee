"use client";

import { TextButton } from "@/components/common/IconButton";
import { formatScheduleShareText } from "@/lib/schedule/formatScheduleShareText";
import type { DaySchedule } from "@/types/schedule";
import { useState } from "react";

interface ScheduleShareButtonProps {
  schedule: DaySchedule;
  onMessage: (message: string) => void;
}

export function ScheduleShareButton({
  schedule,
  onMessage,
}: ScheduleShareButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleCopy = async () => {
    const text = formatScheduleShareText(schedule);
    setBusy(true);
    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: schedule.title,
            text,
          });
          onMessage("공유 시트를 열었습니다.");
          return;
        } catch {
          // fall through to clipboard
        }
      }
      await navigator.clipboard.writeText(text);
      onMessage("일정 텍스트가 클립보드에 복사되었습니다.");
    } catch {
      onMessage("공유/복사에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TextButton
      variant="secondary"
      className="w-full"
      disabled={busy || schedule.items.length === 0}
      onClick={handleCopy}
    >
      일정 공유·복사
    </TextButton>
  );
}
