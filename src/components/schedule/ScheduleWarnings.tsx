"use client";

import type { ScheduleWarning } from "@/types/schedule";

interface ScheduleWarningsProps {
  warnings: ScheduleWarning[];
}

export function ScheduleWarnings({ warnings }: ScheduleWarningsProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <section aria-label="일정 경고" className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
        일정 안내·경고
      </h3>
      <ul className="space-y-2" role="list">
        {warnings.map((warning) => (
          <li
            key={warning.id}
            role="status"
            className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs ${
              warning.severity === "danger"
                ? "border-red-200 bg-red-50 text-red-900"
                : warning.severity === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-sky-200 bg-sky-50 text-sky-900"
            }`}
          >
            <p className="font-semibold">
              [{warning.severity}] {warning.title}
            </p>
            <p className="mt-0.5">{warning.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
