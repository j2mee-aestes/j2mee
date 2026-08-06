import { mockAttractions } from "@/data/attractions/mockAttractions";
import type {
  AttractionPlace,
  AttractionRepository,
} from "@/types/attraction";

let cached: AttractionPlace[] | null = null;

export function getAllAttractions(): AttractionPlace[] {
  if (!cached) {
    cached = mockAttractions.map((place) => ({ ...place }));
  }
  return cached;
}

export function getAttractionById(id: string): AttractionPlace | null {
  return getAllAttractions().find((place) => place.id === id) ?? null;
}

export function searchAttractions(query: string): AttractionPlace[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  return getAllAttractions().filter((place) => {
    const haystack = [
      place.name,
      place.address,
      place.description,
      ...(place.highlights ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export const localAttractionRepository: AttractionRepository = {
  async getAll() {
    return getAllAttractions();
  },
  async getById(id) {
    return getAttractionById(id);
  },
};
