# Security notes

## Protections

- Passwords are Argon2id hashes; login errors are generic and login attempts are rate limited.
- Sessions use signed JWTs in httpOnly, SameSite cookies. Mutating requests require a CSRF token. Production cookies set `Secure`.
- Helmet headers, exact-origin credentialed CORS, JSON body size limit, Zod validation, server-side ownership filters and admin-role checks are used.
- Prisma handles parameterized database access. SQLite stays local; document files are never accepted.
- AI provider keys are read only by the server. Chat masks Aadhaar-like, PAN-like and Indian mobile patterns, limits input and applies request and daily user quotas.
- AI prompts treat retrieved catalog and user input as untrusted context and require uncertainty/disclaimers. The app says not to provide identity, bank or portal credentials.

## Threats and limits

Protect the host OS account and local database backup. Anyone with filesystem access can read SQLite data and a local `.env`; encrypt the disk and keep backups private. Cookie CSRF tokens are scoped to the local app origin; production must use HTTPS and an exact client origin. AI masking uses patterns and cannot detect every sensitive detail; avoid entering personal data. The catalog and AI may be wrong or stale; official sources are authoritative. The starter catalog is not verified live and is explicitly marked for portal verification. Admin scheme create/edit endpoints are included; scheme delete/import authorization should be limited to trusted admins. For internet-facing production, add email verification, account recovery, audit logging, stronger operational monitoring and a reviewed deployment configuration before opening registration broadly.

Run `npm audit` regularly and review advisories before updating dependencies. Do not commit `.env`, database files, credentials, or real student data.
