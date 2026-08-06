import type { Coordinates, MapCategory } from "./map";

export interface LocationDetail {
  id: string;
  category: MapCategory;
  name: string;
  address: string;
  description: string;
  beginnerFriendly?: boolean;
  parkingAvailable?: boolean;
  toiletAvailable?: boolean;
  safetyFacilities?: boolean;
  targetFish?: string[];
  nearbyMarket?: string;
  nearbyMarketDistanceKm?: number;
  distanceLabel?: string;
  coordinates: Coordinates;
}

export interface TideTime {
  type: "high" | "low";
  time: string;
  height?: number;
}

export interface TideChartPoint {
  time: string;
  /** Relative height 0–100 for SVG chart */
  height: number;
  kind?: "high" | "low" | "now";
}

export interface TideDaySummary {
  mul: string;
  status: string;
  times: TideTime[];
  chartPoints: TideChartPoint[];
  currentTimeLabel: string;
}

export interface WeatherSummary {
  location: string;
  temperature: number;
  condition: string;
  windSpeed: number;
}
