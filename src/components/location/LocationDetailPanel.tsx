"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { IconButton, TextButton } from "@/components/common/IconButton";
import { LocationFeatureBadge } from "@/components/location/LocationFeatureBadge";
import { NearbyPlaceCard } from "@/components/location/NearbyPlaceCard";
import { CATEGORY_TYPE_LABELS } from "@/constants/categories";
import { UI_TEXT } from "@/constants/uiText";
import type { LocationDetail } from "@/types/fishing";
import { Heart, MapPin, Navigation } from "lucide-react";

interface LocationDetailPanelProps {
  location: LocationDetail | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDirections: () => void;
  notice: string | null;
  className?: string;
}

export function LocationDetailPanel({
  location,
  isFavorite,
  onToggleFavorite,
  onDirections,
  notice,
  className = "",
}: LocationDetailPanelProps) {
  if (!location) {
    return (
      <EmptyState
        title={UI_TEXT.selectPlace}
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  return (
    <Card as="article" className={`flex flex-col gap-4 p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ocean-600)]">
            {CATEGORY_TYPE_LABELS[location.category]}
          </p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {location.name}
          </h2>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ocean-500)]"
              aria-hidden
            />
            <span>{location.address}</span>
          </p>
        </div>
        <IconButton
          label={isFavorite ? UI_TEXT.removeFavorite : UI_TEXT.addFavorite}
          active={isFavorite}
          onClick={onToggleFavorite}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
            aria-hidden
          />
        </IconButton>
      </div>

      <div
        className="relative h-28 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #bae6fd 0%, #7dd3fc 35%, #99f6e4 70%, #bbf7d0 100%)",
        }}
        aria-hidden
      >
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.35), transparent 35%)",
          }}
        />
        <div className="absolute bottom-2 left-2 rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]">
          이미지 준비 중
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {location.beginnerFriendly ? (
          <LocationFeatureBadge label={UI_TEXT.beginnerFriendly} tone="blue" />
        ) : null}
        {location.parkingAvailable ? (
          <LocationFeatureBadge label={UI_TEXT.parkingAvailable} tone="teal" />
        ) : null}
        {location.toiletAvailable ? (
          <LocationFeatureBadge label={UI_TEXT.toiletAvailable} tone="green" />
        ) : null}
        {location.safetyFacilities ? (
          <LocationFeatureBadge label={UI_TEXT.safetyFacilities} tone="orange" />
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {location.description}
      </p>

      {location.targetFish && location.targetFish.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
            {UI_TEXT.targetFish}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {location.targetFish.map((fish) => (
              <LocationFeatureBadge key={fish} label={fish} tone="gray" />
            ))}
          </div>
        </div>
      ) : null}

      {location.nearbyMarket ? (
        <NearbyPlaceCard
          title={UI_TEXT.nearbyMarket}
          name={location.nearbyMarket}
          distanceLabel={
            location.nearbyMarketDistanceKm !== undefined
              ? `${UI_TEXT.distance}: ${location.nearbyMarketDistanceKm}km`
              : location.distanceLabel
          }
        />
      ) : location.distanceLabel ? (
        <NearbyPlaceCard title={UI_TEXT.distance} name={location.distanceLabel} />
      ) : null}

      <TextButton variant="primary" className="w-full" onClick={onDirections}>
        <Navigation className="h-4 w-4" aria-hidden />
        {UI_TEXT.directions}
      </TextButton>

      {notice ? (
        <p
          className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
          role="status"
        >
          {notice}
        </p>
      ) : null}
    </Card>
  );
}
