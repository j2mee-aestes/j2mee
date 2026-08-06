"use client";

import { useMemo, useState } from "react";
import { MapControls } from "@/components/map/MapControls";
import { MapFilterChips } from "@/components/map/MapFilterChips";
import { MapMarker } from "@/components/map/MapMarker";
import { PloggingRouteOverlay } from "@/components/map/PloggingRouteOverlay";
import { CATEGORY_COLORS } from "@/constants/categories";
import { UI_TEXT } from "@/constants/uiText";
import { mockMapLocations } from "@/data/mockMapLocations";
import { mockPloggingRoutes } from "@/data/mockPloggingRoutes";
import type { CategoryFilter } from "@/types/map";

interface MapPlaceholderProps {
  selectedCategory: CategoryFilter;
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onNotice: (message: string) => void;
}

function shouldShowCategory(
  selectedCategory: CategoryFilter,
  category: CategoryFilter,
): boolean {
  return selectedCategory === "all" || selectedCategory === category;
}

export function MapPlaceholder({
  selectedCategory,
  selectedLocationId,
  onSelectLocation,
  onCategoryChange,
  onNotice,
}: MapPlaceholderProps) {
  const [zoom, setZoom] = useState(1);

  const visibleLocations = useMemo(
    () =>
      mockMapLocations.filter((location) =>
        shouldShowCategory(selectedCategory, location.category),
      ),
    [selectedCategory],
  );

  const showPlogging =
    shouldShowCategory(selectedCategory, "plogging") ||
    selectedCategory === "all";
  const emphasizePlogging = selectedCategory === "plogging";

  return (
    <section
      aria-label="지도"
      className="relative flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-map-bg)] shadow-[var(--shadow-card)] sm:min-h-[440px] lg:min-h-0"
    >
      <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex justify-center sm:inset-x-4 sm:justify-start">
        <div className="pointer-events-auto max-w-full">
          <MapFilterChips
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      <div className="absolute right-3 top-3 z-30 sm:right-4 sm:top-14">
        <MapControls
          onZoomIn={() => setZoom((value) => Math.min(value + 0.1, 1.4))}
          onZoomOut={() => setZoom((value) => Math.max(value - 0.1, 0.8))}
          onCurrentLocation={() => onNotice(UI_TEXT.locationComingSoon)}
          onListView={() => onNotice(UI_TEXT.listComingSoon)}
        />
      </div>

      <div
        className="relative min-h-[360px] flex-1 origin-center transition-transform duration-200 sm:min-h-[440px] lg:min-h-0"
        style={{ transform: `scale(${zoom})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 18% 28%, rgba(14, 165, 233, 0.22), transparent 42%),
              radial-gradient(circle at 78% 22%, rgba(20, 184, 166, 0.16), transparent 36%),
              linear-gradient(160deg, #bfdbfe 0%, #e0f2fe 38%, #ecfdf5 72%, #f8fafc 100%)
            `,
          }}
          aria-hidden
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,18 C18,26 28,14 40,22 C52,30 58,18 70,24 C82,30 90,38 100,48 L100,100 L0,100 Z"
            fill="rgba(14,165,233,0.18)"
          />
          <path
            d="M0,42 C16,36 26,48 38,44 C52,39 60,52 74,48 C86,45 94,54 100,58 L100,100 L0,100 Z"
            fill="var(--color-map-land)"
            opacity="0.85"
          />
          <path
            d="M8,55 C22,50 30,62 44,58 C58,54 66,66 80,60"
            fill="none"
            stroke="rgba(148,163,184,0.55)"
            strokeWidth="0.6"
          />
          <path
            d="M20,70 C34,66 42,78 56,74 C68,70 78,80 90,76"
            fill="none"
            stroke="rgba(148,163,184,0.4)"
            strokeWidth="0.45"
          />
        </svg>

        <div className="pointer-events-none absolute left-[18%] top-[34%] text-[11px] font-semibold text-sky-900/50">
          기장
        </div>
        <div className="pointer-events-none absolute left-[42%] top-[48%] text-[11px] font-semibold text-emerald-900/40">
          일광
        </div>
        <div className="pointer-events-none absolute left-[62%] top-[24%] text-[11px] font-semibold text-sky-900/45">
          임랑
        </div>

        <div className="absolute left-1/2 top-[4.75rem] z-20 w-[min(92%,300px)] -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-ocean-200)] bg-white/90 px-3 py-1.5 text-center text-xs font-semibold text-[var(--color-ocean-800)] shadow-sm backdrop-blur sm:top-3 sm:left-auto sm:right-28 sm:w-auto sm:translate-x-0">
          {UI_TEXT.mapComingSoon}
        </div>

        {showPlogging
          ? mockPloggingRoutes.map((route) => (
              <PloggingRouteOverlay
                key={route.id}
                route={route}
                emphasized={emphasizePlogging}
              />
            ))
          : null}

        {visibleLocations.length === 0 ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
            <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/95 px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] shadow-sm">
              {UI_TEXT.noPlaces}
            </p>
          </div>
        ) : (
          visibleLocations.map((location) => (
            <MapMarker
              key={location.id}
              category={location.category}
              label={location.name}
              x={location.position.x}
              y={location.position.y}
              selected={location.id === selectedLocationId}
              showLabel={location.id === selectedLocationId}
              onClick={() => onSelectLocation(location.id)}
            />
          ))
        )}
      </div>

      <div className="absolute bottom-3 left-3 z-20 flex max-w-[calc(100%-5rem)] flex-wrap gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/90 p-2 text-[10px] text-[var(--color-text-secondary)] shadow-sm backdrop-blur sm:text-xs">
        <LegendDot color={CATEGORY_COLORS.fishing} label="낚시" />
        <LegendDot color={CATEGORY_COLORS.market} label="시장" />
        <LegendDot color={CATEGORY_COLORS.restaurant} label="식당" />
        <LegendDot color={CATEGORY_COLORS.uglySeafood} label="못난이" />
        <LegendDot color={CATEGORY_COLORS.trash} label="쓰레기통" />
        <LegendDot color={CATEGORY_COLORS.plogging} label="플로깅" />
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
