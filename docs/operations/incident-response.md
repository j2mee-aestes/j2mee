# Incident response

| Situation | User impact | Immediate action | Fallback |
|-----------|-------------|------------------|----------|
| Kakao Map outage | Map blank | Show MapFallback; keep list/detail panels | Browse places via side panel |
| Weather API failure | Weather card error | Retry + mock when `ALLOW_MOCK_DATA=true` | Stale/mock card with notice |
| DB down | Login/server save fail | Keep localStorage path for anonymous | Hybrid repos fall back to local |
| Auth outage | Cannot login/my page | Continue anonymous map/schedule | Disable server save notices |
| Bad safety info | Risk of wrong guidance | Admin sets place `inactive` | Map hides via `/api/catalog/inactive` |
| Wrong bin location | Misleading disposal | Report → admin deactivate | User report form `/api/reports` |
| Admin account compromise | Data tampering | Rotate `AUTH_SECRET`, revoke sessions, review audit log | Temporarily remove email from `INITIAL_ADMIN_EMAILS` |

Always verify recovery with: smoke open `/`, `/schedule`, `/login`, `/admin`, and `npm run build`.
