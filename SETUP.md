# YojanaMitra setup

## Local development

1. Install Node.js LTS and run `npm install` at the repository root.
2. Copy `.env.example` to `.env` at the repository root. Keep provider keys server-side in this file only; never put them in `client/.env` or commit `.env`.
3. Set a random `JWT_SECRET` (at least 32 characters), `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD`. Add `GEMINI_API_KEY` or `GROQ_API_KEY` only when enabling hosted AI. Model names are configurable with `GEMINI_MODEL` and `GROQ_MODEL`.
4. Run `npm run db:migrate -w server`, `npm run db:seed -w server`, and `npm run admin:create -w server` for a fresh install.
5. Keep this project outside OneDrive when possible because SQLite uses a local file and OneDrive synchronization can interfere with database locks. Recommended location: `C:\Users\Lenovo\YojanaMitra`. Set `DATABASE_URL` in the root `.env`; the current project-relative value is `file:../../data/app.db` (the Prisma datasource is configurable through this variable).
6. Start with `npm run dev`. The client uses `http://localhost:5173` and the API uses `http://localhost:4000`.

Use `npm run dev:lan -w client` only when you intentionally want the client reachable from your local network. `npm run dev:clean` stops listeners on ports 4000 and 5173 before a restart.

## Knowledge and verification data

- Import a tracker workbook with `npm run import:tracker -- "C:\\path\\to\\scheme-verification-tracker.xlsx"`. A scheme is verified only when its `Correct? (Yes/No)` cell is exactly `Yes`; dates and notes do not decide verification. Notes that mention uncertainty are printed as a non-blocking warning. Each matched row and reason is printed, and re-importing is safe.
- Ingest a local `.txt` or `.md` file inside `server/knowledge/sources/` with `npm run kb:ingest -- knowledge/sources/file.md`. Official public HTTPS pages may be ingested from the allow-list implemented in `server/scripts/kb-ingest.ts`. Local PDF files must currently be converted to text first.
- Knowledge chunks are stored as unreviewed until reviewed by an administrator.

## AI

The server prints whether provider keys are set or missing, without printing their values. `/api/ai/health` is available to signed-in admins in production and reports provider health and error categories. Run `npm run ai:test` to send one prompt through the Gemini, Groq, and compatible-provider chain; it prints only provider, model and category. With no working provider, chat uses matching stored guidance and labels the answer as offline.

## Jobs

- Run `npm run jobs:seed -w server` to add evergreen UPSC, MPSC, SSC CGL, IBPS PO and RRB NTPC guide entries. The entries contain official landing pages and say to verify the current notification; they do not contain guessed dates, fees or vacancies.
- Ingest an official HTTPS notification with `npm run jobs:ingest -- https://official-domain.gov.in/notification.pdf`, or a local PDF path. Local/PDF ingestion requires Python with `pypdf` installed (`pip install pypdf`, then set `PYTHON` if needed). Configure additional official hosts as comma-separated `JOB_SOURCE_ALLOWLIST` entries; robots.txt is checked for URL ingestion.
- Ingestion extracts source quotes and creates a DRAFT. An administrator must review it and confirm the official notification URL in the Jobs page before publishing. Published jobs appear in FTS search and assistant retrieval. Job bookmarks and application status are stored separately and included in My applications.
- `JOB_FEEDS`, RSS refresh, the `jobs:refresh` command, and the six-hour scheduler are not implemented yet.
