# 파도파도 (PadoPado)

바다 낚시 장소, 수산시장·손질·식당, 쓰레기통·수거함, 플로깅 코스를 한 지도에서 탐색하고, 하루 일정과 활동 기록을 만드는 웹앱입니다.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Kakao Maps JS SDK
- Auth.js (next-auth v5) + Prisma 7 (SQLite local / Postgres-ready)
- ko / en / ja / zh-CN i18n via `messages/*.json`

## Features

- Map exploration with category filters
- Weather + activity safety status (tide/물때 removed)
- Day schedule builder and activity run/completion
- Anonymous localStorage + signed-in server persistence
- Admin console for catalog, import, reports, translation review

## Local setup

```bash
npm install
cp .env.example .env.local
# fill NEXT_PUBLIC_KAKAO_MAP_APP_KEY, AUTH_SECRET, DATABASE_URL, AUTH_DEV_PASSWORD
npx prisma migrate deploy
npm run dev
```

Dev login: `dev@padopado.local` / `AUTH_DEV_PASSWORD`  
Admin: put that email in `INITIAL_ADMIN_EMAILS`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + production build |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Translation key parity |
| `npm test` | Unit/auth/import tests |

## Data locations

- Fishing spots: `src/data/fishing-spots/`
- Partners: `src/data/partners/`
- Waste / plogging: `src/data/environment/`
- Admin overrides: `ManagedPlace` table (seeded from static data)

## Deploy notes

1. Use Postgres `DATABASE_URL` in production.
2. Set `ALLOW_MOCK_DATA=false` unless mock weather is intentional.
3. Register Kakao JS key domains and Auth.js `AUTH_URL`.
4. Run `npx prisma migrate deploy` before start.
5. See `docs/release-checklist.md` and `docs/operations/*`.

## Supported browsers

Latest Chrome, Edge, Safari, mobile Safari, Android Chrome.

## Docs

- `docs/auth-setup.md`
- `docs/admin-ops.md`
- `docs/translation-review-needed.md`
- `docs/operations/backup-and-restore.md`
- `docs/operations/incident-response.md`
- `docs/release-checklist.md`
