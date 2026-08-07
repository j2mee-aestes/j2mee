import { wasteBinsFromGeoJson } from "@/data/environment/wasteBinsFromGeoJson";
import type { WastePoint } from "@/types/environment";

/**
 * Parses/loads waste bin points from the GeoJSON-backed data module.
 * Prefer this over fetching `/public/data/waste-bins.geojson` in the browser.
 */
export function loadWasteBinsGeoJson(): WastePoint[] {
  return [...wasteBinsFromGeoJson];
}
