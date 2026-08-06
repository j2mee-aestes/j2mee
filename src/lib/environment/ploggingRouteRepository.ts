import { mockPloggingRoutes } from "@/data/environment/mockPloggingRoutes";
import { getAllWastePoints } from "@/lib/environment/wastePointRepository";
import {
  normalizePloggingRoute,
  validatePloggingRoute,
} from "@/lib/environment/validatePloggingRoute";
import type {
  PloggingRoute,
  PloggingRouteRepository,
} from "@/types/environment";

let cached: PloggingRoute[] | null = null;

export function getAllPloggingRoutes(): PloggingRoute[] {
  if (!cached) {
    const knownWasteIds = new Set(getAllWastePoints().map((point) => point.id));
    cached = mockPloggingRoutes
      .map((route) => {
        const result = validatePloggingRoute(route, {
          knownWastePointIds: knownWasteIds,
        });
        if (!result.ok) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[plogging] skipped invalid route ${route.id}:`,
              result.warnings,
            );
          }
          return null;
        }
        if (
          result.warnings.length > 0 &&
          process.env.NODE_ENV !== "production"
        ) {
          console.warn(`[plogging] route ${route.id}:`, result.warnings);
        }
        return normalizePloggingRoute({
          ...route,
          connectedWastePointIds: route.connectedWastePointIds.filter((id) =>
            knownWasteIds.has(id),
          ),
        });
      })
      .filter((route): route is PloggingRoute => route !== null);
  }
  return cached;
}

export function getPloggingRouteById(id: string): PloggingRoute | null {
  return getAllPloggingRoutes().find((route) => route.id === id) ?? null;
}

export function searchPloggingRoutes(query: string): PloggingRoute[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return getAllPloggingRoutes().filter((route) => {
    const haystack = [
      route.name,
      route.description ?? "",
      ...(route.facilities ?? []),
      ...(route.cautionNotes ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return (
      haystack.includes(normalized) ||
      normalized.includes("플로깅") ||
      normalized.includes("코스")
    );
  });
}

export const localPloggingRouteRepository: PloggingRouteRepository = {
  async getAll() {
    return getAllPloggingRoutes();
  },
  async getById(id) {
    return getPloggingRouteById(id);
  },
};
