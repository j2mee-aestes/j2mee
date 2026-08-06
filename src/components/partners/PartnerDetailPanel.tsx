"use client";

import { Card } from "@/components/common/Card";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { EmptyState } from "@/components/common/EmptyState";
import { TextButton } from "@/components/common/IconButton";
import { BusinessStatusBadge } from "@/components/partners/BusinessStatusBadge";
import { CatchPolicySection } from "@/components/partners/CatchPolicySection";
import { PartnerInquiryForm } from "@/components/partners/PartnerInquiryForm";
import { PartnerServiceBadges } from "@/components/partners/PartnerServiceBadges";
import {
  PARTNER_TYPE_LABELS,
  PARTNER_VERIFICATION_LABELS,
} from "@/constants/partners";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
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
  const [inquiryOpen, setInquiryOpen] = useState(false);

  if (!partner) {
    return (
      <EmptyState
        title="시장·식당을 선택해주세요."
        description="지도 마커나 주변 장소 목록에서 장소를 선택하면 상세정보가 표시됩니다."
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  const business = getBusinessStatus(partner.businessHours);
  const hasDetail =
    Boolean(partner.description) ||
    Boolean(partner.catchPolicy) ||
    Boolean(partner.businessHours?.length);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Card as="article" className="flex flex-col gap-4 p-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ocean-600)]">
            {PARTNER_TYPE_LABELS[partner.type]}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {partner.name}
            </h2>
            <BusinessStatusBadge status={business.status} />
          </div>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ocean-500)]"
              aria-hidden
            />
            <span>{partner.address}</span>
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
            검증 상태: {PARTNER_VERIFICATION_LABELS[partner.verificationStatus]}
            {partner.lastVerifiedAt ? ` · 마지막 확인일 ${partner.lastVerifiedAt}` : ""}
          </p>
        </div>

        {distanceKm !== null && distanceKm !== undefined && originLabel ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
            <p className="font-semibold text-[var(--color-text-primary)]">
              {originLabel}에서 {formatDistanceKm(distanceKm)}
            </p>
            <p className="mt-0.5">표시된 거리는 좌표 기준 직선거리입니다.</p>
          </div>
        ) : null}

        {partner.description ? (
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {partner.description}
          </p>
        ) : null}

        {!hasDetail ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            이 장소의 상세 이용정보가 아직 등록되지 않았습니다.
          </p>
        ) : null}

        <section aria-labelledby="partner-hours-heading">
          <h3
            id="partner-hours-heading"
            className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            영업정보
          </h3>
          {partner.businessHours && partner.businessHours.length > 0 ? (
            <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
              <p>오늘: {business.todayHoursLabel}</p>
              <p>현재 상태: {business.label}</p>
              {partner.closedDays && partner.closedDays.length > 0 ? (
                <p>휴무일: {partner.closedDays.join(", ")}</p>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-[var(--color-text-secondary)]">
              <p>영업시간 정보가 없습니다.</p>
              <p className="mt-0.5">방문 전 직접 확인해주세요.</p>
            </div>
          )}
        </section>

        <section aria-labelledby="partner-services-heading">
          <h3
            id="partner-services-heading"
            className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            제공 서비스
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
            이용 안내
          </h3>
          <p className="mt-1">
            잡은 수산물의 상태와 보관 방식에 따라 접수가 거절될 수 있습니다.
            방문 전 점포에 직접 문의하고, 현장 안내를 우선 확인해주세요.
          </p>
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
            {scheduleAdded ? "일정에 추가됨" : "일정에 추가"}
          </TextButton>
          <TextButton
            variant="primary"
            className="w-full"
            onClick={() => setInquiryOpen(true)}
          >
            이용 문의하기
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
        partnerName={partner.name}
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
