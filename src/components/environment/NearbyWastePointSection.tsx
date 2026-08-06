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
import { findNearbyWastePoints } from "@/lib/environment/findNearbyWastePoints";
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
          주변 쓰레기통·수거함
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
          {originName} 기준 약 {radiusKm}km · 직선거리 참고
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
              ? "선택한 조건에 맞는 수거 장소가 없습니다."
              : "주변에 등록된 수거 장소가 없습니다."
          }
          description={
            radiusKm < EXPANDED_WASTE_SEARCH_RADIUS_KM
              ? "검색 반경을 넓혀 다시 찾아볼 수 있습니다."
              : "필터를 변경해보세요."
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
            더 보기 ({nearby.length - DEFAULT_NEARBY_WASTE_LIMIT})
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
            반경 {EXPANDED_WASTE_SEARCH_RADIUS_KM}km로 넓히기
          </TextButton>
        ) : null}
      </div>
    </Card>
  );
}
