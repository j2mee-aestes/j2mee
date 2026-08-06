export type MapCategory =
  | "fishing"
  | "tide"
  | "market"
  | "restaurant"
  | "uglySeafood"
  | "trash"
  | "plogging";

export type CategoryFilter = "all" | MapCategory;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapLocation {
  id: string;
  category: MapCategory;
  name: string;
  coordinates: Coordinates;
  /** Percentage position on the placeholder map (0–100) */
  position: {
    x: number;
    y: number;
  };
  description?: string;
  address?: string;
}

export interface PloggingRoute {
  id: string;
  name: string;
  distanceKm: number;
  durationLabel: string;
  /** SVG path-like points as percentages on the placeholder map */
  points: Array<{ x: number; y: number }>;
  startLabel: string;
  endLabel: string;
}
