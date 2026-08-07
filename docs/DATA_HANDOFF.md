# 실제 데이터 교체 가이드 (Data handoff)

실제 자료가 준비되면 이 문서의 경로에 맞춰 주시면 **mock을 교체**하는 방식으로 반영합니다.
오늘은 UI·기능 루프를 마무리해 두었고, 데이터만 들어오면 빠르게 붙일 수 있습니다.

## 권장 전달 형식

가능한 한 **JSON / GeoJSON / CSV + 사진 폴더**로 주세요. 카카오맵 URL만 있어도 됩니다.

### 1) 쓰레기통·수거함
- 파일: `public/data/waste-bins.geojson` 교체 또는 추가
- 속성: `id`, `name`, `type`(`generalTrash|recycling|fishingLine|…`), `address`, `status`
- 좌표계: WGS84 (위도/경도)
- 현재: 큐레이션 + 부산 해안권 OSM(ODbL) 병합 — `docs/busan_coastal_osm_waste_bins.md`

### 2) 낚시터
- 파일: `src/data/fishing-spots/fishingSpots.json`
- 핵심 필드: `id`, `name`, `address`, `coordinates`, `fishingAllowedStatus`, `restrictionDescription`, `targetFish`, `imageUrls`, `sourceName`, `sourceUrl`, `lastVerifiedAt`

### 3) 수산시장·손질·식당
- 파일: `src/data/partners/partnerPlaces.json`
- 핵심 필드: `type`, `phone`, `businessHours`, `services`, `catchPolicy`, `imageUrls`, `sourceUrl`

### 4) 플로깅 코스
- 파일: `src/data/environment/mockPloggingRoutes.ts` (또는 JSON화 요청 가능)
- 핵심 필드: `coordinates[]`, `distanceKm`, `walkingMinutes`, `crosswalkCount`, `crossingNotes`, `connectedWastePointIds`

### 5) 관광명소 / 레저
- `src/data/attractions/mockAttractions.ts`
- `src/data/leisure/mockLeisurePlaces.ts`
- 사진 URL 또는 `/public/images/...` 파일, 3D는 `.glb` → `/public/models/`

### 6) 데이터 출처 링크
- `src/data/sources/dataSources.ts` 의 `url` / `label` / `description`

## 제보·투표·관리자 흐름 (이미 UI 연결됨)

1. 사용자: `/contribute` 에서 제보 + 투표  
2. 관리자: `/admin/contributions` 에서 검토 → **게시·마일리지**  
3. 마이페이지: `/my` 에서 마일리지 잔액 확인  

실제 지도 카탈로그에 “게시된 제보”를 자동 합치는 단계는, 실데이터 구조 확정 후 이어서 붙입니다.

## 주시면 바로 하는 작업

- mock 좌표/이름/영업시간/제한 문구 교체
- 사진·출처 링크 연결
- GeoJSON 교체 후 지도 마커 확인
- (선택) 기상청·Firebase 키 연동
