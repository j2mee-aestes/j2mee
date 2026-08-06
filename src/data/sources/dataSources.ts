export type DataSourceCategory = "weather" | "map" | "admin" | "community";

export interface DataSourceEntry {
  id: string;
  label: string;
  description: string;
  url: string;
  category: DataSourceCategory;
}

/** Registry of external/public data sources referenced by PadoPado. */
export const dataSources: DataSourceEntry[] = [
  {
    id: "kma-weather",
    label: "기상청 날씨·해양 기상",
    description:
      "기온·풍속·파고 등 활동 안전 판단에 참고하는 공개 기상 정보입니다.",
    url: "https://www.kma.go.kr/",
    category: "weather",
  },
  {
    id: "khoa-tide",
    label: "국립해양조사원 조석",
    description: "조석·해수면 정보 참고용 공개 자료입니다.",
    url: "https://www.khoa.go.kr/",
    category: "weather",
  },
  {
    id: "kakao-map",
    label: "카카오맵",
    description:
      "지도 표시·장소 검색·공개 업소 위치 확인에 사용하는 지도 서비스입니다.",
    url: "https://map.kakao.com/",
    category: "map",
  },
  {
    id: "waste-bins-geojson",
    label: "해안 수거함 GeoJSON",
    description:
      "기장·일광·임랑·대변 일대 쓰레기통·재활용·폐낚싯줄 수거함 참고 위치입니다.",
    url: "/data/waste-bins.geojson",
    category: "admin",
  },
  {
    id: "busan-coastal-admin",
    label: "부산·기장 해안 공개 안내",
    description:
      "관광 명소·해안 산책로·시장 위치 등 공개 행정·관광 안내를 참고합니다.",
    url: "https://www.busan.go.kr/",
    category: "admin",
  },
  {
    id: "padopado-community",
    label: "파도파도 커뮤니티 제보",
    description:
      "이용자 제보·현장 확인으로 보완되는 미검증 위치·상태 정보입니다.",
    url: "https://github.com/",
    category: "community",
  },
];
