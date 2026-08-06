"use client";

import { Card } from "@/components/common/Card";
import { TideChart } from "@/components/tide/TideChart";
import { TideTimeItem } from "@/components/tide/TideTimeItem";
import { UI_TEXT } from "@/constants/uiText";
import type { TideDaySummary } from "@/types/fishing";

interface TideSummaryProps {
  tide: TideDaySummary;
  highlighted?: boolean;
  className?: string;
}

export function TideSummary({
  tide,
  highlighted = false,
  className = "",
}: TideSummaryProps) {
  return (
    <Card
      as="section"
      className={`scroll-mt-24 p-4 transition-shadow ${
        highlighted
          ? "ring-2 ring-[var(--color-ocean-400)] shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
          : ""
      } ${className}`}
      id="tide-summary-card"
    >
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            {UI_TEXT.todayTide}
          </h3>
          <p className="mt-1 text-lg font-bold text-[var(--color-ocean-700)]">
            {tide.mul}
          </p>
        </div>
        <div className="rounded-full bg-[var(--color-teal-50)] px-2.5 py-1 text-xs font-semibold text-[var(--color-teal-700)]">
          {UI_TEXT.tideStatus}: {tide.status}
        </div>
      </div>

      <TideChart
        points={tide.chartPoints}
        currentTimeLabel={tide.currentTimeLabel}
        className="mb-3"
      />

      <ul className="grid grid-cols-2 gap-2">
        {tide.times.map((item) => (
          <TideTimeItem key={`${item.type}-${item.time}`} tide={item} />
        ))}
      </ul>
    </Card>
  );
}
