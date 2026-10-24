# YojanaMitra

YojanaMitra is a local-first opportunity companion for Indian college students. It combines a scholarship/job catalog, deterministic profile matching, an application tracker, a document checklist and an optional server-side AI helper.

## Features

- Maharashtra and national schemes plus example recruitment/internship portals (30 seed records)
- English, Hindi and Marathi UI language selection
- Student profile with eligibility matching; outcomes are Eligible, Not eligible or Maybe
- Search, category filters, bookmarks and application status tracking
- Document readiness checklist without uploading files
- Guided scheme directory, official portal links and AI chat grounded in relevant rows
- Email/password accounts, Argon2 password hashes, JWT httpOnly cookies, CSRF protection, rate limits and role-checked admin endpoints
- Admin scheme creation/verification API and JSON import command
- SQLite via Prisma; no hosted database required

## Architecture

```text
React + Vite + TypeScript (client :5173)
             │ same-origin /api proxy
             ▼
Express + TypeScript (server :4000)
    ├── Auth, profiles, matching, tracker, admin, optional AI providers
    └── Prisma ORM
             ▼
       SQLite ./data/app.db
```

## Quick start

Read [SETUP.md](SETUP.md) for Windows, macOS and Linux setup. Short version: install Node.js 20+, copy `.env.example` to `.env`, set a random `JWT_SECRET` and strong admin password, run `npm run setup`, then `npm run dev` and open http://localhost:5173.

See [DATA-VERIFICATION.md](DATA-VERIFICATION.md) before relying on catalog information. Seed records intentionally say “Check official site” for changing deadlines and benefits. [SECURITY.md](SECURITY.md) documents protections and known boundaries. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) covers common setup problems.

## Useful commands

`npm run setup` installs dependencies, deploys migrations, seeds the catalog and creates/updates the admin account. `npm run dev` runs both apps. `npm run typecheck`, `npm test`, and `npm run build` validate the code. Run `npm audit` to inspect dependency advisories.

## Optional deployment

The app is designed for local use. A server deployment requires a persistent disk mounted for the SQLite file and a matching `DATABASE_URL`; ephemeral filesystems lose data. Render/Railway free availability and limits change, so check the provider before use. The static client can be deployed to Vercel/Netlify with its API base/proxy configured for the server origin. Set `NODE_ENV=production`, HTTPS, secure cookies, a strong secret and exact CORS origin. Never expose AI keys as client environment variables.
