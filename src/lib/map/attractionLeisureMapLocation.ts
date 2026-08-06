import type { AttractionPlace } from "@/types/attraction";
import type { LeisurePlace } from "@/types/leisure";
import type { MapLocation } from "@/types/map";

export function attractionPlaceToMapLocation(
  place: AttractionPlace,
): MapLocation {
  return {
    id: place.id,
    category: "attraction",
    name: place.name,
    address: place.address,
    coordinates: place.coordinates,
    description: place.description,
    isVerified: place.verificationStatus !== "unverified",
  };
}

export function leisurePlaceToMapLocation(place: LeisurePlace): MapLocation {
  return {
    id: place.id,
    category: "leisure",
    name: place.name,
    address: place.address,
    coordinates: place.coordinates,
    description: place.description,
    isVerified: place.verificationStatus !== "unverified",
  };
}
