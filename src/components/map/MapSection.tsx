"use client";

import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import type { CategoryFilter } from "@/types/map";

interface MapSectionProps {
  selectedCategory: CategoryFilter;
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onNotice: (message: string) => void;
}

/**
 * Map container that can later wrap a real map SDK.
 * Phase 2 uses MapPlaceholder; replace its internals without changing this API.
 */
export function MapSection({
  selectedCategory,
  selectedLocationId,
  onSelectLocation,
  onCategoryChange,
  onNotice,
}: MapSectionProps) {
  return (
    <MapPlaceholder
      selectedCategory={selectedCategory}
      selectedLocationId={selectedLocationId}
      onSelectLocation={onSelectLocation}
      onCategoryChange={onCategoryChange}
      onNotice={onNotice}
    />
  );
}
