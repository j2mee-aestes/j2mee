"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { MapMarkerLayer } from "@/components/map/MapMarkerLayer";
import { PloggingRouteLayer } from "@/components/map/PloggingRouteLayer";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
  SINGLE_MARKER_ZOOM_LEVEL,
  USER_LOCATION_ZOOM_LEVEL,
} from "@/lib/map/constants";
import { createUserLocationContent } from "@/lib/map/markerContent";
import type { CategoryFilter, Coordinates, MapLocation } from "@/types/map";
import type { PloggingRoute } from "@/types/environment";

type KakaoMapInstance = KakaoMap;

export interface KakaoMapHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  panTo: (coords: Coordinates, level?: number) => void;
  fitLocations: (locations: MapLocation[]) => void;
  fitRoute: (route: PloggingRoute) => void;
  setUserLocation: (coords: Coordinates | null) => void;
  relayout: () => void;
}

interface KakaoMapProps {
  locations: MapLocation[];
  routes: PloggingRoute[];
  selectedCategory: CategoryFilter;
  selectedLocationId: string | null;
  selectedRouteId?: string | null;
  onSelectLocation: (locationId: string) => void;
  onSelectRoute?: (routeId: string) => void;
  onReady?: () => void;
}

export const KakaoMap = forwardRef<KakaoMapHandle, KakaoMapProps>(
  function KakaoMapComponent(
    {
      locations,
      routes,
      selectedCategory,
      selectedLocationId,
      selectedRouteId = null,
      onSelectLocation,
      onSelectRoute,
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
      if (!container || !window.kakao?.maps?.Map) {
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

      // Containers often need an extra relayout after first paint / flex layout
      const relayoutSoon = () => {
        if (!cancelled) {
          map.relayout();
        }
      };
      const raf = window.requestAnimationFrame(relayoutSoon);
      const relayoutTimer = window.setTimeout(relayoutSoon, 120);

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
        window.cancelAnimationFrame(raf);
        window.clearTimeout(relayoutTimer);
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
      fitRoute: (route) => {
        fitMapToRoute(mapRef.current, route);
      },
      setUserLocation: (coords) => {
        const map = mapRef.current;
        if (!map || !window.kakao?.maps) {
          return;
        }

        if (!coords) {
          userOverlayRef.current?.setMap(null);
          userOverlayRef.current = null;
          return;
        }

        const latlng = new window.kakao.maps.LatLng(
          coords.latitude,
          coords.longitude,
        );

        if (userOverlayRef.current) {
          userOverlayRef.current.setPosition(latlng);
        } else {
          const overlay = new window.kakao.maps.CustomOverlay({
            map,
            position: latlng,
            content: createUserLocationContent(),
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 20,
          });
          userOverlayRef.current = overlay;
        }

        // Kakao level: higher number = more zoomed out. Only zoom in when needed.
        if (map.getLevel() > USER_LOCATION_ZOOM_LEVEL) {
          map.setLevel(USER_LOCATION_ZOOM_LEVEL, { animate: true });
        }
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

    useEffect(() => {
      if (!mapInstance || !selectedRouteId) {
        return;
      }
      const route = routes.find((item) => item.id === selectedRouteId);
      if (!route) {
        return;
      }
      fitMapToRoute(mapInstance, route);
    }, [mapInstance, selectedRouteId, routes]);

    return (
      <div className="relative h-full min-h-[360px] w-full sm:min-h-[440px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        <MapMarkerLayer
          map={mapInstance}
          locations={locations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={onSelectLocation}
        />
        <PloggingRouteLayer
          map={mapInstance}
          routes={routes}
          selectedCategory={selectedCategory}
          selectedRouteId={selectedRouteId}
          onSelectRoute={onSelectRoute}
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

function fitMapToRoute(map: KakaoMapInstance | null, route: PloggingRoute) {
  if (!map || !window.kakao?.maps) {
    return;
  }
  const bounds = new window.kakao.maps.LatLngBounds();
  route.coordinates.forEach((point) => {
    bounds.extend(
      new window.kakao.maps.LatLng(point.latitude, point.longitude),
    );
  });
  map.setBounds(bounds, 72, 72, 72, 72);
}
