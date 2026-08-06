"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { IconButton, TextButton } from "@/components/common/IconButton";
import { PlaceImageGallery } from "@/components/common/PlaceImageGallery";
import { LocationFeatureBadge } from "@/components/location/LocationFeatureBadge";
import { ActivityStatusCard } from "@/components/safety/ActivityStatusCard";
import { useTranslations } from "@/context/LocaleContext";
import {
  getFishDisplayName,
  getFishingSpotDescription,
  getFishingSpotDisplayName,
} from "@/lib/i18n/placeDisplay";
import { getFishingAllowedText } from "@/lib/i18n/safetyTexts";
import { evaluateActivityStatus } from "@/lib/safety/evaluateActivityStatus";
import type { FishingSpot, WeatherData } from "@/types/fishing";
import { Heart, MapPin, Navigation } from "lucide-react";
import { useMemo } from "react";

interface LocationDetailPanelProps {
  location: FishingSpot | null;
  weather?: WeatherData | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDirections: () => void;
  onAddToSchedule?: () => void;
  scheduleAdded?: boolean;
  notice: string | null;
  className?: string;
}

export function LocationDetailPanel({
  location,
  weather = null,
  isFavorite,
  onToggleFavorite,
  onDirections,
  onAddToSchedule,
  scheduleAdded = false,
  notice,
  className = "",
}: LocationDetailPanelProps) {
  const { t, locale } = useTranslations();
  const evaluation = useMemo(() => {
    if (!location) {
      return null;
    }
    const base = evaluateActivityStatus({
      fishingAllowedStatus: location.fishingAllowedStatus,
      weather,
    });
    return {
      ...base,
      label: t(`safety.status.${base.status}`),
    };
  }, [location, weather, t]);

  if (!location) {
    return (
      <EmptyState
        title={t("map.selectPlace")}
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  const fishing = location;
  const displayName = getFishingSpotDisplayName(fishing, locale);
  const displayDescription = getFishingSpotDescription(fishing, locale);
  const allowedLabel = getFishingAllowedText(
    locale,
    fishing.fishingAllowedStatus,
  );
  const spotTypeLabel = t(`fishing.spotType.${fishing.spotType}`);
  const verificationLabel = t(
    `fishing.verification.${fishing.verificationStatus}`,
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {evaluation ? <ActivityStatusCard evaluation={evaluation} /> : null}

      <Card as="article" className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
              {spotTypeLabel}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                {displayName}
              </h2>
              <LocationFeatureBadge
                label={verificationLabel}
                tone={
                  fishing.verificationStatus === "unverified" ? "gray" : "teal"
                }
              />
            </div>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ocean-500)]"
                aria-hidden
              />
              <span>{location.address}</span>
            </p>
            {fishing.lastVerifiedAt ? (
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                {t("fishing.lastVerified", { date: fishing.lastVerifiedAt })}
              </p>
            ) : null}
          </div>
          <IconButton
            label={
              isFavorite
                ? t("fishing.removeFavorite")
                : t("fishing.addFavorite")
            }
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
          className={`rounded-[var(--radius-md)] border px-3 py-2 text-sm font-semibold ${
            fishing.fishingAllowedStatus === "allowed"
              ? "border-sky-200 bg-sky-50 text-sky-800"
              : fishing.fishingAllowedStatus === "restricted"
                ? "border-orange-200 bg-orange-50 text-orange-800"
                : fishing.fishingAllowedStatus === "prohibited"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {allowedLabel.text}
          {allowedLabel.reviewStatus === "machineTranslated" ? (
            <p className="mt-1 text-[11px] font-normal opacity-80">
              {t("safety.machineTranslatedNotice")}
            </p>
          ) : null}
          {fishing.restrictionDescription ? (
            <p className="mt-1 text-xs font-normal opacity-90">
              {fishing.restrictionDescription}
            </p>
          ) : null}
        </div>

        <PlaceImageGallery
          images={fishing.imageUrls}
          alt={displayName}
          pendingLabel={t("fishing.imagePending")}
        />

        <div className="flex flex-wrap gap-2">
          {fishing.beginnerFriendly ? (
            <LocationFeatureBadge
              label={t("fishing.beginnerFriendly")}
              tone="blue"
            />
          ) : null}
          {fishing.parkingAvailable ? (
            <LocationFeatureBadge
              label={t("fishing.parkingAvailable")}
              tone="teal"
            />
          ) : null}
          {fishing.toiletAvailable ? (
            <LocationFeatureBadge
              label={t("fishing.toiletAvailable")}
              tone="green"
            />
          ) : null}
          {fishing.safetyFenceAvailable ? (
            <LocationFeatureBadge
              label={t("fishing.safetyFacilities")}
              tone="orange"
            />
          ) : null}
        </div>

        {displayDescription !== t("common.infoUnavailable") ? (
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {displayDescription}
          </p>
        ) : null}

        {fishing.accessDescription ? (
          <p className="text-xs text-[var(--color-text-secondary)]">
            {t("fishing.access", { text: fishing.accessDescription })}
          </p>
        ) : null}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
            {t("fishing.targetFish")}
          </h3>
          {fishing.targetFish && fishing.targetFish.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {fishing.targetFish.map((fish) => (
                <LocationFeatureBadge
                  key={fish}
                  label={getFishDisplayName(fish, locale)}
                  tone="gray"
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">
              {t("common.infoUnavailable")}
            </p>
          )}
        </div>

        {fishing.cautionText && fishing.cautionText.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
              {t("fishing.cautions")}
            </h3>
            <ul className="space-y-1">
              {fishing.cautionText.map((item) => (
                <li
                  key={item}
                  className="text-xs leading-relaxed text-[var(--color-text-secondary)]"
                >
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="text-xs text-[var(--color-text-muted)]">
          {t("fishing.nearbyHint")}
        </p>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/80 p-3 text-xs text-[var(--color-text-secondary)]">
          <p className="font-semibold text-[var(--color-text-primary)]">
            {t("fishing.dataSource")}
          </p>
          <p className="mt-1">
            {fishing.sourceName ?? t("common.unknown")}
          </p>
          {fishing.lastVerifiedAt ? (
            <p className="mt-0.5">
              {t("common.updated")}: {fishing.lastVerifiedAt}
            </p>
          ) : null}
          {fishing.sourceUrl ? (
            <a
              href={fishing.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex font-semibold text-[var(--color-ocean-700)]"
            >
              {t("fishing.viewSource")}
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {onAddToSchedule ? (
            <TextButton
              variant="secondary"
              className="w-full"
              disabled={scheduleAdded}
              onClick={onAddToSchedule}
            >
              {scheduleAdded
                ? t("fishing.addedToSchedule")
                : t("fishing.addToSchedule")}
            </TextButton>
          ) : null}
          <TextButton variant="primary" className="w-full" onClick={onDirections}>
            <Navigation className="h-4 w-4" aria-hidden />
            {t("common.directions")}
          </TextButton>
        </div>

        {notice ? (
          <p
            className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
            role="status"
          >
            {notice}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
