# Release checklist

- [ ] `.env` / secrets not in git
- [ ] `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` set
- [ ] Kakao map key + domain registered
- [ ] OAuth callback URLs (if used)
- [ ] `INITIAL_ADMIN_EMAILS` set for first admin
- [ ] `ALLOW_MOCK_DATA=false` in production unless intentional
- [ ] `npx prisma migrate deploy`
- [ ] Admin login smoke test
- [ ] Import preview + sample commit on staging
- [ ] Safety / translation review for critical strings
- [ ] Privacy page linked and reviewed by counsel if needed
- [ ] Mobile smoke: map, schedule bottom bar, activity finish
- [ ] Keyboard: language selector, schedule form, admin tables
- [ ] Security headers present (`X-Content-Type-Options`, CSP)
- [ ] Monitoring/logging sink configured (or logger stub accepted)
- [ ] Backup taken
- [ ] `npm run lint && npm test && npm run build`
- [ ] Post-deploy smoke: `/`, `/schedule`, `/login`, `/admin`
