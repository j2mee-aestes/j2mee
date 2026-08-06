"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KAKAO_MAP_APP_KEY } from "@/lib/map/constants";
import {
  loadKakaoMapsSdk,
  resetKakaoMapsLoader,
} from "@/lib/map/loadKakaoMaps";

export type KakaoMapsStatus =
  | "missing-key"
  | "loading"
  | "ready"
  | "error";

interface UseKakaoMapsResult {
  status: KakaoMapsStatus;
  errorMessage: string | null;
  appKey: string;
  retry: () => void;
}

export function useKakaoMaps(): UseKakaoMapsResult {
  const appKey = KAKAO_MAP_APP_KEY;
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">(
    appKey ? "loading" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!appKey) {
      return;
    }

    let cancelled = false;

    loadKakaoMapsSdk(appKey)
      .then(() => {
        if (!cancelled) {
          setLoadState("ready");
          setErrorMessage(null);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        setLoadState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "SDK_LOAD_FAILED",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [appKey, retryCount]);

  const retry = useCallback(() => {
    resetKakaoMapsLoader();
    document
      .querySelectorAll('script[id^="kakao-maps-sdk-"]')
      .forEach((node) => node.remove());
    setErrorMessage(null);
    setLoadState("loading");
    setRetryCount((value) => value + 1);
  }, []);

  const status = useMemo<KakaoMapsStatus>(() => {
    if (!appKey) {
      return "missing-key";
    }
    if (loadState === "ready") {
      return "ready";
    }
    if (loadState === "error") {
      return "error";
    }
    return "loading";
  }, [appKey, loadState]);

  return { status, errorMessage, appKey, retry };
}
