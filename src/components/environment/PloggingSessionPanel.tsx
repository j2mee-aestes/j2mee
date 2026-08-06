"use client";

import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import type { PloggingSession, PloggingSessionStatus } from "@/types/environment";
import type { PloggingRoute, WastePoint } from "@/types/environment";
import { useId, useState, type FormEvent } from "react";

interface PloggingSessionPanelProps {
  route: PloggingRoute;
  session: PloggingSession;
  connectedWastePoints: WastePoint[];
  onStart: () => void;
  onCancel: () => void;
  onComplete: (payload: {
    collectedWasteTypes: string[];
    bagCount: number;
    disposalWastePointId?: string;
    memo: string;
  }) => void;
}

const WASTE_CHOICES = [
  "일반 쓰레기",
  "재활용",
  "폐낚싯줄",
  "폐어구",
  "기타",
];

export function PloggingSessionPanel({
  route,
  session,
  connectedWastePoints,
  onStart,
  onCancel,
  onComplete,
}: PloggingSessionPanelProps) {
  const formId = useId();
  const [collected, setCollected] = useState<string[]>([]);
  const [bagCount, setBagCount] = useState(1);
  const [disposalId, setDisposalId] = useState(
    connectedWastePoints[0]?.id ?? "",
  );
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const statusLabel = statusText(session.status);

  const handleCompleteSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<string, string>> = {};
    if (collected.length === 0) {
      next.collected = "수거한 쓰레기 종류를 하나 이상 선택해주세요.";
    }
    if (!bagCount || bagCount < 1) {
      next.bagCount = "봉투 수를 1개 이상 입력해주세요.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      return;
    }
    onComplete({
      collectedWasteTypes: collected,
      bagCount,
      disposalWastePointId: disposalId || undefined,
      memo,
    });
  };

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          플로깅 활동
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]" role="status" aria-live="polite">
          상태: {statusLabel} · {route.name}
        </p>
      </div>

      {session.status === "notStarted" ? (
        <div className="space-y-2">
          <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            주변 안전과 현장 통제 안내를 먼저 확인해주세요.
            위험한 구간이나 해안 아래로 진입하지 마세요.
          </p>
          <TextButton variant="primary" className="w-full" onClick={onStart}>
            플로깅 시작
          </TextButton>
        </div>
      ) : null}

      {session.status === "inProgress" ? (
        <form
          id={formId}
          className="space-y-3"
          onSubmit={handleCompleteSubmit}
          noValidate
        >
          <p className="text-xs font-medium text-teal-800" role="status">
            플로깅 진행 중입니다. GPS 추적은 하지 않습니다.
          </p>

          <fieldset>
            <legend className="mb-1.5 text-xs font-medium">
              수거한 쓰레기 종류
            </legend>
            <div className="flex flex-wrap gap-2">
              {WASTE_CHOICES.map((item) => {
                const checked = collected.includes(item);
                return (
                  <label
                    key={item}
                    className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ${
                      checked
                        ? "bg-teal-50 text-teal-900 ring-teal-300"
                        : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        setCollected((prev) =>
                          checked
                            ? prev.filter((value) => value !== item)
                            : [...prev, item],
                        )
                      }
                    />
                    {item}
                  </label>
                );
              })}
            </div>
            {errors.collected ? (
              <p className="mt-1 text-xs text-red-600">{errors.collected}</p>
            ) : null}
          </fieldset>

          <div>
            <label htmlFor={`${formId}-bags`} className="mb-1 block text-xs font-medium">
              대략적인 봉투 수
            </label>
            <input
              id={`${formId}-bags`}
              type="number"
              min={1}
              value={bagCount}
              aria-invalid={Boolean(errors.bagCount)}
              onChange={(event) => setBagCount(Number(event.target.value))}
              className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
            />
            {errors.bagCount ? (
              <p className="mt-1 text-xs text-red-600">{errors.bagCount}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={`${formId}-disposal`}
              className="mb-1 block text-xs font-medium"
            >
              이용한 배출 장소
            </label>
            <select
              id={`${formId}-disposal`}
              value={disposalId}
              onChange={(event) => setDisposalId(event.target.value)}
              className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
            >
              <option value="">선택 안 함</option>
              {connectedWastePoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${formId}-memo`} className="mb-1 block text-xs font-medium">
              간단한 메모
            </label>
            <textarea
              id={`${formId}-memo`}
              rows={2}
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <TextButton type="submit" variant="primary" className="flex-1">
              플로깅 완료
            </TextButton>
            <TextButton type="button" variant="ghost" className="flex-1" onClick={onCancel}>
              취소
            </TextButton>
          </div>
        </form>
      ) : null}
    </Card>
  );
}

function statusText(status: PloggingSessionStatus): string {
  switch (status) {
    case "inProgress":
      return "진행 중";
    case "completed":
      return "완료";
    default:
      return "시작 전";
  }
}
