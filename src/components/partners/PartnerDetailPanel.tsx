"use client";

import { Card } from "@/components/common/Card";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { EmptyState } from "@/components/common/EmptyState";
import { TextButton } from "@/components/common/IconButton";
import { PlaceImageGallery } from "@/components/common/PlaceImageGallery";
import { BusinessStatusBadge } from "@/components/partners/BusinessStatusBadge";
import { CatchPolicySection } from "@/components/partners/CatchPolicySection";
import { PartnerInquiryForm } from "@/components/partners/PartnerInquiryForm";
import { PartnerServiceBadges } from "@/components/partners/PartnerServiceBadges";
import { useTranslations } from "@/context/LocaleContext";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import { getBusinessStatus } from "@/lib/partners/getBusinessStatus";
import type { Coordinates } from "@/types/map";
import type { PartnerPlace } from "@/types/partner";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";

interface PartnerDetailPanelProps {
  partner: PartnerPlace | null;
  originLabel?: string | null;
  originCoordinates?: Coordinates | null;
  distanceKm?: number | null;
  onAddToSchedule: () => void;
  scheduleAdded: boolean;
  notice?: string | null;
  className?: string;
}

export function PartnerDetailPanel({
  partner,
  originLabel,
  distanceKm,
  onAddToSchedule,
  scheduleAdded,
  notice,
  className = "",
}: PartnerDetailPanelProps) {
  const { t, locale } = useTranslations();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  if (!partner) {
    return (
      <EmptyState
        title={t("partner.selectPrompt")}
        description={t("partner.selectHint")}
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  const business = getBusinessStatus(partner.businessHours);
  const statusLabel = t(`partner.businessStatus.${business.status}`);
  const hasDetail =
    Boolean(partner.description) ||
    Boolean(partner.catchPolicy) ||
    Boolean(partner.businessHours?.length);
  const name = localizePlaceText(partner.name, locale);
  const address = localizePlaceText(partner.address, locale);
  const description = partner.description
    ? localizePlaceText(partner.description, locale)
    : null;
  const verification = t(`partner.verification.${partner.verificationStatus}`);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Card as="article" className="flex flex-col gap-4 p-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ocean-600)]">
            {t(`partner.type.${partner.type}`)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {name}
            </h2>
            <BusinessStatusBadge status={business.status} label={statusLabel} />
          </div>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ocean-500)]"
              aria-hidden
            />
            <span>{address}</span>
          </p>
          {partner.phone ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm">
              <Phone className="h-4 w-4 text-[var(--color-ocean-500)]" aria-hidden />
              <a
                href={`tel:${partner.phone.replace(/-/g, "")}`}
                className="font-medium text-[var(--color-ocean-700)] underline-offset-2 hover:underline"
              >
                {partner.phone}
              </a>
            </p>
          ) : null}
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {t("partner.verificationStatus", { status: verification })}
            {partner.lastVerifiedAt
              ? ` · ${t("common.lastVerifiedDate", { date: partner.lastVerifiedAt })}`
              : ""}
          </p>
        </div>

        <PlaceImageGallery
          images={
            partner.imageUrls?.length
              ? partner.imageUrls
              : partner.imageUrl
                ? [partner.imageUrl]
                : undefined
          }
          alt={name}
          pendingLabel={t("common.imagePending")}
        />

        {distanceKm !== null && distanceKm !== undefined && originLabel ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
            <p className="font-semibold text-[var(--color-text-primary)]">
              {t("common.fromOriginDistance", {
                origin: localizePlaceText(originLabel, locale),
                distance: formatDistanceKm(distanceKm),
              })}
            </p>
            <p className="mt-0.5">{t("common.straightDistanceHint")}</p>
          </div>
        ) : null}

        {description ? (
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {description}
          </p>
        ) : null}

        {!hasDetail ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("partner.noDetailYet")}
          </p>
        ) : null}

        <section aria-labelledby="partner-hours-heading">
          <h3
            id="partner-hours-heading"
            className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            {t("partner.businessInfo")}
          </h3>
          {partner.businessHours && partner.businessHours.length > 0 ? (
            <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
              <p>
                {t("partner.todayHours", {
                  hours: localizePlaceText(business.todayHoursLabel, locale),
                })}
              </p>
              <p>{t("partner.currentStatus", { status: statusLabel })}</p>
              {partner.closedDays && partner.closedDays.length > 0 ? (
                <p>
                  {t("partner.closedDays", {
                    days: partner.closedDays
                      .map((day) => localizePlaceText(day, locale))
                      .join(", "),
                  })}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-[var(--color-text-secondary)]">
              <p>{t("partner.noBusinessHours")}</p>
              <p className="mt-0.5">{t("partner.checkBeforeVisit")}</p>
            </div>
          )}
        </section>

        <section aria-labelledby="partner-services-heading">
          <h3
            id="partner-services-heading"
            className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            {t("partner.servicesTitle")}
          </h3>
          <PartnerServiceBadges services={partner.services} />
        </section>

        <CatchPolicySection
          policy={partner.catchPolicy}
          outsideCatchAccepted={partner.services.outsideCatchAccepted}
        />

        <section
          aria-labelledby="partner-guide-heading"
          className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900"
        >
          <h3 id="partner-guide-heading" className="font-semibold">
            {t("partner.usageGuide")}
          </h3>
          <p className="mt-1">{t("partner.usageGuideBody")}</p>
        </section>

        <DataSourceInfo
          sourceName={partner.sourceName}
          lastVerifiedAt={partner.lastVerifiedAt}
          sourceUrl={partner.sourceUrl}
          isMock
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <TextButton
            variant="secondary"
            className="w-full"
            disabled={scheduleAdded}
            onClick={onAddToSchedule}
          >
            {scheduleAdded
              ? t("partner.addedToSchedule")
              : t("partner.addToSchedule")}
          </TextButton>
          <TextButton
            variant="primary"
            className="w-full"
            onClick={() => setInquiryOpen(true)}
          >
            {t("partner.inquiryCta")}
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

      <PartnerInquiryForm
        partnerName={name}
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
