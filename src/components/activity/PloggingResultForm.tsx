"use client";

import { PLOGGING_WASTE_OPTIONS } from "@/constants/activityDefaults";
import { TextButton } from "@/components/common/IconButton";
import type { PloggingActivityResult } from "@/types/activity";
import type { WastePoint } from "@/types/environment";
import { useState } from "react";

interface PloggingResultFormProps {
  disposalOptions: WastePoint[];
  initial?: PloggingActivityResult;
  onSubmit: (result: PloggingActivityResult) => void;
  onCancel: () => void;
}

export function PloggingResultForm({
  disposalOptions,
  initial,
  onSubmit,
  onCancel,
}: PloggingResultFormProps) {
  const [completedRoute, setCompletedRoute] = useState(
    initial?.completedRoute ?? true,
  );
  const [wasteTypes, setWasteTypes] = useState<string[]>(
    initial?.wasteTypes ?? [],
  );
  const [bagCount, setBagCount] = useState(initial?.bagCount ?? 1);
  const [disposalId, setDisposalId] = useState(
    initial?.disposalWastePointId ?? "",
  );
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [error, setError] = useState<string | null>(null);
  const [warnDisposal, setWarnDisposal] = useState(false);

  const toggle = (value: string) => {
    setWasteTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleSubmit = () => {
    if (bagCount < 0 || !Number.isInteger(bagCount)) {
      setError("봉투 수는 0 이상의 정수여야 합니다.");
      return;
    }
    if (!disposalId) {
      setWarnDisposal(true);
    }
    const disposal = disposalOptions.find((item) => item.id === disposalId);
    onSubmit({
      type: "plogging",
      completedRoute,
      wasteTypes,
      bagCount,
      disposalWastePointId: disposalId || undefined,
      disposalWastePointName: disposal?.name,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
      <p className="text-sm font-semibold">플로깅 결과 기록</p>
      <p className="text-[11px] text-[var(--color-text-muted)]">
        아래 내용은 사용자가 직접 입력한 기록입니다.
      </p>

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium">코스 완료 여부</legend>
        <div className="flex gap-3 text-xs">
          <label className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              checked={completedRoute}
              onChange={() => setCompletedRoute(true)}
            />
            완료했어요
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="radio"
              checked={!completedRoute}
              onChange={() => setCompletedRoute(false)}
            />
            일부만 / 미완료
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium">수거한 쓰레기 종류</legend>
        <div className="flex flex-wrap gap-1.5">
          {PLOGGING_WASTE_OPTIONS.map((option) => {
            const checked = wasteTypes.includes(option);
            return (
              <label
                key={option}
                className={`rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ${
                  checked
                    ? "bg-emerald-50 text-emerald-900 ring-emerald-300"
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

      <div>
        <label htmlFor="bag-count" className="mb-1 block text-xs font-medium">
          대략적인 봉투 수
        </label>
        <input
          id="bag-count"
          type="number"
          min={0}
          step={1}
          value={bagCount}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "bag-count-error" : undefined}
          onChange={(event) => setBagCount(Number(event.target.value))}
          className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
        />
        {error ? (
          <p id="bag-count-error" className="mt-1 text-xs text-red-600">
            {error}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="disposal" className="mb-1 block text-xs font-medium">
          이용한 배출 장소
        </label>
        <select
          id="disposal"
          value={disposalId}
          onChange={(event) => {
            setDisposalId(event.target.value);
            setWarnDisposal(false);
          }}
          className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
        >
          <option value="">선택 안 함</option>
          {disposalOptions.map((point) => (
            <option key={point.id} value={point.id}>
              {point.name}
            </option>
          ))}
        </select>
        {warnDisposal || !disposalId ? (
          <p className="mt-1 text-[11px] text-amber-800">
            쓰레기 배출 장소가 기록되지 않았습니다. 수거한 쓰레기는 지정된
            방법으로 배출해주세요.
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="plogging-memo" className="mb-1 block text-xs font-medium">
          메모
        </label>
        <textarea
          id="plogging-memo"
          rows={2}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
        />
      </div>

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
