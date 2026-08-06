"use client";

import Link from "next/link";
import { dataSources } from "@/data/sources/dataSources";
import { useTranslations } from "@/context/LocaleContext";

const CATEGORY_LABEL: Record<string, string> = {
  weather: "기상·해양",
  map: "지도",
  admin: "행정·공개자료",
  community: "커뮤니티",
};

export default function SourcesPage() {
  const { t } = useTranslations();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm font-semibold text-[var(--color-accent-strong)]"
      >
        ← {t("sourcesPage.backHome")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        {t("sourcesPage.title")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {t("sourcesPage.body")}
      </p>
      <ul className="mt-8 space-y-3">
        {dataSources.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target={source.url.startsWith("http") ? "_blank" : undefined}
              rel={source.url.startsWith("http") ? "noreferrer" : undefined}
              className="glass-panel block rounded-2xl p-4 transition hover:-translate-y-0.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
                {CATEGORY_LABEL[source.category] ?? source.category}
              </p>
              <p className="mt-1 font-display text-lg font-semibold">
                {source.label}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {source.description}
              </p>
              <p className="mt-2 text-xs font-semibold text-[var(--color-accent-strong)]">
                {source.url} →
              </p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
