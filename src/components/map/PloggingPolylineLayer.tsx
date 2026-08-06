"use client";

import { useEffect, useRef } from "react";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { CategoryFilter, PloggingRoute } from "@/types/map";

interface PloggingPolylineLayerProps {
  map: KakaoMap | null;
  routes: PloggingRoute[];
  selectedCategory: CategoryFilter;
}

export function PloggingPolylineLayer({
  map,
  routes,
  selectedCategory,
}: PloggingPolylineLayerProps) {
  const polylinesRef = useRef<KakaoPolyline[]>([]);
  const badgesRef = useRef<KakaoCustomOverlay[]>([]);

  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    polylinesRef.current.forEach((line) => line.setMap(null));
    badgesRef.current.forEach((badge) => badge.setMap(null));
    polylinesRef.current = [];
    badgesRef.current = [];

    const show =
      selectedCategory === "all" || selectedCategory === "plogging";
    if (!show) {
      return;
    }

    const emphasized = selectedCategory === "plogging";

    routes.forEach((route) => {
      if (route.coordinates.length < 2) {
        return;
      }

      const path = route.coordinates.map(
        (point) =>
          new window.kakao.maps.LatLng(point.latitude, point.longitude),
      );

      const polyline = new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: emphasized ? 6 : 4,
        strokeColor: CATEGORY_COLORS.plogging,
        strokeOpacity: emphasized ? 0.95 : 0.55,
        strokeStyle: emphasized ? "solid" : "shortdash",
        zIndex: emphasized ? 4 : 2,
      });
      polylinesRef.current.push(polyline);

      const mid = route.coordinates[Math.floor(route.coordinates.length / 2)];
      if (mid) {
        const badge = document.createElement("div");
        badge.style.cssText = `
          padding: 4px 8px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.95);
          color: #0f172a;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(15,23,42,0.12);
          white-space: nowrap;
        `;
        badge.textContent = `${route.name} · ${route.distanceKm}km`;

        const overlay = new window.kakao.maps.CustomOverlay({
          map: emphasized ? map : null,
          position: new window.kakao.maps.LatLng(mid.latitude, mid.longitude),
          content: badge,
          yAnchor: 1.4,
          zIndex: 5,
        });
        badgesRef.current.push(overlay);
      }
    });

    return () => {
      polylinesRef.current.forEach((line) => line.setMap(null));
      badgesRef.current.forEach((badge) => badge.setMap(null));
      polylinesRef.current = [];
      badgesRef.current = [];
    };
  }, [map, routes, selectedCategory]);

  return null;
}
