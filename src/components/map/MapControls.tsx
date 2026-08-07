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
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-sky-200/35 bg-[rgba(8,28,58,0.78)] px-3.5 py-2 text-xs font-semibold text-sky-50 shadow-[0_12px_28px_-14px_rgba(3,18,40,0.75)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[rgba(11,42,84,0.9)]"
      >
        <LocateFixed className="h-3.5 w-3.5 text-sky-300" aria-hidden />
        {t("map.fitAllMarkers")}
      </button>
      <div className="flex flex-col gap-1 rounded-2xl border border-sky-200/30 bg-[rgba(8,28,58,0.78)] p-1.5 shadow-[0_12px_28px_-14px_rgba(3,18,40,0.75)] backdrop-blur-md">
        <IconButton
          label={t("map.zoomIn")}
          className="h-10 w-10 border-0 bg-transparent text-sky-50 shadow-none hover:bg-white/10"
          onClick={onZoomIn}
        >
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={t("map.zoomOut")}
          className="h-10 w-10 border-0 bg-transparent text-sky-50 shadow-none hover:bg-white/10"
          onClick={onZoomOut}
        >
          <Minus className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
