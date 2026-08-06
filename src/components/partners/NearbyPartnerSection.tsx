"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { TextButton } from "@/components/common/IconButton";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { PartnerFilters } from "@/components/partners/PartnerFilters";
import { PartnerSortSelect } from "@/components/partners/PartnerSortSelect";
import {
  DEFAULT_NEARBY_LIMIT,
  DEFAULT_NEARBY_RADIUS_KM,
  EXPANDED_NEARBY_RADIUS_KM,
} from "@/constants/partners";
import { useTranslations } from "@/context/LocaleContext";
import { formatLocaleDistanceKm } from "@/lib/i18n/formatDistance";
import { findNearbyPartners } from "@/lib/partners/findNearbyPartners";
import { getAllPartners } from "@/lib/partners/partnerRepository";
import type { Coordinates } from "@/types/map";
import type {
  NearbyPartnerResult,
  PartnerServiceFilter,
  PartnerSortOption,
  PartnerType,
} from "@/types/partner";
import { Store } from "lucide-react";
import { useMemo, useState } from "react";

interface NearbyPartnerSectionProps {
  origin: Coordinates;
  originName: string;
  selectedPartnerId: string | null;
  schedulePartnerIds: string[];
  onSelectPartner: (partnerId: string) => void;
  onAddToSchedule: (partnerId: string) => void;
  loadError?: boolean;
  className?: string;
}

type ExtraFilters = {
  outsideCatch: boolean;
  cleaning: boolean;
  cooking: boolean;
  reservation: boolean;
};

function applyExtraFilters(
  results: NearbyPartnerResult[],
  extra: ExtraFilters,
): NearbyPartnerResult[] {
  return results.filter(({ partner }) => {
    if (extra.outsideCatch) {
      const status = partner.catchPolicy?.acceptanceStatus;
      const ok =
        partner.services.outsideCatchAccepted ||
        status === "accepted" ||
        status === "conditional";
      if (!ok) {
        return false;
      }
    }
    if (extra.cleaning && !partner.services.catchCleaning) {
      return false;
    }
    if (extra.cooking && !partner.services.catchCooking) {
      return false;
    }
    if (extra.reservation && !partner.services.reservationAvailable) {
      return false;
    }
    return true;
  });
}

export function NearbyPartnerSection({
  origin,
  originName,
  selectedPartnerId,
  schedulePartnerIds,
  onSelectPartner,
  onAddToSchedule,
  loadError = false,
  className = "",
}: NearbyPartnerSectionProps) {
  const { t, locale } = useTranslations();
  const [radiusKm, setRadiusKm] = useState(DEFAULT_NEARBY_RADIUS_KM);
  const [serviceFilter, setServiceFilter] =
    useState<PartnerServiceFilter>("all");
  const [typeFilters, setTypeFilters] = useState<PartnerType[]>([]);
  const [sortBy, setSortBy] = useState<PartnerSortOption>("distance");
  const [extraFilters, setExtraFilters] = useState<ExtraFilters>({
    outsideCatch: false,
    cleaning: false,
    cooking: false,
    reservation: false,
  });
  const [showAll, setShowAll] = useState(false);

  const partners = useMemo(() => getAllPartners(), []);

  const nearbyAll = useMemo(
    () =>
      findNearbyPartners({
        origin,
        partners,
        radiusKm,
        services: serviceFilter,
        types: typeFilters.length > 0 ? typeFilters : undefined,
        sortBy,
      }),
    [origin, partners, radiusKm, serviceFilter, typeFilters, sortBy],
  );

  const filtered = useMemo(
    () => applyExtraFilters(nearbyAll, extraFilters),
    [nearbyAll, extraFilters],
  );

  const visible = showAll ? filtered : filtered.slice(0, DEFAULT_NEARBY_LIMIT);

  const hasActiveExtra =
    extraFilters.outsideCatch ||
    extraFilters.cleaning ||
    extraFilters.cooking ||
    extraFilters.reservation ||
    serviceFilter !== "all" ||
    typeFilters.length > 0;

  if (loadError) {
    return (
      <EmptyState
        title={t("partner.loadError")}
        description={t("partner.loadErrorHint")}
        className={className}
      />
    );
  }

  return (
    <Card className={`flex flex-col gap-3 p-4 ${className}`}>
      <div>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {t("partner.nearbyTitle")}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
          {t("partner.nearbyHint")}
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
          {t("partner.distanceHint", {
            origin: originName,
            radius: formatLocaleDistanceKm(radiusKm, locale),
          })}
        </p>
      </div>

      <PartnerFilters
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        typeFilters={typeFilters}
        onToggleType={(type) =>
          setTypeFilters((prev) =>
            prev.includes(type)
              ? prev.filter((item) => item !== type)
              : [...prev, type],
          )
        }
        extraFilters={extraFilters}
        onToggleExtra={(key) =>
          setExtraFilters((prev) => ({ ...prev, [key]: !prev[key] }))
        }
      />

      <PartnerSortSelect value={sortBy} onChange={setSortBy} />

      {filtered.length === 0 ? (
        <EmptyState
          title={
            hasActiveExtra
              ? t("partner.emptyFiltered")
              : t("partner.emptyNearby")
          }
          description={
            hasActiveExtra
              ? t("partner.changeFilters")
              : radiusKm < EXPANDED_NEARBY_RADIUS_KM
                ? t("partner.expandRadiusHint")
                : undefined
          }
          icon={<Store className="h-5 w-5" />}
          className="py-6 shadow-none"
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((result) => (
            <li key={result.partner.id}>
              <PartnerCard
                result={result}
                selected={selectedPartnerId === result.partner.id}
                onSelect={onSelectPartner}
                onAddToSchedule={onAddToSchedule}
                scheduleAdded={schedulePartnerIds.includes(result.partner.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {filtered.length > DEFAULT_NEARBY_LIMIT && !showAll ? (
          <TextButton
            variant="secondary"
            className="h-8 text-xs"
            onClick={() => setShowAll(true)}
          >
            {t("partner.showMoreRemaining", {
              count: filtered.length - DEFAULT_NEARBY_LIMIT,
            })}
          </TextButton>
        ) : null}
        {radiusKm < EXPANDED_NEARBY_RADIUS_KM ? (
          <TextButton
            variant="ghost"
            className="h-8 text-xs"
            onClick={() => {
              setRadiusKm(EXPANDED_NEARBY_RADIUS_KM);
              setShowAll(false);
            }}
          >
            {t("partner.expandToRadius", {
              radius: EXPANDED_NEARBY_RADIUS_KM,
            })}
          </TextButton>
        ) : null}
      </div>
    </Card>
  );
}
