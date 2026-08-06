"use client";

import { useEffect, useRef } from "react";
import { SCHEDULE_TYPE_COLORS } from "@/constants/scheduleDefaults";
import { getPloggingRouteById } from "@/lib/environment/ploggingRouteRepository";
import { getWastePointById } from "@/lib/environment/wastePointRepository";
import type { ActivityExecutionItem, ActivityRun } from "@/types/activity";

interface ActivityMapLayerProps {
  map: KakaoMap | null;
  run: ActivityRun;
  focusItemId?: string | null;
  nextItemId?: string | null;
  fitAll?: boolean;
  showCompletedOnly?: boolean;
  showDisposalPoints?: boolean;
  interactive?: boolean;
  onSelectItem?: (itemId: string) => void;
}

function markerStyle(
  item: ActivityExecutionItem,
  options: { focused: boolean; isNext: boolean },
): { bg: string; opacity: string; border: string; label: string; size: number } {
  const color = SCHEDULE_TYPE_COLORS[item.type];
  if (item.status === "completed") {
    return {
      bg: "#059669",
      opacity: "1",
      border: options.focused ? "3px solid #fff" : "2px solid #fff",
      label: "✓",
      size: options.focused ? 34 : 30,
    };
  }
  if (item.status === "inProgress" || options.focused) {
    return {
      bg: color,
      opacity: "1",
      border: "3px solid #0f172a",
      label: String(item.order),
      size: 36,
    };
  }
  if (item.status === "skipped") {
    return {
      bg: "#94a3b8",
      opacity: "0.45",
      border: "2px solid #fff",
      label: String(item.order),
      size: 26,
    };
  }
  if (options.isNext) {
    return {
      bg: color,
      opacity: "1",
      border: "3px solid #f59e0b",
      label: String(item.order),
      size: 32,
    };
  }
  return {
    bg: color,
    opacity: "0.9",
    border: "2px solid #fff",
    label: String(item.order),
    size: 28,
  };
}

/** Status-aware markers + reference lines + optional plogging polylines / disposal points. */
export function ActivityMapLayer({
  map,
  run,
  focusItemId = null,
  nextItemId = null,
  fitAll = false,
  showCompletedOnly = false,
  showDisposalPoints = false,
  interactive = true,
  onSelectItem,
}: ActivityMapLayerProps) {
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const polylinesRef = useRef<KakaoPolyline[]>([]);

  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
    polylinesRef.current.forEach((line) => line.setMap(null));
    polylinesRef.current = [];

    const ordered = [...run.items]
      .sort((a, b) => a.order - b.order)
      .filter((item) =>
        showCompletedOnly ? item.status === "completed" : true,
      );

    if (ordered.length === 0) {
      return;
    }

    ordered.forEach((item) => {
      const focused = item.id === focusItemId;
      const isNext = item.id === nextItemId;
      const style = markerStyle(item, { focused, isNext });
      const content = document.createElement(
        interactive ? "button" : "div",
      ) as HTMLButtonElement;
      if (interactive) {
        content.type = "button";
      }
      content.setAttribute(
        "aria-label",
        `${item.order}번 ${item.title} (${item.status})`,
      );
      content.style.cssText = `
        width: ${style.size}px;
        height: ${style.size}px;
        border-radius: 9999px;
        border: ${style.border};
        background: ${style.bg};
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        opacity: ${style.opacity};
        box-shadow: 0 3px 8px rgba(15,23,42,0.2);
        cursor: ${interactive ? "pointer" : "default"};
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      content.textContent = style.label;
      if (interactive && onSelectItem) {
        content.addEventListener("click", (event) => {
          event.stopPropagation();
          onSelectItem(item.id);
        });
      }

      overlaysRef.current.push(
        new window.kakao.maps.CustomOverlay({
          map,
          position: new window.kakao.maps.LatLng(
            item.coordinates.latitude,
            item.coordinates.longitude,
          ),
          content,
          xAnchor: 0.5,
          yAnchor: 1,
          zIndex: focused || item.status === "inProgress" ? 14 : 8,
          clickable: interactive,
        }),
      );

      if (item.type === "plogging") {
        const route = getPloggingRouteById(item.sourceId);
        if (route && route.coordinates.length >= 2) {
          const path = route.coordinates.map(
            (point) =>
              new window.kakao.maps.LatLng(point.latitude, point.longitude),
          );
          polylinesRef.current.push(
            new window.kakao.maps.Polyline({
              map,
              path,
              strokeWeight: item.status === "inProgress" ? 6 : 4,
              strokeColor: "#0f766e",
              strokeOpacity: item.status === "skipped" ? 0.35 : 0.85,
              strokeStyle: "solid",
              zIndex: 4,
            }),
          );
        }
      }
    });

    if (ordered.length >= 2) {
      const path = ordered.map(
        (item) =>
          new window.kakao.maps.LatLng(
            item.coordinates.latitude,
            item.coordinates.longitude,
          ),
      );
      polylinesRef.current.push(
        new window.kakao.maps.Polyline({
          map,
          path,
          strokeWeight: 4,
          strokeColor: "#64748b",
          strokeOpacity: 0.7,
          strokeStyle: "shortdash",
          zIndex: 3,
        }),
      );
    }

    if (showDisposalPoints) {
      ordered.forEach((item) => {
        if (item.result?.type !== "plogging" || !item.result.disposalWastePointId) {
          return;
        }
        const point = getWastePointById(item.result.disposalWastePointId);
        if (!point) {
          return;
        }
        const badge = document.createElement("div");
        badge.style.cssText = `
          padding: 2px 6px;
          border-radius: 6px;
          background: #334155;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        `;
        badge.textContent = "배출";
        overlaysRef.current.push(
          new window.kakao.maps.CustomOverlay({
            map,
            position: new window.kakao.maps.LatLng(
              point.coordinates.latitude,
              point.coordinates.longitude,
            ),
            content: badge,
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 10,
          }),
        );
      });
    }

    const focusItem = ordered.find((item) => item.id === focusItemId);
    if (focusItem && !fitAll) {
      map.panTo(
        new window.kakao.maps.LatLng(
          focusItem.coordinates.latitude,
          focusItem.coordinates.longitude,
        ),
      );
    } else {
      const bounds = new window.kakao.maps.LatLngBounds();
      ordered.forEach((item) => {
        bounds.extend(
          new window.kakao.maps.LatLng(
            item.coordinates.latitude,
            item.coordinates.longitude,
          ),
        );
      });
      map.setBounds(bounds, 56, 56, 56, 56);
    }

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
      polylinesRef.current.forEach((line) => line.setMap(null));
      polylinesRef.current = [];
    };
  }, [
    map,
    run,
    focusItemId,
    nextItemId,
    fitAll,
    showCompletedOnly,
    showDisposalPoints,
    interactive,
    onSelectItem,
  ]);

  return null;
}
