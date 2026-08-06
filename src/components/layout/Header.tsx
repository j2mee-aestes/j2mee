"use client";

import { SearchBar } from "@/components/common/SearchBar";
import { IconButton, TextButton } from "@/components/common/IconButton";
import type { LanguageCode } from "@/constants/languages";
import { LANGUAGES } from "@/constants/languages";
import { UI_TEXT } from "@/constants/uiText";
import { mockTideData, mockWeather } from "@/data/mockTideData";
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
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchNotice: string | null;
  searchResults: SearchablePlace[];
  onSelectSearchResult: (locationId: string) => void;
  onTideSummaryClick: () => void;
}

export function Header({
  language,
  onLanguageChange,
  mobileMenuOpen,
  onMobileMenuToggle,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  searchNotice,
  searchResults,
  onSelectSearchResult,
  onTideSummaryClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton
            label={mobileMenuOpen ? UI_TEXT.closeMenu : UI_TEXT.openMenu}
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
                {UI_TEXT.serviceName}
              </p>
              <p className="hidden truncate text-xs text-[var(--color-text-secondary)] sm:block">
                {UI_TEXT.serviceTagline}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1.5 md:flex">
              <IconButton label={UI_TEXT.notifications}>
                <Bell className="h-4 w-4" />
              </IconButton>
              <IconButton label={UI_TEXT.favorites}>
                <Heart className="h-4 w-4" />
              </IconButton>
            </div>
            <Link
              href="/activities"
              className="hidden h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium text-[var(--color-text-primary)] md:inline-flex"
            >
              기록
            </Link>
            <Link
              href="/schedule"
              className="hidden h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white sm:inline-flex"
            >
              일정
            </Link>
            <TextButton variant="primary" className="hidden md:inline-flex">
              <LogIn className="h-4 w-4" aria-hidden />
              {UI_TEXT.login}
            </TextButton>
            <TextButton
              variant="primary"
              className="sm:hidden"
              aria-label={UI_TEXT.login}
            >
              <LogIn className="h-4 w-4" />
            </TextButton>
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
                {mockWeather.temperature}°C
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {mockWeather.condition}
              </span>
            </div>

            <button
              type="button"
              onClick={onTideSummaryClick}
              className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-2 text-xs transition-colors hover:border-[var(--color-ocean-200)] hover:bg-[var(--color-ocean-50)] sm:text-sm"
              aria-label={`${UI_TEXT.tide} ${mockTideData.mul} ${mockTideData.status}`}
            >
              <Waves
                className="h-4 w-4 shrink-0 text-[var(--color-teal-700)]"
                aria-hidden
              />
              <span className="font-semibold text-[var(--color-text-primary)]">
                {mockTideData.mul}
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {mockTideData.status}
              </span>
            </button>

            <div
              className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1"
              role="group"
              aria-label={UI_TEXT.language}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  aria-pressed={language === lang.code}
                  aria-label={lang.label}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                    language === lang.code
                      ? "bg-[var(--color-ocean-600)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
                  }`}
                >
                  {lang.code}
                </button>
              ))}
            </div>
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
            aria-label={UI_TEXT.searchResultsLabel}
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
                          : "장소 정보"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {mobileMenuOpen ? (
          <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-3 lg:hidden">
            <IconButton label={UI_TEXT.notifications}>
              <Bell className="h-4 w-4" />
            </IconButton>
            <IconButton label={UI_TEXT.favorites}>
              <Heart className="h-4 w-4" />
            </IconButton>
            <Link
              href="/activities"
              className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm font-medium"
            >
              활동 기록
            </Link>
            <Link
              href="/schedule"
              className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-3 text-sm font-medium text-white"
            >
              일정
            </Link>
            <span className="self-center text-xs text-[var(--color-text-secondary)]">
              {UI_TEXT.serviceTagline}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
