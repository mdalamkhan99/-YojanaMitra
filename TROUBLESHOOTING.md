# Troubleshooting

## Ports and stale development processes

The default client port is 5173 and the API port is 4000. Vite uses strict port mode, so it stops instead of silently moving to 5174. To stop only listeners on those ports, run:

```powershell
npm run dev:clean
npm run dev
```

To inspect a listener manually on Windows PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 4000,5173 -State Listen | Select-Object LocalPort,OwningProcess
Stop-Process -Id <PID>
```

The API reports a clear `EADDRINUSE` message if port 4000 remains occupied. `npm run check:dev` checks the client, Vite proxy, and backend health responses.

## AI provider

Keep keys only in the root `.env` file. Restart the server after changing a key or model. Startup logs show `set` or `missing`, never key contents. Use the admin `/api/ai/health` endpoint or `npm run ai:test` to inspect provider categories (invalid key, model not found, quota/rate limit, permission/region, network, timeout or parse error). A provider fetch failure in a network-restricted environment is reported as `network`; try again with internet access before changing credentials. Chat falls back to matching local knowledge only after all configured providers fail.

## Tracker and knowledge

- Re-run `npm run import:tracker -- "C:\\path\\to\\scheme-verification-tracker.xlsx"` after updating the tracker. Only the exact `Yes` value marks a row verified. Conflicting notes are warnings and do not override that value.
- Put local text or Markdown sources inside `server/knowledge/sources/`, then run `npm run kb:ingest -- knowledge/sources/file.md`. PDF text extraction is not yet supported by the local ingest command; convert it to `.txt` or `.md` first.
- Public URL ingestion is allow-listed and checks `robots.txt`; it does not sign in or bypass portal access.

## Jobs

Run `npm run jobs:seed -w server` to populate evergreen exam guides. Ingest an official HTTPS notice with `npm run jobs:ingest -- <official-url-or-local-pdf>`. PDF extraction needs Python plus `pypdf`. The command respects robots.txt, limits host domains, logs provider status without keys, and saves a DRAFT. An administrator must confirm its official notification URL and approve it on the Jobs page. `JOB_FEEDS`, RSS refresh and the six-hour scheduler remain unimplemented. Evergreen guides are not current vacancy notices.

## Database client generation

After schema changes, run `npx prisma migrate dev --schema server/prisma/schema.prisma --name <migration-name>`. If Prisma reports that it cannot replace the query engine DLL on Windows, close any running Node/Vite/server process using this workspace and retry `npx prisma generate --schema server/prisma/schema.prisma`.
