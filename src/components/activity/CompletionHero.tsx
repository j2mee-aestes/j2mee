"use client";

interface CompletionHeroProps {
  title: string;
  date: string;
}

export function CompletionHero({ title, date }: CompletionHeroProps) {
  return (
    <section
      className="rounded-[var(--radius-lg)] border border-[var(--color-ocean-200)] bg-[var(--color-ocean-50)] p-5"
      aria-labelledby="completion-hero-title"
    >
      <p className="text-xs font-semibold text-[var(--color-ocean-700)]">
        {date} · {title}
      </p>
      <h1
        id="completion-hero-title"
        className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]"
      >
        오늘의 바다 일정이 완료되었어요!
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        낚시부터 지역 방문과 플로깅까지 오늘의 활동을 정리했어요.
      </p>
    </section>
  );
}
