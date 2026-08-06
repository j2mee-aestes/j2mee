"use client";

import type { PartnerServiceFilter, PartnerType } from "@/types/partner";

interface PartnerFiltersProps {
  serviceFilter: PartnerServiceFilter;
  onServiceFilterChange: (filter: PartnerServiceFilter) => void;
  typeFilters: PartnerType[];
  onToggleType: (type: PartnerType) => void;
  extraFilters: {
    outsideCatch: boolean;
    cleaning: boolean;
    cooking: boolean;
    reservation: boolean;
  };
  onToggleExtra: (key: keyof PartnerFiltersProps["extraFilters"]) => void;
}

const SERVICE_OPTIONS: Array<{ id: PartnerServiceFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "cleaning", label: "손질 가능" },
  { id: "cooking", label: "조리 가능" },
  { id: "outsideCatch", label: "외부 수산물 접수 가능" },
  { id: "seafoodSales", label: "수산물 구매 가능" },
];

const TYPE_OPTIONS: Array<{ id: PartnerType; label: string }> = [
  { id: "market", label: "수산시장" },
  { id: "restaurant", label: "식당" },
  { id: "processingShop", label: "손질 전문점" },
];

const EXTRA_OPTIONS: Array<{
  key: keyof PartnerFiltersProps["extraFilters"];
  label: string;
}> = [
  { key: "outsideCatch", label: "외부 수산물 접수 가능" },
  { key: "cleaning", label: "손질 가능" },
  { key: "cooking", label: "조리 가능" },
  { key: "reservation", label: "예약 가능" },
];

export function PartnerFilters({
  serviceFilter,
  onServiceFilterChange,
  typeFilters,
  onToggleType,
  extraFilters,
  onToggleExtra,
}: PartnerFiltersProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          서비스
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="서비스 필터">
          {SERVICE_OPTIONS.map((option) => {
            const active = serviceFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onServiceFilterChange(option.id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                  active
                    ? "bg-[var(--color-ocean-600)] text-white ring-[var(--color-ocean-600)]"
                    : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          장소 유형
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="장소 유형 필터">
          {TYPE_OPTIONS.map((option) => {
            const active = typeFilters.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleType(option.id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                  active
                    ? "bg-teal-700 text-white ring-teal-700"
                    : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          추가 조건
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="추가 조건 필터">
          {EXTRA_OPTIONS.map((option) => {
            const active = extraFilters[option.key];
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleExtra(option.key)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                  active
                    ? "bg-violet-600 text-white ring-violet-600"
                    : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
