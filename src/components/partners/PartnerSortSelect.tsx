"use client";

import { useTranslations } from "@/context/LocaleContext";
import type { PartnerSortOption } from "@/types/partner";

interface PartnerSortSelectProps {
  value: PartnerSortOption;
  onChange: (value: PartnerSortOption) => void;
  id?: string;
}

const OPTIONS: PartnerSortOption[] = [
  "distance",
  "name",
  "openFirst",
  "services",
];

export function PartnerSortSelect({
  value,
  onChange,
  id = "partner-sort",
}: PartnerSortSelectProps) {
  const { t } = useTranslations();

  const labelFor = (option: PartnerSortOption): string => {
    switch (option) {
      case "distance":
        return t("partner.sortDistance");
      case "name":
        return t("partner.sortName");
      case "openFirst":
        return t("partner.sortOpenFirst");
      case "services":
        return t("partner.sortServices");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)]"
      >
        {t("partner.sortBy")}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as PartnerSortOption)}
        className="h-8 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2 text-xs text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {labelFor(option)}
          </option>
        ))}
      </select>
    </div>
  );
}
