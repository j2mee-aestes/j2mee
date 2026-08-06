# Auth & persistent storage setup (Phase 10)

## Stack

- **Auth.js (next-auth v5)** — credentials (dev) + optional Google/Kakao OAuth
- **Prisma 7 + SQLite** locally (`file:./prisma/dev.db`) via `@prisma/adapter-better-sqlite3`
- Production: set `DATABASE_URL` to Postgres (schema is portable; swap adapter as needed)

## Why this combo

Works without paid cloud services in the agent/dev environment, keeps anonymous localStorage flows intact, and matches the Auth.js + Prisma Adapter pattern for OAuth when keys are supplied.

## Environment

Copy `.env.example` → `.env.local` and set:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite or Postgres connection string |
| `AUTH_SECRET` | Auth.js secret (`openssl rand -base64 32`) |
| `AUTH_URL` | App origin (e.g. `http://localhost:3000`) |
| `AUTH_DEV_EMAIL` / `AUTH_DEV_PASSWORD` | Local credentials user |
| `GOOGLE_*` / `KAKAO_*` | Optional OAuth |

## Commands

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Dev login: `dev@padopado.local` / value of `AUTH_DEV_PASSWORD`.

## Ownership

All `/api/favorites`, `/api/schedules`, `/api/activities`, `/api/me`, `/api/export`, `/api/import/local` routes call `requireUserId()` from the session. Client-supplied `userId` is never trusted.
