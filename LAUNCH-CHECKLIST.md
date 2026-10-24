# Launch checklist

Date: 2026-10-16

## Automated checks

- [ ] `npm run launch:check` — typecheck, unit tests, production build, secret scan, offline dependency audit, and config/document gates pass.
- [ ] `npm run ai:test` — run from a network-enabled environment with an approved provider key; confirm success or expected classified fallback. This environment previously could not reach provider endpoints.
- [ ] `npm run check:dev` — API and Vite endpoints respond. Earlier local port checks failed because occupied ports had no discoverable listener PID; retry on a clean machine.
- [ ] Browser E2E: register, save profile, reload, confirm fields persist; create chat, reload, confirm chat history persists.
- [ ] Exercise account data export and password-confirmed deletion using a disposable account.
- [ ] Test voice stop button and Escape while recording, transcribing, speaking, and awaiting chat; navigate away and close the page while active.
- [ ] Run the Docker image and confirm non-root operation, `/api/health`, `/api/ready`, same-origin static SPA route fallback, and persistent volume behavior.
- [ ] Restore a backup into a disposable copy and verify records and readiness.

## Release blockers / operator decisions

- [ ] PostgreSQL/Neon support is not implemented: SQLite-only Prisma schema and migrations remain. `POSTGRES_ENABLED=true` deliberately fails closed. A Render + Neon production launch requires a second schema/migration strategy and integration tests.
- [ ] Add a compressed-response implementation and verify gzip/Brotli for production static assets. The current runtime serves static files and same-origin API but does not install compression middleware.
- [ ] Install and run ESLint; dependency installation was blocked by unavailable npm registry access in this environment. Add lockfile-pinned ESLint dependencies before treating lint as a release gate.
- [ ] Add and run browser Playwright tests; adding its package could not be completed while npm registry access was unavailable.
- [ ] Implement a maintained all-state/UT district master list. Profile accepts a free-form district for every state/UT; Maharashtra suggestions are present, but the full enumerated list is not yet bundled.
- [ ] Jobs are fetched into admin drafts by explicit official URL; the in-process daily review scheduler moves verified listings older than 24 hours back to drafts. It does not discover new notices and only runs while the server process is awake; review the source health and draft queue manually.
- [ ] Review privacy and terms drafts with qualified counsel before public launch.
- [ ] Verify all scholarship rules against current official portals; the tracker currently has 5/30 MahaDBT records verified; 25/30 remain unverified.
- [ ] Set up managed TLS, domain, backups, restore rehearsal, monitoring, admin account, and incident contact before inviting students.

## Data and safety

- [ ] Keep `Always verify on the official portal` visible.
- [ ] Show last verified dates; unverified entries say to check the official site.
- [ ] Ensure public listings use reviewed official sources and current application cycle dates.
- [ ] Use test profiles at and immediately above/below income limits and across supported categories; compare deterministic results with official criteria.
- [ ] Confirm account export, account deletion, retention, and backup procedures.
