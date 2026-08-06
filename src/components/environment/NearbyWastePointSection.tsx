"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { TextButton } from "@/components/common/IconButton";
import { WastePointCard } from "@/components/environment/WastePointCard";
import { WastePointFilters } from "@/components/environment/WastePointFilters";
import {
  DEFAULT_NEARBY_WASTE_LIMIT,
  DEFAULT_WASTE_SEARCH_RADIUS_KM,
  EXPANDED_WASTE_SEARCH_RADIUS_KM,
} from "@/constants/environmentData";
import { useTranslations } from "@/context/LocaleContext";
import { findNearbyWastePoints } from "@/lib/environment/findNearbyWastePoints";
import { formatLocaleDistanceKm } from "@/lib/i18n/formatDistance";
import { getAllWastePoints } from "@/lib/environment/wastePointRepository";
import type { Coordinates } from "@/types/map";
import type { WastePointType } from "@/types/environment";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

interface NearbyWastePointSectionProps {
  origin: Coordinates;
  originName: string;
  selectedWastePointId: string | null;
  onSelectWastePoint: (id: string) => void;
  className?: string;
}

export function NearbyWastePointSection({
  origin,
  originName,
  selectedWastePointId,
  onSelectWastePoint,
  className = "",
}: NearbyWastePointSectionProps) {
  const { t, locale } = useTranslations();
  const [radiusKm, setRadiusKm] = useState(DEFAULT_WASTE_SEARCH_RADIUS_KM);
  const [typeFilter, setTypeFilter] = useState<"all" | WastePointType>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const wastePoints = useMemo(() => getAllWastePoints(), []);

  const nearby = useMemo(
    () =>
      findNearbyWastePoints({
        origin,
        wastePoints,
        radiusKm,
        types: typeFilter === "all" ? undefined : [typeFilter],
        availableOnly,
      }),
    [origin, wastePoints, radiusKm, typeFilter, availableOnly],
  );

  const visible = showAll ? nearby : nearby.slice(0, DEFAULT_NEARBY_WASTE_LIMIT);
  const hasFilters = typeFilter !== "all" || availableOnly;

  return (
    <Card className={`flex flex-col gap-3 p-4 ${className}`}>
      <div>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          {t("environment.nearbyWasteTitle")}
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
          {t("partner.distanceHint", {
            origin: originName,
            radius: formatLocaleDistanceKm(radiusKm, locale),
          })}
        </p>
      </div>

      <WastePointFilters
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        availableOnly={availableOnly}
        onAvailableOnlyChange={setAvailableOnly}
      />

      {nearby.length === 0 ? (
        <EmptyState
          title={
            hasFilters
              ? t("environment.emptyWasteFiltered")
              : t("environment.emptyWasteNearby")
          }
          description={
            radiusKm < EXPANDED_WASTE_SEARCH_RADIUS_KM
              ? t("partner.expandRadiusHint")
              : t("partner.changeFilters")
          }
          icon={<Trash2 className="h-5 w-5" />}
          className="py-6 shadow-none"
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((result) => (
            <li key={result.wastePoint.id}>
              <WastePointCard
                result={result}
                selected={selectedWastePointId === result.wastePoint.id}
                onSelect={onSelectWastePoint}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {nearby.length > DEFAULT_NEARBY_WASTE_LIMIT && !showAll ? (
          <TextButton
            variant="secondary"
            className="h-8 text-xs"
            onClick={() => setShowAll(true)}
          >
            {t("partner.showMoreRemaining", {
              count: nearby.length - DEFAULT_NEARBY_WASTE_LIMIT,
            })}
          </TextButton>
        ) : null}
        {radiusKm < EXPANDED_WASTE_SEARCH_RADIUS_KM ? (
          <TextButton
            variant="ghost"
            className="h-8 text-xs"
            onClick={() => {
              setRadiusKm(EXPANDED_WASTE_SEARCH_RADIUS_KM);
              setShowAll(false);
            }}
          >
            {t("partner.expandToRadius", {
              radius: EXPANDED_WASTE_SEARCH_RADIUS_KM,
            })}
          </TextButton>
        ) : null}
      </div>
    </Card>
  );
}
