import { Badge } from "@/components/common/Badge";
import {
  CATCH_ACCEPTANCE_LABELS,
  COOKING_METHOD_LABELS,
} from "@/constants/partners";
import type { CatchProcessingPolicy } from "@/types/partner";

interface CatchPolicySectionProps {
  policy?: CatchProcessingPolicy;
  outsideCatchAccepted: boolean;
}

export function CatchPolicySection({
  policy,
  outsideCatchAccepted,
}: CatchPolicySectionProps) {
  if (!policy) {
    return (
      <section aria-labelledby="catch-policy-heading">
        <h3
          id="catch-policy-heading"
          className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
        >
          잡은 수산물 접수
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          외부 수산물 접수 여부를 확인할 수 없습니다.
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          방문 전 점포에 직접 문의해주세요.
        </p>
        {!outsideCatchAccepted ? (
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            서비스 정보상 외부 수산물 접수가 표시되어 있지 않습니다.
          </p>
        ) : null}
      </section>
    );
  }

  const statusTone =
    policy.acceptanceStatus === "accepted"
      ? "green"
      : policy.acceptanceStatus === "conditional"
        ? "orange"
        : policy.acceptanceStatus === "notAccepted"
          ? "gray"
          : "blue";

  return (
    <section aria-labelledby="catch-policy-heading" className="space-y-3">
      <h3
        id="catch-policy-heading"
        className="text-sm font-semibold text-[var(--color-text-primary)]"
      >
        잡은 수산물 접수
      </h3>

      <Badge tone={statusTone}>
        {CATCH_ACCEPTANCE_LABELS[policy.acceptanceStatus]}
      </Badge>

      {policy.acceptanceStatus === "unknown" ? (
        <p className="text-xs text-[var(--color-text-muted)]">
          방문 전 점포에 직접 문의해주세요.
        </p>
      ) : null}

      {policy.acceptanceStatus === "accepted" ||
      policy.acceptanceStatus === "conditional" ? (
        <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
          <li>· 현장 상태 확인 후 최종 접수</li>
          {policy.refrigerationRequired ? <li>· 냉장 보관 필수</li> : null}
          {policy.reservationRequired ? <li>· 사전 문의 권장</li> : null}
        </ul>
      ) : null}

      {policy.acceptedSpecies && policy.acceptedSpecies.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-text-primary)]">
            가능한 어종
          </p>
          <div className="flex flex-wrap gap-1.5">
            {policy.acceptedSpecies.map((species) => (
              <Badge key={species} tone="teal">
                {species}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {policy.rejectedSpecies && policy.rejectedSpecies.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-text-primary)]">
            불가능한 어종
          </p>
          <div className="flex flex-wrap gap-1.5">
            {policy.rejectedSpecies.map((species) => (
              <Badge key={species} tone="gray">
                {species}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {policy.acceptedCookingMethods &&
      policy.acceptedCookingMethods.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-text-primary)]">
            가능한 조리 방식
          </p>
          <div className="flex flex-wrap gap-1.5">
            {policy.acceptedCookingMethods.map((method) => (
              <Badge key={method} tone="purple">
                {COOKING_METHOD_LABELS[method]}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {(policy.minimumWeightKg !== undefined ||
        policy.maximumWeightKg !== undefined) && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          무게 조건:{" "}
          {policy.minimumWeightKg !== undefined
            ? `최소 ${policy.minimumWeightKg}kg`
            : null}
          {policy.minimumWeightKg !== undefined &&
          policy.maximumWeightKg !== undefined
            ? " · "
            : null}
          {policy.maximumWeightKg !== undefined
            ? `최대 ${policy.maximumWeightKg}kg`
            : null}
        </p>
      )}

      {policy.pricingDescription ? (
        <p className="text-xs text-[var(--color-text-secondary)]">
          가격 안내: {policy.pricingDescription}
        </p>
      ) : null}

      {policy.finalInspectionRequired ? (
        <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
          최종 접수 여부는 현장 확인이 필요합니다.
        </p>
      ) : null}

      {policy.additionalNotes && policy.additionalNotes.length > 0 ? (
        <ul className="space-y-1">
          {policy.additionalNotes.map((note) => (
            <li
              key={note}
              className="text-xs text-[var(--color-text-secondary)]"
            >
              · {note}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
