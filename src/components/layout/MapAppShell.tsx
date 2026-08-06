"use client";

import { useEffect, useMemo, useState } from "react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { Header } from "@/components/layout/Header";
import { MobileCategoryBar } from "@/components/layout/MobileCategoryBar";
import { LocationDetailPanel } from "@/components/location/LocationDetailPanel";
import { MapSection } from "@/components/map/MapSection";
import { TideSummary } from "@/components/tide/TideSummary";
import type { LanguageCode } from "@/constants/languages";
import { UI_TEXT } from "@/constants/uiText";
import { DEFAULT_SELECTED_LOCATION_ID } from "@/data/mockFishingSpots";
import {
  getLocationDetailById,
  searchMockLocations,
} from "@/data/mockMapLocations";
import { mockTideData } from "@/data/mockTideData";
import type { LocationDetail } from "@/types/fishing";
import type { CategoryFilter } from "@/types/map";

export function MapAppShell() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [language, setLanguage] = useState<LanguageCode>("KR");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    DEFAULT_SELECTED_LOCATION_ID,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotice, setSearchNotice] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<LocationDetail[]>([]);
  const [panelNotice, setPanelNotice] = useState<string | null>(null);
  const [mapNotice, setMapNotice] = useState<string | null>(null);
  const [tideHighlighted, setTideHighlighted] = useState(false);
  const [focusRequestId, setFocusRequestId] = useState(0);

  const selectedLocation = useMemo(
    () =>
      selectedLocationId
        ? getLocationDetailById(selectedLocationId)
        : null,
    [selectedLocationId],
  );

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
    if (
      category !== "all" &&
      selectedLocation &&
      selectedLocation.category !== category
    ) {
      setSelectedLocationId(null);
    }
  };

  const selectAndFocusLocation = (locationId: string) => {
    const detail = getLocationDetailById(locationId);
    if (!detail) {
      return;
    }
    setSelectedLocationId(locationId);
    setSelectedCategory("all");
    setPanelNotice(null);
    setSearchResults([]);
    setSearchNotice(null);
    setFocusRequestId((value) => value + 1);
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
              onSelectLocation={(id) => {
                setSelectedLocationId(id);
                setPanelNotice(null);
              }}
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

          <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-80 lg:overflow-y-auto xl:w-96">
            <LocationDetailPanel
              location={selectedLocation}
              isFavorite={Boolean(
                selectedLocationId && favorites[selectedLocationId],
              )}
              onToggleFavorite={handleToggleFavorite}
              onDirections={() => setPanelNotice(UI_TEXT.directionsNotice)}
              notice={panelNotice}
            />
            <TideSummary tide={mockTideData} highlighted={tideHighlighted} />
          </aside>
        </main>
      </div>
    </div>
  );
}
