import { access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
try { await access('.env', constants.R_OK); } catch { throw new Error('Create the root .env from .env.example before running setup.'); }
await mkdir('data', { recursive: true });
