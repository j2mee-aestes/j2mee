"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  isFacilityLocation,
  isFishingSpot,
  isPartnerPlace,
  searchMockLocations,
} from "@/data/mockMapLocations";
import {
  useTideData,
  useWeatherData,
} from "@/hooks/useSpotEnvironmentData";
import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import { partnerTypeToMapCategory } from "@/lib/map/partnerMapLocation";
import type { SearchablePlace } from "@/data/mockMapLocations";
import type { CategoryFilter } from "@/types/map";
import type { ScheduleItem } from "@/types/partner";

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
  return place.category;
}

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
    return place && isFishingSpot(place) ? place.id : DEFAULT_SELECTED_LOCATION_ID;
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
  const [chartExpanded, setChartExpanded] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

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
  const selectedFacility = isFacilityLocation(selectedLocation)
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

  const partnerDistanceKm =
    selectedPartner && relatedFishingSpot
      ? calculateDistanceKm(
          relatedFishingSpot.coordinates,
          selectedPartner.coordinates,
        )
      : null;

  const tideState = useTideData(fishingSpotId, selectedDate);
  const weatherState = useWeatherData(fishingSpotId, selectedDate);

  const schedulePartnerIds = useMemo(
    () => scheduleItems.map((item) => item.partnerId),
    [scheduleItems],
  );

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
    const detail = getLocationDetailById(locationId);
    if (!detail) {
      return;
    }
    setSelectedLocationId(locationId);
    setSelectedCategory(resolvePlaceCategory(detail));
    if (isFishingSpot(detail)) {
      setRelatedFishingSpotId(detail.id);
    }
    setPanelNotice(null);
    setSearchResults([]);
    setSearchNotice(null);
    setFocusRequestId((value) => value + 1);
  };

  const handleSelectLocation = (id: string) => {
    const detail = getLocationDetailById(id);
    setSelectedLocationId(id);
    setPanelNotice(null);
    if (detail && isFishingSpot(detail)) {
      setRelatedFishingSpotId(detail.id);
    }
  };

  const handleAddToSchedule = (partnerId: string) => {
    const partner = getLocationDetailById(partnerId);
    if (!partner || !isPartnerPlace(partner)) {
      return;
    }
    setScheduleItems((prev) => {
      if (prev.some((item) => item.partnerId === partnerId)) {
        setPanelNotice(`${partner.name}은(는) 이미 일정에 추가되어 있습니다.`);
        return prev;
      }
      setPanelNotice(`${partner.name}이(가) 일정에 추가되었습니다.`);
      return [
        ...prev,
        {
          id: `schedule-${partnerId}-${Date.now()}`,
          partnerId: partner.id,
          partnerName: partner.name,
          partnerType: partner.type,
          relatedFishingSpotId: relatedFishingSpotId ?? undefined,
          addedAt: new Date().toISOString(),
        },
      ];
    });
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
              onSelectLocation={handleSelectLocation}
              onCategoryChange={handleCategoryChange}
              onNotice={setMapNotice}
              focusRequestId={focusRequestId}
            />
            {mapNotice ? (
              <p
                className="absolute bottom-16 left-1/2 z-40 w-[min(90%,360px)] -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-center text-xs text-[var(--color-text-secondary)] shadow-md"
                role="status"
              >
                {mapNotice}
              </p>
            ) : null}
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-3 pb-20 lg:w-80 lg:overflow-y-auto lg:pb-0 xl:w-96">
            {selectedPartner ? (
              <PartnerDetailPanel
                partner={selectedPartner}
                originLabel={
                  relatedFishingSpot
                    ? `선택한 낚시터(${relatedFishingSpot.name})`
                    : null
                }
                originCoordinates={relatedFishingSpot?.coordinates ?? null}
                distanceKm={partnerDistanceKm}
                onAddToSchedule={() => handleAddToSchedule(selectedPartner.id)}
                scheduleAdded={schedulePartnerIds.includes(selectedPartner.id)}
                notice={panelNotice}
              />
            ) : (
              <LocationDetailPanel
                location={selectedFishing ?? selectedFacility}
                weather={weatherState.data}
                isFavorite={Boolean(
                  selectedLocationId && favorites[selectedLocationId],
                )}
                onToggleFavorite={handleToggleFavorite}
                onDirections={() => setPanelNotice(UI_TEXT.directionsNotice)}
                notice={panelNotice}
              />
            )}

            {selectedFishing || (relatedFishingSpot && selectedPartner) ? (
              <NearbyPartnerSection
                origin={
                  (selectedFishing ?? relatedFishingSpot)!.coordinates
                }
                originName={(selectedFishing ?? relatedFishingSpot)!.name}
                selectedPartnerId={selectedPartner?.id ?? null}
                schedulePartnerIds={schedulePartnerIds}
                onSelectPartner={selectAndFocusLocation}
                onAddToSchedule={handleAddToSchedule}
              />
            ) : null}

            {scheduleItems.length > 0 ? (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 text-xs text-[var(--color-text-secondary)]">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  임시 일정 ({scheduleItems.length})
                </p>
                <ul className="mt-1.5 space-y-1">
                  {scheduleItems.map((item) => (
                    <li key={item.id}>· {item.partnerName}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
                  새로고침 후 유지되지 않습니다. 정식 일정 기능은 다음 단계에서
                  연결됩니다.
                </p>
              </div>
            ) : null}

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
