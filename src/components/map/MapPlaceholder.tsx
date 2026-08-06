"use client";

import { MapMarker } from "@/components/map/MapMarker";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { LanguageCode } from "@/constants/languages";
import { t } from "@/constants/uiText";
import { mockMapMarkers, mockPloggingPaths } from "@/data/mockMapData";
import type { CategoryFilter } from "@/types/map";

interface MapPlaceholderProps {
  language: LanguageCode;
  selectedCategory: CategoryFilter;
  selectedSpotId: string | null;
  onSelectSpot: (spotId: string) => void;
}

const fishingMarkerToSpotId: Record<string, string> = {
  "marker-fishing-1": "spot-hakri",
  "marker-fishing-2": "spot-songjung",
  "marker-fishing-3": "spot-dadaepo",
};

function shouldShowCategory(
  selectedCategory: CategoryFilter,
  category: CategoryFilter,
): boolean {
  return selectedCategory === "all" || selectedCategory === category;
}

export function MapPlaceholder({
  language,
  selectedCategory,
  selectedSpotId,
  onSelectSpot,
}: MapPlaceholderProps) {
  const visibleMarkers = mockMapMarkers.filter((marker) =>
    shouldShowCategory(selectedCategory, marker.category),
  );
  const showPlogging =
    shouldShowCategory(selectedCategory, "plogging") ||
    selectedCategory === "all";

  return (
    <section
      aria-label="Map"
      className="relative min-h-[320px] flex-1 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-map-bg)] shadow-[var(--shadow-card)] sm:min-h-[420px] lg:min-h-0"
    >
      {/* Decorative map-like background */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.18), transparent 40%),
            radial-gradient(circle at 75% 25%, rgba(20, 184, 166, 0.16), transparent 35%),
            radial-gradient(circle at 60% 75%, rgba(34, 197, 94, 0.12), transparent 40%),
            linear-gradient(135deg, #e0f2fe 0%, #ecfeff 40%, #f0fdf4 100%)
          `,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 116, 144, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 116, 144, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      {/* Coastline-ish path */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M5,20 C20,28 30,18 42,25 C55,33 60,22 72,28 C84,34 92,40 98,52 L98,100 L5,100 Z"
          fill="rgba(14,165,233,0.12)"
          stroke="rgba(2,132,199,0.35)"
          strokeWidth="0.4"
        />
      </svg>

      <div className="absolute left-1/2 top-4 z-20 w-[min(90%,320px)] -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-ocean-200)] bg-white/90 px-4 py-2 text-center text-sm font-semibold text-[var(--color-ocean-800)] shadow-sm backdrop-blur">
        {t(language, "mapComingSoon")}
      </div>

      {showPlogging &&
        mockPloggingPaths.map((path) => {
          const points = path.points.map((p) => `${p.x},${p.y}`).join(" ");
          return (
            <svg
              key={path.id}
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-label={t(language, "tempPloggingPath")}
            >
              <polyline
                points={points}
                fill="none"
                stroke={CATEGORY_COLORS.plogging}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 1.5"
                opacity="0.85"
              />
            </svg>
          );
        })}

      {visibleMarkers.map((marker) => {
        const spotId = fishingMarkerToSpotId[marker.id];
        const isSelected =
          marker.category === "fishing" &&
          spotId !== undefined &&
          spotId === selectedSpotId;

        return (
          <MapMarker
            key={marker.id}
            category={marker.category}
            label={marker.label}
            x={marker.position.x}
            y={marker.position.y}
            selected={isSelected}
            onClick={() => {
              if (spotId) {
                onSelectSpot(spotId);
              }
            }}
          />
        );
      })}

      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/90 p-2 text-[10px] text-[var(--color-text-secondary)] shadow-sm backdrop-blur sm:text-xs">
        <LegendDot color={CATEGORY_COLORS.fishing} label={t(language, "tempFishingMarker")} />
        <LegendDot color={CATEGORY_COLORS.market} label={t(language, "tempMarketMarker")} />
        <LegendDot color={CATEGORY_COLORS.trash} label={t(language, "tempTrashMarker")} />
        <LegendDot color={CATEGORY_COLORS.plogging} label={t(language, "tempPloggingPath")} />
      </div>
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}
