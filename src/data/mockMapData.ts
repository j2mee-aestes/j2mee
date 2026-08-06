import type { MapMarkerItem, PloggingPath } from "@/types/map";

export const mockMapMarkers: MapMarkerItem[] = [
  {
    id: "marker-fishing-1",
    category: "fishing",
    label: "학리 방파제",
    coordinates: { latitude: 35.3184, longitude: 129.2631 },
    position: { x: 62, y: 38 },
  },
  {
    id: "marker-fishing-2",
    category: "fishing",
    label: "송정해수욕장 방파제",
    coordinates: { latitude: 35.1786, longitude: 129.1994 },
    position: { x: 48, y: 52 },
  },
  {
    id: "marker-fishing-3",
    category: "fishing",
    label: "다대포 방파제",
    coordinates: { latitude: 35.0478, longitude: 128.9656 },
    position: { x: 28, y: 68 },
  },
  {
    id: "marker-market-1",
    category: "market",
    label: "기장시장",
    coordinates: { latitude: 35.2441, longitude: 129.222 },
    position: { x: 55, y: 44 },
  },
  {
    id: "marker-market-2",
    category: "market",
    label: "자갈치시장",
    coordinates: { latitude: 35.0966, longitude: 129.0306 },
    position: { x: 36, y: 58 },
  },
  {
    id: "marker-ugly-1",
    category: "uglySeafood",
    label: "못난이 수산물 판매처",
    coordinates: { latitude: 35.15, longitude: 129.06 },
    position: { x: 42, y: 46 },
  },
  {
    id: "marker-trash-1",
    category: "trash",
    label: "해안 쓰레기통 A",
    coordinates: { latitude: 35.2, longitude: 129.18 },
    position: { x: 70, y: 42 },
  },
  {
    id: "marker-trash-2",
    category: "trash",
    label: "해안 쓰레기통 B",
    coordinates: { latitude: 35.12, longitude: 129.1 },
    position: { x: 58, y: 62 },
  },
  {
    id: "marker-tide-1",
    category: "tide",
    label: "조석 관측소",
    coordinates: { latitude: 35.25, longitude: 129.25 },
    position: { x: 74, y: 30 },
  },
];

export const mockPloggingPaths: PloggingPath[] = [
  {
    id: "plogging-coast-1",
    name: "기장 해안 플로깅",
    points: [
      { x: 50, y: 30 },
      { x: 58, y: 36 },
      { x: 66, y: 40 },
      { x: 72, y: 48 },
      { x: 68, y: 56 },
    ],
  },
];
