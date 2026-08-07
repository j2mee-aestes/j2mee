import { mockLeisurePlaces } from "@/data/leisure/mockLeisurePlaces";
import type { LeisurePlace, LeisureRepository } from "@/types/leisure";

let cached: LeisurePlace[] | null = null;

export function getAllLeisurePlaces(): LeisurePlace[] {
  if (!cached) {
    cached = mockLeisurePlaces.map((place) => ({ ...place }));
  }
  return cached;
}

export function getLeisurePlaceById(id: string): LeisurePlace | null {
  return getAllLeisurePlaces().find((place) => place.id === id) ?? null;
}

export function searchLeisurePlaces(query: string): LeisurePlace[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const activityKeywords: Array<{
    key: string;
    type: LeisurePlace["activityType"];
  }> = [
    { key: "서핑", type: "surfing" },
    { key: "surf", type: "surfing" },
    { key: "요트", type: "yacht" },
    { key: "yacht", type: "yacht" },
    { key: "다이빙", type: "diving" },
    { key: "카약", type: "kayak" },
    { key: "kayak", type: "kayak" },
    { key: "자전거", type: "bike" },
    { key: "bike", type: "bike" },
  ];

  return getAllLeisurePlaces().filter((place) => {
    const haystack = [
      place.name,
      place.address,
      place.description,
      place.activityType,
      place.seasonNote ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (haystack.includes(normalized)) {
      return true;
    }

    return activityKeywords.some(
      (item) =>
        normalized.includes(item.key.toLowerCase()) &&
        place.activityType === item.type,
    );
  });
}

export const localLeisureRepository: LeisureRepository = {
  async getAll() {
    return getAllLeisurePlaces();
  },
  async getById(id) {
    return getLeisurePlaceById(id);
  },
};
