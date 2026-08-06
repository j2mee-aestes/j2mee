"use client";

import { Card } from "@/components/common/Card";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { EmptyState } from "@/components/common/EmptyState";
import { TextButton } from "@/components/common/IconButton";
import { LocationReportForm } from "@/components/environment/LocationReportForm";
import { WastePointStatusBadge } from "@/components/environment/WastePointStatusBadge";
import { WastePointTypeBadge } from "@/components/environment/WastePointTypeBadge";
import { VERIFICATION_STATUS_LABELS } from "@/constants/safetyThresholds";
import { UI_TEXT } from "@/constants/uiText";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import { isStaleVerificationDate } from "@/lib/environment/isStaleVerificationDate";
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
  const [reportOpen, setReportOpen] = useState(false);

  if (!wastePoint) {
    return (
      <EmptyState
        title="수거 장소를 선택해주세요."
        icon={<MapPin className="h-6 w-6" />}
        className={className}
      />
    );
  }

  const stale = isStaleVerificationDate(wastePoint.lastVerifiedAt);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Card as="article" className="flex flex-col gap-4 p-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <WastePointTypeBadge type={wastePoint.type} />
            <WastePointStatusBadge status={wastePoint.status} />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {wastePoint.name}
          </h2>
          {wastePoint.address ? (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{wastePoint.address}</span>
            </p>
          ) : null}
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            검증: {VERIFICATION_STATUS_LABELS[wastePoint.verificationStatus]}
            {wastePoint.lastVerifiedAt
              ? ` · 마지막 확인일 ${wastePoint.lastVerifiedAt}`
              : ""}
          </p>
        </div>

        {wastePoint.status === "unknown" ? (
          <div className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <p>현재 운영 여부를 확인할 수 없습니다.</p>
            <p className="mt-0.5">방문 전 현장 상태를 확인해주세요.</p>
          </div>
        ) : null}

        {stale ? (
          <div className="rounded-[var(--radius-md)] border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            <p>오랫동안 현장 확인이 이루어지지 않은 장소입니다.</p>
            <p className="mt-0.5">
              현재 위치와 운영 상태가 다를 수 있습니다.
            </p>
          </div>
        ) : null}

        {distanceKm !== null && distanceKm !== undefined && originLabel ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--color-text-primary)]">
              {originLabel}에서 {formatDistanceKm(distanceKm)}
            </p>
            <p className="mt-0.5 text-[var(--color-text-muted)]">
              표시된 거리는 좌표 기준 직선거리입니다.
            </p>
          </div>
        ) : null}

        {wastePoint.description ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {wastePoint.description}
          </p>
        ) : null}

        <section>
          <h3 className="mb-1 text-sm font-semibold">수거 가능한 쓰레기 종류</h3>
          {wastePoint.acceptedWasteTypes &&
          wastePoint.acceptedWasteTypes.length > 0 ? (
            <ul className="space-y-0.5 text-xs text-[var(--color-text-secondary)]">
              {wastePoint.acceptedWasteTypes.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">
              등록된 수거 종류 정보가 없습니다.
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-1 text-sm font-semibold">이용시간</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {wastePoint.availableHours ??
              "이용시간 정보가 없습니다. 방문 전 확인해 주세요."}
          </p>
        </section>

        {wastePoint.usageNotes && wastePoint.usageNotes.length > 0 ? (
          <section>
            <h3 className="mb-1 text-sm font-semibold">이용 시 주의사항</h3>
            <ul className="space-y-0.5 text-xs text-[var(--color-text-secondary)]">
              {wastePoint.usageNotes.map((note) => (
                <li key={note}>· {note}</li>
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
            {UI_TEXT.directions}
          </TextButton>
          <TextButton
            variant="secondary"
            className="w-full"
            onClick={() => setReportOpen(true)}
          >
            위치 오류 신고
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
        targetName={wastePoint.name}
      />
    </div>
  );
}
