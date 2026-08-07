"use client";

import { TextButton } from "@/components/common/IconButton";
import { BusinessStatusBadge } from "@/components/partners/BusinessStatusBadge";
import { useTranslations } from "@/context/LocaleContext";
import { formatLocaleDistanceKm } from "@/lib/i18n/formatDistance";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import { getBusinessStatus } from "@/lib/partners/getBusinessStatus";
import type { NearbyPartnerResult } from "@/types/partner";

interface PartnerCardProps {
  result: NearbyPartnerResult;
  selected?: boolean;
  onSelect: (partnerId: string) => void;
  onAddToSchedule?: (partnerId: string) => void;
  scheduleAdded?: boolean;
}

export function PartnerCard({
  result,
  selected = false,
  onSelect,
  onAddToSchedule,
  scheduleAdded = false,
}: PartnerCardProps) {
  const { t, locale } = useTranslations();
  const { partner, distanceKm, estimatedDriveMinutes } = result;
  const business = getBusinessStatus(partner.businessHours);
  const policy = partner.catchPolicy;
  const acceptanceLabel =
    policy?.acceptanceStatus === "accepted"
      ? t("partner.acceptanceAccepted")
      : policy?.acceptanceStatus === "conditional"
        ? t("partner.acceptanceConditional")
        : policy?.acceptanceStatus === "notAccepted"
          ? t("partner.acceptanceNotAccepted")
          : t("partner.acceptanceUnknown");

  return (
    <article
      className={`rounded-[var(--radius-md)] border p-3 transition-colors ${
        selected
          ? "border-[var(--color-ocean-400)] bg-[var(--color-ocean-50)]"
          : "border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-muted)]"
      }`}
    >
      <button
        type="button"
        className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
        onClick={() => onSelect(partner.id)}
        aria-pressed={selected}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {localizePlaceText(partner.name, locale)}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {t(`partner.type.${partner.type}`)} ·{" "}
              {formatLocaleDistanceKm(distanceKm, locale)}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-muted)]">
              {localizePlaceText(partner.address, locale)}
            </p>
          </div>
          <BusinessStatusBadge
            status={business.status}
            label={t(`partner.businessStatus.${business.status}`)}
          />
        </div>

        <ul className="mt-2 space-y-0.5 text-xs text-[var(--color-text-secondary)]">
          <li>
            {partner.services.catchCleaning
              ? t("partner.cleaningYes")
              : t("partner.cleaningUnknown")}
          </li>
          <li>
            {partner.services.catchCooking
              ? t("partner.cookingYes")
              : t("partner.cookingUnknown")}
          </li>
          <li>{acceptanceLabel}</li>
          {policy?.reservationRequired ||
          partner.services.reservationAvailable ? (
            <li>{t("partner.inquiryRecommended")}</li>
          ) : null}
          <li>
            {t("partner.verifiedPrefix", {
              status: t(`partner.verification.${partner.verificationStatus}`),
            })}
          </li>
          {estimatedDriveMinutes !== null ? (
            <li>
              {t("partner.driveEstimate", {
                minutes: estimatedDriveMinutes,
              })}
            </li>
          ) : (
            <li>{t("partner.drivePending")}</li>
          )}
        </ul>
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        <TextButton
          variant="secondary"
          className="h-8 flex-1 text-xs"
          onClick={() => onSelect(partner.id)}
        >
          {t("partner.viewDetail")}
        </TextButton>
        {onAddToSchedule ? (
          <TextButton
            variant="ghost"
            className="h-8 flex-1 text-xs"
            disabled={scheduleAdded}
            onClick={() => onAddToSchedule(partner.id)}
          >
            {scheduleAdded
              ? t("partner.addedToSchedule")
              : t("partner.addToSchedule")}
          </TextButton>
        ) : null}
      </div>
    </article>
  );
}
