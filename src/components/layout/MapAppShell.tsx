"use client";

import { useMemo, useState } from "react";
import { FishingSpotCard } from "@/components/fishing/FishingSpotCard";
import { Header } from "@/components/layout/Header";
import { MobileCategoryBar } from "@/components/layout/MobileCategoryBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import type { LanguageCode } from "@/constants/languages";
import {
  DEFAULT_SELECTED_SPOT_ID,
  mockFishingSpots,
  mockTideTimes,
} from "@/data/mockFishingSpots";
import type { CategoryFilter } from "@/types/map";

export function MapAppShell() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [language, setLanguage] = useState<LanguageCode>("KR");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(
    DEFAULT_SELECTED_SPOT_ID,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedSpot = useMemo(
    () =>
      mockFishingSpots.find((spot) => spot.id === selectedSpotId) ?? null,
    [selectedSpotId],
  );

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)}
      />

      <MobileCategoryBar
        language={language}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <Sidebar
          language={language}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          mobileOpen={mobileMenuOpen}
        />

        <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:gap-4 lg:overflow-hidden">
          <MapPlaceholder
            language={language}
            selectedCategory={selectedCategory}
            selectedSpotId={selectedSpotId}
            onSelectSpot={setSelectedSpotId}
          />

          <aside className="w-full shrink-0 lg:w-80 xl:w-96 lg:overflow-y-auto">
            <FishingSpotCard
              language={language}
              spot={selectedSpot}
              tides={mockTideTimes}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}
