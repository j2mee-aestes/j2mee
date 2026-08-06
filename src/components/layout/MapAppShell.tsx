"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NearbyWastePointSection } from "@/components/environment/NearbyWastePointSection";
import { PloggingRouteDetail } from "@/components/environment/PloggingRouteDetail";
import { PloggingRouteList } from "@/components/environment/PloggingRouteList";
import { WastePointDetailPanel } from "@/components/environment/WastePointDetailPanel";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { Header } from "@/components/layout/Header";
import { MobileCategoryBar } from "@/components/layout/MobileCategoryBar";
import { LocationDetailPanel } from "@/components/location/LocationDetailPanel";
import { MapSection } from "@/components/map/MapSection";
import { NearbyPartnerSection } from "@/components/partners/NearbyPartnerSection";
import { PartnerDetailPanel } from "@/components/partners/PartnerDetailPanel";
import { TidePanel } from "@/components/tide/TidePanel";
import { WeatherCard } from "@/components/weather/WeatherCard";
import type { LanguageCode } from "@/constants/languages";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";
import { UI_TEXT } from "@/constants/uiText";
import { DEFAULT_SELECTED_LOCATION_ID } from "@/data/fishing-spots/mockFishingSpots";
import {
  getLocationDetailById,
  isFishingSpot,
  isPartnerPlace,
  isPloggingRoute,
  isWastePoint,
  searchMockLocations,
  type SearchablePlace,
} from "@/data/mockMapLocations";
import {
  useTideData,
  useWeatherData,
} from "@/hooks/useSpotEnvironmentData";
import { useScheduleContext } from "@/context/ScheduleContext";
import { getWastePointById } from "@/lib/environment/wastePointRepository";
import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import { partnerTypeToMapCategory } from "@/lib/map/partnerMapLocation";
import type { CategoryFilter, Coordinates } from "@/types/map";
import type { PloggingSession } from "@/types/environment";
import Link from "next/link";

function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isValidDateParam(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const today = todayKst();
  const max = addDays(today, SAFETY_THRESHOLDS.maxTideDateOffsetDays);
  return value >= today && value <= max;
}

function resolvePlaceCategory(place: SearchablePlace): CategoryFilter {
  if (isFishingSpot(place)) {
    return "fishing";
  }
  if (isPartnerPlace(place)) {
    return partnerTypeToMapCategory(place.type);
  }
  if (isWastePoint(place)) {
    return "trash";
  }
  if (isPloggingRoute(place)) {
    return "plogging";
  }
  return "all";
}

const EMPTY_SESSION: PloggingSession = {
  status: "notStarted",
  routeId: null,
  collectedWasteTypes: [],
  bagCount: 1,
  memo: "",
};

export function MapAppShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSpot =
    searchParams.get("spot") && getLocationDetailById(searchParams.get("spot")!)
      ? searchParams.get("spot")
      : DEFAULT_SELECTED_LOCATION_ID;
  const initialDate = isValidDateParam(searchParams.get("date"))
    ? (searchParams.get("date") as string)
    : todayKst();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [language, setLanguage] = useState<LanguageCode>("KR");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    initialSpot,
  );
  const [relatedFishingSpotId, setRelatedFishingSpotId] = useState<
    string | null
  >(() => {
    const place = initialSpot ? getLocationDetailById(initialSpot) : null;
    return place && isFishingSpot(place)
      ? place.id
      : DEFAULT_SELECTED_LOCATION_ID;
  });
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotice, setSearchNotice] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchablePlace[]>([]);
  const [panelNotice, setPanelNotice] = useState<string | null>(null);
  const [mapNotice, setMapNotice] = useState<string | null>(null);
  const [tideHighlighted, setTideHighlighted] = useState(false);
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [fitRouteRequestId, setFitRouteRequestId] = useState(0);
  const [chartExpanded, setChartExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [ploggingSession, setPloggingSession] =
    useState<PloggingSession>(EMPTY_SESSION);
  const scheduleApi = useScheduleContext();

  const selectedLocation = useMemo(
    () =>
      selectedLocationId
        ? getLocationDetailById(selectedLocationId)
        : null,
    [selectedLocationId],
  );

  const selectedPartner = isPartnerPlace(selectedLocation)
    ? selectedLocation
    : null;
  const selectedFishing = isFishingSpot(selectedLocation)
    ? selectedLocation
    : null;
  const selectedWaste = isWastePoint(selectedLocation)
    ? selectedLocation
    : null;
  const selectedRoute = isPloggingRoute(selectedLocation)
    ? selectedLocation
    : null;

  const relatedFishingSpot = useMemo(() => {
    if (!relatedFishingSpotId) {
      return null;
    }
    const place = getLocationDetailById(relatedFishingSpotId);
    return place && isFishingSpot(place) ? place : null;
  }, [relatedFishingSpotId]);

  const fishingSpotId = selectedFishing?.id ?? null;

  const distanceOrigin = relatedFishingSpot?.coordinates ?? userLocation;
  const distanceOriginLabel = relatedFishingSpot
    ? `선택한 낚시터(${relatedFishingSpot.name})`
    : userLocation
      ? "현재 위치"
      : null;

  const partnerDistanceKm =
    selectedPartner && distanceOrigin
      ? calculateDistanceKm(distanceOrigin, selectedPartner.coordinates)
      : null;

  const wasteDistanceKm =
    selectedWaste && distanceOrigin
      ? calculateDistanceKm(distanceOrigin, selectedWaste.coordinates)
      : null;

  const connectedWastePoints = useMemo(() => {
    if (!selectedRoute) {
      return [];
    }
    return selectedRoute.connectedWastePointIds
      .map((id) => getWastePointById(id))
      .filter((point): point is NonNullable<typeof point> => point !== null);
  }, [selectedRoute]);

  const tideState = useTideData(fishingSpotId, selectedDate);
  const weatherState = useWeatherData(fishingSpotId, selectedDate);

  const syncUrl = useCallback(
    (spotId: string | null, date: string) => {
      const params = new URLSearchParams();
      if (spotId) {
        params.set("spot", spotId);
      }
      params.set("date", date);
      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (nextQuery === currentQuery) {
        return;
      }
      router.replace(`${pathname}?${nextQuery}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    syncUrl(selectedLocationId, selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when selection changes only
  }, [selectedLocationId, selectedDate]);

  useEffect(() => {
    if (!tideHighlighted) {
      return;
    }
    const timer = window.setTimeout(() => setTideHighlighted(false), 2200);
    return () => window.clearTimeout(timer);
  }, [tideHighlighted]);

  useEffect(() => {
    if (!mapNotice) {
      return;
    }
    const timer = window.setTimeout(() => setMapNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [mapNotice]);

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    if (!selectedLocation || category === "all") {
      return;
    }
    if (resolvePlaceCategory(selectedLocation) !== category) {
      setSelectedLocationId(null);
    }
  };

  const selectAndFocusLocation = (locationId: string) => {
    const normalizedId = locationId.endsWith("-end")
      ? locationId.replace(/-end$/, "")
      : locationId;
    const detail = getLocationDetailById(normalizedId);
    if (!detail) {
      return;
    }
    setSelectedLocationId(normalizedId);
    setSelectedCategory(resolvePlaceCategory(detail));
    if (isFishingSpot(detail)) {
      setRelatedFishingSpotId(detail.id);
    }
    if (isPloggingRoute(detail)) {
      setFitRouteRequestId((value) => value + 1);
    } else {
      setFocusRequestId((value) => value + 1);
    }
    setPanelNotice(null);
    setSearchResults([]);
    setSearchNotice(null);
  };

  const handleSelectLocation = (id: string) => {
    const normalizedId = id.endsWith("-end") ? id.replace(/-end$/, "") : id;
    const detail = getLocationDetailById(normalizedId);
    setSelectedLocationId(normalizedId);
    setPanelNotice(null);
    if (detail && isFishingSpot(detail)) {
      setRelatedFishingSpotId(detail.id);
    }
    if (detail && isPloggingRoute(detail)) {
      setSelectedCategory("plogging");
      setFitRouteRequestId((value) => value + 1);
    }
  };

  const handleAddPartnerToSchedule = (partnerId: string) => {
    const partner = getLocationDetailById(partnerId);
    if (!partner || !isPartnerPlace(partner)) {
      return;
    }
    const result = scheduleApi.addPartner(partner);
    setPanelNotice(
      result.ok
        ? result.message
        : "이미 일정에 추가된 장소입니다.",
    );
  };

  const handleAddPloggingToSchedule = (routeId: string) => {
    const route = getLocationDetailById(routeId);
    if (!route || !isPloggingRoute(route)) {
      return;
    }
    const result = scheduleApi.addPlogging(route);
    setPanelNotice(
      result.ok
        ? result.message
        : "이미 일정에 추가된 장소입니다.",
    );
  };

  const handleAddFishingToSchedule = () => {
    if (!selectedFishing) {
      return;
    }
    const result = scheduleApi.addFishing(selectedFishing);
    setPanelNotice(
      result.ok
        ? result.message
        : "이미 일정에 추가된 장소입니다.",
    );
  };

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchNotice(null);
      setSearchResults([]);
      return;
    }

    const results = searchMockLocations(trimmed);
    if (results.length === 0) {
      setSearchResults([]);
      setSearchNotice(UI_TEXT.searchNoResults);
      return;
    }

    if (results.length === 1) {
      selectAndFocusLocation(results[0].id);
      setSearchNotice(`“${results[0].name}” 위치로 이동했습니다.`);
      return;
    }

    setSearchNotice(null);
    setSearchResults(results);
  };

  const handleTideSummaryClick = () => {
    const card = document.getElementById("tide-summary-card");
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTideHighlighted(true);
  };

  const handleToggleFavorite = () => {
    if (!selectedLocationId) {
      return;
    }
    setFavorites((prev) => ({
      ...prev,
      [selectedLocationId]: !prev[selectedLocationId],
    }));
  };

  const nearbyOrigin =
    selectedFishing?.coordinates ??
    relatedFishingSpot?.coordinates ??
    userLocation;
  const nearbyOriginName =
    selectedFishing?.name ??
    relatedFishingSpot?.name ??
    (userLocation ? "현재 위치" : null);

  const showPloggingList =
    selectedCategory === "plogging" || selectedCategory === "all";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)}
        searchQuery={searchQuery}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          if (!value.trim()) {
            setSearchResults([]);
            setSearchNotice(null);
          }
        }}
        onSearchSubmit={handleSearchSubmit}
        searchNotice={searchNotice}
        searchResults={searchResults}
        onSelectSearchResult={selectAndFocusLocation}
        onTideSummaryClick={handleTideSummaryClick}
      />

      <MobileCategoryBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <DesktopSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          mobileOpen={mobileMenuOpen}
        />

        <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4 lg:h-[calc(100vh-7.5rem)] lg:flex-row lg:gap-4 lg:overflow-hidden">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <MapSection
              selectedCategory={selectedCategory}
              selectedLocationId={selectedLocationId}
              selectedRouteId={selectedRoute?.id ?? null}
              highlightedWastePointIds={
                selectedRoute?.connectedWastePointIds ?? []
              }
              onSelectLocation={handleSelectLocation}
              onSelectRoute={(routeId) => selectAndFocusLocation(routeId)}
              onCategoryChange={handleCategoryChange}
              onNotice={setMapNotice}
              onUserLocation={setUserLocation}
              focusRequestId={focusRequestId}
              fitRouteRequestId={fitRouteRequestId}
            />
            {mapNotice ? (
              <p
                className="absolute bottom-16 left-1/2 z-40 w-[min(90%,360px)] -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-center text-xs text-[var(--color-text-secondary)] shadow-md"
                role="status"
              >
                {mapNotice}
              </p>
            ) : null}
            {ploggingSession.status === "inProgress" &&
            ploggingSession.routeId ? (
              <p
                className="absolute bottom-4 left-1/2 z-40 w-[min(90%,360px)] -translate-x-1/2 rounded-[var(--radius-md)] border border-teal-200 bg-teal-50 px-3 py-2 text-center text-xs font-medium text-teal-900 shadow-md"
                role="status"
                aria-live="polite"
              >
                플로깅 진행 중 · 상세 패널에서 완료할 수 있습니다
              </p>
            ) : null}
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-3 pb-24 lg:w-80 lg:overflow-y-auto lg:pb-0 xl:w-96">
            {selectedPartner ? (
              <PartnerDetailPanel
                partner={selectedPartner}
                originLabel={distanceOriginLabel}
                originCoordinates={distanceOrigin}
                distanceKm={partnerDistanceKm}
                onAddToSchedule={() =>
                  handleAddPartnerToSchedule(selectedPartner.id)
                }
                scheduleAdded={scheduleApi.isSourceInSchedule(selectedPartner.id)}
                notice={panelNotice}
              />
            ) : null}

            {selectedWaste ? (
              <WastePointDetailPanel
                wastePoint={selectedWaste}
                originLabel={distanceOriginLabel}
                distanceKm={wasteDistanceKm}
                onDirections={() => setPanelNotice(UI_TEXT.directionsNotice)}
                notice={panelNotice}
              />
            ) : null}

            {selectedRoute ? (
              <PloggingRouteDetail
                route={selectedRoute}
                connectedWastePoints={connectedWastePoints}
                session={
                  ploggingSession.routeId === selectedRoute.id
                    ? ploggingSession
                    : { ...EMPTY_SESSION, routeId: selectedRoute.id }
                }
                scheduleAdded={scheduleApi.isSourceInSchedule(selectedRoute.id)}
                onAddToSchedule={() =>
                  handleAddPloggingToSchedule(selectedRoute.id)
                }
                onSelectWastePoint={selectAndFocusLocation}
                onStartSession={() =>
                  setPloggingSession({
                    ...EMPTY_SESSION,
                    status: "inProgress",
                    routeId: selectedRoute.id,
                    startedAt: new Date().toISOString(),
                  })
                }
                onCancelSession={() => setPloggingSession(EMPTY_SESSION)}
                onCompleteSession={(payload) =>
                  setPloggingSession((prev) => ({
                    ...prev,
                    status: "completed",
                    completedAt: new Date().toISOString(),
                    ...payload,
                  }))
                }
                onResetSession={() => setPloggingSession(EMPTY_SESSION)}
                notice={panelNotice}
              />
            ) : null}

            {selectedFishing ? (
              <LocationDetailPanel
                location={selectedFishing}
                weather={weatherState.data}
                isFavorite={Boolean(
                  selectedLocationId && favorites[selectedLocationId],
                )}
                onToggleFavorite={handleToggleFavorite}
                onDirections={() => setPanelNotice(UI_TEXT.directionsNotice)}
                onAddToSchedule={handleAddFishingToSchedule}
                scheduleAdded={scheduleApi.isSourceInSchedule(selectedFishing.id)}
                notice={panelNotice}
              />
            ) : null}

            {!selectedPartner &&
            !selectedWaste &&
            !selectedRoute &&
            !selectedFishing ? (
              <LocationDetailPanel
                location={null}
                isFavorite={false}
                onToggleFavorite={handleToggleFavorite}
                onDirections={() => setPanelNotice(UI_TEXT.directionsNotice)}
                notice={panelNotice}
              />
            ) : null}

            {nearbyOrigin && nearbyOriginName ? (
              <NearbyWastePointSection
                origin={nearbyOrigin}
                originName={nearbyOriginName}
                selectedWastePointId={selectedWaste?.id ?? null}
                onSelectWastePoint={selectAndFocusLocation}
              />
            ) : null}

            {selectedFishing || (relatedFishingSpot && selectedPartner) ? (
              <NearbyPartnerSection
                origin={(selectedFishing ?? relatedFishingSpot)!.coordinates}
                originName={(selectedFishing ?? relatedFishingSpot)!.name}
                selectedPartnerId={selectedPartner?.id ?? null}
                schedulePartnerIds={scheduleApi.schedule.items.map(
                  (item) => item.sourceId,
                )}
                onSelectPartner={selectAndFocusLocation}
                onAddToSchedule={handleAddPartnerToSchedule}
              />
            ) : null}

            {showPloggingList && !selectedRoute ? (
              <PloggingRouteList
                selectedRouteId={null}
                onSelectRoute={selectAndFocusLocation}
              />
            ) : null}

            {scheduleApi.schedule.items.length > 0 ? (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 text-xs text-[var(--color-text-secondary)]">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  임시 일정 ({scheduleApi.schedule.items.length})
                </p>
                <ul className="mt-1.5 space-y-1">
                  {[...scheduleApi.schedule.items]
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <li key={item.id}>
                        · {item.order}. {item.title}
                      </li>
                    ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/schedule"
                    className="inline-flex h-8 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-xs font-medium text-white"
                  >
                    일정 편집
                  </Link>
                  <Link
                    href="/schedules"
                    className="inline-flex h-8 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-xs font-medium"
                  >
                    저장 목록
                  </Link>
                </div>
                <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                  브라우저에 임시 저장되며, 정식 서버 저장은 다음 단계에서
                  연결됩니다.
                </p>
              </div>
            ) : (
              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-white p-3 text-xs text-[var(--color-text-secondary)]">
                <p>아직 일정에 추가된 장소가 없습니다.</p>
                <Link
                  href="/schedule"
                  className="mt-2 inline-flex font-semibold text-[var(--color-ocean-700)]"
                >
                  하루 일정 만들기 →
                </Link>
              </div>
            )}

            {fishingSpotId ? (
              <>
                <WeatherCard
                  weather={weatherState.data}
                  loading={weatherState.loading}
                  error={weatherState.error}
                  onRetry={weatherState.reload}
                />
                <div
                  className={
                    tideHighlighted
                      ? "rounded-[var(--radius-lg)] ring-2 ring-[var(--color-ocean-400)]"
                      : ""
                  }
                >
                  <TidePanel
                    tide={tideState.data}
                    loading={tideState.loading}
                    error={tideState.error}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    onRetry={tideState.reload}
                    chartExpanded={chartExpanded}
                    onToggleChart={() => setChartExpanded((value) => !value)}
                  />
                </div>
              </>
            ) : null}
          </aside>
        </main>
      </div>
    </div>
  );
}
