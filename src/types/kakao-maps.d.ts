/**
 * Minimal Kakao Maps SDK typings used by 파도파도.
 * Only APIs actually used in this project are declared.
 */

export {};

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }

  interface KakaoNamespace {
    maps: KakaoMaps;
  }

  interface KakaoMaps {
    load: (callback: () => void) => void;
    LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
    LatLngBounds: new () => KakaoLatLngBounds;
    Map: new (
      container: HTMLElement,
      options: KakaoMapOptions,
    ) => KakaoMap;
    CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay;
    Polyline: new (options: KakaoPolylineOptions) => KakaoPolyline;
    event: {
      addListener: (
        target: object,
        type: string,
        handler: (...args: unknown[]) => void,
      ) => void;
      removeListener: (
        target: object,
        type: string,
        handler: (...args: unknown[]) => void,
      ) => void;
    };
  }

  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface KakaoLatLngBounds {
    extend: (latlng: KakaoLatLng) => void;
    isEmpty: () => boolean;
  }

  interface KakaoMapOptions {
    center: KakaoLatLng;
    level: number;
  }

  interface KakaoMap {
    setCenter: (latlng: KakaoLatLng) => void;
    getCenter: () => KakaoLatLng;
    setLevel: (level: number, options?: { animate?: boolean }) => void;
    getLevel: () => number;
    panTo: (latlng: KakaoLatLng) => void;
    relayout: () => void;
    setBounds: (
      bounds: KakaoLatLngBounds,
      paddingTop?: number,
      paddingRight?: number,
      paddingBottom?: number,
      paddingLeft?: number,
    ) => void;
  }

  interface KakaoCustomOverlayOptions {
    map?: KakaoMap | null;
    position: KakaoLatLng;
    content: HTMLElement | string;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }

  interface KakaoCustomOverlay {
    setMap: (map: KakaoMap | null) => void;
    setPosition: (position: KakaoLatLng) => void;
    setZIndex: (zIndex: number) => void;
    getContent: () => HTMLElement | string;
  }

  interface KakaoPolylineOptions {
    map?: KakaoMap | null;
    path: KakaoLatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    zIndex?: number;
  }

  interface KakaoPolyline {
    setMap: (map: KakaoMap | null) => void;
    setOptions: (options: Partial<KakaoPolylineOptions>) => void;
    setPath: (path: KakaoLatLng[]) => void;
  }
}
