import type { PloggingRoute } from "@/types/map";
import type { LocationDetail } from "@/types/fishing";

export const mockPloggingRoutes: PloggingRoute[] = [
  {
    id: "route-imrang",
    name: "임랑해수욕장 플로깅 코스",
    distanceKm: 3.1,
    durationLabel: "약 1시간 20분",
    startLabel: "시작",
    endLabel: "종료",
    points: [
      { x: 50, y: 30 },
      { x: 58, y: 36 },
      { x: 66, y: 40 },
      { x: 72, y: 48 },
      { x: 68, y: 56 },
    ],
  },
];

export const mockPloggingLocations: LocationDetail[] = [
  {
    id: "loc-plogging-start",
    category: "plogging",
    name: "임랑해수욕장 플로깅 코스",
    address: "부산광역시 기장군 장안읍 임랑리",
    description:
      "임랑해수욕장 해안을 따라 걷는 3.1km 플로깅 코스입니다. 약 1시간 20분 소요됩니다.",
    coordinates: { latitude: 35.3189, longitude: 129.268 },
    distanceLabel: "3.1km · 약 1시간 20분",
  },
];
