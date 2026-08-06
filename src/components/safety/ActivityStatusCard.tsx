"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import type { ActivityEvaluation } from "@/types/fishing";

interface ActivityStatusCardProps {
  evaluation: ActivityEvaluation;
  className?: string;
}

const STATUS_STYLES: Record<
  ActivityEvaluation["status"],
  { bg: string; border: string; text: string }
> = {
  normal: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
  },
  caution: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
  },
  notRecommended: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-900",
  },
  restricted: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
  },
  unknown: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
  },
};

export function ActivityStatusCard({
  evaluation,
  className = "",
}: ActivityStatusCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = STATUS_STYLES[evaluation.status];
  const visibleReasons = expanded
    ? evaluation.reasons
    : evaluation.reasons.slice(0, 3);
  const hiddenCount = evaluation.reasons.length - visibleReasons.length;

  return (
    <Card
      className={`border ${style.border} ${style.bg} p-4 shadow-none ${className}`}
    >
      <p className={`text-sm font-bold ${style.text}`}>{evaluation.label}</p>
      <ul className="mt-2 space-y-1">
        {visibleReasons.map((reason) => (
          <li
            key={reason}
            className="text-xs leading-relaxed text-[var(--color-text-secondary)]"
          >
            · {reason}
          </li>
        ))}
      </ul>
      {hiddenCount > 0 || expanded ? (
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-[var(--color-ocean-700)]"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "접기" : `나머지 ${hiddenCount}개 보기`}
        </button>
      ) : null}
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
        공개된 예보와 등록된 장소정보를 바탕으로 한 참고 정보입니다. 현장 통제와
        기상특보를 우선 확인해주세요.
      </p>
    </Card>
  );
}
