"use client";

import { COMMON_FISH_SPECIES } from "@/constants/activityDefaults";
import { TextButton } from "@/components/common/IconButton";
import type { FishingActivityResult } from "@/types/activity";
import { useState } from "react";

interface FishingResultFormProps {
  initial?: FishingActivityResult;
  onSubmit: (result: FishingActivityResult) => void;
  onCancel: () => void;
}

export function FishingResultForm({
  initial,
  onSubmit,
  onCancel,
}: FishingResultFormProps) {
  const [choice, setChoice] = useState<"caught" | "notCaught" | "skipped">(
    initial?.catchChoice ??
      (initial?.catchRecorded ? "caught" : "skipped"),
  );
  const [species, setSpecies] = useState<string[]>(
    initial?.caughtSpecies ?? [],
  );
  const [customSpecies, setCustomSpecies] = useState("");
  const [count, setCount] = useState(initial?.catchCount ?? 1);
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [error, setError] = useState<string | null>(null);

  const toggleSpecies = (value: string) => {
    setSpecies((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleSubmit = () => {
    if (choice === "caught") {
      const all = [...species];
      if (customSpecies.trim()) {
        all.push(customSpecies.trim());
      }
      if (all.length === 0) {
        setError("잡은 어종을 하나 이상 선택하거나 입력해주세요.");
        return;
      }
      if (!count || count < 1) {
        setError("마릿수는 1 이상이어야 합니다.");
        return;
      }
      onSubmit({
        type: "fishing",
        catchRecorded: true,
        catchChoice: "caught",
        caughtSpecies: all,
        catchCount: count,
        memo: memo.trim() || undefined,
      });
      return;
    }
    onSubmit({
      type: "fishing",
      catchRecorded: false,
      catchChoice: choice,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
      <p className="text-sm font-semibold">낚시 결과 기록</p>
      <fieldset>
        <legend className="mb-1.5 text-xs font-medium">잡은 수산물</legend>
        <div className="flex flex-col gap-1.5 text-xs">
          {(
            [
              ["caught", "잡은 수산물이 있어요"],
              ["notCaught", "잡지 못했어요"],
              ["skipped", "기록하지 않을게요"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="catch-choice"
                checked={choice === value}
                onChange={() => setChoice(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {choice === "caught" ? (
        <>
          <fieldset>
            <legend className="mb-1.5 text-xs font-medium">어종</legend>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_FISH_SPECIES.map((item) => {
                const checked = species.includes(item);
                return (
                  <label
                    key={item}
                    className={`rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ${
                      checked
                        ? "bg-sky-50 text-sky-900 ring-sky-300"
                        : "bg-white ring-[var(--color-border)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleSpecies(item)}
                    />
                    {item}
                  </label>
                );
              })}
            </div>
            <label htmlFor="custom-species" className="mt-2 block text-xs">
              직접 입력
            </label>
            <input
              id="custom-species"
              value={customSpecies}
              onChange={(event) => setCustomSpecies(event.target.value)}
              className="mt-1 h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
            />
          </fieldset>
          <div>
            <label htmlFor="catch-count" className="mb-1 block text-xs font-medium">
              마릿수
            </label>
            <input
              id="catch-count"
              type="number"
              min={1}
              value={count}
              aria-invalid={Boolean(error)}
              onChange={(event) => setCount(Number(event.target.value))}
              className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
            />
          </div>
        </>
      ) : null}

      <div>
        <label htmlFor="fishing-memo" className="mb-1 block text-xs font-medium">
          메모
        </label>
        <textarea
          id="fishing-memo"
          rows={2}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
        />
      </div>

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <TextButton variant="ghost" className="flex-1" onClick={onCancel}>
          닫기
        </TextButton>
        <TextButton variant="primary" className="flex-1" onClick={handleSubmit}>
          결과 저장·완료
        </TextButton>
      </div>
    </div>
  );
}
