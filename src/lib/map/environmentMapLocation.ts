import type { MapLocation } from "@/types/map";
import type { PloggingRoute, WastePoint } from "@/types/environment";

export function wastePointToMapLocation(point: WastePoint): MapLocation {
  return {
    id: point.id,
    category: "trash",
    name: point.name,
    address: point.address ?? "",
    coordinates: point.coordinates,
    description: point.description,
    isVerified: point.verificationStatus !== "unverified",
    wastePointType: point.type,
    wasteStatus: point.status,
  };
}

export function ploggingRouteToMapLocations(
  route: PloggingRoute,
): MapLocation[] {
  return [
    {
      id: route.id,
      category: "plogging",
      name: route.name,
      address: "플로깅 코스 시작점",
      coordinates: route.startPoint,
      description: route.description,
      isVerified: route.verificationStatus !== "unverified",
    },
    {
      id: `${route.id}-end`,
      category: "plogging",
      name: `${route.name} 종료점`,
      address: "플로깅 코스 종료점",
      coordinates: route.endPoint,
      description: route.description,
      isVerified: route.verificationStatus !== "unverified",
    },
  ];
}
