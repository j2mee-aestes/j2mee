import type { TideStation } from "@/types/fishing";

/** Mock tide observation stations around Gijang (UI verification only). */
export const mockTideStations: TideStation[] = [
  {
    id: "tide-gijang",
    name: "기장 조위관측소",
    coordinates: { latitude: 35.244, longitude: 129.222 },
    sourceName: "파도파도 mock 조석",
  },
  {
    id: "tide-imrang",
    name: "임랑 인근 조위관측소",
    coordinates: { latitude: 35.315, longitude: 129.268 },
    sourceName: "파도파도 mock 조석",
  },
  {
    id: "tide-ilgwang",
    name: "일광 조위관측소",
    coordinates: { latitude: 35.26, longitude: 129.23 },
    sourceName: "파도파도 mock 조석",
  },
];
