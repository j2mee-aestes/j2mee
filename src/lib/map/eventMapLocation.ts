import type { CoastalEvent } from "@/types/event";
import type { MapLocation } from "@/types/map";

export function coastalEventToMapLocation(event: CoastalEvent): MapLocation {
  return {
    id: event.id,
    category: "event",
    name: event.name,
    address: event.address,
    coordinates: event.coordinates,
    description: event.summary,
    isVerified: event.officialConfirmed,
  };
}
