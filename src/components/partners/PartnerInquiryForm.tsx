"use client";

import { TextButton } from "@/components/common/IconButton";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { PartnerInquiryDraft } from "@/types/partner";

const SERVICE_CHOICES = [
  { id: "cleaningOnly", label: "손질만" },
  { id: "sashimi", label: "회" },
  { id: "grill", label: "구이" },
  { id: "soup", label: "탕" },
  { id: "other", label: "기타 조리" },
] as const;

interface PartnerInquiryFormProps {
  partnerName: string;
  open: boolean;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof PartnerInquiryDraft | "services", string>>;

const EMPTY_DRAFT: PartnerInquiryDraft = {
  visitDate: "",
  visitTime: "",
  partySize: 2,
  catchSpecies: "",
  estimatedWeightKg: "",
  requestedServices: [],
  notes: "",
};

function PartnerInquiryDialog({
  partnerName,
  onClose,
}: {
  partnerName: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<PartnerInquiryDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!draft.visitDate) {
      next.visitDate = "방문 예정일을 입력해주세요.";
    }
    if (!draft.visitTime) {
      next.visitTime = "방문 예정시간을 입력해주세요.";
    }
    if (!draft.partySize || draft.partySize < 1) {
      next.partySize = "이용 인원을 1명 이상 입력해주세요.";
    }
    if (!draft.catchSpecies.trim()) {
      next.catchSpecies = "잡은 어종을 입력해주세요.";
    }
    if (!draft.estimatedWeightKg.trim()) {
      next.estimatedWeightKg = "예상 수량 또는 무게를 입력해주세요.";
    }
    if (draft.requestedServices.length === 0) {
      next.services = "원하는 서비스를 하나 이상 선택해주세요.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setSubmitted(true);
  };

  const toggleService = (id: string) => {
    setDraft((prev) => {
      const exists = prev.requestedServices.includes(id);
      return {
        ...prev,
        requestedServices: exists
          ? prev.requestedServices.filter((item) => item !== id)
          : [...prev.requestedServices, id],
      };
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h2
              id={titleId}
              className="text-base font-bold text-[var(--color-text-primary)]"
            >
              이용 문의하기
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {partnerName}
            </p>
          </div>
          <TextButton variant="ghost" className="h-8 px-2 text-xs" onClick={onClose}>
            닫기
          </TextButton>
        </div>

        {submitted ? (
          <div className="space-y-3" role="status">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              이용 문의 내용이 준비되었습니다.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              현재 단계에서는 실제 점포로 전송되지 않습니다.
              예약이 확정된 것이 아니니, 방문 전 점포에 직접 문의해주세요.
            </p>
            <ul className="space-y-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3 text-xs text-[var(--color-text-secondary)]">
              <li>
                방문 예정: {draft.visitDate} {draft.visitTime}
              </li>
              <li>인원: {draft.partySize}명</li>
              <li>어종: {draft.catchSpecies}</li>
              <li>수량/무게: {draft.estimatedWeightKg}</li>
              <li>
                서비스:{" "}
                {draft.requestedServices
                  .map(
                    (id) =>
                      SERVICE_CHOICES.find((item) => item.id === id)?.label ??
                      id,
                  )
                  .join(", ")}
              </li>
            </ul>
            <TextButton variant="primary" className="w-full" onClick={onClose}>
              확인
            </TextButton>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-900">
              이 양식은 문의 초안을 정리하기 위한 것이며, 실제 예약·접수가
              아닙니다.
            </p>

            <div>
              <label
                htmlFor="inquiry-date"
                className="mb-1 block text-xs font-medium text-[var(--color-text-primary)]"
              >
                방문 예정일
              </label>
              <input
                ref={firstFieldRef}
                id="inquiry-date"
                type="date"
                value={draft.visitDate}
                aria-invalid={Boolean(errors.visitDate)}
                aria-describedby={
                  errors.visitDate ? "inquiry-date-error" : undefined
                }
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    visitDate: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              />
              {errors.visitDate ? (
                <p id="inquiry-date-error" className="mt-1 text-xs text-red-600">
                  {errors.visitDate}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="inquiry-time"
                className="mb-1 block text-xs font-medium text-[var(--color-text-primary)]"
              >
                방문 예정시간
              </label>
              <input
                id="inquiry-time"
                type="time"
                value={draft.visitTime}
                aria-invalid={Boolean(errors.visitTime)}
                aria-describedby={
                  errors.visitTime ? "inquiry-time-error" : undefined
                }
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    visitTime: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              />
              {errors.visitTime ? (
                <p id="inquiry-time-error" className="mt-1 text-xs text-red-600">
                  {errors.visitTime}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="inquiry-party"
                className="mb-1 block text-xs font-medium text-[var(--color-text-primary)]"
              >
                이용 인원
              </label>
              <input
                id="inquiry-party"
                type="number"
                min={1}
                value={draft.partySize}
                aria-invalid={Boolean(errors.partySize)}
                aria-describedby={
                  errors.partySize ? "inquiry-party-error" : undefined
                }
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    partySize: Number(event.target.value),
                  }))
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              />
              {errors.partySize ? (
                <p id="inquiry-party-error" className="mt-1 text-xs text-red-600">
                  {errors.partySize}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="inquiry-species"
                className="mb-1 block text-xs font-medium text-[var(--color-text-primary)]"
              >
                잡은 어종
              </label>
              <input
                id="inquiry-species"
                type="text"
                value={draft.catchSpecies}
                aria-invalid={Boolean(errors.catchSpecies)}
                aria-describedby={
                  errors.catchSpecies ? "inquiry-species-error" : undefined
                }
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    catchSpecies: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              />
              {errors.catchSpecies ? (
                <p
                  id="inquiry-species-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.catchSpecies}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="inquiry-weight"
                className="mb-1 block text-xs font-medium text-[var(--color-text-primary)]"
              >
                예상 수량 또는 무게
              </label>
              <input
                id="inquiry-weight"
                type="text"
                placeholder="예: 2kg / 3마리"
                value={draft.estimatedWeightKg}
                aria-invalid={Boolean(errors.estimatedWeightKg)}
                aria-describedby={
                  errors.estimatedWeightKg ? "inquiry-weight-error" : undefined
                }
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    estimatedWeightKg: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              />
              {errors.estimatedWeightKg ? (
                <p
                  id="inquiry-weight-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.estimatedWeightKg}
                </p>
              ) : null}
            </div>

            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-[var(--color-text-primary)]">
                원하는 서비스
              </legend>
              <div className="flex flex-wrap gap-2">
                {SERVICE_CHOICES.map((choice) => {
                  const checked = draft.requestedServices.includes(choice.id);
                  return (
                    <label
                      key={choice.id}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ${
                        checked
                          ? "bg-[var(--color-ocean-50)] text-[var(--color-ocean-800)] ring-[var(--color-ocean-300)]"
                          : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleService(choice.id)}
                      />
                      {choice.label}
                    </label>
                  );
                })}
              </div>
              {errors.services ? (
                <p
                  id="inquiry-services-error"
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                >
                  {errors.services}
                </p>
              ) : null}
            </fieldset>

            <div>
              <label
                htmlFor="inquiry-notes"
                className="mb-1 block text-xs font-medium text-[var(--color-text-primary)]"
              >
                요청사항
              </label>
              <textarea
                id="inquiry-notes"
                rows={3}
                value={draft.notes}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, notes: event.target.value }))
                }
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
              />
            </div>

            <TextButton type="submit" variant="primary" className="w-full">
              문의 내용 확인
            </TextButton>
          </form>
        )}
      </div>
    </div>
  );
}

export function PartnerInquiryForm({
  partnerName,
  open,
  onClose,
}: PartnerInquiryFormProps) {
  if (!open) {
    return null;
  }

  return (
    <PartnerInquiryDialog
      key={partnerName}
      partnerName={partnerName}
      onClose={onClose}
    />
  );
}
