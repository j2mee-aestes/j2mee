# 파도파도

낚시 장소, 물때, 수산시장, 손질·식당, 못난이 수산물, 쓰레기통, 플로깅 코스를 하나의 지도에서 제공하는 해양활동 웹앱입니다.

## 현재 단계

**3단계: 카카오맵 연결** — 실제 지도 위에 mock 위치 데이터를 표시합니다. 낚시터·조석·날씨 공공 API는 아직 연결하지 않습니다.

## 환경변수

```bash
cp .env.example .env.local
```

`.env.local`에 카카오맵 JavaScript 키를 등록합니다.

```env
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

키가 없으면 지도 영역에 설정 안내가 표시됩니다.

## 실행

```bash
npm install
npm run dev
```

## 스크립트

- `npm run dev` — 개발 서버
- `npm run lint` — ESLint
- `npm run build` — 프로덕션 빌드
- `npm run start` — 프로덕션 서버
