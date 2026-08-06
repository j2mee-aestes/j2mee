"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ScheduleMapLayer } from "@/components/map/ScheduleMapLayer";
import { MapFallback, MapSkeleton } from "@/components/map/MapFallback";
import { useKakaoMaps } from "@/hooks/useKakaoMaps";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_LEVEL,
} from "@/lib/map/constants";
import type { ScheduleItem } from "@/types/schedule";

interface ScheduleMapPreviewProps {
  items: ScheduleItem[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  focusItemId?: string | null;
}

export function ScheduleMapPreview({
  items,
  selectedItemId,
  onSelectItem,
  focusItemId,
}: ScheduleMapPreviewProps) {
  const { status, retry } = useKakaoMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const ordered = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items],
  );

    useEffect(() => {
      if (status !== "ready" || !containerRef.current || !window.kakao?.maps) {
        return;
      }
      const container = containerRef.current;
      const instance = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(
          DEFAULT_CENTER.latitude,
          DEFAULT_CENTER.longitude,
        ),
        level: DEFAULT_ZOOM_LEVEL,
      });
      setMap(instance);
      return () => {
        setMap(null);
        container.innerHTML = "";
      };
    }, [status]);

  useEffect(() => {
    if (!map || !focusItemId || !window.kakao?.maps) {
      return;
    }
    const item = ordered.find((entry) => entry.id === focusItemId);
    if (!item) {
      return;
    }
    map.panTo(
      new window.kakao.maps.LatLng(
        item.coordinates.latitude,
        item.coordinates.longitude,
      ),
    );
  }, [map, focusItemId, ordered]);

  return (
    <section
      aria-label="일정 지도 미리보기"
      className="relative h-64 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-map-bg)] sm:h-80"
    >
      {status === "missing-key" ? <MapFallback variant="missing-key" /> : null}
      {status === "loading" ? <MapSkeleton /> : null}
      {status === "error" ? <MapFallback variant="error" onRetry={retry} /> : null}
      {status === "ready" ? (
        <>
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />
          <ScheduleMapLayer
            map={map}
            items={ordered}
            selectedItemId={selectedItemId}
            onSelectItem={onSelectItem}
          />
          <p className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-md bg-white/90 px-2 py-1 text-[10px] text-[var(--color-text-secondary)]">
            점선은 일정 순서 참고 연결선이며 실제 도로 경로가 아닙니다.
          </p>
        </>
      ) : null}
    </section>
  );
}
