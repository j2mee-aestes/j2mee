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
): AsyncState<WeatherData> {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    if (!spotId) {
      return;
    }

    const controller = new AbortController();
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });

    fetch(
      `/api/weather?spotId=${encodeURIComponent(spotId)}&date=${encodeURIComponent(date)}`,
      { signal: controller.signal },
    )
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
  }, [spotId, date, tick]);

  return {
    data: spotId ? data : null,
    loading: spotId ? loading : false,
    error: spotId ? error : null,
    reload,
  };
}
