"use client";

import { IconButton } from "@/components/common/IconButton";
import { UI_TEXT } from "@/constants/uiText";
import { Crosshair, List, Minus, Plus } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCurrentLocation: () => void;
  onListView: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onCurrentLocation,
  onListView,
}: MapControlsProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onListView}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm hover:bg-white"
      >
        <List className="h-3.5 w-3.5" aria-hidden />
        {UI_TEXT.listView}
      </button>
      <div className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-white/80 bg-white/95 p-1 shadow-sm">
        <IconButton label={UI_TEXT.zoomIn} className="h-9 w-9 border-0" onClick={onZoomIn}>
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={UI_TEXT.zoomOut}
          className="h-9 w-9 border-0"
          onClick={onZoomOut}
        >
          <Minus className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={UI_TEXT.currentLocation}
          className="h-9 w-9 border-0"
          onClick={onCurrentLocation}
        >
          <Crosshair className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="rounded-md border border-white/80 bg-white/95 px-2 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] shadow-sm">
        {UI_TEXT.scaleLabel}
      </div>
    </div>
  );
}
