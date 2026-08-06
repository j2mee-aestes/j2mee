"use client";

import { useEffect, useRef } from "react";
import { createMarkerContent } from "@/lib/map/markerContent";
import type { MapLocation } from "@/types/map";

interface MapMarkerLayerProps {
  map: KakaoMap | null;
  locations: MapLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
}

interface OverlayEntry {
  overlay: KakaoCustomOverlay;
  locationId: string;
}

export function MapMarkerLayer({
  map,
  locations,
  selectedLocationId,
  onSelectLocation,
}: MapMarkerLayerProps) {
  const overlaysRef = useRef<OverlayEntry[]>([]);
  const onSelectRef = useRef(onSelectLocation);

  useEffect(() => {
    onSelectRef.current = onSelectLocation;
  }, [onSelectLocation]);

  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    overlaysRef.current.forEach((entry) => entry.overlay.setMap(null));
    overlaysRef.current = [];

    const nextOverlays = locations.map((location) => {
      const selected = location.id === selectedLocationId;
      const content = createMarkerContent(location, selected, (id) => {
        onSelectRef.current(id);
      });

      const overlay = new window.kakao.maps.CustomOverlay({
        map,
        position: new window.kakao.maps.LatLng(
          location.coordinates.latitude,
          location.coordinates.longitude,
        ),
        content,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: selected ? 10 : 1,
        clickable: true,
      });

      return { overlay, locationId: location.id };
    });

    overlaysRef.current = nextOverlays;

    return () => {
      nextOverlays.forEach((entry) => entry.overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [map, locations, selectedLocationId]);

  return null;
}
