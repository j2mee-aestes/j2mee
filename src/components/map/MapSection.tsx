"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KakaoMap, type KakaoMapHandle } from "@/components/map/KakaoMap";
import { MapControls } from "@/components/map/MapControls";
import { MapFallback, MapSkeleton } from "@/components/map/MapFallback";
import { MapFilterChips } from "@/components/map/MapFilterChips";
import { UI_TEXT } from "@/constants/uiText";
import { mockMapLocations } from "@/data/mockMapLocations";
import { getAllPloggingRoutes } from "@/lib/environment/ploggingRouteRepository";
import { useKakaoMaps } from "@/hooks/useKakaoMaps";
import type { CategoryFilter, Coordinates } from "@/types/map";

interface MapSectionProps {
  selectedCategory: CategoryFilter;
  selectedLocationId: string | null;
  selectedRouteId?: string | null;
  highlightedWastePointIds?: string[];
  onSelectLocation: (locationId: string) => void;
  onSelectRoute?: (routeId: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onNotice: (message: string) => void;
  onUserLocation?: (coords: Coordinates) => void;
  focusRequestId?: number;
  fitRouteRequestId?: number;
}

function matchesCategory(
  selectedCategory: CategoryFilter,
  category: CategoryFilter,
): boolean {
  return selectedCategory === "all" || selectedCategory === category;
}

export function MapSection({
  selectedCategory,
  selectedLocationId,
  selectedRouteId = null,
  highlightedWastePointIds = [],
  onSelectLocation,
  onSelectRoute,
  onCategoryChange,
  onNotice,
  onUserLocation,
  focusRequestId = 0,
  fitRouteRequestId = 0,
}: MapSectionProps) {
  const { status, retry } = useKakaoMaps();
  const mapRef = useRef<KakaoMapHandle>(null);
  const [locating, setLocating] = useState(false);
  const routes = useMemo(() => getAllPloggingRoutes(), []);

  const visibleLocations = useMemo(() => {
    const base = mockMapLocations.filter((location) =>
      matchesCategory(selectedCategory, location.category),
    );
    if (highlightedWastePointIds.length === 0) {
      return base;
    }
    // Ensure connected waste points remain visible when a plogging route is selected
    const extras = mockMapLocations.filter(
      (location) =>
        location.category === "trash" &&
        highlightedWastePointIds.includes(location.id) &&
        !base.some((item) => item.id === location.id),
    );
    return [...base, ...extras];
  }, [selectedCategory, highlightedWastePointIds]);

  useEffect(() => {
    if (!focusRequestId || status !== "ready") {
      return;
    }
    const selected = mockMapLocations.find(
      (location) => location.id === selectedLocationId,
    );
    if (!selected) {
      return;
    }
    mapRef.current?.panTo(selected.coordinates, 5);
  }, [focusRequestId, selectedLocationId, status]);

  useEffect(() => {
    if (!fitRouteRequestId || status !== "ready" || !selectedRouteId) {
      return;
    }
    const route = routes.find((item) => item.id === selectedRouteId);
    if (!route) {
      return;
    }
    mapRef.current?.fitRoute(route);
  }, [fitRouteRequestId, selectedRouteId, status, routes]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      onNotice(UI_TEXT.locationUnsupported);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        mapRef.current?.setUserLocation(coords);
        onUserLocation?.(coords);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          onNotice(UI_TEXT.locationPermissionNeeded);
          return;
        }
        if (error.code === error.TIMEOUT) {
          onNotice(UI_TEXT.locationTimeout);
          return;
        }
        onNotice(UI_TEXT.locationUnavailable);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

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

      {status === "ready" ? (
        <div className="absolute right-3 top-3 z-30 sm:right-4 sm:top-14">
          <MapControls
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onCurrentLocation={handleCurrentLocation}
            onFitAllMarkers={() =>
              mapRef.current?.fitLocations(visibleLocations)
            }
            locating={locating}
          />
        </div>
      ) : null}

      <div className="relative min-h-[360px] flex-1 sm:min-h-[440px] lg:min-h-0">
        {status === "missing-key" ? (
          <MapFallback variant="missing-key" />
        ) : null}
        {status === "loading" ? <MapSkeleton /> : null}
        {status === "error" ? (
          <MapFallback variant="error" onRetry={retry} />
        ) : null}
        {status === "ready" ? (
          <>
            <KakaoMap
              ref={mapRef}
              locations={visibleLocations}
              routes={routes}
              selectedCategory={selectedCategory}
              selectedLocationId={selectedLocationId}
              selectedRouteId={selectedRouteId}
              onSelectLocation={onSelectLocation}
              onSelectRoute={onSelectRoute}
            />
            {visibleLocations.length === 0 && selectedCategory !== "plogging" ? (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6">
                <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/95 px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] shadow-sm">
                  {UI_TEXT.noPlaces}
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
