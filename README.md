# 파도파도

낚시 장소, 수산시장(손질·식당 포함), 쓰레기통·수거함, 플로깅 코스를 하나의 지도에서 제공하는 해양활동 웹앱입니다.

## 현재 단계

활동 진행·완료 기록(8단계)까지 구현되어 있으며, 지도 데이터는 부산 기장·해운대 해안권 중심으로 구성되어 있습니다.

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
