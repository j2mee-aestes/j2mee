"use client";

import type { PartnerSortOption } from "@/types/partner";

interface PartnerSortSelectProps {
  value: PartnerSortOption;
  onChange: (value: PartnerSortOption) => void;
  id?: string;
}

const OPTIONS: Array<{ value: PartnerSortOption; label: string }> = [
  { value: "distance", label: "거리순" },
  { value: "name", label: "이름순" },
  { value: "openFirst", label: "현재 영업 중 우선" },
  { value: "services", label: "서비스 많은 순" },
];

export function PartnerSortSelect({
  value,
  onChange,
  id = "partner-sort",
}: PartnerSortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)]"
      >
        정렬
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as PartnerSortOption)}
        className="h-8 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2 text-xs text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
