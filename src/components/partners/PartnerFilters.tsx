"use client";

import { useTranslations } from "@/context/LocaleContext";
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

const SERVICE_IDS: PartnerServiceFilter[] = [
  "all",
  "cleaning",
  "cooking",
  "outsideCatch",
  "seafoodSales",
];

const TYPE_IDS: PartnerType[] = ["market", "restaurant", "processingShop"];

const EXTRA_KEYS: Array<keyof PartnerFiltersProps["extraFilters"]> = [
  "outsideCatch",
  "cleaning",
  "cooking",
  "reservation",
];

export function PartnerFilters({
  serviceFilter,
  onServiceFilterChange,
  typeFilters,
  onToggleType,
  extraFilters,
  onToggleExtra,
}: PartnerFiltersProps) {
  const { t } = useTranslations();

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          {t("partner.serviceFilter")}
        </p>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={t("partner.serviceFilter")}
        >
          {SERVICE_IDS.map((id) => {
            const active = serviceFilter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onServiceFilterChange(id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                  active
                    ? "bg-[var(--color-ocean-600)] text-white ring-[var(--color-ocean-600)]"
                    : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                {t(`partner.service.${id}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          {t("partner.typeFilter")}
        </p>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={t("partner.typeFilter")}
        >
          {TYPE_IDS.map((id) => {
            const active = typeFilters.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleType(id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                  active
                    ? "bg-teal-700 text-white ring-teal-700"
                    : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                {t(`partner.type.${id}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          {t("partner.extraFilter")}
        </p>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={t("partner.extraFilter")}
        >
          {EXTRA_KEYS.map((key) => {
            const active = extraFilters[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleExtra(key)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] ${
                  active
                    ? "bg-violet-600 text-white ring-violet-600"
                    : "bg-white text-[var(--color-text-secondary)] ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                {t(`partner.service.${key}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
