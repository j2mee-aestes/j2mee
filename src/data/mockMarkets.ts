import type { LocationDetail } from "@/types/fishing";

export const mockMarkets: LocationDetail[] = [
  {
    id: "loc-ilgwang-market",
    category: "market",
    name: "일광수산시장",
    address: "부산광역시 기장군 일광읍",
    description: "신선한 회와 제철 수산물을 만날 수 있는 지역 수산시장입니다.",
    coordinates: { latitude: 35.26, longitude: 129.23 },
    parkingAvailable: true,
    toiletAvailable: true,
    distanceLabel: "학리에서 약 3.1km",
  },
  {
    id: "loc-gijang-market",
    category: "market",
    name: "기장시장",
    address: "부산광역시 기장군 기장읍",
    description: "기장 연안에서 올라온 수산물과 못난이 수산물 코너가 있습니다.",
    coordinates: { latitude: 35.2441, longitude: 129.222 },
    parkingAvailable: true,
    toiletAvailable: true,
    distanceLabel: "대변항에서 약 2.4km",
  },
];

export const mockRestaurants: LocationDetail[] = [
  {
    id: "loc-bada-restaurant",
    category: "restaurant",
    name: "바다한끼 식당",
    address: "부산광역시 기장군 일광읍",
    description:
      "직접 잡은 수산물을 손질·조리해 주는 식당입니다. 예약 없이 방문 가능합니다.",
    coordinates: { latitude: 35.27, longitude: 129.24 },
    parkingAvailable: true,
    toiletAvailable: true,
    distanceLabel: "학리에서 약 2.0km",
  },
];

export const mockUglySeafood: LocationDetail[] = [
  {
    id: "loc-ugly-1",
    category: "uglySeafood",
    name: "못난이 수산물 판매처",
    address: "부산광역시 기장군 기장읍",
    description: "모양이 고르지 않지만 맛은 좋은 수산물을 합리적 가격에 판매합니다.",
    coordinates: { latitude: 35.15, longitude: 129.06 },
    parkingAvailable: true,
    toiletAvailable: false,
  },
];

export const mockTrashBins: LocationDetail[] = [
  {
    id: "loc-trash-1",
    category: "trash",
    name: "해안 쓰레기통 A",
    address: "부산광역시 기장군 일광읍 해안로",
    description: "일반·재활용 분리수거가 가능한 공공 쓰레기통입니다.",
    coordinates: { latitude: 35.2, longitude: 129.18 },
  },
  {
    id: "loc-trash-2",
    category: "trash",
    name: "해안 쓰레기통 B",
    address: "부산광역시 기장군 장안읍 해안로",
    description: "플로깅 코스 중간 지점에 설치된 쓰레기통입니다.",
    coordinates: { latitude: 35.12, longitude: 129.1 },
  },
  {
    id: "loc-trash-line",
    category: "trash",
    name: "폐낚싯줄 수거함",
    address: "부산광역시 기장군 기장읍 대변항",
    description: "폐낚싯줄과 납추를 안전하게 버릴 수 있는 전용 수거함입니다.",
    coordinates: { latitude: 35.22, longitude: 129.23 },
  },
];

export const mockTideStations: LocationDetail[] = [
  {
    id: "loc-tide-1",
    category: "tide",
    name: "기장 조석 관측소",
    address: "부산광역시 기장군 해안",
    description: "인근 해안의 만조·간조 관측 정보를 제공하는 지점입니다.",
    coordinates: { latitude: 35.25, longitude: 129.25 },
  },
];
