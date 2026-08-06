"use client";

import { TextButton } from "@/components/common/IconButton";
import { formatActivityShareText } from "@/lib/activity/formatActivityShareText";
import type { ActivityRun } from "@/types/activity";
import { Share2 } from "lucide-react";
import { useState } from "react";

interface CompletionShareButtonProps {
  run: ActivityRun;
}

export function CompletionShareButton({ run }: CompletionShareButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  const handleShare = async () => {
    const text = formatActivityShareText(run);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "파도파도 활동 기록",
          text,
        });
        setMessage("공유 화면을 열었습니다.");
        return;
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(text);
      setMessage("공유 텍스트를 클립보드에 복사했습니다.");
    } catch {
      setMessage("공유를 지원하지 않는 환경입니다. 텍스트를 직접 선택해 복사해주세요.");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <TextButton
        type="button"
        variant="secondary"
        className="w-full min-h-11"
        onClick={() => void handleShare()}
      >
        <Share2 className="h-4 w-4" aria-hidden />
        결과 공유
      </TextButton>
      {message ? (
        <p className="text-xs text-[var(--color-text-secondary)]" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
