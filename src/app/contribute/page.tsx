"use client";

import Link from "next/link";
import { Binoculars, Fish, Trash2 } from "lucide-react";
import { ContributionBoard } from "@/components/contribute/ContributionBoard";
import { useTranslations } from "@/context/LocaleContext";

export default function ContributePage() {
  const { t } = useTranslations();

  const items = [
    {
      href: "/contribute/bins",
      icon: Trash2,
      title: t("contribute.bins"),
      body: t("contribute.binsBody"),
    },
    {
      href: "/contribute/attractions",
      icon: Binoculars,
      title: t("contribute.attractions"),
      body: t("contribute.attractionsBody"),
    },
    {
      href: "/contribute/fishing",
      icon: Fish,
      title: t("contribute.fishing"),
      body: t("contribute.fishingBody"),
    },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm font-semibold text-[var(--color-accent-strong)]"
      >
        ← {t("sourcesPage.backHome")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        {t("contribute.title")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {t("contribute.body")}
      </p>
      <div className="mt-8 grid gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="glass-panel flex items-start gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">
                  {item.body}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-[var(--color-text-muted)]">
        {t("contribute.mileageNote")}
      </p>

      <ContributionBoard />
    </main>
  );
}
