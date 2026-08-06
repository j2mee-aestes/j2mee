# Backup and restore

## SQLite (local / small deploys)

```bash
# Backup
cp prisma/dev.db "backups/padopado-$(date +%Y%m%d-%H%M%S).db"

# Restore
cp backups/<file>.db prisma/dev.db
npx prisma migrate deploy
```

## PostgreSQL (production)

```bash
pg_dump "$DATABASE_URL" > backup.sql
psql "$DATABASE_URL" < backup.sql
```

## Before large imports

1. Take a DB backup.
2. Run import preview in `/admin/import`.
3. Commit only after validation passes.
4. If a place was deactivated by mistake, set `recordStatus` back to `active` in admin UI or restore from backup.
5. Confirm changes in `/admin/system` audit log.
