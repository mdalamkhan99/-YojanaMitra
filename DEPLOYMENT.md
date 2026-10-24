# YojanaMitra deployment guide

This guide describes the currently supported SQLite deployment and records the hosted PostgreSQL path as blocked. Do not put the SQLite database on Render's free web service: Render documents free service filesystems as ephemeral, free services can sleep after 15 minutes, and Render says free instances are not for production. See [Render free services](https://render.com/docs/free).

## Supported: run on a Windows PC and share a temporary preview

1. Install Node.js 22 LTS and Git. Open PowerShell in the project folder.
2. Copy `.env.dev.example` to `.env`. Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and put it in `JWT_SECRET`. Keep `.env` private. Set a unique admin email and password if you are creating the admin account.
3. Run `npm ci`, then `npx prisma generate --schema server/prisma/schema.prisma`, `npm run db:migrate -w server`, and `npm run db:seed -w server`.
4. Start the app with `npm run dev`. Open `http://localhost:5173`. The API runs on port 4000.
5. For a temporary demonstration, install `cloudflared` from [Cloudflare's official downloads](https://developers.cloudflare.com/tunnel/downloads/), then run `cloudflared tunnel --url http://localhost:5173`. Use the random URL printed in that terminal. Keep the PC and both app processes awake. Quick Tunnels are for testing and development only, not production; see [Cloudflare Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/).
6. Do not expose real student information on a temporary tunnel. Stop it with Ctrl+C. For a stable domain, configure a managed Cloudflare Tunnel and access controls.

## Supported: persistent host with SQLite

Use a host with a persistent disk. Build and run the container with Docker Compose:

1. Copy `.env.prod.example` to `.env` and set `JWT_SECRET` to a fresh random 64+ character value and `CLIENT_ORIGIN` to the public HTTPS origin. Keep `.env` outside source control.
2. Ensure the data volume path in `docker-compose.yml` is on persistent storage and backed up. The compose file binds the app to localhost so a reverse proxy or managed tunnel can terminate TLS.
3. Run `docker compose up --build -d`. Check `/api/health` for process liveness and `/api/ready` for database readiness.
4. Create an admin using the setup command on the host before public launch. Keep administrator credentials private.
5. Back up with `npm run db:backup -w server`. Restore only while the service is stopped: `npm run db:restore -w server -- <backup-file> --confirm`. Verify the restored service before reopening it.

## Hosted Render + Neon (not yet deployable)

The current Prisma schema and migrations use SQLite. The server rejects `POSTGRES_ENABLED=true`; there is no PostgreSQL schema, migration set, or passing PostgreSQL integration run. Render's free filesystem cannot safely hold this SQLite database, so deploying the present app to a free Render web service would risk data loss. This is a known launch blocker for the requested Render + Neon option.

When PostgreSQL support is implemented and verified, the deployment outline is: create a Neon project and copy its pooled connection URL into Render's `DATABASE_URL`; create a Render Node web service from the repository; use Node 22, build command `npm ci && npx prisma generate --schema server/prisma/schema.prisma && npm run build`, start command `npm run db:migrate -w server && npm start`; configure `NODE_ENV=production`, a strong `JWT_SECRET`, the HTTPS `CLIENT_ORIGIN`, `TRUST_PROXY=true`, and AI provider secrets in Render's secret environment. Validate Neon plan quotas and Render limits directly before selecting a tier because free-plan limits change. Current references: [Neon plans](https://neon.com/docs/introduction/plans) and [Render free services](https://render.com/docs/free). Do not set `POSTGRES_ENABLED=true` until the schema port and migration tests are complete.

## Checks and operations

Run `npm run launch:check` before release. Read `LAUNCH-CHECKLIST.md` and review each limitation. Run the SQLite backup before every deployment. On an incident, capture the JSON request ID returned in the `X-Request-Id` header and locate its structured log row; do not attach student chat contents or secrets to support requests.

The application defaults chat retention to 90 days (`CHAT_RETENTION_DAYS`). Account export and deletion are available under My profile. Password reset without email is an operator CLI task: set `RESET_EMAIL` and `RESET_PASSWORD` in a private shell environment, run `npm run admin:reset-password -w server`, then clear both variables.
