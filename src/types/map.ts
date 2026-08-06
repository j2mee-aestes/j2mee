export type MapCategory =
  | "fishing"
  | "tide"
  | "market"
  | "uglySeafood"
  | "trash"
  | "plogging";

export type CategoryFilter = "all" | MapCategory;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarkerItem {
  id: string;
  category: MapCategory;
  label: string;
  coordinates: Coordinates;
  /** Percentage position on the placeholder map (0–100) */
  position: {
    x: number;
    y: number;
  };
}

export interface PloggingPath {
  id: string;
  name: string;
  /** SVG path-like points as percentages on the placeholder map */
  points: Array<{ x: number; y: number }>;
}
