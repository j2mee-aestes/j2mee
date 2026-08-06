"use client";

import { TextButton } from "@/components/common/IconButton";
import {
  LOCATION_REPORT_TYPE_LABELS,
} from "@/constants/environmentData";
import type { LocationReportDraft, LocationReportType } from "@/types/environment";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

interface LocationReportFormProps {
  open: boolean;
  onClose: () => void;
  targetType: "wastePoint" | "ploggingRoute";
  targetId: string;
  targetName: string;
}

const REPORT_TYPES = Object.keys(
  LOCATION_REPORT_TYPE_LABELS,
) as LocationReportType[];

export function LocationReportForm({
  open,
  onClose,
  targetType,
  targetId,
  targetName,
}: LocationReportFormProps) {
  if (!open) {
    return null;
  }

  return (
    <LocationReportDialog
      key={`${targetType}-${targetId}`}
      onClose={onClose}
      targetType={targetType}
      targetId={targetId}
      targetName={targetName}
    />
  );
}

function LocationReportDialog({
  onClose,
  targetType,
  targetId,
  targetName,
}: Omit<LocationReportFormProps, "open">) {
  const titleId = useId();
  const firstRef = useRef<HTMLSelectElement>(null);
  const [reportType, setReportType] =
    useState<LocationReportType>("wrongLocation");
  const [description, setDescription] = useState("");
  const [observedDate, setObservedDate] = useState("");
  const [photoName, setPhotoName] = useState<string | undefined>();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState<LocationReportDraft | null>(
    null,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => firstRef.current?.focus(), 50);
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<string, string>> = {};
    if (!description.trim()) {
      next.description = "간단한 설명을 입력해주세요.";
    }
    if (!observedDate) {
      next.observedDate = "확인한 날짜를 선택해주세요.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      return;
    }

    const draft: LocationReportDraft = {
      targetType,
      targetId,
      targetName,
      reportType,
      description: description.trim(),
      observedDate,
      photoName,
    };

    try {
      const existing = JSON.parse(
        window.localStorage.getItem("padopado-location-reports") ?? "[]",
      ) as LocationReportDraft[];
      existing.push(draft);
      window.localStorage.setItem(
        "padopado-location-reports",
        JSON.stringify(existing),
      );
    } catch {
      // localStorage may be unavailable; still show confirmation.
    }

    setSavedDraft(draft);
    setSubmitted(true);
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
              위치 오류 신고
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {targetName}
            </p>
          </div>
          <TextButton variant="ghost" className="h-8 px-2 text-xs" onClick={onClose}>
            닫기
          </TextButton>
        </div>

        {submitted && savedDraft ? (
          <div className="space-y-3" role="status">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              신고 내용이 임시로 저장되었습니다.
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              현재 단계에서는 운영자에게 실제 전송되지 않습니다.
            </p>
            <ul className="space-y-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3 text-xs">
              <li>유형: {LOCATION_REPORT_TYPE_LABELS[savedDraft.reportType]}</li>
              <li>확인일: {savedDraft.observedDate}</li>
              <li>설명: {savedDraft.description}</li>
            </ul>
            <TextButton variant="primary" className="w-full" onClick={onClose}>
              확인
            </TextButton>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="report-type"
                className="mb-1 block text-xs font-medium"
              >
                신고 유형
              </label>
              <select
                ref={firstRef}
                id="report-type"
                value={reportType}
                onChange={(event) =>
                  setReportType(event.target.value as LocationReportType)
                }
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              >
                {REPORT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {LOCATION_REPORT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report-description"
                className="mb-1 block text-xs font-medium"
              >
                간단한 설명
              </label>
              <textarea
                id="report-description"
                rows={3}
                value={description}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "report-description-error" : undefined
                }
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
              />
              {errors.description ? (
                <p
                  id="report-description-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {errors.description}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="report-date"
                className="mb-1 block text-xs font-medium"
              >
                확인한 날짜
              </label>
              <input
                id="report-date"
                type="date"
                value={observedDate}
                aria-invalid={Boolean(errors.observedDate)}
                aria-describedby={
                  errors.observedDate ? "report-date-error" : undefined
                }
                onChange={(event) => setObservedDate(event.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              />
              {errors.observedDate ? (
                <p id="report-date-error" className="mt-1 text-xs text-red-600">
                  {errors.observedDate}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="report-photo"
                className="mb-1 block text-xs font-medium"
              >
                사진 첨부 (선택, 업로드되지 않음)
              </label>
              <input
                id="report-photo"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPhotoName(file?.name);
                }}
                className="block w-full text-xs"
              />
              {photoName ? (
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                  선택됨: {photoName} (로컬 미리보기만, 서버 업로드 없음)
                </p>
              ) : null}
            </div>

            <TextButton type="submit" variant="primary" className="w-full">
              신고 내용 저장
            </TextButton>
          </form>
        )}
      </div>
    </div>
  );
}
