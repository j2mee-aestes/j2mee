"use client";

import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { TideSummary } from "@/components/fishing/TideSummary";
import type { LanguageCode } from "@/constants/languages";
import { t } from "@/constants/uiText";
import type { FishingSpot, TideTime } from "@/types/fishing";
import { MapPin } from "lucide-react";

interface FishingSpotCardProps {
  language: LanguageCode;
  spot: FishingSpot | null;
  tides: TideTime[];
  className?: string;
}

export function FishingSpotCard({
  language,
  spot,
  tides,
  className = "",
}: FishingSpotCardProps) {
  if (!spot) {
    return (
      <Card className={`p-4 ${className}`}>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t(language, "noSpotSelected")}
        </p>
      </Card>
    );
  }

  return (
    <Card as="article" className={`flex flex-col gap-4 p-4 ${className}`}>
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ocean-600)]">
          {t(language, "selectedSpot")}
        </p>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          {spot.name}
        </h2>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ocean-500)]" aria-hidden />
          <span>
            <span className="sr-only">{t(language, "location")}: </span>
            {spot.address}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {spot.beginnerFriendly ? (
          <Badge tone="blue">{t(language, "beginnerFriendly")}</Badge>
        ) : null}
        {spot.parkingAvailable ? (
          <Badge tone="teal">{t(language, "parkingAvailable")}</Badge>
        ) : null}
        {spot.toiletAvailable ? (
          <Badge tone="green">{t(language, "toiletAvailable")}</Badge>
        ) : null}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
          {t(language, "targetFish")}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {spot.targetFish.map((fish) => (
            <Badge key={fish} tone="gray">
              {fish}
            </Badge>
          ))}
        </div>
      </div>

      {spot.nearbyMarket ? (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
            {t(language, "nearbyMarket")}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {spot.nearbyMarket}
          </p>
        </div>
      ) : null}

      <TideSummary language={language} tides={tides} />
    </Card>
  );
}
