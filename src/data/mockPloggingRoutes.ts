/**
 * UI-verification mock plogging route around Imrang Beach (Gijang).
 * Path coordinates are approximate mock values for polyline testing.
 */
import type { PloggingRoute } from "@/types/map";
import type { LocationDetail } from "@/types/fishing";

export const mockPloggingRoutes: PloggingRoute[] = [
  {
    id: "route-imrang",
    name: "임랑해수욕장 플로깅 코스",
    distanceKm: 3.1,
    estimatedMinutes: 80,
    startLabel: "시작",
    endLabel: "종료",
    coordinates: [
      { latitude: 35.3189, longitude: 129.2618 },
      { latitude: 35.3172, longitude: 129.2645 },
      { latitude: 35.3154, longitude: 129.2672 },
      { latitude: 35.3138, longitude: 129.2698 },
      { latitude: 35.3122, longitude: 129.2715 },
    ],
  },
];

export const mockPloggingLocations: LocationDetail[] = [
  {
    id: "loc-plogging-start",
    category: "plogging",
    name: "임랑해수욕장 플로깅 시작점",
    address: "부산광역시 기장군 장안읍 임랑리",
    description:
      "임랑해수욕장 플로깅 코스 시작점입니다. 약 3.1km, 1시간 20분 코스입니다.",
    coordinates: { latitude: 35.3189, longitude: 129.2618 },
    distanceLabel: "3.1km · 약 1시간 20분",
    isVerified: true,
  },
  {
    id: "loc-plogging-end",
    category: "plogging",
    name: "임랑해수욕장 플로깅 종료점",
    address: "부산광역시 기장군 장안읍 임랑리",
    description: "임랑해수욕장 플로깅 코스 종료점입니다.",
    coordinates: { latitude: 35.3122, longitude: 129.2715 },
    distanceLabel: "3.1km · 약 1시간 20분",
    isVerified: true,
  },
];
