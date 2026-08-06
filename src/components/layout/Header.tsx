"use client";

import { SearchBar } from "@/components/common/SearchBar";
import { IconButton } from "@/components/common/IconButton";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useTranslations } from "@/context/LocaleContext";
import { mockWeather } from "@/data/mockWeather";
import type { SearchablePlace } from "@/data/mockMapLocations";
import {
  Bell,
  CloudSun,
  Heart,
  LogIn,
  Menu,
  Waves,
  X,
} from "lucide-react";
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
}

export function Header({
  mobileMenuOpen,
  onMobileMenuToggle,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  searchNotice,
  searchResults,
  onSelectSearchResult,
}: HeaderProps) {
  const { t } = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton
            label={mobileMenuOpen ? t("common.closeMenu") : t("common.openMenu")}
            className="lg:hidden"
            onClick={onMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </IconButton>

          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] text-white shadow-sm"
              aria-hidden
            >
              <Waves className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold tracking-tight text-[var(--color-ocean-800)]">
                {t("common.serviceName")}
              </p>
              <p className="hidden truncate text-xs text-[var(--color-text-secondary)] sm:block">
                {t("common.serviceTagline")}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1.5 md:flex">
              <IconButton label={t("common.notifications")}>
                <Bell className="h-4 w-4" />
              </IconButton>
              <IconButton label={t("common.favorites")}>
                <Heart className="h-4 w-4" />
              </IconButton>
            </div>
            <Link
              href="/activities"
              className="hidden h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium text-[var(--color-text-primary)] md:inline-flex"
            >
              {t("common.activities")}
            </Link>
            <Link
              href="/schedule"
              className="hidden h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white sm:inline-flex"
            >
              {t("common.schedule")}
            </Link>
            <Link
              href="/privacy"
              className="hidden h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium lg:inline-flex"
            >
              {t("common.privacy")}
            </Link>
            <Link
              href="/my"
              className="hidden h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium md:inline-flex"
            >
              {t("auth.myPage")}
            </Link>
            <Link
              href="/login"
              className="hidden h-10 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white md:inline-flex"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              {t("common.login")}
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] text-white sm:hidden"
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
            <div className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-2 text-xs sm:text-sm">
              <CloudSun
                className="h-4 w-4 shrink-0 text-[var(--color-ocean-600)]"
                aria-hidden
              />
              <span className="font-semibold text-[var(--color-text-primary)]">
                {mockWeather.temperature}
                {t("units.celsius")}
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {mockWeather.condition}
              </span>
            </div>

            <LanguageSelector compact className="hidden sm:flex" />
          </div>
        </div>

        {searchNotice ? (
          <p
            className="rounded-[var(--radius-md)] border border-[var(--color-ocean-200)] bg-[var(--color-ocean-50)] px-3 py-2 text-xs text-[var(--color-ocean-800)] sm:text-sm"
            role="status"
          >
            {searchNotice}
          </p>
        ) : null}

        {searchResults.length > 0 ? (
          <div
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-2 shadow-sm"
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
                    className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left hover:bg-[var(--color-surface-muted)]"
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
          <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-3 lg:hidden">
            <div className="flex flex-wrap gap-2">
              <IconButton label={t("common.notifications")}>
                <Bell className="h-4 w-4" />
              </IconButton>
              <IconButton label={t("common.favorites")}>
                <Heart className="h-4 w-4" />
              </IconButton>
              <Link
                href="/activities"
                className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
              >
                {t("common.activities")}
              </Link>
              <Link
                href="/schedule"
                className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
              >
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
