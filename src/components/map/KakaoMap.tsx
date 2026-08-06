"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { MapMarkerLayer } from "@/components/map/MapMarkerLayer";
import { PloggingPolylineLayer } from "@/components/map/PloggingPolylineLayer";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
  SINGLE_MARKER_ZOOM_LEVEL,
  USER_LOCATION_ZOOM_LEVEL,
} from "@/lib/map/constants";
import { createUserLocationContent } from "@/lib/map/markerContent";
import type {
  CategoryFilter,
  Coordinates,
  MapLocation,
  PloggingRoute,
} from "@/types/map";

/** Captures global Kakao map instance type before component value shadows it. */
type KakaoMapInstance = KakaoMap;

export interface KakaoMapHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (coords: Coordinates, level?: number) => void;
  fitLocations: (locations: MapLocation[]) => void;
  setUserLocation: (coords: Coordinates | null) => void;
  relayout: () => void;
}

interface KakaoMapProps {
  locations: MapLocation[];
  routes: PloggingRoute[];
  selectedCategory: CategoryFilter;
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
  onReady?: () => void;
}

export const KakaoMap = forwardRef<KakaoMapHandle, KakaoMapProps>(
  function KakaoMapComponent(
    {
      locations,
      routes,
      selectedCategory,
      selectedLocationId,
      onSelectLocation,
      onReady,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<KakaoMapInstance | null>(null);
    const userOverlayRef = useRef<KakaoCustomOverlay | null>(null);
    const [mapInstance, setMapInstance] = useState<KakaoMapInstance | null>(
      null,
    );
    const didInitialFit = useRef(false);
    const onReadyRef = useRef(onReady);
    const locationsRef = useRef(locations);

    useEffect(() => {
      onReadyRef.current = onReady;
    }, [onReady]);

    useEffect(() => {
      locationsRef.current = locations;
    }, [locations]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !window.kakao?.maps) {
        return;
      }

      let cancelled = false;
      const center = new window.kakao.maps.LatLng(
        DEFAULT_CENTER.latitude,
        DEFAULT_CENTER.longitude,
      );

      const map = new window.kakao.maps.Map(container, {
        center,
        level: DEFAULT_ZOOM_LEVEL,
      });

      if (cancelled) {
        return;
      }

      mapRef.current = map;
      setMapInstance(map);
      onReadyRef.current?.();

      const handleResize = () => {
        map.relayout();
      };
      window.addEventListener("resize", handleResize);

      const observer = new ResizeObserver(() => {
        map.relayout();
      });
      observer.observe(container);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", handleResize);
        observer.disconnect();
        userOverlayRef.current?.setMap(null);
        userOverlayRef.current = null;
        mapRef.current = null;
        setMapInstance(null);
        container.innerHTML = "";
        didInitialFit.current = false;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        const map = mapRef.current;
        if (!map) {
          return;
        }
        const next = Math.max(MIN_ZOOM_LEVEL, map.getLevel() - 1);
        map.setLevel(next, { animate: true });
      },
      zoomOut: () => {
        const map = mapRef.current;
        if (!map) {
          return;
        }
        const next = Math.min(MAX_ZOOM_LEVEL, map.getLevel() + 1);
        map.setLevel(next, { animate: true });
      },
      panTo: (coords, level) => {
        const map = mapRef.current;
        if (!map || !window.kakao?.maps) {
          return;
        }
        const latlng = new window.kakao.maps.LatLng(
          coords.latitude,
          coords.longitude,
        );
        map.panTo(latlng);
        if (level !== undefined) {
          map.setLevel(level, { animate: true });
        }
      },
      fitLocations: (targets) => {
        fitMapToLocations(mapRef.current, targets);
      },
      setUserLocation: (coords) => {
        const map = mapRef.current;
        if (!map || !window.kakao?.maps) {
          return;
        }

        userOverlayRef.current?.setMap(null);
        userOverlayRef.current = null;

        if (!coords) {
          return;
        }

        const latlng = new window.kakao.maps.LatLng(
          coords.latitude,
          coords.longitude,
        );
        const overlay = new window.kakao.maps.CustomOverlay({
          map,
          position: latlng,
          content: createUserLocationContent(),
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 20,
        });
        userOverlayRef.current = overlay;
        map.setLevel(USER_LOCATION_ZOOM_LEVEL, { animate: true });
        map.panTo(latlng);
      },
      relayout: () => {
        mapRef.current?.relayout();
      },
    }));

    useEffect(() => {
      if (!mapInstance || didInitialFit.current) {
        return;
      }
      if (locations.length === 0) {
        return;
      }
      fitMapToLocations(mapInstance, locations);
      didInitialFit.current = true;
    }, [mapInstance, locations]);

    useEffect(() => {
      if (!mapInstance || !didInitialFit.current) {
        return;
      }
      fitMapToLocations(mapInstance, locationsRef.current);
    }, [mapInstance, selectedCategory]);

    useEffect(() => {
      if (!mapInstance || !selectedLocationId || !window.kakao?.maps) {
        return;
      }
      const selected = locations.find((item) => item.id === selectedLocationId);
      if (!selected) {
        return;
      }
      mapInstance.panTo(
        new window.kakao.maps.LatLng(
          selected.coordinates.latitude,
          selected.coordinates.longitude,
        ),
      );
    }, [mapInstance, selectedLocationId, locations]);

    return (
      <div className="relative h-full min-h-[360px] w-full sm:min-h-[440px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        <MapMarkerLayer
          map={mapInstance}
          locations={locations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={onSelectLocation}
        />
        <PloggingPolylineLayer
          map={mapInstance}
          routes={routes}
          selectedCategory={selectedCategory}
        />
      </div>
    );
  },
);

function fitMapToLocations(
  map: KakaoMapInstance | null,
  locations: MapLocation[],
) {
  if (!map || !window.kakao?.maps) {
    return;
  }

  if (locations.length === 0) {
    map.setCenter(
      new window.kakao.maps.LatLng(
        DEFAULT_CENTER.latitude,
        DEFAULT_CENTER.longitude,
      ),
    );
    map.setLevel(DEFAULT_ZOOM_LEVEL);
    return;
  }

  if (locations.length === 1) {
    const only = locations[0];
    map.setCenter(
      new window.kakao.maps.LatLng(
        only.coordinates.latitude,
        only.coordinates.longitude,
      ),
    );
    map.setLevel(SINGLE_MARKER_ZOOM_LEVEL, { animate: true });
    return;
  }

  const bounds = new window.kakao.maps.LatLngBounds();
  locations.forEach((location) => {
    bounds.extend(
      new window.kakao.maps.LatLng(
        location.coordinates.latitude,
        location.coordinates.longitude,
      ),
    );
  });
  map.setBounds(bounds, 64, 64, 64, 64);
}
