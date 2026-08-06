export type ScheduleItemType =
  | "fishing"
  | "market"
  | "restaurant"
  | "processing"
  | "plogging";

export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  targetId: string;
  name: string;
  relatedFishingSpotId?: string;
  addedAt: string;
}
