import type {
  DailyTideData,
  TideEvent,
  TideHourlyPoint,
} from "@/types/fishing";
import { mockTideStations } from "@/data/mockTideStations";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function buildHourly(date: string, seed: number): TideHourlyPoint[] {
  const points: TideHourlyPoint[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const angle = ((hour + seed) / 24) * Math.PI * 2;
    const heightCm = Math.round(70 + Math.sin(angle) * 45 + Math.cos(angle * 2) * 8);
    points.push({
      time: `${date}T${pad(hour)}:00:00+09:00`,
      heightCm: Math.max(10, heightCm),
    });
  }
  return points;
}

function buildEvents(date: string, seed: number): TideEvent[] {
  const offsets = [5, 11, 17, 23];
  return offsets.map((hour, index) => {
    const adjusted = (hour + (seed % 2)) % 24;
    const type: TideEvent["type"] = index % 2 === 0 ? "high" : "low";
    const heightCm = type === "high" ? 110 + seed : 25 + seed;
    return {
      type,
      time: `${date}T${pad(adjusted)}:${pad(seed * 3 % 60)}:00+09:00`,
      heightCm,
    };
  });
}

/** Deterministic mock tide provider for UI verification. */
export const mockTideProvider = {
  async getDailyTide(stationId: string, date: string): Promise<DailyTideData> {
    const station =
      mockTideStations.find((item) => item.id === stationId) ??
      mockTideStations[0];

    if (!station) {
      throw new Error("TIDE_STATION_NOT_FOUND");
    }

    const seed = stationId.length + date.split("-").reduce((sum, part) => sum + Number(part), 0);

    return {
      stationId: station.id,
      stationName: station.name,
      date,
      events: buildEvents(date, seed % 7),
      hourly: buildHourly(date, seed % 5),
      fetchedAt: new Date().toISOString(),
      sourceName: station.sourceName,
    };
  },
};
