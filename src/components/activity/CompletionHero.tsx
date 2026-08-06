"use client";

import { useTranslations } from "@/context/LocaleContext";

interface CompletionHeroProps {
  title: string;
  date: string;
}

export function CompletionHero({ title, date }: CompletionHeroProps) {
  const { t } = useTranslations();

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
        {t("activity.completionHero")}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {t("activity.completionSub")}
      </p>
    </section>
  );
}
