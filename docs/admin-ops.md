# Admin operations (Phase 11)

## Access

- Roles: `user` | `admin` | `superAdmin` (server-checked via `requireAdmin`)
- Promote admins with `INITIAL_ADMIN_EMAILS` (comma-separated)
- Dev: login as `dev@padopado.local` when listed in `INITIAL_ADMIN_EMAILS`
- Routes under `/admin` are `noindex`

## Menus

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard counts |
| `/admin/fishing-spots` | Fishing spot exposure status |
| `/admin/partners` | Markets / restaurants / processing |
| `/admin/waste-points` | Bins / collection points |
| `/admin/plogging-routes` | Plogging courses |
| `/admin/reports` | User reports |
| `/admin/translations` | Translation review tracking |
| `/admin/import` | CSV/JSON preview → validate → commit |
| `/admin/system` | API/mock status + audit log |

## Import templates

Download via `GET /api/admin/import?entityType=fishing|partner|waste|plogging`.

Validation covers required fields, lat/lng ranges, duplicate IDs, plogging path length, and forbidden “못난이 수산물” terms. Fatal errors block commit.

## Public impact

`GET /api/catalog/inactive` feeds the map so `inactive` / `archived` / `draft` places are hidden from users.
