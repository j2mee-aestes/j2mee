# Auth & persistent storage setup (Phase 10+)

## Stack

- **Firebase Authentication (client)** — Google + email/password; works on GitHub Pages
- **Auth.js (next-auth v5)** — credentials (dev) + optional Google/Kakao OAuth for Node/server deploys
- **Prisma 7 + SQLite** locally (`file:./prisma/dev.db`) via `@prisma/adapter-better-sqlite3`
- Production server: set `DATABASE_URL` to Postgres (schema is portable; swap adapter as needed)

See also: [`firebase-auth.md`](./firebase-auth.md) for console + env steps.

## Why this combo

- Firebase client auth unlocks real login on **static GitHub Pages** (no `/api/auth`).
- Auth.js + Prisma keep server-owned favorites/schedules/activities when a Node backend is available.
- Anonymous localStorage flows stay intact for guests.

## Environment

Copy `.env.example` → `.env.local` and set:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Web config (enables `/login` Google + email) |
| `DATABASE_URL` | SQLite or Postgres connection string |
| `AUTH_SECRET` | Auth.js secret (`openssl rand -base64 32`) |
| `AUTH_URL` | App origin (e.g. `http://localhost:3000`) |
| `AUTH_DEV_EMAIL` / `AUTH_DEV_PASSWORD` | Local credentials user |
| `GOOGLE_*` / `KAKAO_*` | Optional Auth.js OAuth |

## Commands

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

- Firebase: open `/login` after setting `NEXT_PUBLIC_FIREBASE_*`
- Auth.js dev: `dev@padopado.local` / value of `AUTH_DEV_PASSWORD`

## Ownership

All `/api/favorites`, `/api/schedules`, `/api/activities`, `/api/me`, `/api/export`, `/api/import/local` routes call `requireUserId()` from the Auth.js session. Client-supplied `userId` is never trusted. Firebase-only sessions use local browser data until token bridge is added.
