"use client";

import { Card } from "@/components/common/Card";
import { PlaceImageGallery } from "@/components/common/PlaceImageGallery";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import type { LeisurePlace } from "@/types/leisure";

const ACTIVITY_LABEL: Record<LeisurePlace["activityType"], string> = {
  surfing: "서핑",
  yacht: "요트",
  diving: "다이빙",
  kayak: "카약",
  bike: "자전거",
  other: "기타",
};

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
      </div>

      <PlaceImageGallery
        images={place.imageUrls}
        alt={displayName}
        pendingLabel={t("fishing.imagePending")}
      />

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-[var(--color-foam)] p-3">
          <dt className="text-[var(--color-text-muted)]">{t("leisure.activity")}</dt>
          <dd className="mt-1 font-semibold">
            {ACTIVITY_LABEL[place.activityType]}
          </dd>
        </div>
        <div className="rounded-2xl bg-[var(--color-foam)] p-3">
          <dt className="text-[var(--color-text-muted)]">{t("leisure.season")}</dt>
          <dd className="mt-1 font-semibold">
            {place.seasonNote ?? t("common.infoUnavailable")}
          </dd>
        </div>
      </dl>

      {place.description ? (
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {place.description}
        </p>
      ) : null}

      <DataSourceInfo
        sourceName={place.sourceName}
        sourceUrl={place.sourceUrl}
        lastVerifiedAt={place.lastVerifiedAt}
        isMock={place.verificationStatus === "unverified"}
      />
    </Card>
  );
}
