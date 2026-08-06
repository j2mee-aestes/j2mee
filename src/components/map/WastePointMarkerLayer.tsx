"use client";

/**
 * Waste point markers are rendered via the unified MapMarkerLayer.
 * This helper filters waste locations for map composition and emphasis.
 */
import { MapMarkerLayer } from "@/components/map/MapMarkerLayer";
import type { MapLocation } from "@/types/map";

interface WastePointMarkerLayerProps {
  map: KakaoMap | null;
  locations: MapLocation[];
  selectedLocationId: string | null;
  highlightedIds?: string[];
  onSelectLocation: (locationId: string) => void;
}

export function filterWasteMapLocations(
  locations: MapLocation[],
): MapLocation[] {
  return locations.filter((location) => location.category === "trash");
}

export function WastePointMarkerLayer({
  map,
  locations,
  selectedLocationId,
  highlightedIds = [],
  onSelectLocation,
}: WastePointMarkerLayerProps) {
  const wasteLocations = filterWasteMapLocations(locations).map((location) =>
    highlightedIds.includes(location.id)
      ? { ...location, isVerified: true }
      : location,
  );

  return (
    <MapMarkerLayer
      map={map}
      locations={wasteLocations}
      selectedLocationId={selectedLocationId}
      onSelectLocation={onSelectLocation}
    />
  );
}
