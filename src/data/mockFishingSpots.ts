import type { FishingSpot, TideTime, WeatherSummary } from "@/types/fishing";

export const mockFishingSpots: FishingSpot[] = [
  {
    id: "spot-hakri",
    name: "학리 방파제",
    address: "부산광역시 기장군",
    coordinates: { latitude: 35.3184, longitude: 129.2631 },
    beginnerFriendly: true,
    parkingAvailable: true,
    toiletAvailable: true,
    targetFish: ["감성돔", "볼락", "학꽁치", "고등어"],
    nearbyMarket: "기장시장",
  },
  {
    id: "spot-songjung",
    name: "송정해수욕장 방파제",
    address: "부산광역시 해운대구",
    coordinates: { latitude: 35.1786, longitude: 129.1994 },
    beginnerFriendly: true,
    parkingAvailable: true,
    toiletAvailable: true,
    targetFish: ["숭어", "볼락", "전어"],
    nearbyMarket: "자갈치시장",
  },
  {
    id: "spot-dadaepo",
    name: "다대포 방파제",
    address: "부산광역시 사하구",
    coordinates: { latitude: 35.0478, longitude: 128.9656 },
    beginnerFriendly: false,
    parkingAvailable: true,
    toiletAvailable: false,
    targetFish: ["광어", "우럭", "도다리"],
    nearbyMarket: "다대포항 수산물시장",
  },
];

export const mockTideTimes: TideTime[] = [
  { type: "high", time: "05:42", height: 118 },
  { type: "low", time: "11:58", height: 32 },
  { type: "high", time: "18:15", height: 126 },
  { type: "low", time: "00:40", height: 28 },
];

export const mockWeather: WeatherSummary = {
  location: "기장",
  temperature: 22,
  condition: "맑음",
  windSpeed: 3.2,
};

export const DEFAULT_SELECTED_SPOT_ID = "spot-hakri";
