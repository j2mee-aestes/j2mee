"use client";

import type { ActivityExecutionItem } from "@/types/activity";
import { SCHEDULE_TYPE_LABELS } from "@/constants/scheduleDefaults";
import { Check, Circle, Minus, Play } from "lucide-react";

const STATUS_UI = {
  notStarted: {
    label: "대기",
    className: "border-slate-200 bg-white text-slate-700",
    Icon: Circle,
  },
  inProgress: {
    label: "진행 중",
    className: "border-sky-300 bg-sky-50 text-sky-900",
    Icon: Play,
  },
  completed: {
    label: "완료",
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    Icon: Check,
  },
  skipped: {
    label: "건너뜀",
    className: "border-slate-200 bg-slate-50 text-slate-500 opacity-70",
    Icon: Minus,
  },
} as const;

type Props = {
  item: ActivityExecutionItem;
  onSelect?: () => void;
};

export function ActivityItemCard({ item, onSelect }: Props) {
  const ui = STATUS_UI[item.status];
  const Icon = ui.Icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm ${ui.className}`}
      aria-label={`${item.order}. ${item.title}, ${ui.label}`}
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/80 text-xs font-bold">
        {item.order}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {ui.label} · {SCHEDULE_TYPE_LABELS[item.type]}
        </span>
        <span className="mt-0.5 block truncate text-sm font-semibold">
          {item.title}
        </span>
        <span className="mt-0.5 block text-xs opacity-80">
          {item.plannedStartTime ?? "—"}
          {item.plannedEndTime ? `–${item.plannedEndTime}` : ""}
        </span>
      </span>
    </button>
  );
}
