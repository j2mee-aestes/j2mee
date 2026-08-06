"use client";

import type { LanguageCode } from "@/constants/languages";
import { t } from "@/constants/uiText";
import type { TideTime } from "@/types/fishing";

interface TideSummaryProps {
  language: LanguageCode;
  tides: TideTime[];
  className?: string;
}

export function TideSummary({ language, tides, className = "" }: TideSummaryProps) {
  return (
    <div className={className}>
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
        {t(language, "todayTide")}
      </h3>
      <ul className="grid grid-cols-2 gap-2">
        {tides.map((tide) => (
          <li
            key={`${tide.type}-${tide.time}`}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-2"
          >
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">
              {tide.type === "high"
                ? t(language, "highTide")
                : t(language, "lowTide")}
            </p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {tide.time}
              {tide.height !== undefined ? (
                <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                  {tide.height}cm
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
