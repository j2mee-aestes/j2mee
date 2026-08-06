"use client";

import type { CompletionBadge } from "@/types/activity";

interface CompletionBadgesProps {
  badges: CompletionBadge[];
}

export function CompletionBadges({ badges }: CompletionBadgesProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <section aria-label="완료 배지">
      <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
        활동 기록 배지
      </h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <li
            key={badge.id}
            className="rounded-[var(--radius-md)] border border-[var(--color-ocean-200)] bg-[var(--color-ocean-50)] px-3 py-2"
          >
            <p className="text-sm font-semibold text-[var(--color-ocean-800)]">
              {badge.label}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
              {badge.description}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-[var(--color-text-secondary)]">
        활동 기록을 기념하기 위한 앱 내부 배지입니다. 별도의 금전적 보상이나
        포인트는 제공되지 않습니다.
      </p>
    </section>
  );
}
