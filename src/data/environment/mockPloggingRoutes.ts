/**
 * Gijang coastal plogging routes.
 * Paths follow land-side promenades / coastal roads (sea is to the east).
 * Coordinates stay on or west of the shoreline so polylines do not cross open water.
 */
import type { PloggingRoute } from "@/types/environment";

export const mockPloggingRoutes: PloggingRoute[] = [
  {
    id: "plogging-imrang",
    name: "임랑해수욕장 플로깅 코스",
    description:
      "임랑해수욕장 산책로(육지 쪽 보행로)를 따라 해안 쓰레기를 줍는 초급 코스입니다.",
    coordinates: [
      { latitude: 35.3212, longitude: 129.263 },
      { latitude: 35.3198, longitude: 129.2634 },
      { latitude: 35.3184, longitude: 129.2638 },
      { latitude: 35.317, longitude: 129.264 },
      { latitude: 35.3158, longitude: 129.2636 },
    ],
    startPoint: { latitude: 35.3212, longitude: 129.263 },
    endPoint: { latitude: 35.3158, longitude: 129.2636 },
    distanceKm: 1.2,
    estimatedMinutes: 40,
    difficulty: "easy",
    connectedWastePointIds: [
      "waste-imrang-collection-1",
      "waste-imrang-line-1",
    ],
    cautionNotes: [
      "산책로(육지 측)를 이용하고 갯바위·해상으로 내려가지 마세요.",
      "만조 시 일부 해안 접근이 어려울 수 있습니다.",
      "야간에는 조명이 부족합니다.",
    ],
    facilities: ["화장실", "주차장", "쉼터"],
    recommendedTimeDescription: "오전 9시–오후 4시",
    verificationStatus: "admin",
    lastVerifiedAt: "2026-08-05",
    sourceName: "파도파도 해안 산책로 참고 데이터",
  },
  {
    id: "plogging-ilgwang",
    name: "일광 해안 플로깅 코스",
    description:
      "일광해수욕장 해안 산책로와 도로변 보행로를 잇는 코스로, 폐낚싯줄 수거함과 연결됩니다.",
    coordinates: [
      { latitude: 35.2624, longitude: 129.232 },
      { latitude: 35.2612, longitude: 129.2328 },
      { latitude: 35.26, longitude: 129.2334 },
      { latitude: 35.2588, longitude: 129.2336 },
      { latitude: 35.2576, longitude: 129.233 },
    ],
    startPoint: { latitude: 35.2624, longitude: 129.232 },
    endPoint: { latitude: 35.2576, longitude: 129.233 },
    distanceKm: 1.1,
    estimatedMinutes: 35,
    difficulty: "normal",
    connectedWastePointIds: [
      "waste-ilgwang-general-1",
      "waste-ilgwang-line-1",
    ],
    cautionNotes: [
      "차량 통행이 있는 구간이 있습니다. 보행로를 이용하세요.",
      "방파제·테트라포드 아래 위험 구간으로 내려가지 마세요.",
    ],
    facilities: ["화장실"],
    recommendedTimeDescription: "해가 밝은 시간대",
    verificationStatus: "partner",
    lastVerifiedAt: "2026-08-05",
    sourceName: "파도파도 해안 산책로 참고 데이터",
  },
];
