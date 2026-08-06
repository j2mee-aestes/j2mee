"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { IconButton, TextButton } from "@/components/common/IconButton";
import { LocationFeatureBadge } from "@/components/location/LocationFeatureBadge";
import { ActivityStatusCard } from "@/components/safety/ActivityStatusCard";
import {
  FISHING_ALLOWED_LABELS,
  FISHING_SPOT_TYPE_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/constants/safetyThresholds";
import { UI_TEXT } from "@/constants/uiText";
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
  notice: string | null;
  className?: string;
}

export function LocationDetailPanel({
  location,
  weather = null,
  isFavorite,
  onToggleFavorite,
  onDirections,
  notice,
  className = "",
}: LocationDetailPanelProps) {
  const evaluation = useMemo(() => {
    if (!location) {
      return null;
    }
    return evaluateActivityStatus({
      fishingAllowedStatus: location.fishingAllowedStatus,
      weather,
    });
  }, [location, weather]);

  if (!location) {
    return (
      <EmptyState
        title={UI_TEXT.selectPlace}
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  const fishing = location;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {evaluation ? <ActivityStatusCard evaluation={evaluation} /> : null}

      <Card as="article" className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ocean-600)]">
              {FISHING_SPOT_TYPE_LABELS[fishing.spotType]}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {location.name}
              </h2>
              <LocationFeatureBadge
                label={VERIFICATION_STATUS_LABELS[fishing.verificationStatus]}
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
                마지막 확인일: {fishing.lastVerifiedAt}
              </p>
            ) : null}
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
          {FISHING_ALLOWED_LABELS[fishing.fishingAllowedStatus]}
          {fishing.restrictionDescription ? (
            <p className="mt-1 text-xs font-normal opacity-90">
              {fishing.restrictionDescription}
            </p>
          ) : null}
        </div>

        <div
          className="relative h-28 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #bae6fd 0%, #7dd3fc 35%, #99f6e4 70%, #bbf7d0 100%)",
          }}
          aria-hidden
        >
          <div className="absolute bottom-2 left-2 rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]">
            이미지 준비 중
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {fishing.beginnerFriendly ? (
            <LocationFeatureBadge label={UI_TEXT.beginnerFriendly} tone="blue" />
          ) : null}
          {fishing.parkingAvailable ? (
            <LocationFeatureBadge label={UI_TEXT.parkingAvailable} tone="teal" />
          ) : null}
          {fishing.toiletAvailable ? (
            <LocationFeatureBadge label={UI_TEXT.toiletAvailable} tone="green" />
          ) : null}
          {fishing.lightingAvailable ? (
            <LocationFeatureBadge label="조명" tone="orange" />
          ) : null}
          {fishing.safetyFenceAvailable ? (
            <LocationFeatureBadge label={UI_TEXT.safetyFacilities} tone="orange" />
          ) : null}
        </div>

        {fishing.description ? (
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {fishing.description}
          </p>
        ) : null}

        {fishing.accessDescription ? (
          <p className="text-xs text-[var(--color-text-secondary)]">
            접근: {fishing.accessDescription}
          </p>
        ) : null}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
            {UI_TEXT.targetFish}
          </h3>
          {fishing.targetFish && fishing.targetFish.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {fishing.targetFish.map((fish) => (
                <LocationFeatureBadge key={fish} label={fish} tone="gray" />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">정보 준비 중</p>
          )}
        </div>

        {fishing.cautionText && fishing.cautionText.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
              주의사항
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
          주변 수산시장·식당과 쓰레기통·수거함은 아래 목록에서 확인할 수
          있습니다.
        </p>

        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 text-xs text-[var(--color-text-secondary)]">
          <p className="font-semibold text-[var(--color-text-primary)]">
            데이터 출처
          </p>
          <p className="mt-1">{fishing.sourceName ?? "미상"}</p>
          {fishing.lastVerifiedAt ? (
            <p className="mt-0.5">업데이트: {fishing.lastVerifiedAt}</p>
          ) : null}
          {fishing.sourceUrl ? (
            <a
              href={fishing.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex font-semibold text-[var(--color-ocean-700)]"
            >
              원문 보기
            </a>
          ) : null}
        </div>

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
    </div>
  );
}
