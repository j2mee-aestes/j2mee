/**
 * UI-verification mock plogging routes around Gijang coast.
 * Path coordinates are approximate mock values for polyline testing.
 * Replace via ploggingRouteRepository when official course data is available.
 */
import type { PloggingRoute } from "@/types/environment";

export const mockPloggingRoutes: PloggingRoute[] = [
  {
    id: "plogging-imrang",
    name: "임랑해수욕장 플로깅 코스",
    description:
      "임랑해수욕장 산책로를 따라 해안 쓰레기를 줍는 초급 친화 코스입니다.",
    coordinates: [
      { latitude: 35.3189, longitude: 129.2618 },
      { latitude: 35.3172, longitude: 129.2645 },
      { latitude: 35.3154, longitude: 129.2672 },
      { latitude: 35.3138, longitude: 129.2698 },
      { latitude: 35.3122, longitude: 129.2715 },
    ],
    startPoint: { latitude: 35.3189, longitude: 129.2618 },
    endPoint: { latitude: 35.3122, longitude: 129.2715 },
    distanceKm: 3.1,
    estimatedMinutes: 80,
    difficulty: "easy",
    connectedWastePointIds: [
      "waste-imrang-collection-1",
      "waste-imrang-line-1",
    ],
    cautionNotes: [
      "일부 구간에 계단이 있습니다.",
      "만조 시 해안 접근이 어려울 수 있습니다.",
      "야간에는 조명이 부족합니다.",
      "미끄러운 갯바위 구간에 진입하지 마세요.",
    ],
    facilities: ["화장실", "주차장", "쉼터"],
    recommendedTimeDescription: "오전 9시–오후 4시",
    verificationStatus: "admin",
    lastVerifiedAt: "2026-07-30",
    sourceName: "파도파도 mock 환경 데이터",
  },
  {
    id: "plogging-ilgwang",
    name: "일광 해안 플로깅 코스",
    description:
      "일광 해안로와 산책로를 잇는 중급 코스로, 폐낚싯줄 수거함과 연결됩니다.",
    coordinates: [
      { latitude: 35.2612, longitude: 129.231 },
      { latitude: 35.2595, longitude: 129.2335 },
      { latitude: 35.2578, longitude: 129.2352 },
      { latitude: 35.256, longitude: 129.2368 },
      { latitude: 35.2542, longitude: 129.238 },
    ],
    startPoint: { latitude: 35.2612, longitude: 129.231 },
    endPoint: { latitude: 35.2542, longitude: 129.238 },
    distanceKm: 2.4,
    estimatedMinutes: 55,
    difficulty: "normal",
    connectedWastePointIds: [
      "waste-ilgwang-general-1",
      "waste-ilgwang-line-1",
    ],
    cautionNotes: [
      "차량 통행이 있는 구간이 있습니다.",
      "방파제 아래 위험 구간으로 내려가지 마세요.",
    ],
    facilities: ["화장실"],
    recommendedTimeDescription: "해가 밝은 시간대",
    verificationStatus: "partner",
    lastVerifiedAt: "2026-07-15",
    sourceName: "파도파도 mock 환경 데이터",
  },
];
