"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityMapLayer } from "@/components/map/ActivityMapLayer";
import { MapFallback, MapSkeleton } from "@/components/map/MapFallback";
import { TextButton } from "@/components/common/IconButton";
import { useKakaoMaps } from "@/hooks/useKakaoMaps";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM_LEVEL,
} from "@/lib/map/constants";
import type { ActivityRun } from "@/types/activity";

interface ActivityMapPreviewProps {
  run: ActivityRun;
  focusItemId?: string | null;
  nextItemId?: string | null;
  showDisposalPoints?: boolean;
  showCompletedOnly?: boolean;
  interactive?: boolean;
  onSelectItem?: (itemId: string) => void;
  className?: string;
}

export function ActivityMapPreview({
  run,
  focusItemId = null,
  nextItemId = null,
  showDisposalPoints = false,
  showCompletedOnly = false,
  interactive = true,
  onSelectItem,
  className = "",
}: ActivityMapPreviewProps) {
  const { status, retry } = useKakaoMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [fitAll, setFitAll] = useState(false);
  const [completedOnlyOverride, setCompletedOnlyOverride] = useState<
    boolean | null
  >(null);
  const completedOnly = completedOnlyOverride ?? showCompletedOnly;

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

  return (
    <section
      aria-label="활동 지도"
      className={`relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-map-bg)] ${className || "h-64 sm:h-80"}`}
    >
      {status === "missing-key" ? <MapFallback variant="missing-key" /> : null}
      {status === "loading" ? <MapSkeleton /> : null}
      {status === "error" ? <MapFallback variant="error" onRetry={retry} /> : null}
      {status === "ready" ? (
        <>
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />
          <ActivityMapLayer
            map={map}
            run={run}
            focusItemId={focusItemId}
            nextItemId={nextItemId}
            fitAll={fitAll}
            showCompletedOnly={completedOnly}
            showDisposalPoints={showDisposalPoints}
            interactive={interactive}
            onSelectItem={onSelectItem}
          />
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2">
            <TextButton
              type="button"
              className="h-8 bg-white/95 px-2 text-xs"
              onClick={() => {
                setFitAll(true);
                window.setTimeout(() => setFitAll(false), 100);
              }}
            >
              전체 일정 보기
            </TextButton>
            {showDisposalPoints || run.status === "completed" ? (
              <TextButton
                type="button"
                className="h-8 bg-white/95 px-2 text-xs"
                onClick={() =>
                  setCompletedOnlyOverride((prev) => !(prev ?? showCompletedOnly))
                }
                aria-pressed={completedOnly}
              >
                {completedOnly ? "전체 장소" : "완료 장소만"}
              </TextButton>
            ) : null}
          </div>
          <p className="pointer-events-none absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] text-[var(--color-text-secondary)]">
            실제 이동 경로를 추적하지 않습니다. 점선은 일정 순서 참고선입니다.
          </p>
        </>
      ) : null}
    </section>
  );
}
