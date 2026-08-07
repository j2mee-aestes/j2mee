"use client";

import { Card } from "@/components/common/Card";
import { PlaceImageGallery } from "@/components/common/PlaceImageGallery";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import type { LeisurePlace } from "@/types/leisure";

type LeisureDetailPanelProps = {
  place: LeisurePlace;
  className?: string;
};

export function LeisureDetailPanel({
  place,
  className = "",
}: LeisureDetailPanelProps) {
  const { t, locale } = useTranslations();
  const displayName = localizePlaceText(place.name, locale);
  const displayAddress = localizePlaceText(place.address, locale);
  const displayDescription = place.description
    ? localizePlaceText(place.description, locale)
    : null;
  const seasonNote = place.seasonNote
    ? localizePlaceText(place.seasonNote, locale)
    : t("common.infoUnavailable");

  return (
    <Card as="article" className={`flex flex-col gap-4 p-4 ${className}`}>
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-teal-700)]">
          {t("leisure.title")}
        </p>
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {displayName}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {displayAddress}
        </p>
        {displayDescription ? (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {displayDescription}
          </p>
        ) : null}
      </div>

      <PlaceImageGallery
        images={place.imageUrls}
        alt={displayName}
        pendingLabel={t("common.imagePending")}
      />

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-[var(--color-foam)] p-3">
          <dt className="text-[var(--color-text-muted)]">{t("leisure.activity")}</dt>
          <dd className="mt-1 font-semibold">
            {t(`leisure.activityType.${place.activityType}`)}
          </dd>
        </div>
        <div className="rounded-2xl bg-[var(--color-foam)] p-3">
          <dt className="text-[var(--color-text-muted)]">{t("leisure.season")}</dt>
          <dd className="mt-1 font-semibold">{seasonNote}</dd>
        </div>
      </dl>

      <DataSourceInfo
        sourceName={place.sourceName}
        lastVerifiedAt={place.lastVerifiedAt}
        sourceUrl={place.sourceUrl}
        isMock={place.verificationStatus === "unverified"}
      />
    </Card>
  );
}
