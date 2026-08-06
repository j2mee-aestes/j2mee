import { mockWastePoints } from "@/data/environment/mockWastePoints";
import {
  isValidWastePoint,
  normalizeWastePoint,
} from "@/lib/environment/normalizeWastePoint";
import type { WastePoint, WastePointRepository } from "@/types/environment";

let cached: WastePoint[] | null = null;

export function getAllWastePoints(): WastePoint[] {
  if (!cached) {
    cached = mockWastePoints
      .filter((point) => {
        const valid = isValidWastePoint(point);
        if (!valid && process.env.NODE_ENV !== "production") {
          console.warn(`[waste] skipped invalid waste point: ${point.id}`);
        }
        return valid;
      })
      .map(normalizeWastePoint);
  }
  return cached;
}

export function getWastePointById(id: string): WastePoint | null {
  return getAllWastePoints().find((point) => point.id === id) ?? null;
}

export function searchWastePoints(query: string): WastePoint[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const typeKeywords: Array<{ key: string; type: WastePoint["type"] }> = [
    { key: "일반", type: "generalTrash" },
    { key: "쓰레기", type: "generalTrash" },
    { key: "재활용", type: "recycling" },
    { key: "낚싯줄", type: "fishingLine" },
    { key: "어구", type: "fishingGear" },
    { key: "플로깅", type: "ploggingCollection" },
    { key: "집하", type: "ploggingCollection" },
  ];

  return getAllWastePoints().filter((point) => {
    const haystack = [
      point.name,
      point.address ?? "",
      point.description ?? "",
      point.type,
      ...(point.acceptedWasteTypes ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(normalized)) {
      return true;
    }

    return typeKeywords.some(
      (item) => normalized.includes(item.key) && point.type === item.type,
    );
  });
}

export const localWastePointRepository: WastePointRepository = {
  async getAll() {
    return getAllWastePoints();
  },
  async getById(id) {
    return getWastePointById(id);
  },
};
