"use client";

import { BusinessStatusBadge } from "@/components/partners/BusinessStatusBadge";
import { TextButton } from "@/components/common/IconButton";
import { PARTNER_TYPE_LABELS, PARTNER_VERIFICATION_LABELS } from "@/constants/partners";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
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
  const { partner, distanceKm, estimatedDriveMinutes } = result;
  const business = getBusinessStatus(partner.businessHours);
  const policy = partner.catchPolicy;
  const acceptanceLabel =
    policy?.acceptanceStatus === "accepted"
      ? "외부 수산물 접수 가능"
      : policy?.acceptanceStatus === "conditional"
        ? "외부 수산물 조건부 접수"
        : policy?.acceptanceStatus === "notAccepted"
          ? "외부 수산물 접수 불가"
          : "접수 여부 확인 필요";

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
              {partner.name}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {PARTNER_TYPE_LABELS[partner.type]} · {formatDistanceKm(distanceKm)}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-muted)]">
              {partner.address}
            </p>
          </div>
          <BusinessStatusBadge status={business.status} />
        </div>

        <ul className="mt-2 space-y-0.5 text-xs text-[var(--color-text-secondary)]">
          <li>
            {partner.services.catchCleaning ? "손질 가능" : "손질 정보 없음"}
          </li>
          <li>
            {partner.services.catchCooking ? "조리 가능" : "조리 정보 없음"}
          </li>
          <li>{acceptanceLabel}</li>
          {policy?.reservationRequired || partner.services.reservationAvailable ? (
            <li>사전 문의 권장</li>
          ) : null}
          <li>
            검증: {PARTNER_VERIFICATION_LABELS[partner.verificationStatus]}
          </li>
          {estimatedDriveMinutes !== null ? (
            <li>
              예상 차량 이동 {estimatedDriveMinutes}분 (직선거리 참고값)
            </li>
          ) : (
            <li>이동시간 정보 준비 중</li>
          )}
        </ul>
      </button>

      <div className="mt-3 flex flex-wrap gap-2">
        <TextButton
          variant="secondary"
          className="h-8 flex-1 text-xs"
          onClick={() => onSelect(partner.id)}
        >
          상세보기
        </TextButton>
        {onAddToSchedule ? (
          <TextButton
            variant="ghost"
            className="h-8 flex-1 text-xs"
            disabled={scheduleAdded}
            onClick={() => onAddToSchedule(partner.id)}
          >
            {scheduleAdded ? "일정 추가됨" : "일정에 추가"}
          </TextButton>
        ) : null}
      </div>
    </article>
  );
}
