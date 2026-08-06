import { getKakaoSdkUrl } from "@/lib/map/constants";

type LoaderStatus = "idle" | "loading" | "ready" | "error";

let loaderPromise: Promise<void> | null = null;
let loaderStatus: LoaderStatus = "idle";
let lastError: string | null = null;
let mapsFullyLoaded = false;

const LOAD_TIMEOUT_MS = 20_000;

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

  // Already fully initialized (e.g. autoload finished)
  if (typeof window.kakao.maps.Map === "function") {
    markReady();
    onDone();
    return;
  }

  let settled = false;
  const finishOk = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timeoutId);
    window.clearInterval(pollId);
    markReady();
    onDone();
  };
  const finishErr = (error: Error) => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timeoutId);
    window.clearInterval(pollId);
    onFail(error);
  };

  const timeoutId = window.setTimeout(() => {
    finishErr(new Error("SDK_LOAD_TIMEOUT"));
  }, LOAD_TIMEOUT_MS);

  // Poll in case load callback is skipped but Map appears (or slow CDN)
  const pollId = window.setInterval(() => {
    if (typeof window.kakao?.maps?.Map === "function") {
      finishOk();
    }
  }, 250);

  try {
    window.kakao.maps.load(() => {
      finishOk();
    });
  } catch (error) {
    finishErr(error instanceof Error ? error : new Error("SDK_LOAD_FAILED"));
  }
}

/**
 * Loads the Kakao Maps JavaScript SDK once (client-only).
 * Uses autoload=false and resolves after kakao.maps.load.
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
    // Prefer https SDK entry; Kakao itself may still pull http CDN on http pages.
    script.src = getKakaoSdkUrl(appKey);
    script.charset = "UTF-8";

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
