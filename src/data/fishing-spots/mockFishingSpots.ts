/**
 * UI-verification mock fishing spots.
 * Replace with official datasets via fishingSpotRepository.
 */
import type { FishingSpot } from "@/types/fishing";
import fishingSpotsJson from "@/data/fishing-spots/fishingSpots.json";

export const DEFAULT_SELECTED_LOCATION_ID = "loc-hakri";

export const mockFishingSpots: FishingSpot[] = fishingSpotsJson as FishingSpot[];
