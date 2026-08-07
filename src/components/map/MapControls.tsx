"use client";

import { IconButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { LocateFixed, Minus, Plus } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAllMarkers: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onFitAllMarkers,
}: MapControlsProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onFitAllMarkers}
        aria-label={t("map.fitAllMarkers")}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-3.5 py-2 text-xs font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
      >
        <LocateFixed className="h-3.5 w-3.5" aria-hidden />
        {t("map.fitAllMarkers")}
      </button>
      <div className="flex flex-col gap-1 rounded-2xl border border-white/70 bg-white/85 p-1.5 shadow-[var(--shadow-soft)] backdrop-blur-md">
        <IconButton
          label={t("map.zoomIn")}
          className="h-10 w-10 border-0 bg-transparent shadow-none"
          onClick={onZoomIn}
        >
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={t("map.zoomOut")}
          className="h-10 w-10 border-0 bg-transparent shadow-none"
          onClick={onZoomOut}
        >
          <Minus className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
