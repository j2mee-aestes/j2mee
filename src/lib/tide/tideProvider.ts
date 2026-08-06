import type { DailyTideData } from "@/types/fishing";

export interface TideProvider {
  getDailyTide(stationId: string, date: string): Promise<DailyTideData>;
}
