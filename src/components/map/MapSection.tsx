"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KakaoMap, type KakaoMapHandle } from "@/components/map/KakaoMap";
import { MapControls } from "@/components/map/MapControls";
import { MapFallback, MapSkeleton } from "@/components/map/MapFallback";
import { MapFilterChips } from "@/components/map/MapFilterChips";
import { MyLocationButton } from "@/components/map/MyLocationButton";
import { useTranslations } from "@/context/LocaleContext";
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
  const { t } = useTranslations();
  const { status, retry, errorMessage } = useKakaoMaps();
  const mapRef = useRef<KakaoMapHandle>(null);
  const [locating, setLocating] = useState(false);
  const [inactiveIds, setInactiveIds] = useState<Set<string>>(new Set());
  const routes = useMemo(() => getAllPloggingRoutes(), []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetch("/api/catalog/inactive")
        .then((response) => response.json())
        .then(
          (body: {
            inactive?: Array<{ sourceId: string }>;
          }) => {
            const next = new Set(
              (body.inactive ?? []).map((item) => item.sourceId),
            );
            setInactiveIds(next);
          },
        )
        .catch(() => {
          // keep static catalog visible if catalog API is unavailable
        });
    });
  }, []);

  const activeLocations = useMemo(
    () => mockMapLocations.filter((location) => !inactiveIds.has(location.id)),
    [inactiveIds],
  );

  const visibleLocations = useMemo(() => {
    const base = activeLocations.filter((location) =>
      matchesCategory(selectedCategory, location.category),
    );
    if (highlightedWastePointIds.length === 0) {
      return base;
    }
    // Ensure connected waste points remain visible when a plogging route is selected
    const extras = activeLocations.filter(
      (location) =>
        location.category === "trash" &&
        highlightedWastePointIds.includes(location.id) &&
        !base.some((item) => item.id === location.id),
    );
    return [...base, ...extras];
  }, [selectedCategory, highlightedWastePointIds, activeLocations]);

  useEffect(() => {
    if (!focusRequestId || status !== "ready") {
      return;
    }
    const selected = activeLocations.find(
      (location) => location.id === selectedLocationId,
    );
    if (!selected) {
      return;
    }
    mapRef.current?.panTo(selected.coordinates, 5);
  }, [focusRequestId, selectedLocationId, status, activeLocations]);

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
    if (locating) {
      return;
    }

    if (!navigator.geolocation) {
      onNotice(t("map.locationUnsupported"));
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
          onNotice(t("map.locationPermissionNeeded"));
          return;
        }
        if (error.code === error.TIMEOUT) {
          onNotice(t("map.locationTimeout"));
          return;
        }
        onNotice(t("map.locationUnavailable"));
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
      aria-label={t("common.map")}
      className="relative flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-map-bg)] shadow-[var(--shadow-float)] ring-1 ring-white/60 sm:min-h-[440px] lg:min-h-0"
    >
      <div className="pointer-events-none absolute inset-x-3 top-3 z-30 hidden justify-center sm:inset-x-4 sm:justify-start lg:flex">
        <div className="pointer-events-auto max-w-full">
          <MapFilterChips
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      {status === "ready" ? (
        <>
          <div className="absolute right-3 top-3 z-30 sm:right-4 lg:top-14">
            <MapControls
              onZoomIn={() => mapRef.current?.zoomIn()}
              onZoomOut={() => mapRef.current?.zoomOut()}
              onFitAllMarkers={() =>
                mapRef.current?.fitLocations(visibleLocations)
              }
            />
          </div>
          <div className="absolute bottom-4 right-3 z-30 sm:bottom-5 sm:right-4">
            <MyLocationButton
              onClick={handleCurrentLocation}
              locating={locating}
            />
          </div>
        </>
      ) : null}

      <div className="relative min-h-[360px] flex-1 sm:min-h-[440px] lg:min-h-0">
        {status === "missing-key" ? (
          <MapFallback variant="missing-key" />
        ) : null}
        {status === "loading" ? <MapSkeleton /> : null}
        {status === "error" ? (
          <MapFallback
            variant="error"
            onRetry={retry}
            errorMessage={errorMessage}
          />
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
                <p className="rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] backdrop-blur-md">
                  {t("map.noPlaces")}
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
