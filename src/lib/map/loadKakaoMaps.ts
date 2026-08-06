type LoaderStatus = "idle" | "loading" | "ready" | "error";

let loaderPromise: Promise<void> | null = null;
let loaderStatus: LoaderStatus = "idle";
let lastError: string | null = null;

function getScriptId(appKey: string): string {
  return `kakao-maps-sdk-${appKey.slice(0, 8)}`;
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

  if (window.kakao?.maps) {
    loaderStatus = "ready";
    return new Promise((resolve) => {
      window.kakao.maps.load(() => resolve());
    });
  }

  if (loaderPromise) {
    return loaderPromise;
  }

  loaderStatus = "loading";
  lastError = null;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(getScriptId(appKey));
    if (existing) {
      existing.addEventListener("load", () => {
        window.kakao.maps.load(() => {
          loaderStatus = "ready";
          resolve();
        });
      });
      existing.addEventListener("error", () => {
        loaderStatus = "error";
        lastError = "SDK_LOAD_FAILED";
        loaderPromise = null;
        reject(new Error("SDK_LOAD_FAILED"));
      });
      return;
    }

    const script = document.createElement("script");
    script.id = getScriptId(appKey);
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;

    script.onload = () => {
      if (!window.kakao?.maps) {
        loaderStatus = "error";
        lastError = "SDK_LOAD_FAILED";
        loaderPromise = null;
        reject(new Error("SDK_LOAD_FAILED"));
        return;
      }
      window.kakao.maps.load(() => {
        loaderStatus = "ready";
        resolve();
      });
    };

    script.onerror = () => {
      loaderStatus = "error";
      lastError = "SDK_LOAD_FAILED";
      loaderPromise = null;
      script.remove();
      reject(new Error("SDK_LOAD_FAILED"));
    };

    document.head.appendChild(script);
  });

  return loaderPromise;
}

export function getKakaoLoaderStatus(): LoaderStatus {
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
}
