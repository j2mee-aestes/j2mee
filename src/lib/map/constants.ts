import type { Coordinates } from "@/types/map";

/** Default map center: Busan Gijang area */
export const DEFAULT_CENTER: Coordinates = {
  latitude: 35.244,
  longitude: 129.222,
};

export const DEFAULT_ZOOM_LEVEL = 7;
export const SINGLE_MARKER_ZOOM_LEVEL = 5;
export const USER_LOCATION_ZOOM_LEVEL = 4;
export const MIN_ZOOM_LEVEL = 1;
export const MAX_ZOOM_LEVEL = 14;

export const KAKAO_MAP_APP_KEY =
  process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY?.trim() ?? "";
