import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
const checks=[];
function check(name,fn){try{const detail=fn();checks.push({name,ok:true,detail:detail||'ok'})}catch(e){checks.push({name,ok:false,detail:e instanceof Error?e.message:String(e)})}}
function command(name,args){check(name,()=>{execFileSync(process.execPath,[process.env.npm_execpath||'npm',...args],{stdio:'inherit'});return `npm ${args.join(' ')}`})}
check('environment templates',()=>{for(const f of ['.env.example','.env.dev.example','.env.prod.example'])if(!existsSync(f))throw new Error(`${f} missing`);return 'development and production templates present'});
check('production security defaults',()=>{const env=readFileSync('.env.prod.example','utf8');if(!env.includes('NODE_ENV=production')||!env.includes('TRUST_PROXY=true')||!env.includes('POSTGRES_ENABLED=false'))throw new Error('production template missing required flags');return 'production template uses secure mode and documents SQLite flag'});
check('PostgreSQL readiness gate',()=>{const schema=readFileSync('server/prisma/schema.prisma','utf8');if(!schema.includes('provider = "sqlite"'))throw new Error('expected SQLite provider');if(!readFileSync('server/src/load-env.ts','utf8').includes('POSTGRES_ENABLED is not supported yet'))throw new Error('PostgreSQL limitation is not enforced');return 'SQLite only; PostgreSQL flag fails closed'});
check('deployment and recovery docs',()=>{for(const f of ['DEPLOYMENT.md','LAUNCH-CHECKLIST.md','docker-compose.yml','Dockerfile','.github/workflows/ci.yml'])if(!existsSync(f))throw new Error(`${f} missing`);return 'deployment, checklist, Docker, CI present'});
check('remaining release gates',()=>{const missing=[];if(!existsSync('eslint.config.js'))missing.push('ESLint config');if(!existsSync('e2e'))missing.push('Playwright persistence tests');if(!existsSync('data/districts-india.json'))missing.push('complete India district master data');if(!existsSync('node_modules/compression'))missing.push('production response compression');if(missing.length)throw new Error(`Not launch-ready: ${missing.join(', ')}. See LAUNCH-CHECKLIST.md.`);return 'all tracked release gates present'});
command('typecheck',['run','typecheck']);
command('unit tests',['test']);
command('production build',['run','build']);
command('secret scan',['run','check:secrets']);
console.log('\nLAUNCH CHECK RESULTS');for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'} ${c.name}: ${c.detail}`);if(checks.some(c=>!c.ok))process.exitCode=1;
