"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { LOCALE_INTL_TAGS } from "@/i18n/config";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import type { WeatherData } from "@/types/fishing";
import { RefreshCw, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

interface WeatherDetailDialogProps {
  open: boolean;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRefresh: () => void;
}

function formatClock(
  isoOrLocal: string | undefined,
  localeTag: string,
): string {
  if (!isoOrLocal) return "";
  const date = new Date(isoOrLocal);
  if (Number.isNaN(date.getTime())) {
    const match = isoOrLocal.match(/T(\d{2}:\d{2})/);
    return match?.[1] ?? isoOrLocal;
  }
  return date.toLocaleTimeString(localeTag, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function WeatherDetailDialog({
  open,
  weather,
  loading,
  error,
  onClose,
  onRefresh,
}: WeatherDetailDialogProps) {
  const { t, locale } = useTranslations();
  const localeTag = LOCALE_INTL_TAGS[locale];
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const display = (value: string | number | undefined, suffix = "") => {
    if (value === undefined || value === null || value === "") {
      return t("common.infoUnavailable");
    }
    return `${value}${suffix}`;
  };

  const windLabel =
    weather?.windDirection && weather.windSpeedMs !== undefined
      ? `${weather.windDirection}풍 ${Number(weather.windSpeedMs).toFixed(1)} ${t("units.metersPerSecond")}`
      : display(weather?.windDirection);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/40 p-4 sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="glass-panel my-auto max-h-[min(88dvh,40rem)] w-full max-w-md overflow-y-auto rounded-[1.5rem] p-4 shadow-[var(--shadow-float)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="font-display text-lg font-bold text-[var(--color-text-primary)]"
            >
              {t("weather.detailTitle")}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              {weather?.locationName
                ? localizePlaceText(weather.locationName, locale)
                : t("common.selectedPoint")}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              aria-label={t("weather.refresh")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/80 text-[var(--color-text-secondary)]"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden
              />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("common.close")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/80 text-[var(--color-text-secondary)]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t("weather.loadFailed")}
            </p>
            <TextButton variant="secondary" className="mt-3" onClick={onRefresh}>
              {t("common.retry")}
            </TextButton>
          </div>
        ) : null}

        {!error && weather ? (
          <>
            <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/80 px-4 py-4">
              <p className="text-base font-semibold text-[var(--color-text-primary)]">
                <span aria-hidden="true">{weather.conditionIcon ?? "☁️"}</span>{" "}
                {weather.condition ?? t("common.infoUnavailable")}
                {weather.isDay === false ? (
                  <span className="ml-2 text-xs font-medium text-[var(--color-text-muted)]">
                    {t("weather.night")}
                  </span>
                ) : (
                  <span className="ml-2 text-xs font-medium text-[var(--color-text-muted)]">
                    {t("weather.day")}
                  </span>
                )}
              </p>
              <p className="mt-1 font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {display(weather.temperatureC, t("units.celsius"))}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {t("weather.feelsLike")}{" "}
                {display(weather.feelsLikeC, t("units.celsius"))}
              </p>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <DetailItem
                label={t("weather.humidity")}
                value={display(weather.humidityPercent, "%")}
              />
              <DetailItem
                label={t("weather.precipAmount")}
                value={display(weather.precipitationMm, " mm")}
              />
              <DetailItem label={t("weather.windSummary")} value={windLabel} />
              <DetailItem
                label={t("weather.windGust")}
                value={display(
                  weather.windGustMs !== undefined
                    ? Number(weather.windGustMs).toFixed(1)
                    : undefined,
                  ` ${t("units.metersPerSecond")}`,
                )}
              />
              <DetailItem
                label={t("weather.cloudCover")}
                value={display(weather.cloudCoverPercent, "%")}
              />
              <DetailItem
                label={t("weather.pressure")}
                value={display(
                  weather.pressureHpa !== undefined
                    ? Math.round(weather.pressureHpa)
                    : undefined,
                  " hPa",
                )}
              />
            </dl>

            {weather.hourly && weather.hourly.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t("weather.nextHours")}
                </p>
                <ul className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {weather.hourly.map((item) => (
                    <li
                      key={item.time}
                      className="min-w-[4.5rem] shrink-0 rounded-2xl border border-[var(--color-border)] bg-white/80 px-2.5 py-2 text-center"
                    >
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {formatClock(item.time, localeTag)}
                      </p>
                      <p className="mt-1 text-sm" aria-hidden>
                        {item.conditionIcon ?? "☁️"}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[var(--color-text-primary)]">
                        {Math.round(item.temperatureC)}
                        {t("units.celsius")}
                      </p>
                      {item.precipitationProbability !== undefined ? (
                        <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                          {item.precipitationProbability}%
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-4 text-[11px] text-[var(--color-text-muted)]">
              {t("weather.updatedAt", {
                time: formatClock(
                  weather.forecastTime || weather.fetchedAt,
                  localeTag,
                ),
              })}{" "}
              · {weather.sourceName}
            </p>
          </>
        ) : null}

        {!error && !weather && loading ? (
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            {t("weather.loading")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/70 px-2.5 py-2">
      <dt className="text-[10px] text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-0.5 font-semibold text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  );
}
