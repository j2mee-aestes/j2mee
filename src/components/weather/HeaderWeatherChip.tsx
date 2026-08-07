"use client";

import { WeatherDetailDialog } from "@/components/weather/WeatherDetailDialog";
import { useTranslations } from "@/context/LocaleContext";
import {
  DEFAULT_HEADER_WEATHER_COORDS,
  DEFAULT_HEADER_WEATHER_NAME,
  fetchLiveWeatherClient,
} from "@/lib/weather/clientWeather";
import type { WeatherData } from "@/types/fishing";
import { CloudSun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function HeaderWeatherChip() {
  const { t } = useTranslations();
  const locationLabel = t("weather.defaultLocation");
  const [summary, setSummary] = useState<WeatherData | null>(null);
  const [detail, setDetail] = useState<WeatherData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await fetchLiveWeatherClient({
        coordinates: DEFAULT_HEADER_WEATHER_COORDS,
        locationName: locationLabel || DEFAULT_HEADER_WEATHER_NAME,
        detail: false,
        signal,
      });
      setSummary(weather);
    } catch {
      setError("WEATHER_FETCH_FAILED");
    } finally {
      setLoading(false);
    }
  }, [locationLabel]);

  const loadDetail = useCallback(async (refresh = false) => {
    setDetailLoading(true);
    setError(null);
    try {
      const weather = await fetchLiveWeatherClient({
        coordinates: DEFAULT_HEADER_WEATHER_COORDS,
        locationName: locationLabel || DEFAULT_HEADER_WEATHER_NAME,
        detail: true,
        refresh,
      });
      setDetail(weather);
      setSummary(weather);
    } catch {
      setError("WEATHER_FETCH_FAILED");
    } finally {
      setDetailLoading(false);
    }
  }, [locationLabel]);

  useEffect(() => {
    const controller = new AbortController();
    void loadSummary(controller.signal);
    return () => controller.abort();
  }, [loadSummary]);

  const openDetail = () => {
    setOpen(true);
    setDetail(summary);
    void loadDetail(false);
  };

  const temp =
    summary?.temperatureC !== undefined
      ? Math.round(summary.temperatureC)
      : null;
  const condition = summary?.condition;
  const icon = summary?.conditionIcon;

  return (
    <>
      <button
        type="button"
        onClick={openDetail}
        aria-label={t("weather.openDetail")}
        className="flex min-w-0 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/75 px-3 py-2 text-xs shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ocean-500)] sm:text-sm"
      >
        {icon ? (
          <span className="text-sm" aria-hidden>
            {icon}
          </span>
        ) : (
          <CloudSun
            className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
            aria-hidden
          />
        )}
        {loading && !summary ? (
          <span className="text-[var(--color-text-secondary)]">
            {t("weather.loading")}
          </span>
        ) : error && !summary ? (
          <span className="text-[var(--color-text-secondary)]">
            {t("weather.loadFailed")}
          </span>
        ) : (
          <>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {temp !== null ? `${temp}${t("units.celsius")}` : t("common.infoUnavailable")}
            </span>
            <span className="truncate text-[var(--color-text-secondary)]">
              {condition ?? DEFAULT_HEADER_WEATHER_NAME}
            </span>
          </>
        )}
      </button>

      <WeatherDetailDialog
        open={open}
        weather={detail}
        loading={detailLoading}
        error={error}
        onClose={() => setOpen(false)}
        onRefresh={() => void loadDetail(true)}
      />
    </>
  );
}
