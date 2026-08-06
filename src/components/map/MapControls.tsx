"use client";

import { IconButton } from "@/components/common/IconButton";
import { UI_TEXT } from "@/constants/uiText";
import { Crosshair, LocateFixed, Minus, Plus } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCurrentLocation: () => void;
  onFitAllMarkers: () => void;
  locating?: boolean;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onCurrentLocation,
  onFitAllMarkers,
  locating = false,
}: MapControlsProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onFitAllMarkers}
        aria-label={UI_TEXT.fitAllMarkers}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm hover:bg-white"
      >
        <LocateFixed className="h-3.5 w-3.5" aria-hidden />
        {UI_TEXT.fitAllMarkers}
      </button>
      <div className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-white/80 bg-white/95 p-1 shadow-sm">
        <IconButton
          label={UI_TEXT.zoomIn}
          className="h-10 w-10 border-0"
          onClick={onZoomIn}
        >
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={UI_TEXT.zoomOut}
          className="h-10 w-10 border-0"
          onClick={onZoomOut}
        >
          <Minus className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={UI_TEXT.currentLocation}
          className="h-10 w-10 border-0"
          onClick={onCurrentLocation}
          disabled={locating}
        >
          <Crosshair className={`h-4 w-4 ${locating ? "animate-pulse" : ""}`} />
        </IconButton>
      </div>
    </div>
  );
}
