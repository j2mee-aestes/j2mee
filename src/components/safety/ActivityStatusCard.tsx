"use client";

import { Card } from "@/components/common/Card";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import { parseActivityReason } from "@/lib/safety/evaluateActivityStatus";
import type { ActivityEvaluation } from "@/types/fishing";
import { useState } from "react";

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
  const { t, locale } = useTranslations();
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
      <p className={`text-sm font-bold ${style.text}`}>
        {t(`safety.status.${evaluation.status}`)}
      </p>
      <ul className="mt-2 space-y-1">
        {visibleReasons.map((raw) => {
          const reason = parseActivityReason(raw);
          const values = reason.values
            ? Object.fromEntries(
                Object.entries(reason.values).map(([key, value]) => [
                  key,
                  typeof value === "string"
                    ? localizePlaceText(value, locale)
                    : value,
                ]),
              )
            : undefined;
          return (
            <li
              key={raw}
              className="text-xs leading-relaxed text-[var(--color-text-secondary)]"
            >
              · {t(reason.key, values)}
            </li>
          );
        })}
      </ul>
      {hiddenCount > 0 || expanded ? (
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-[var(--color-ocean-700)]"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded
            ? t("common.collapse")
            : t("common.showMoreCount", { count: hiddenCount })}
        </button>
      ) : null}
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
        {t("safety.disclaimer")}
      </p>
    </Card>
  );
}
