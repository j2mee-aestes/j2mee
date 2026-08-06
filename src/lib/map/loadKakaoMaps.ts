import { getKakaoSdkUrl } from "@/lib/map/constants";

type LoaderStatus = "idle" | "loading" | "ready" | "error";

let loaderPromise: Promise<void> | null = null;
let loaderStatus: LoaderStatus = "idle";
let lastError: string | null = null;
let mapsFullyLoaded = false;

const LOAD_TIMEOUT_MS = 12_000;

function getScriptId(appKey: string): string {
  return `kakao-maps-sdk-${appKey.slice(0, 8)}`;
}

/** True when kakao.maps.load has completed and Map is available. */
export function isKakaoMapsReady(): boolean {
  return (
    mapsFullyLoaded &&
    typeof window !== "undefined" &&
    typeof window.kakao?.maps?.Map === "function"
  );
}

function markReady(): void {
  mapsFullyLoaded = true;
  loaderStatus = "ready";
  lastError = null;
}

function runMapsLoad(onDone: () => void, onFail: (error: Error) => void): void {
  if (typeof window === "undefined" || !window.kakao?.maps) {
    onFail(new Error("SDK_LOAD_FAILED"));
    return;
  }

  let settled = false;
  const timeoutId = window.setTimeout(() => {
    if (settled) return;
    settled = true;
    onFail(new Error("SDK_LOAD_TIMEOUT"));
  }, LOAD_TIMEOUT_MS);

  try {
    window.kakao.maps.load(() => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      markReady();
      onDone();
    });
  } catch (error) {
    window.clearTimeout(timeoutId);
    if (settled) return;
    settled = true;
    onFail(error instanceof Error ? error : new Error("SDK_LOAD_FAILED"));
  }
}

/**
 * Loads the Kakao Maps JavaScript SDK once (client-only).
 * Uses autoload=false and resolves after kakao.maps.load.
 * Safe to call early (app bootstrap) and again from map views.
 */
export function loadKakaoMapsSdk(appKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps can only load in the browser."));
  }

  if (!appKey) {
    return Promise.reject(new Error("MISSING_APP_KEY"));
  }

  if (isKakaoMapsReady()) {
    loaderStatus = "ready";
    return Promise.resolve();
  }

  if (loaderPromise) {
    return loaderPromise;
  }

  loaderStatus = "loading";
  lastError = null;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const fail = (error: Error) => {
      loaderStatus = "error";
      lastError = error.message;
      loaderPromise = null;
      mapsFullyLoaded = false;
      reject(error);
    };

    const finish = () => resolve();

    // Script already in DOM — do NOT only wait for "load" (it may have already fired)
    const existing = document.getElementById(getScriptId(appKey));
    if (existing) {
      if (window.kakao?.maps) {
        runMapsLoad(finish, fail);
        return;
      }
      existing.addEventListener(
        "load",
        () => {
          runMapsLoad(finish, fail);
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => {
          existing.remove();
          fail(new Error("SDK_LOAD_FAILED"));
        },
        { once: true },
      );
      return;
    }

    if (window.kakao?.maps) {
      runMapsLoad(finish, fail);
      return;
    }

    const script = document.createElement("script");
    script.id = getScriptId(appKey);
    script.async = true;
    script.defer = true;
    script.src = getKakaoSdkUrl(appKey);
    script.setAttribute("fetchpriority", "high");

    script.onload = () => {
      if (!window.kakao?.maps) {
        fail(new Error("SDK_LOAD_FAILED"));
        return;
      }
      runMapsLoad(finish, fail);
    };

    script.onerror = () => {
      script.remove();
      fail(new Error("SDK_LOAD_FAILED"));
    };

    document.head.appendChild(script);
  });

  return loaderPromise;
}

export function getKakaoLoaderStatus(): LoaderStatus {
  if (isKakaoMapsReady()) {
    return "ready";
  }
  return loaderStatus;
}

export function getKakaoLoaderError(): string | null {
  return lastError;
}

/** Allows retry after a failed load attempt. */
export function resetKakaoMapsLoader(): void {
  loaderPromise = null;
  loaderStatus = "idle";
  lastError = null;
  mapsFullyLoaded = false;
}
