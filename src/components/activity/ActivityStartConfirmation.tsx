"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import type { ScheduleWarning } from "@/types/schedule";
import { useEffect, useId, useRef } from "react";

interface ActivityStartConfirmationProps {
  open: boolean;
  title: string;
  date: string;
  canStart: boolean;
  blocking: ScheduleWarning[];
  warnings: ScheduleWarning[];
  info: ScheduleWarning[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ActivityStartConfirmation({
  open,
  title,
  date,
  canStart,
  blocking,
  warnings,
  info,
  onConfirm,
  onCancel,
}: ActivityStartConfirmationProps) {
  const { t } = useTranslations();
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(() => confirmRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-base font-bold">
          {t("schedule.startConfirmTitle")}
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {title} · {date}
        </p>
        <p className="mt-3 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          {t("schedule.startConfirmBody")}
        </p>

        {[...blocking, ...warnings, ...info].length > 0 ? (
          <ul className="mt-3 space-y-2">
            {[...blocking, ...warnings, ...info].map((warning) => (
              <li
                key={warning.id}
                className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs ${
                  warning.severity === "danger"
                    ? "border-red-200 bg-red-50 text-red-900"
                    : warning.severity === "warning"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-sky-200 bg-sky-50 text-sky-900"
                }`}
              >
                <p className="font-semibold">{warning.title}</p>
                <p className="mt-0.5">{warning.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            {t("schedule.noWarnings")}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <TextButton variant="ghost" className="w-full" onClick={onCancel}>
            {t("common.cancel")}
          </TextButton>
          <button
            ref={confirmRef}
            type="button"
            disabled={!canStart}
            onClick={onConfirm}
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("schedule.startConfirmAction")}
          </button>
        </div>
      </div>
    </div>
  );
}
