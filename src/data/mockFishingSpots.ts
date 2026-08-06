/**
 * UI-verification mock fishing spots around Busan Gijang.
 * Coordinates are approximate and not official survey data.
 */
import type { LocationDetail } from "@/types/fishing";

export const DEFAULT_SELECTED_LOCATION_ID = "loc-hakri";

export const mockFishingSpots: LocationDetail[] = [
  {
    id: "loc-hakri",
    category: "fishing",
    name: "학리 방파제",
    address: "부산광역시 기장군 일광읍",
    description:
      "초보자와 가족 단위 이용객이 접근하기 쉬운 방파제 낚시 장소입니다.",
    coordinates: { latitude: 35.2608, longitude: 129.2336 },
    beginnerFriendly: true,
    parkingAvailable: true,
    toiletAvailable: true,
    safetyFacilities: true,
    isVerified: true,
    targetFish: ["감성돔", "우럭", "전갱이", "볼락"],
    nearbyMarket: "일광수산시장",
    nearbyMarketDistanceKm: 3.1,
    distanceLabel: "시장까지 3.1km",
  },
  {
    id: "loc-daebyeon",
    category: "fishing",
    name: "대변항 방파제",
    address: "부산광역시 기장군 기장읍 대변리",
    description:
      "항구와 인접해 접근성이 좋고, 저녁 물때에 볼락·학꽁치가 잘 잡히는 포인트입니다.",
    coordinates: { latitude: 35.2236, longitude: 129.2281 },
    beginnerFriendly: true,
    parkingAvailable: true,
    toiletAvailable: true,
    safetyFacilities: true,
    isVerified: true,
    targetFish: ["볼락", "학꽁치", "고등어"],
    nearbyMarket: "기장시장",
    nearbyMarketDistanceKm: 2.4,
    distanceLabel: "시장까지 2.4km",
  },
  {
    id: "loc-imrang",
    category: "fishing",
    name: "임랑해수욕장 인근 낚시 포인트",
    address: "부산광역시 기장군 장안읍 임랑리",
    description:
      "해수욕장과 가까운 연안 포인트로 플로깅 코스와 함께 즐기기 좋습니다.",
    coordinates: { latitude: 35.3185, longitude: 129.2642 },
    beginnerFriendly: false,
    parkingAvailable: true,
    toiletAvailable: true,
    safetyFacilities: false,
    isVerified: false,
    targetFish: ["감성돔", "농어", "전어"],
    nearbyMarket: "일광수산시장",
    nearbyMarketDistanceKm: 5.2,
    distanceLabel: "시장까지 5.2km",
  },
];
