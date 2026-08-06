"use client";

import { SearchBar } from "@/components/common/SearchBar";
import { IconButton, TextButton } from "@/components/common/IconButton";
import type { LanguageCode } from "@/constants/languages";
import { LANGUAGES } from "@/constants/languages";
import { t } from "@/constants/uiText";
import { mockTideTimes, mockWeather } from "@/data/mockFishingSpots";
import { Heart, LogIn, Menu, Waves, X } from "lucide-react";

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export function Header({
  language,
  onLanguageChange,
  mobileMenuOpen,
  onMobileMenuToggle,
}: HeaderProps) {
  const text = {
    serviceName: t(language, "serviceName"),
    searchPlaceholder: t(language, "searchPlaceholder"),
    weather: t(language, "weather"),
    tide: t(language, "tide"),
    favorites: t(language, "favorites"),
    login: t(language, "login"),
    languageLabel: t(language, "language"),
    openMenu: t(language, "openMenu"),
    closeMenu: t(language, "closeMenu"),
    highTide: t(language, "highTide"),
  };

  const nextTide = mockTideTimes[0];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <IconButton
            label={mobileMenuOpen ? text.closeMenu : text.openMenu}
            className="lg:hidden"
            onClick={onMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </IconButton>

          <div className="flex min-w-0 items-center gap-2">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] text-white shadow-sm"
              aria-hidden
            >
              <Waves className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-[var(--color-ocean-800)] sm:text-lg">
                {text.serviceName}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <IconButton label={text.favorites} className="hidden sm:inline-flex">
              <Heart className="h-4 w-4" />
            </IconButton>
            <TextButton variant="primary" className="hidden sm:inline-flex">
              <LogIn className="h-4 w-4" aria-hidden />
              {text.login}
            </TextButton>
            <TextButton variant="primary" className="sm:hidden" aria-label={text.login}>
              <LogIn className="h-4 w-4" />
            </TextButton>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <SearchBar
            placeholder={text.searchPlaceholder}
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <div className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1.5 text-xs sm:text-sm">
              <span className="font-medium text-[var(--color-text-secondary)]">
                {text.weather}
              </span>
              <span className="text-[var(--color-text-primary)]">
                {mockWeather.location} {mockWeather.temperature}°C · {mockWeather.condition}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1.5 text-xs sm:text-sm">
              <span className="font-medium text-[var(--color-text-secondary)]">
                {text.tide}
              </span>
              <span className="text-[var(--color-text-primary)]">
                {text.highTide} {nextTide.time}
                {nextTide.height !== undefined ? ` (${nextTide.height}cm)` : ""}
              </span>
            </div>

            <div
              className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1"
              role="group"
              aria-label={text.languageLabel}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  aria-pressed={language === lang.code}
                  aria-label={lang.label}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
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
      </div>
    </header>
  );
}
