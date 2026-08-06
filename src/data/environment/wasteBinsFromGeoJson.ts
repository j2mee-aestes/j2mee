import { wasteBinsGeoJson } from "@/data/environment/wasteBins.geojson";
import type {
  WastePoint,
  WastePointStatus,
  WastePointType,
} from "@/types/environment";

const VALID_TYPES = new Set<WastePointType>([
  "generalTrash",
  "recycling",
  "fishingLine",
  "fishingGear",
  "ploggingCollection",
  "other",
]);

const VALID_STATUS = new Set<WastePointStatus>([
  "available",
  "temporarilyUnavailable",
  "removed",
  "unknown",
]);

function acceptedTypesFor(type: WastePointType): string[] {
  switch (type) {
    case "recycling":
      return ["페트병", "캔", "종이"];
    case "fishingLine":
      return ["폐낚싯줄"];
    case "fishingGear":
      return ["폐어구"];
    case "ploggingCollection":
      return ["일반 쓰레기", "재활용", "폐낚싯줄"];
    default:
      return ["일반 쓰레기"];
  }
}

/** Waste points derived from the public waste-bins GeoJSON. */
export function getWasteBinsFromGeoJson(): WastePoint[] {
  return wasteBinsGeoJson.features
    .map((feature) => {
      const props = feature.properties;
      const type = props.type as WastePointType;
      const status = props.status as WastePointStatus;
      if (!VALID_TYPES.has(type) || !VALID_STATUS.has(status)) {
        return null;
      }
      const [longitude, latitude] = feature.geometry.coordinates;
      const point: WastePoint = {
        id: props.id,
        name: props.name,
        type,
        address: props.address,
        coordinates: { latitude, longitude },
        description: `GeoJSON 공개 참고 위치 — ${props.name}`,
        acceptedWasteTypes: acceptedTypesFor(type),
        usageNotes: ["현장 상태·수거 여부를 방문 전 확인해 주세요."],
        status,
        verificationStatus: "unverified",
        sourceName: "waste-bins.geojson",
        sourceUrl: "/data/waste-bins.geojson",
      };
      return point;
    })
    .filter((point): point is WastePoint => point !== null);
}

export const wasteBinsFromGeoJson: WastePoint[] = getWasteBinsFromGeoJson();
