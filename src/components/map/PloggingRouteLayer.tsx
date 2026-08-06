"use client";

import { useEffect, useRef } from "react";
import { CATEGORY_COLORS } from "@/constants/categories";
import type { CategoryFilter } from "@/types/map";
import type { PloggingRoute } from "@/types/environment";

interface PloggingRouteLayerProps {
  map: KakaoMap | null;
  routes: PloggingRoute[];
  selectedCategory: CategoryFilter;
  selectedRouteId: string | null;
  onSelectRoute?: (routeId: string) => void;
}

/** Kakao Polyline layer for plogging courses with selection emphasis. */
export function PloggingRouteLayer({
  map,
  routes,
  selectedCategory,
  selectedRouteId,
  onSelectRoute,
}: PloggingRouteLayerProps) {
  const polylinesRef = useRef<KakaoPolyline[]>([]);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);

  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    polylinesRef.current.forEach((line) => line.setMap(null));
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    polylinesRef.current = [];
    overlaysRef.current = [];

    const show =
      selectedCategory === "all" || selectedCategory === "plogging";
    if (!show) {
      return;
    }

    const categoryEmphasized = selectedCategory === "plogging";

    routes.forEach((route) => {
      if (route.coordinates.length < 2) {
        return;
      }

      const selected = selectedRouteId === route.id;
      const emphasized = selected || (categoryEmphasized && !selectedRouteId);

      const path = route.coordinates.map(
        (point) =>
          new window.kakao.maps.LatLng(point.latitude, point.longitude),
      );

      const polyline = new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: selected ? 7 : emphasized ? 6 : 4,
        strokeColor: selected ? "#0f766e" : CATEGORY_COLORS.plogging,
        strokeOpacity: selected ? 1 : emphasized ? 0.9 : 0.45,
        strokeStyle: selected || emphasized ? "solid" : "shortdash",
        zIndex: selected ? 6 : emphasized ? 4 : 2,
      });
      polylinesRef.current.push(polyline);

      if (onSelectRoute) {
        window.kakao.maps.event.addListener(polyline, "click", () => {
          onSelectRoute(route.id);
        });
      }

      // Start / end badges
      const startBadge = createEndpointBadge("시작", selected);
      const endBadge = createEndpointBadge("종료", selected);
      overlaysRef.current.push(
        new window.kakao.maps.CustomOverlay({
          map,
          position: new window.kakao.maps.LatLng(
            route.startPoint.latitude,
            route.startPoint.longitude,
          ),
          content: startBadge,
          yAnchor: 1.2,
          zIndex: selected ? 8 : 3,
        }),
        new window.kakao.maps.CustomOverlay({
          map,
          position: new window.kakao.maps.LatLng(
            route.endPoint.latitude,
            route.endPoint.longitude,
          ),
          content: endBadge,
          yAnchor: 1.2,
          zIndex: selected ? 8 : 3,
        }),
      );

      const mid = route.coordinates[Math.floor(route.coordinates.length / 2)];
      if (mid && (selected || emphasized)) {
        const badge = document.createElement("button");
        badge.type = "button";
        badge.setAttribute("aria-label", `${route.name} 코스 선택`);
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
          cursor: pointer;
        `;
        badge.textContent = `${route.name} · ${route.distanceKm}km`;
        if (onSelectRoute) {
          badge.addEventListener("click", (event) => {
            event.stopPropagation();
            onSelectRoute(route.id);
          });
        }
        overlaysRef.current.push(
          new window.kakao.maps.CustomOverlay({
            map,
            position: new window.kakao.maps.LatLng(mid.latitude, mid.longitude),
            content: badge,
            yAnchor: 1.4,
            zIndex: selected ? 9 : 5,
          }),
        );
      }
    });

    return () => {
      polylinesRef.current.forEach((line) => line.setMap(null));
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      polylinesRef.current = [];
      overlaysRef.current = [];
    };
  }, [map, routes, selectedCategory, selectedRouteId, onSelectRoute]);

  return null;
}

/** @deprecated Use PloggingRouteLayer */
export { PloggingRouteLayer as PloggingPolylineLayer };

function createEndpointBadge(label: string, selected: boolean): HTMLElement {
  const badge = document.createElement("div");
  badge.textContent = label;
  badge.style.cssText = `
    padding: 2px 6px;
    border-radius: 6px;
    border: 1px solid ${selected ? "#0f766e" : "#99f6e4"};
    background: ${selected ? "#0f766e" : "#fff"};
    color: ${selected ? "#fff" : "#0f766e"};
    font-size: 10px;
    font-weight: 700;
  `;
  return badge;
}
