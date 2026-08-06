"use client";

import { useEffect, useRef } from "react";
import { SCHEDULE_TYPE_COLORS } from "@/constants/scheduleDefaults";
import type { ScheduleItem } from "@/types/schedule";

interface ScheduleMapLayerProps {
  map: KakaoMap | null;
  items: ScheduleItem[];
  selectedItemId: string | null;
  onSelectItem?: (itemId: string) => void;
}

/** Numbered markers + straight reference polylines for day schedule order. */
export function ScheduleMapLayer({
  map,
  items,
  selectedItemId,
  onSelectItem,
}: ScheduleMapLayerProps) {
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const polylineRef = useRef<KakaoPolyline | null>(null);

  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
    polylineRef.current?.setMap(null);
    polylineRef.current = null;

    const ordered = [...items].sort((a, b) => a.order - b.order);
    if (ordered.length === 0) {
      return;
    }

    ordered.forEach((item) => {
      const selected = item.id === selectedItemId;
      const color = SCHEDULE_TYPE_COLORS[item.type];
      const content = document.createElement("button");
      content.type = "button";
      content.setAttribute(
        "aria-label",
        `${item.order}번 ${item.title}`,
      );
      content.setAttribute("aria-pressed", selected ? "true" : "false");
      content.style.cssText = `
        width: ${selected ? "34px" : "28px"};
        height: ${selected ? "34px" : "28px"};
        border-radius: 9999px;
        border: 2px solid #fff;
        background: ${color};
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        box-shadow: ${
          selected
            ? `0 0 0 2px ${color}, 0 4px 12px rgba(15,23,42,0.25)`
            : "0 3px 8px rgba(15,23,42,0.2)"
        };
        cursor: pointer;
      `;
      content.textContent = String(item.order);
      content.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelectItem?.(item.id);
      });

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
          zIndex: selected ? 12 : 8,
          clickable: true,
        }),
      );
    });

    if (ordered.length >= 2) {
      const path = ordered.map(
        (item) =>
          new window.kakao.maps.LatLng(
            item.coordinates.latitude,
            item.coordinates.longitude,
          ),
      );
      polylineRef.current = new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: 4,
        strokeColor: "#64748b",
        strokeOpacity: 0.75,
        strokeStyle: "shortdash",
        zIndex: 3,
      });
    }

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

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
      polylineRef.current?.setMap(null);
      polylineRef.current = null;
    };
  }, [map, items, selectedItemId, onSelectItem]);

  return null;
}
