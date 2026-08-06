import type { Coordinates } from "./map";

export interface FishingSpot {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  beginnerFriendly: boolean;
  parkingAvailable: boolean;
  toiletAvailable: boolean;
  targetFish: string[];
  nearbyMarket?: string;
}

export interface TideTime {
  type: "high" | "low";
  time: string;
  height?: number;
}

export interface WeatherSummary {
  location: string;
  temperature: number;
  condition: string;
  windSpeed: number;
}
