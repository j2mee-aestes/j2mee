"use client";

import { useCallback, useEffect, useState } from "react";
import type { WeatherData } from "@/types/fishing";
import { fetchLiveWeatherClient } from "@/lib/weather/clientWeather";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useWeatherData(
  spotId: string | null,
  date: string,
  coordinates?: { latitude: number; longitude: number } | null,
): AsyncState<WeatherData> {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  const lat = coordinates?.latitude;
  const lng = coordinates?.longitude;
  const enabled = Boolean(spotId || (lat !== undefined && lng !== undefined));

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });

    const run = async () => {
      try {
        if (spotId) {
          const params = new URLSearchParams({ spotId });
          if (date) params.set("date", date);
          try {
            const response = await fetch(`/api/weather?${params.toString()}`, {
              signal: controller.signal,
            });
            if (response.ok) {
              setData((await response.json()) as WeatherData);
              setLoading(false);
              return;
            }
          } catch {
            // GitHub Pages has no API routes — fall through.
          }
        }

        if (lat === undefined || lng === undefined) {
          throw new Error("WEATHER_FETCH_FAILED");
        }

        const payload = await fetchLiveWeatherClient({
          coordinates: { latitude: lat, longitude: lng },
          detail: false,
          signal: controller.signal,
        });
        setData(payload);
        setLoading(false);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        setData(null);
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는 중 문제가 발생했습니다.",
        );
        setLoading(false);
      }
    };

    void run();
    return () => controller.abort();
  }, [spotId, date, tick, enabled, lat, lng]);

  return {
    data: enabled ? data : null,
    loading: enabled ? loading : false,
    error: enabled ? error : null,
    reload,
  };
}

interface WaveState {
  waveHeightM?: number;
  wavePeriodSec?: number;
  fetchedAt?: string;
  sourceName?: string;
}

async function fetchMarineWaveClient(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WaveState> {
  const url = new URL("https://marine-api.open-meteo.com/v1/marine");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "wave_height,wave_period");
  url.searchParams.set("timezone", "Asia/Seoul");
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) throw new Error("WAVE_FETCH_FAILED");
  const payload = (await response.json()) as {
    current?: { wave_height?: number; wave_period?: number };
  };
  if (payload.current?.wave_height == null) {
    throw new Error("WAVE_FETCH_FAILED");
  }
  return {
    waveHeightM: Number(payload.current.wave_height),
    wavePeriodSec: Number(payload.current.wave_period ?? 0),
    fetchedAt: new Date().toISOString(),
    sourceName: "Open-Meteo Marine (실시간 파고)",
  };
}

export function useWaveData(
  spotId: string | null,
  coordinates?: { latitude: number; longitude: number } | null,
): AsyncState<WaveState> {
  const [data, setData] = useState<WaveState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((value) => value + 1), []);
  const lat = coordinates?.latitude;
  const lng = coordinates?.longitude;
  const enabled = Boolean(spotId || (lat !== undefined && lng !== undefined));

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => {
        setData(null);
        setLoading(false);
        setError(null);
      });
      return;
    }

    const controller = new AbortController();
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });

    const run = async () => {
      try {
        try {
          if (spotId) {
            const response = await fetch(
              `/api/wave?spotId=${encodeURIComponent(spotId)}`,
              { signal: controller.signal },
            );
            if (response.ok) {
              setData(await response.json());
              setLoading(false);
              return;
            }
          }
        } catch {
          // Static hosting (GitHub Pages) has no API route — fall through.
        }
        if (lat === undefined || lng === undefined) {
          throw new Error("WAVE_FETCH_FAILED");
        }
        setData(await fetchMarineWaveClient(lat, lng, controller.signal));
        setLoading(false);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        setData(null);
        setError(
          err instanceof Error
            ? err.message
            : "WAVE_FETCH_FAILED",
        );
        setLoading(false);
      }
    };

    void run();
    return () => controller.abort();
  }, [spotId, tick, lat, lng, enabled]);

  return {
    data: enabled ? data : null,
    loading: enabled ? loading : false,
    error: enabled ? error : null,
    reload,
  };
}
