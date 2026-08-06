"use client";

import { useEffect } from "react";
import { KAKAO_MAP_APP_KEY } from "@/lib/map/constants";
import { loadKakaoMapsSdk } from "@/lib/map/loadKakaoMaps";

/** Start Kakao Maps SDK download as soon as the app shell mounts. */
export function KakaoMapsPreload() {
  useEffect(() => {
    if (!KAKAO_MAP_APP_KEY) {
      return;
    }
    void loadKakaoMapsSdk(KAKAO_MAP_APP_KEY).catch(() => {
      // Map views surface errors via useKakaoMaps / MapFallback
    });
  }, []);

  return null;
}
