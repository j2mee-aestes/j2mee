"use client";

import { SearchBar } from "@/components/common/SearchBar";
import { IconButton } from "@/components/common/IconButton";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { HeaderWeatherChip } from "@/components/weather/HeaderWeatherChip";
import { useTranslations } from "@/context/LocaleContext";
import { publicPath } from "@/lib/paths";
import type { SearchablePlace } from "@/data/mockMapLocations";
import {
  Bell,
  Heart,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchNotice: string | null;
  searchResults: SearchablePlace[];
  onSelectSearchResult: (locationId: string) => void;
  externalKakaoQuery?: string | null;
}

const navLinkClass =
  "inline-flex h-10 items-center rounded-full border border-[var(--color-border)] bg-white/70 px-3.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-accent-soft)]";

const navCtaClass =
  "inline-flex h-10 items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] px-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(11,36,71,0.65)] transition hover:-translate-y-0.5 hover:brightness-105";

export function Header({
  mobileMenuOpen,
  onMobileMenuToggle,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  searchNotice,
  searchResults,
  onSelectSearchResult,
  externalKakaoQuery = null,
}: HeaderProps) {
  const { t } = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,white_72%,transparent)] shadow-[var(--shadow-soft)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton
            label={mobileMenuOpen ? t("common.closeMenu") : t("common.openMenu")}
            className="lg:hidden"
            onClick={onMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </IconButton>

          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <Image
              src={publicPath("/images/padopado-logo.png")}
              alt={t("common.serviceName")}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-2xl object-cover shadow-[0_12px_28px_-14px_rgba(11,36,71,0.55)] transition duration-300 group-hover:scale-[1.03]"
              priority
            />
            <div className="min-w-0">
              <p className="font-display truncate text-[1.35rem] font-semibold leading-none tracking-[-0.04em] text-[var(--color-ink)] sm:text-[1.55rem]">
                {t("common.serviceName")}
              </p>
              <p className="mt-1 hidden truncate text-[11px] font-medium text-[var(--color-text-secondary)] sm:block">
                {t("common.serviceTagline")}
              </p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1.5 md:flex">
              <IconButton label={t("common.notifications")}>
                <Bell className="h-4 w-4" />
              </IconButton>
              <IconButton label={t("common.favorites")}>
                <Heart className="h-4 w-4" />
              </IconButton>
            </div>
            <Link href="/activities" className={`hidden md:inline-flex ${navLinkClass}`}>
              {t("common.activities")}
            </Link>
            <Link href="/schedule" className={`hidden sm:inline-flex ${navCtaClass}`}>
              {t("common.schedule")}
            </Link>
            <Link href="/sources" className={`hidden lg:inline-flex ${navLinkClass}`}>
              {t("home.nav.sources")}
            </Link>
            <Link href="/contribute" className={`hidden md:inline-flex ${navLinkClass}`}>
              {t("home.nav.contribute")}
            </Link>
            <Link href="/privacy" className={`hidden lg:inline-flex ${navLinkClass}`}>
              {t("common.privacy")}
            </Link>
            <Link href="/my" className={`hidden md:inline-flex ${navLinkClass}`}>
              {t("auth.myPage")}
            </Link>
            <Link href="/login" className={`hidden md:inline-flex ${navCtaClass}`}>
              <LogIn className="h-4 w-4" aria-hidden />
              {t("common.login")}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] text-white shadow-[0_12px_28px_-14px_rgba(11,36,71,0.65)] sm:hidden"
              aria-label={t("common.login")}
            >
              <LogIn className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <SearchBar
            value={searchQuery}
            onChange={onSearchQueryChange}
            onSubmit={onSearchSubmit}
            className="w-full xl:max-w-xl"
          />

          <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
            <HeaderWeatherChip />

            <LanguageSelector compact className="hidden sm:flex" />
          </div>
        </div>

        {searchNotice ? (
          <p
            className="ui-rise rounded-2xl border border-[var(--color-ocean-200)] bg-[var(--color-ocean-50)]/90 px-3 py-2 text-xs text-[var(--color-ocean-800)] sm:text-sm"
            role="status"
          >
            {searchNotice}
          </p>
        ) : null}

        {externalKakaoQuery ? (
          <div className="ui-rise rounded-2xl border border-[var(--color-border)] bg-white/80 px-3 py-2 text-xs sm:text-sm">
            <p className="text-[var(--color-text-secondary)]">
              {t("search.externalHint")}
            </p>
            <a
              href={`https://map.kakao.com/?q=${encodeURIComponent(externalKakaoQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex font-semibold text-[var(--color-accent-strong)]"
            >
              {t("search.openInKakao", { query: externalKakaoQuery })} →
            </a>
          </div>
        ) : null}

        {searchResults.length > 0 ? (
          <div
            className="ui-rise glass-panel rounded-2xl p-2"
            role="listbox"
            aria-label={t("search.resultsLabel")}
          >
            <ul className="max-h-48 divide-y divide-[var(--color-border)] overflow-y-auto">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    className="flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--color-accent-soft)]"
                    onClick={() => onSelectSearchResult(result.id)}
                  >
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {result.name}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {"address" in result && result.address
                        ? result.address
                        : "description" in result && result.description
                          ? result.description
                          : t("common.infoUnavailable")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {mobileMenuOpen ? (
          <div className="ui-rise flex flex-col gap-3 border-t border-[var(--color-border)] pt-3 lg:hidden">
            <div className="flex flex-wrap gap-2">
              <IconButton label={t("common.notifications")}>
                <Bell className="h-4 w-4" />
              </IconButton>
              <IconButton label={t("common.favorites")}>
                <Heart className="h-4 w-4" />
              </IconButton>
              <Link href="/activities" className={navLinkClass}>
                {t("common.activities")}
              </Link>
              <Link href="/contribute" className={navLinkClass}>
                {t("home.nav.contribute")}
              </Link>
              <Link href="/sources" className={navLinkClass}>
                {t("home.nav.sources")}
              </Link>
              <Link href="/schedule" className={navCtaClass}>
                {t("common.schedule")}
              </Link>
            </div>
            <LanguageSelector />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("common.serviceTagline")}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
