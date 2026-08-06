"use client";

/**
 * Partner markers share the unified MapMarkerLayer.
 * This module documents partner-specific filtering for map composition.
 */
import { MapMarkerLayer } from "@/components/map/MapMarkerLayer";
import type { MapLocation } from "@/types/map";

interface PartnerMarkerLayerProps {
  map: KakaoMap | null;
  locations: MapLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
}

export function filterPartnerMapLocations(
  locations: MapLocation[],
): MapLocation[] {
  return locations.filter((location) => Boolean(location.partnerType));
}

/** Renders only partner place markers on the Kakao map. */
export function PartnerMarkerLayer({
  map,
  locations,
  selectedLocationId,
  onSelectLocation,
}: PartnerMarkerLayerProps) {
  return (
    <MapMarkerLayer
      map={map}
      locations={filterPartnerMapLocations(locations)}
      selectedLocationId={selectedLocationId}
      onSelectLocation={onSelectLocation}
    />
  );
}
