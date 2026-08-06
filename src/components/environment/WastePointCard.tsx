"use client";

import { TextButton } from "@/components/common/IconButton";
import { WastePointStatusBadge } from "@/components/environment/WastePointStatusBadge";
import { WastePointTypeBadge } from "@/components/environment/WastePointTypeBadge";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import type { NearbyWastePointResult } from "@/types/environment";

interface WastePointCardProps {
  result: NearbyWastePointResult;
  selected?: boolean;
  onSelect: (id: string) => void;
}

export function WastePointCard({
  result,
  selected = false,
  onSelect,
}: WastePointCardProps) {
  const { wastePoint, distanceKm } = result;

  return (
    <article
      className={`rounded-[var(--radius-md)] border p-3 ${
        selected
          ? "border-emerald-400 bg-emerald-50"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      <button
        type="button"
        className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
        onClick={() => onSelect(wastePoint.id)}
        aria-pressed={selected}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {wastePoint.name}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {formatDistanceKm(distanceKm)} · 직선거리
            </p>
          </div>
          <WastePointStatusBadge status={wastePoint.status} />
        </div>
        <div className="mt-2">
          <WastePointTypeBadge type={wastePoint.type} />
        </div>
        {wastePoint.address ? (
          <p className="mt-1 truncate text-[11px] text-[var(--color-text-muted)]">
            {wastePoint.address}
          </p>
        ) : null}
      </button>
      <TextButton
        variant="secondary"
        className="mt-2 h-8 w-full text-xs"
        onClick={() => onSelect(wastePoint.id)}
      >
        상세보기
      </TextButton>
    </article>
  );
}
