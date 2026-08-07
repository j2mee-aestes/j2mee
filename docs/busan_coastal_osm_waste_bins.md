# 부산 해안권 OSM 쓰레기통·재활용 데이터

> 반영일: 2026-08-07  
> 출처: OpenStreetMap Overpass export (ODbL)  
> 앱 경로: `public/data/waste-bins.geojson` → 지도 카테고리 `trash`

## 범위

해운대·송정·광안리·수영만·송도·다대포·이기대·오륙도·일광·대변·용궁사·영도/남항 등 **해안 핫스팟 반경** 안의
`amenity=recycling` / `waste_basket` / `waste_disposal` 포인트를 앱 스키마로 변환했다.

## 매핑

| OSM | 앱 `type` |
|---|---|
| recycling / recycling_type | `recycling` |
| waste_basket / waste_disposal / bin=yes | `generalTrash` |

상태값은 현장 미검증이므로 `available` + `verificationStatus: unverified`로 둔다.

## 사용

- 지도: `/map?category=trash`
- 기존 큐레이션 포인트(일광 등)는 유지하고 OSM 포인트를 병합한다.
