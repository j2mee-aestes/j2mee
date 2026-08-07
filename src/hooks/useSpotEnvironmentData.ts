"use client";

import { useCallback, useEffect, useState } from "react";
import type { WeatherData } from "@/types/fishing";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? "데이터를 불러오는 중 문제가 발생했습니다.";
  } catch {
    return "데이터를 불러오는 중 문제가 발생했습니다.";
  }
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

    const params = new URLSearchParams();
    if (spotId) {
      params.set("spotId", spotId);
    }
    if (lat !== undefined && lng !== undefined) {
      params.set("lat", String(lat));
      params.set("lng", String(lng));
    }
    if (date) {
      params.set("date", date);
    }

    fetch(`/api/weather?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await readErrorMessage(response));
        }
        return (await response.json()) as WeatherData;
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setData(null);
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는 중 문제가 발생했습니다.",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [spotId, date, tick, enabled, lat, lng]);

  return {
    data: enabled ? data : null,
    loading: enabled ? loading : false,
    error: enabled ? error : null,
    reload,
  };
}

export function useWaveData(spotId: string | null): AsyncState<{
  waveHeightM?: number;
  wavePeriodSec?: number;
  fetchedAt?: string;
  sourceName?: string;
}> {
  const [data, setData] = useState<{
    waveHeightM?: number;
    wavePeriodSec?: number;
    fetchedAt?: string;
    sourceName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    if (!spotId) return;
    const controller = new AbortController();
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });
    fetch(`/api/wave?spotId=${encodeURIComponent(spotId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(await readErrorMessage(response));
        return response.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는 중 문제가 발생했습니다.",
        );
        setLoading(false);
      });
    return () => controller.abort();
  }, [spotId, tick]);

  return {
    data: spotId ? data : null,
    loading: spotId ? loading : false,
    error: spotId ? error : null,
    reload,
  };
}
