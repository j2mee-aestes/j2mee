"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NearbyWastePointSection } from "@/components/environment/NearbyWastePointSection";
import { PloggingCoursePopup } from "@/components/environment/PloggingCoursePopup";
import { PloggingRouteDetail } from "@/components/environment/PloggingRouteDetail";
import { PloggingRouteList } from "@/components/environment/PloggingRouteList";
import { WastePointDetailPanel } from "@/components/environment/WastePointDetailPanel";
import { AttractionDetailPanel } from "@/components/attractions/AttractionDetailPanel";
import { LeisureDetailPanel } from "@/components/leisure/LeisureDetailPanel";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { Header } from "@/components/layout/Header";
import { MobileCategoryBar } from "@/components/layout/MobileCategoryBar";
import { LocationDetailPanel } from "@/components/location/LocationDetailPanel";
import { MapSection } from "@/components/map/MapSection";
import { NearbyPartnerSection } from "@/components/partners/NearbyPartnerSection";
import { PartnerDetailPanel } from "@/components/partners/PartnerDetailPanel";
import { WaveCard } from "@/components/weather/WaveCard";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { WeatherDetailDialog } from "@/components/weather/WeatherDetailDialog";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";
import { useTranslations } from "@/context/LocaleContext";
import { DEFAULT_SELECTED_LOCATION_ID } from "@/data/fishing-spots/mockFishingSpots";
import {
  getLocationDetailById,
  isAttraction,
  isCoastalEvent,
  isFishingSpot,
  isLeisure,
  isPartnerPlace,
  isPloggingRoute,
  isWastePoint,
  searchMockLocations,
  type SearchablePlace,
} from "@/data/mockMapLocations";
import { getAllCoastalEvents } from "@/lib/events/eventRepository";
import { EventDetailPanel } from "@/components/events/EventDetailPanel";
import { EventList } from "@/components/events/EventList";
import { useWaveData, useWeatherData } from "@/hooks/useSpotEnvironmentData";
import {
  DEFAULT_HEADER_WEATHER_COORDS,
  DEFAULT_HEADER_WEATHER_NAME,
} from "@/lib/weather/clientWeather";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import { useScheduleContext } from "@/context/ScheduleContext";
import { apiJson } from "@/lib/auth/clientApi";
import { getWastePointById } from "@/lib/environment/wastePointRepository";
import {
  loadLocalFavorites,
  persistLocalFavorites,
  type LocalFavorite,
} from "@/lib/favorites/localFavorites";
import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import { partnerTypeToMapCategory } from "@/lib/map/partnerMapLocation";
import type { WeatherData } from "@/types/fishing";
import type { CategoryFilter, Coordinates } from "@/types/map";
import type { PloggingRoute, PloggingSession } from "@/types/environment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

function placeTypeForLocation(locationId: string): LocalFavorite["placeType"] {
  const place = getLocationDetailById(locationId);
  if (!place) return "fishing";
  if (isFishingSpot(place)) return "fishing";
  if (isPartnerPlace(place)) return place.type;
  if (isWastePoint(place)) return "trash";
  if (isPloggingRoute(place)) return "plogging";
  if (isAttraction(place)) return "attraction";
  if (isLeisure(place)) return "leisure";
  if (isCoastalEvent(place)) return "event";
  return "fishing";
}

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
  const max = addDays(today, SAFETY_THRESHOLDS.maxWeatherDateOffsetDays);
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
  if (isAttraction(place)) {
    return "attraction";
  }
  if (isLeisure(place)) {
    return "leisure";
  }
  if (isCoastalEvent(place)) {
    return "event";
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
  const { t, locale } = useTranslations();
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
  const initialCategoryParam = searchParams.get("category");
  const initialCategory: CategoryFilter =
    CATEGORIES.some((item) => item.id === initialCategoryParam)
      ? (initialCategoryParam as CategoryFilter)
      : "all";

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>(initialCategory);
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
  const [selectedDate] = useState(initialDate);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status: authStatus } = useSession();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotice, setSearchNotice] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchablePlace[]>([]);
  const [externalKakaoQuery, setExternalKakaoQuery] = useState<string | null>(
    null,
  );
  const [panelNotice, setPanelNotice] = useState<string | null>(null);
  const [mapNotice, setMapNotice] = useState<string | null>(null);
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [fitRouteRequestId, setFitRouteRequestId] = useState(0);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [ploggingSession, setPloggingSession] =
    useState<PloggingSession>(EMPTY_SESSION);
  const [ploggingPreview, setPloggingPreview] = useState<PloggingRoute | null>(
    null,
  );
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
  const selectedAttraction = isAttraction(selectedLocation)
    ? selectedLocation
    : null;
  const selectedLeisure = isLeisure(selectedLocation) ? selectedLocation : null;
  const selectedEvent = isCoastalEvent(selectedLocation)
    ? selectedLocation
    : null;
  const coastalEvents = useMemo(() => getAllCoastalEvents(), []);
  const showEventList =
    selectedCategory === "event" || selectedCategory === "all";

  const relatedFishingSpot = useMemo(() => {
    if (!relatedFishingSpotId) {
      return null;
    }
    const place = getLocationDetailById(relatedFishingSpotId);
    return place && isFishingSpot(place) ? place : null;
  }, [relatedFishingSpotId]);

  const weatherTarget = useMemo(() => {
    if (selectedFishing) {
      return {
        id: selectedFishing.id,
        coordinates: selectedFishing.coordinates,
        name: selectedFishing.name,
      };
    }
    if (selectedPartner) {
      return {
        id: selectedPartner.id,
        coordinates: selectedPartner.coordinates,
        name: selectedPartner.name,
      };
    }
    if (selectedWaste) {
      return {
        id: selectedWaste.id,
        coordinates: selectedWaste.coordinates,
        name: selectedWaste.name,
      };
    }
    if (selectedAttraction) {
      return {
        id: selectedAttraction.id,
        coordinates: selectedAttraction.coordinates,
        name: selectedAttraction.name,
      };
    }
    if (selectedLeisure) {
      return {
        id: selectedLeisure.id,
        coordinates: selectedLeisure.coordinates,
        name: selectedLeisure.name,
      };
    }
    if (selectedEvent) {
      return {
        id: selectedEvent.id,
        coordinates: selectedEvent.coordinates,
        name: selectedEvent.name,
      };
    }
    if (selectedRoute) {
      return {
        id: selectedRoute.id,
        coordinates: selectedRoute.startPoint,
        name: selectedRoute.name,
      };
    }
    return {
      id: null,
      coordinates: DEFAULT_HEADER_WEATHER_COORDS,
      name: DEFAULT_HEADER_WEATHER_NAME,
    };
  }, [
    selectedFishing,
    selectedPartner,
    selectedWaste,
    selectedAttraction,
    selectedLeisure,
    selectedEvent,
    selectedRoute,
  ]);

  const distanceOrigin = relatedFishingSpot?.coordinates ?? userLocation;
  const distanceOriginLabel = relatedFishingSpot
    ? t("map.selectedFishingOrigin", {
        name: localizePlaceText(relatedFishingSpot.name, locale),
      })
    : userLocation
      ? t("map.userLocationLabel")
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

  const weatherState = useWeatherData(
    weatherTarget.id,
    selectedDate,
    weatherTarget.coordinates,
  );
  const waveState = useWaveData(
    weatherTarget.id,
    weatherTarget.coordinates,
  );
  const [weatherDetailOpen, setWeatherDetailOpen] = useState(false);
  const [weatherDetail, setWeatherDetail] = useState<WeatherData | null>(null);
  const [weatherDetailLoading, setWeatherDetailLoading] = useState(false);
  const [weatherDetailError, setWeatherDetailError] = useState<string | null>(
    null,
  );

  const loadWeatherDetail = useCallback(
    async (refresh = false) => {
      const coords = weatherTarget.coordinates;
      if (!coords) return;
      setWeatherDetailLoading(true);
      setWeatherDetailError(null);
      try {
        if (weatherTarget.id) {
          const params = new URLSearchParams({
            spotId: weatherTarget.id,
            detail: "1",
          });
          if (selectedDate) params.set("date", selectedDate);
          if (refresh) params.set("refresh", "1");
          try {
            const response = await fetch(`/api/weather?${params.toString()}`);
            if (response.ok) {
              setWeatherDetail((await response.json()) as WeatherData);
              return;
            }
          } catch {
            // fall through for static hosts
          }
        }

        const { fetchLiveWeatherClient } = await import(
          "@/lib/weather/clientWeather"
        );
        const payload = await fetchLiveWeatherClient({
          coordinates: coords,
          locationName: localizePlaceText(weatherTarget.name, locale),
          detail: true,
          refresh,
        });
        setWeatherDetail(payload);
      } catch {
        setWeatherDetailError("WEATHER_FETCH_FAILED");
      } finally {
        setWeatherDetailLoading(false);
      }
    },
    [weatherTarget, selectedDate, locale],
  );

  const openWeatherDetail = useCallback(() => {
    setWeatherDetail(weatherState.data);
    setWeatherDetailOpen(true);
    void loadWeatherDetail(false);
  }, [loadWeatherDetail, weatherState.data]);

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
    if (isPloggingRoute(detail)) {
      setPloggingPreview(detail);
      setSelectedCategory("plogging");
      setSearchResults([]);
      setSearchNotice(null);
      setExternalKakaoQuery(null);
      return;
    }
    setSelectedLocationId(normalizedId);
    setSelectedCategory(resolvePlaceCategory(detail));
    if (isFishingSpot(detail)) {
      setRelatedFishingSpotId(detail.id);
    }
    setFocusRequestId((value) => value + 1);
    setPanelNotice(null);
    setSearchResults([]);
    setSearchNotice(null);
    setExternalKakaoQuery(null);
  };

  const handleSelectLocation = (id: string) => {
    const normalizedId = id.endsWith("-end") ? id.replace(/-end$/, "") : id;
    const detail = getLocationDetailById(normalizedId);
    if (detail && isPloggingRoute(detail)) {
      setPloggingPreview(detail);
      setSelectedCategory("plogging");
      return;
    }
    setSelectedLocationId(normalizedId);
    setPanelNotice(null);
    if (detail && isFishingSpot(detail)) {
      setRelatedFishingSpotId(detail.id);
    }
  };

  const confirmPloggingPreview = () => {
    if (!ploggingPreview) return;
    setSelectedLocationId(ploggingPreview.id);
    setSelectedCategory("plogging");
    setFitRouteRequestId((value) => value + 1);
    setPloggingPreview(null);
    setPanelNotice(null);
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
      setExternalKakaoQuery(null);
      return;
    }

    const results = searchMockLocations(trimmed);
    if (results.length === 0) {
      setSearchResults([]);
      setSearchNotice(t("search.noResults"));
      setExternalKakaoQuery(trimmed);
      return;
    }

    setExternalKakaoQuery(null);
    if (results.length === 1) {
      selectAndFocusLocation(results[0].id);
      setSearchNotice(t("search.movedTo", { name: results[0].name }));
      return;
    }

    setSearchNotice(null);
    setSearchResults(results);
  };

  useEffect(() => {
    queueMicrotask(() => {
      const local = loadLocalFavorites();
      const map: Record<string, boolean> = {};
      for (const item of local) {
        map[item.sourceId] = true;
      }
      setFavorites(map);
      if (authStatus !== "authenticated") {
        return;
      }
      void apiJson<{
        favorites: Array<{ sourceId: string; placeType: string }>;
      }>("/api/favorites").then((result) => {
        if (!result.ok) return;
        const next: Record<string, boolean> = { ...map };
        for (const item of result.data.favorites) {
          next[item.sourceId] = true;
        }
        setFavorites(next);
      });
    });
  }, [authStatus]);

  const handleToggleFavorite = () => {
    if (!selectedLocationId) {
      return;
    }
    const placeType = placeTypeForLocation(selectedLocationId);
    const nextActive = !favorites[selectedLocationId];
    setFavorites((prev) => ({
      ...prev,
      [selectedLocationId]: nextActive,
    }));

    const local = loadLocalFavorites().filter(
      (item) => item.sourceId !== selectedLocationId,
    );
    if (nextActive) {
      local.push({ sourceId: selectedLocationId, placeType });
    }
    persistLocalFavorites(local);

    if (authStatus === "authenticated") {
      if (nextActive) {
        void apiJson("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ sourceId: selectedLocationId, placeType }),
        }).then((result) => {
          if (!result.ok) {
            setFavorites((prev) => ({
              ...prev,
              [selectedLocationId]: false,
            }));
          }
        });
      } else {
        void apiJson(
          `/api/favorites?sourceId=${encodeURIComponent(selectedLocationId)}&placeType=${encodeURIComponent(placeType)}`,
          { method: "DELETE" },
        ).then((result) => {
          if (!result.ok) {
            setFavorites((prev) => ({
              ...prev,
              [selectedLocationId]: true,
            }));
          }
        });
      }
    }
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
    <div className="flex min-h-screen flex-col">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)}
        searchQuery={searchQuery}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          if (!value.trim()) {
            setSearchResults([]);
            setSearchNotice(null);
            setExternalKakaoQuery(null);
          }
        }}
        onSearchSubmit={handleSearchSubmit}
        searchNotice={searchNotice}
        searchResults={searchResults}
        onSelectSearchResult={selectAndFocusLocation}
        externalKakaoQuery={externalKakaoQuery}
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

        <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4 lg:h-[calc(100vh-7.5rem)] lg:flex-row lg:gap-5 lg:overflow-hidden lg:px-5">
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
                className="absolute bottom-16 left-1/2 z-40 w-[min(90%,360px)] -translate-x-1/2 rounded-2xl border border-[var(--color-border)] bg-white/90 px-3 py-2 text-center text-xs text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] backdrop-blur-md"
                role="status"
              >
                {mapNotice}
              </p>
            ) : null}
            {ploggingSession.status === "inProgress" &&
            ploggingSession.routeId ? (
              <p
                className="absolute bottom-4 left-1/2 z-40 w-[min(90%,360px)] -translate-x-1/2 rounded-2xl border border-teal-200 bg-teal-50/95 px-3 py-2 text-center text-xs font-medium text-teal-900 shadow-[var(--shadow-soft)] backdrop-blur-md"
                role="status"
                aria-live="polite"
              >
                {t("environment.ploggingInProgress")}
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
                onDirections={() => setPanelNotice(t("common.directionsNotice"))}
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

            {selectedAttraction ? (
              <AttractionDetailPanel attraction={selectedAttraction} />
            ) : null}

            {selectedLeisure ? (
              <LeisureDetailPanel place={selectedLeisure} />
            ) : null}

            {selectedEvent ? (
              <EventDetailPanel
                event={selectedEvent}
                onDirections={() => setPanelNotice(t("common.directionsNotice"))}
                notice={panelNotice}
              />
            ) : null}

            {showEventList ? (
              <EventList
                events={coastalEvents}
                selectedEventId={selectedEvent?.id ?? null}
                onSelectEvent={selectAndFocusLocation}
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
                onDirections={() => setPanelNotice(t("common.directionsNotice"))}
                onAddToSchedule={handleAddFishingToSchedule}
                scheduleAdded={scheduleApi.isSourceInSchedule(selectedFishing.id)}
                notice={panelNotice}
              />
            ) : null}

            {!selectedPartner &&
            !selectedWaste &&
            !selectedRoute &&
            !selectedFishing &&
            !selectedAttraction &&
            !selectedLeisure &&
            !selectedEvent ? (
              <LocationDetailPanel
                location={null}
                isFavorite={false}
                onToggleFavorite={handleToggleFavorite}
                onDirections={() => setPanelNotice(t("common.directionsNotice"))}
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
              <div className="glass-panel rounded-[var(--radius-xl)] p-4 text-xs text-[var(--color-text-secondary)]">
                <p className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                  {t("common.schedule")} ({scheduleApi.schedule.items.length})
                </p>
                <ul className="mt-2 space-y-1.5">
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
                    className="inline-flex h-8 items-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] px-3.5 text-xs font-semibold text-white"
                  >
                    {t("schedule.editLink")}
                  </Link>
                  <Link
                    href="/schedules"
                    className="inline-flex h-8 items-center rounded-full border border-[var(--color-border)] bg-white/70 px-3.5 text-xs font-semibold"
                  >
                    {t("schedule.savedList")}
                  </Link>
                </div>
                <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                  {t("schedule.draftSavedLocal")}
                </p>
              </div>
            ) : (
              <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-white/60 p-4 text-xs text-[var(--color-text-secondary)] backdrop-blur-sm">
                <p>{t("schedule.empty")}</p>
                <Link
                  href="/schedule"
                  className="mt-2 inline-flex font-semibold text-[var(--color-accent-strong)]"
                >
                  {t("schedule.createLink")}
                </Link>
              </div>
            )}

            <>
              <WeatherCard
                weather={weatherState.data}
                loading={weatherState.loading}
                error={weatherState.error}
                onRetry={weatherState.reload}
                onOpenDetail={openWeatherDetail}
              />
              <WaveCard
                wave={waveState.data}
                loading={waveState.loading}
                error={waveState.error}
                onRetry={waveState.reload}
              />
            </>
          </aside>
        </main>
      </div>

      <WeatherDetailDialog
        open={weatherDetailOpen}
        weather={weatherDetail}
        loading={weatherDetailLoading}
        error={weatherDetailError}
        onClose={() => setWeatherDetailOpen(false)}
        onRefresh={() => {
          void loadWeatherDetail(true);
        }}
      />

      {ploggingPreview ? (
        <PloggingCoursePopup
          route={ploggingPreview}
          onClose={() => setPloggingPreview(null)}
          onOpenDetail={confirmPloggingPreview}
        />
      ) : null}
    </div>
  );
}
