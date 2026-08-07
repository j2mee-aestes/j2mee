"use client";

import { LoaderCircle, Navigation } from "lucide-react";
import { useTranslations } from "@/context/LocaleContext";

interface MyLocationButtonProps {
  onClick: () => void;
  locating?: boolean;
}

export function MyLocationButton({
  onClick,
  locating = false,
}: MyLocationButtonProps) {
  const { t } = useTranslations();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locating}
      aria-label={t("map.currentLocation")}
      aria-busy={locating}
      title={
        locating ? t("map.locating") : t("map.currentLocation")
      }
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-sky-200/40 bg-gradient-to-br from-sky-400 to-blue-700 text-white shadow-[0_14px_32px_-12px_rgba(3,18,40,0.7)] transition hover:-translate-y-0.5 hover:from-sky-300 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-wait disabled:opacity-80 sm:h-11 sm:w-11"
    >
      {locating ? (
        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
      ) : (
        <Navigation className="h-5 w-5 fill-current" aria-hidden />
      )}
    </button>
  );
}
