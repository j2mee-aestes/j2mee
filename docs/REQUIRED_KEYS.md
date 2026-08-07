# 파도파도 — 제공해 주셔야 하는 API 키·자료

이 문서에 적힌 항목을 주시면 해당 기능을 실제 연동으로 전환할 수 있습니다.
지금 저장소에는 **UI·흐름·mock/스텁**이 들어가 있고, 키가 없으면 안전하게 mock으로 동작합니다.

> 실제 장소·사진·GeoJSON 데이터 전달 형식은 [`DATA_HANDOFF.md`](./DATA_HANDOFF.md) 를 참고해 주세요.

## 필수에 가까운 항목

| 항목 | 용도 | 환경 변수 / 위치 |
|---|---|---|
| **카카오맵 JavaScript 키** | 지도 표시 | `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` |
| **카카오 개발자 Web 도메인** | localhost / GitHub Pages에서 SDK 로드 | 카카오 콘솔 → 플랫폼 → Web에 `localhost`, `127.0.0.1`, `j2mee-aestes.github.io` 등록 (포트 제외) |
| **AUTH_SECRET** | Auth.js 세션 | `AUTH_SECRET` |
| **DATABASE_URL** | 제보·투표·마일리지·계정 | SQLite 로컬 또는 Postgres URL |

## 기상·파도 (기상청)

| 항목 | 용도 | 환경 변수 |
|---|---|---|
| 기상청 단기/초단기 예보 API 키 | 헤더·낚시터 실시간 날씨 (초단기실황) | `KMA_API_KEY` (또는 `WEATHER_API_KEY`) |
| 기상청 API Base URL | `VilageFcstInfoService_2.0` | `KMA_API_BASE_URL` (기본값 내장) |
| 기상청 해양기상 API 키 | 실시간 파고 | `KMA_MARINE_API_KEY` (또는 `MARINE_WEATHER_API_KEY`) |
| 해양기상 Base URL | 파도 엔드포인트 | `KMA_MARINE_API_BASE_URL` |

> 기상청은 보통 **공공데이터포털(data.go.kr)** 인증키와 격자(nx/ny) 변환이 필요합니다. 발급하신 서비스명·샘플 응답 JSON을 주시면 파서를 맞추겠습니다.

## 낚시 제한 실시간

| 항목 | 용도 |
|---|---|
| 지자체/수산 관련 공개 API 또는 데이터셋 URL | `FISHING_RESTRICTION_API_URL` 로 연결 예정 |
| 허용 필드 스펙(금지·제한·허용) | 실시간 반영 매핑 |

현재 `/api/fishing/restrictions` 는 카탈로그 상태를 타임스탬프와 함께 반환하는 스텁입니다.

## 로그인 (Firebase)

**클라이언트 Firebase Auth** 연동 코드가 준비되어 있습니다. 아래 웹 설정을 주시면(또는 `.env.local` / GitHub Secrets에 넣어 주시면) Google·이메일 로그인이 바로 켜집니다.

자세한 콘솔 설정: [`firebase-auth.md`](./firebase-auth.md)

| 항목 | 환경 변수 |
|---|---|
| Firebase Web API Key | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| Auth Domain | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| Project ID | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| App ID | `NEXT_PUBLIC_FIREBASE_APP_ID` |
| Storage Bucket (사진 제보 업로드용, 권장) | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| Messaging Sender ID | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |

Firebase 콘솔에서 **Google + Email/Password** 로그인 방법을 켜고, Authorized domains에 `localhost`, `j2mee-aestes.github.io` 를 추가해 주세요.

선택: 서버 Auth.js OAuth를 유지하려면 `GOOGLE_CLIENT_ID/SECRET`, `KAKAO_CLIENT_ID/SECRET` 도 가능합니다.

## 쓰레기통 GeoJSON

| 항목 | 설명 |
|---|---|
| 공식/현장 GeoJSON | `public/data/waste-bins.geojson` 교체 또는 추가 |
| 좌표계 | WGS84 (EPSG:4326) 권장 |
| 속성 | `id`, `name`, `type`, `address`, `status` |

현재는 기장·일광·임랑·대변 일대 **참고용 GeoJSON**이 포함되어 있습니다. 공식 자료를 주시면 교체합니다.

## 장소 사진·3D

| 항목 | 용도 |
|---|---|
| 낚시터/시장/손질점/명소 실사 이미지 (저작권 허용) | 자세히보기 갤러리 |
| glTF/GLB 3D 모델 | 관광명소 3D 팝업 (`/public/models/...`) |

지금은 placeholder 이미지·3D 프리뷰를 사용합니다.

## 수산시장·손질점 실데이터

카카오맵 기준으로 기장·해운대 등 **공개 정보 참고 mock**을 넣어 두었습니다.
정확한 반영을 위해 원하시면:

- 확정 점포 리스트(이름, 주소, 전화, 영업시간, 손질/외부수산물 접수 여부)
- 카카오맵 장소 URL
- 현장 확인일

을 주세요.

## 마일리지 ↔ 네이버 포인트

| 항목 | 설명 |
|---|---|
| 네이버 포인트/커머스 파트너 연동 스펙 | 추후 교환용 |
| 적립 정책(제보 승인 시 점수 등) | 현재 승인 시 50 마일리지 상수 |

DB에는 `mileageBalance` / `MileageLedger` 스키마가 준비되어 있습니다.

## GitHub Pages 배포 시

- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` 를 빌드 환경에 넣어야 정적 사이트에서도 지도가 뜹니다.
- 카카오 콘솔에 `j2mee-aestes.github.io` 도메인 등록이 필요합니다.
- Firebase 로그인을 쓰려면 `NEXT_PUBLIC_FIREBASE_*` 도 빌드 시 넣고, Firebase Authorized domains에 `j2mee-aestes.github.io` 를 등록하세요.
