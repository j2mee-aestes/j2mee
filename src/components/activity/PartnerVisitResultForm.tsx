"use client";

import { PARTNER_SERVICE_OPTIONS } from "@/constants/activityDefaults";
import { TextButton } from "@/components/common/IconButton";
import type { PartnerVisitResult } from "@/types/activity";
import type { ScheduleItemType } from "@/types/schedule";
import { useState } from "react";

interface PartnerVisitResultFormProps {
  placeType: Extract<
    ScheduleItemType,
    "market" | "restaurant" | "processingShop"
  >;
  initial?: PartnerVisitResult;
  onSubmit: (result: PartnerVisitResult) => void;
  onSkip: () => void;
  onCancel: () => void;
}

export function PartnerVisitResultForm({
  placeType,
  initial,
  onSubmit,
  onSkip,
  onCancel,
}: PartnerVisitResultFormProps) {
  const [visited, setVisited] = useState(initial?.visited ?? true);
  const [services, setServices] = useState<string[]>(
    initial?.serviceUsed ?? [],
  );
  const [memo, setMemo] = useState(initial?.memo ?? "");

  const toggle = (value: string) => {
    setServices((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
      <p className="text-sm font-semibold">방문 결과 기록</p>
      <fieldset>
        <legend className="mb-1.5 text-xs font-medium">실제 방문 여부</legend>
        <div className="flex gap-3 text-xs">
          <label className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              checked={visited}
              onChange={() => setVisited(true)}
            />
            방문했어요
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              checked={!visited}
              onChange={() => setVisited(false)}
            />
            방문하지 않았어요
          </label>
        </div>
      </fieldset>

      {visited ? (
        <fieldset>
          <legend className="mb-1.5 text-xs font-medium">이용한 서비스</legend>
          <div className="flex flex-wrap gap-1.5">
            {PARTNER_SERVICE_OPTIONS.map((option) => {
              const checked = services.includes(option);
              return (
                <label
                  key={option}
                  className={`rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ${
                    checked
                      ? "bg-violet-50 text-violet-900 ring-violet-300"
                      : "bg-white ring-[var(--color-border)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggle(option)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div>
        <label htmlFor="partner-memo" className="mb-1 block text-xs font-medium">
          메모
        </label>
        <textarea
          id="partner-memo"
          rows={2}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <TextButton variant="ghost" className="flex-1" onClick={onCancel}>
          닫기
        </TextButton>
        {!visited ? (
          <TextButton variant="secondary" className="flex-1" onClick={onSkip}>
            건너뛰기로 완료
          </TextButton>
        ) : (
          <TextButton
            variant="primary"
            className="flex-1"
            onClick={() =>
              onSubmit({
                type: placeType,
                visited: true,
                serviceUsed: services,
                memo: memo.trim() || undefined,
              })
            }
          >
            결과 저장·완료
          </TextButton>
        )}
      </div>
    </div>
  );
}
