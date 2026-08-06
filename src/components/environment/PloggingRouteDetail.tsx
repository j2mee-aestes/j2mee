"use client";

import { Card } from "@/components/common/Card";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { TextButton } from "@/components/common/IconButton";
import { LocationReportForm } from "@/components/environment/LocationReportForm";
import { PloggingCompletionSummary } from "@/components/environment/PloggingCompletionSummary";
import { PloggingSessionPanel } from "@/components/environment/PloggingSessionPanel";
import { WastePointTypeBadge } from "@/components/environment/WastePointTypeBadge";
import { PLOGGING_DIFFICULTY_LABELS } from "@/constants/environmentData";
import { VERIFICATION_STATUS_LABELS } from "@/constants/safetyThresholds";
import { findNearbyWastePoints } from "@/lib/environment/findNearbyWastePoints";
import { isStaleVerificationDate } from "@/lib/environment/isStaleVerificationDate";
import type {
  PloggingRoute,
  PloggingSession,
  WastePoint,
} from "@/types/environment";
import { useMemo, useState } from "react";

interface PloggingRouteDetailProps {
  route: PloggingRoute;
  connectedWastePoints: WastePoint[];
  session: PloggingSession;
  scheduleAdded: boolean;
  onAddToSchedule: () => void;
  onSelectWastePoint: (id: string) => void;
  onStartSession: () => void;
  onCancelSession: () => void;
  onCompleteSession: (payload: {
    collectedWasteTypes: string[];
    bagCount: number;
    disposalWastePointId?: string;
    memo: string;
  }) => void;
  onResetSession: () => void;
  notice?: string | null;
  className?: string;
}

export function PloggingRouteDetail({
  route,
  connectedWastePoints,
  session,
  scheduleAdded,
  onAddToSchedule,
  onSelectWastePoint,
  onStartSession,
  onCancelSession,
  onCompleteSession,
  onResetSession,
  notice,
  className = "",
}: PloggingRouteDetailProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const stale = isStaleVerificationDate(route.lastVerifiedAt);

  const nearbyFromStart = useMemo(
    () =>
      findNearbyWastePoints({
        origin: route.startPoint,
        wastePoints: connectedWastePoints,
        radiusKm: 5,
        limit: 3,
      }),
    [route.startPoint, connectedWastePoints],
  );

  const disposalName = connectedWastePoints.find(
    (point) => point.id === session.disposalWastePointId,
  )?.name;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Card as="article" className="flex flex-col gap-4 p-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
            플로깅 코스 · {PLOGGING_DIFFICULTY_LABELS[route.difficulty]}
          </p>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {route.name}
          </h2>
          {route.description ? (
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {route.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            검증: {VERIFICATION_STATUS_LABELS[route.verificationStatus]}
            {route.lastVerifiedAt
              ? ` · 마지막 확인일 ${route.lastVerifiedAt}`
              : ""}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2">
            <dt className="text-[var(--color-text-muted)]">거리</dt>
            <dd className="font-semibold">{route.distanceKm}km</dd>
          </div>
          <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-2">
            <dt className="text-[var(--color-text-muted)]">예상 시간</dt>
            <dd className="font-semibold">약 {route.estimatedMinutes}분</dd>
          </div>
        </dl>

        {route.recommendedTimeDescription ? (
          <p className="text-xs text-[var(--color-text-secondary)]">
            추천 이용시간: {route.recommendedTimeDescription}
          </p>
        ) : null}

        {stale ? (
          <div className="rounded-[var(--radius-md)] border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            오랫동안 현장 확인이 이루어지지 않은 코스입니다. 현재 상태가 다를 수
            있습니다.
          </div>
        ) : null}

        <section>
          <h3 className="mb-1 text-sm font-semibold">연결된 배출 장소</h3>
          {connectedWastePoints.length > 0 ? (
            <ul className="space-y-2">
              {connectedWastePoints.map((point) => (
                <li key={point.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-left text-xs hover:bg-[var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)]"
                    onClick={() => onSelectWastePoint(point.id)}
                  >
                    <span className="font-medium">{point.name}</span>
                    <WastePointTypeBadge type={point.type} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">
              연결된 배출 장소가 없습니다.
            </p>
          )}
          {nearbyFromStart.length > 0 ? (
            <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
              시작점 근처 배출 장소도 함께 확인해 보세요.
            </p>
          ) : null}
        </section>

        {route.facilities && route.facilities.length > 0 ? (
          <section>
            <h3 className="mb-1 text-sm font-semibold">편의시설</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {route.facilities.join(" · ")}
            </p>
          </section>
        ) : null}

        {route.cautionNotes && route.cautionNotes.length > 0 ? (
          <section>
            <h3 className="mb-1 text-sm font-semibold">주의사항</h3>
            <ul className="space-y-0.5 text-xs text-[var(--color-text-secondary)]">
              {route.cautionNotes.map((note) => (
                <li key={note}>· {note}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <DataSourceInfo
          sourceName={route.sourceName}
          lastVerifiedAt={route.lastVerifiedAt}
          sourceUrl={route.sourceUrl}
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
            variant="ghost"
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

      {session.status === "completed" ? (
        <PloggingCompletionSummary
          route={route}
          session={session}
          disposalName={disposalName}
          onReset={onResetSession}
        />
      ) : (
        <PloggingSessionPanel
          route={route}
          session={session}
          connectedWastePoints={connectedWastePoints}
          onStart={onStartSession}
          onCancel={onCancelSession}
          onComplete={onCompleteSession}
        />
      )}

      <LocationReportForm
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="ploggingRoute"
        targetId={route.id}
        targetName={route.name}
      />
    </div>
  );
}
