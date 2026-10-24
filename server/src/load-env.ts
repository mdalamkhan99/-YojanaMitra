import dotenv from 'dotenv';
import { z } from 'zod';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const localEnv=resolve(here,'../../.env');const parentEnv=resolve(here,'../../../.env');dotenv.config({path:existsSync(localEnv)?localEnv:parentEnv});

const envSchema=z.object({
  NODE_ENV:z.enum(['development','test','production']).default('development'),
  PORT:z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL:z.string().min(1).default('file:../../data/app.db'),
  JWT_SECRET:z.string().min(32,'JWT_SECRET must contain at least 32 characters.'),
  CLIENT_ORIGIN:z.string().url().default('http://localhost:5173'),
  TRUST_PROXY:z.enum(['true','false']).default('false'),
  CHAT_RETENTION_DAYS:z.coerce.number().int().min(1).max(3650).default(90),
  BACKUP_DIR:z.string().optional(),
});
const parsed=envSchema.safeParse(process.env);
if(!parsed.success)throw new Error(`Invalid environment configuration: ${parsed.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; ')}`);
if(parsed.data.NODE_ENV==='production'&&(!process.env.CLIENT_ORIGIN||parsed.data.JWT_SECRET.length<48))
  throw new Error('Production requires CLIENT_ORIGIN and a 48+ character JWT_SECRET.');
if(process.env.POSTGRES_ENABLED==='true')throw new Error('POSTGRES_ENABLED is not supported yet: the Prisma schema and migrations are SQLite-only.');
for(const [key,value] of Object.entries(parsed.data))if(value!==undefined)process.env[key]=String(value);
