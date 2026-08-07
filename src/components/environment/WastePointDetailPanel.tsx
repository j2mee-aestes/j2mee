"use client";

import { Card } from "@/components/common/Card";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { EmptyState } from "@/components/common/EmptyState";
import { TextButton } from "@/components/common/IconButton";
import { LocationReportForm } from "@/components/environment/LocationReportForm";
import { WastePointStatusBadge } from "@/components/environment/WastePointStatusBadge";
import { WastePointTypeBadge } from "@/components/environment/WastePointTypeBadge";
import { useTranslations } from "@/context/LocaleContext";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import { isStaleVerificationDate } from "@/lib/environment/isStaleVerificationDate";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import type { WastePoint } from "@/types/environment";
import { MapPin } from "lucide-react";
import { useState } from "react";

interface WastePointDetailPanelProps {
  wastePoint: WastePoint | null;
  originLabel?: string | null;
  distanceKm?: number | null;
  onDirections: () => void;
  notice?: string | null;
  className?: string;
}

export function WastePointDetailPanel({
  wastePoint,
  originLabel,
  distanceKm,
  onDirections,
  notice,
  className = "",
}: WastePointDetailPanelProps) {
  const { t, locale } = useTranslations();
  const [reportOpen, setReportOpen] = useState(false);

  if (!wastePoint) {
    return (
      <EmptyState
        title={t("environment.selectWaste")}
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  const stale = isStaleVerificationDate(wastePoint.lastVerifiedAt);
  const name = localizePlaceText(wastePoint.name, locale);
  const address = wastePoint.address
    ? localizePlaceText(wastePoint.address, locale)
    : null;
  const description = wastePoint.description
    ? localizePlaceText(wastePoint.description, locale)
    : null;
  const verification = t(
    `environment.verification.${wastePoint.verificationStatus}`,
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Card as="article" className="flex flex-col gap-4 p-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <WastePointTypeBadge type={wastePoint.type} />
            <WastePointStatusBadge status={wastePoint.status} />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {name}
          </h2>
          {address ? (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{address}</span>
            </p>
          ) : null}
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {t("environment.verificationLabel", { status: verification })}
            {wastePoint.lastVerifiedAt
              ? ` · ${t("common.lastVerifiedDate", { date: wastePoint.lastVerifiedAt })}`
              : ""}
          </p>
        </div>

        {wastePoint.status === "unknown" ? (
          <div className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <p>{t("environment.statusUnknownTitle")}</p>
            <p className="mt-0.5">{t("environment.statusUnknownBody")}</p>
          </div>
        ) : null}

        {stale ? (
          <div className="rounded-[var(--radius-md)] border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            <p>{t("environment.staleWasteTitle")}</p>
            <p className="mt-0.5">{t("environment.staleWasteBody")}</p>
          </div>
        ) : null}

        {distanceKm !== null && distanceKm !== undefined && originLabel ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--color-text-primary)]">
              {t("common.fromOriginDistance", {
                origin: localizePlaceText(originLabel, locale),
                distance: formatDistanceKm(distanceKm),
              })}
            </p>
            <p className="mt-0.5 text-[var(--color-text-muted)]">
              {t("common.straightDistanceHint")}
            </p>
          </div>
        ) : null}

        {description ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {description}
          </p>
        ) : null}

        <section>
          <h3 className="mb-1 text-sm font-semibold">
            {t("environment.acceptedTypes")}
          </h3>
          {wastePoint.acceptedWasteTypes &&
          wastePoint.acceptedWasteTypes.length > 0 ? (
            <ul className="space-y-0.5 text-xs text-[var(--color-text-secondary)]">
              {wastePoint.acceptedWasteTypes.map((item) => (
                <li key={item}>· {localizePlaceText(item, locale)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">
              {t("environment.noAcceptedTypes")}
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-1 text-sm font-semibold">
            {t("environment.hoursTitle")}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {wastePoint.availableHours
              ? localizePlaceText(wastePoint.availableHours, locale)
              : t("environment.hoursMissing")}
          </p>
        </section>

        {wastePoint.usageNotes && wastePoint.usageNotes.length > 0 ? (
          <section>
            <h3 className="mb-1 text-sm font-semibold">
              {t("environment.usageNotes")}
            </h3>
            <ul className="space-y-0.5 text-xs text-[var(--color-text-secondary)]">
              {wastePoint.usageNotes.map((note) => (
                <li key={note}>· {localizePlaceText(note, locale)}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <DataSourceInfo
          sourceName={wastePoint.sourceName}
          lastVerifiedAt={wastePoint.lastVerifiedAt}
          sourceUrl={wastePoint.sourceUrl}
          isMock
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <TextButton variant="primary" className="w-full" onClick={onDirections}>
            {t("common.directions")}
          </TextButton>
          <TextButton
            variant="secondary"
            className="w-full"
            onClick={() => setReportOpen(true)}
          >
            {t("environment.reportLocationError")}
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

      <LocationReportForm
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="wastePoint"
        targetId={wastePoint.id}
        targetName={name}
      />
    </div>
  );
}
