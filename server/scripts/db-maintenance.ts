import '../src/load-env.js';
import {PrismaClient} from '@prisma/client';
import {copyFile, mkdir, readdir, stat, unlink} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const action=process.argv[2];
const here=dirname(fileURLToPath(import.meta.url));
const schemaDir=resolve(here,'../prisma');
const raw=process.env.DATABASE_URL||'file:../../data/app.db';
if(!raw.startsWith('file:'))throw new Error('SQLite maintenance only; DATABASE_URL must use file:.');
const dbPath=resolve(schemaDir,raw.slice(5));
const backupDir=resolve(schemaDir,process.env.BACKUP_DIR||'../../data/backups');
if(action==='backup'){
  await mkdir(backupDir,{recursive:true});
  const target=resolve(backupDir,`yojanamitra-${new Date().toISOString().replace(/[:.]/g,'-')}.db`);
  const db=new PrismaClient();
  try{await db.$executeRawUnsafe(`VACUUM INTO '${target.replaceAll("'","''")}'`)}finally{await db.$disconnect()}
  const files=(await readdir(backupDir)).filter(n=>/^yojanamitra-.*\.db$/.test(n)).map(n=>resolve(backupDir,n));
  const dated=await Promise.all(files.map(async path=>({path,mtime:(await stat(path)).mtimeMs})));dated.sort((a,b)=>b.mtime-a.mtime);
  for(const old of dated.slice(14))await unlink(old.path);
  console.log(`SQLite backup created: ${target}`);
}else if(action==='restore'){
  const source=process.argv[3];if(!source||process.argv[4]!=='--confirm')throw new Error('Usage: npm run db:restore -w server -- <backup.db> --confirm (stop the app first).');
  await stat(source);await mkdir(dirname(dbPath),{recursive:true});await copyFile(resolve(source),dbPath);console.log(`SQLite database restored to ${dbPath}. Start the app and verify /api/ready.`);
}else throw new Error('Usage: npm run db:backup -w server | npm run db:restore -w server -- <backup.db> --confirm');
