"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "@/context/LocaleContext";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import {
  ArrowRight,
  Binoculars,
  Fish,
  Footprints,
  Map as MapIcon,
  Pause,
  Play,
  Shield,
  Trash2,
  Waves,
} from "lucide-react";

const NAV = [
  { href: "/map", labelKey: "home.nav.map" as const },
  { href: "/contribute", labelKey: "home.nav.contribute" as const },
  { href: "/sources", labelKey: "home.nav.sources" as const },
  { href: "/privacy", labelKey: "home.nav.privacy" as const },
  { href: "/login", labelKey: "home.nav.login" as const },
];

const FEATURES = [
  {
    href: "/map?category=fishing",
    icon: Fish,
    titleKey: "home.features.fishing.title" as const,
    bodyKey: "home.features.fishing.body" as const,
  },
  {
    href: "/map?category=plogging",
    icon: Footprints,
    titleKey: "home.features.plogging.title" as const,
    bodyKey: "home.features.plogging.body" as const,
  },
  {
    href: "/map?category=trash",
    icon: Trash2,
    titleKey: "home.features.bins.title" as const,
    bodyKey: "home.features.bins.body" as const,
  },
  {
    href: "/map?category=attraction",
    icon: Binoculars,
    titleKey: "home.features.attractions.title" as const,
    bodyKey: "home.features.attractions.body" as const,
  },
];

export function LandingHome() {
  const { t } = useTranslations();
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((value) => (value >= 100 ? 0 : value + 0.8));
    }, 80);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="min-h-screen text-[var(--color-ink)]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(145deg,var(--color-accent),var(--color-accent-strong))] text-white shadow-[0_12px_28px_-14px_rgba(14,116,144,0.7)]">
              <Waves className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
              {t("common.serviceName")}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector compact className="hidden sm:flex" />
            <Link
              href="/map"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              {t("home.cta.openMap")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </header>

        {/* AirSide-style hero: one composition, brand-first, full-bleed media plane */}
        <section className="ui-rise relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-float)] sm:rounded-[2.5rem]">
          <div
            className="relative min-h-[72vh] w-full bg-[radial-gradient(120%_90%_at_50%_0%,#9fd4ea_0%,#4fa8c8_42%,#0b3d5c_100%)]"
            aria-label={t("home.hero.mediaLabel")}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)",
                backgroundSize: "18px 18px",
                maskImage:
                  "linear-gradient(180deg, transparent 0%, black 25%, black 70%, transparent 100%)",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,transparent,rgba(7,30,48,0.55))]"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] drop-shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
                {t("common.serviceName")}
              </p>
              <p className="mt-4 max-w-xl text-sm font-medium text-white/90 sm:text-base">
                {t("home.hero.tagline")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/map"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_16px_40px_-18px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5"
                >
                  <MapIcon className="h-4 w-4" aria-hidden />
                  {t("home.cta.exploreMap")}
                </Link>
                <Link
                  href="/contribute"
                  className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  {t("home.cta.contribute")}
                </Link>
              </div>
            </div>

            <nav
              className="absolute bottom-16 left-1/2 z-10 hidden w-[min(92%,720px)] -translate-x-1/2 items-center gap-1 rounded-full bg-[rgba(10,18,28,0.88)] px-3 py-2 text-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl md:flex"
              aria-label={t("home.nav.label")}
            >
              <span className="mr-1 grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <Waves className="h-4 w-4" aria-hidden />
              </span>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="absolute inset-x-5 bottom-5 z-10 flex items-center gap-3">
              <button
                type="button"
                aria-label={playing ? t("home.hero.pause") : t("home.hero.play")}
                onClick={() => setPlaying((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm"
              >
                {playing ? (
                  <Pause className="h-4 w-4" aria-hidden />
                ) : (
                  <Play className="h-4 w-4" aria-hidden />
                )}
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-[#f472b6] transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wide text-[var(--color-accent-strong)]">
            {t("home.about.eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("home.about.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
            {t("home.about.body")}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="glass-panel group rounded-[1.5rem] p-5 transition hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {t(feature.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {t(feature.bodyKey)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-strong)]">
                  {t("home.features.cta")}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 px-6 py-8 text-center shadow-[var(--shadow-soft)] backdrop-blur-md sm:px-10">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
            {t("home.partners.lead")}
          </p>
          <p className="mt-3 font-display text-lg font-semibold tracking-tight sm:text-xl">
            {t("home.partners.names")}
          </p>
          <Link
            href="/sources"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent-strong)] underline-offset-4 hover:underline"
          >
            {t("home.partners.link")}
          </Link>
        </section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-[var(--color-surface-muted)] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--color-accent-strong)] shadow-[var(--shadow-soft)]">
              <Shield className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">{t("home.footerCta.title")}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {t("home.footerCta.body")}
              </p>
            </div>
          </div>
          <Link
            href="/map"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] px-5 text-sm font-semibold text-white"
          >
            {t("home.cta.getStarted")}
          </Link>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} {t("common.serviceName")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy" className="hover:text-[var(--color-ink)]">
              {t("common.privacy")}
            </Link>
            <Link href="/sources" className="hover:text-[var(--color-ink)]">
              {t("home.nav.sources")}
            </Link>
            <Link href="/contribute" className="hover:text-[var(--color-ink)]">
              {t("home.nav.contribute")}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
