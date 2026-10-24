import '../src/load-env.js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const db=new PrismaClient();
const input=process.argv[2];
if(!input)throw new Error('Usage: npm run kb:ingest -- <path-or-official-url>');
const allowed=['mahadbt.maharashtra.gov.in','scholarships.gov.in','aicte-india.org','upsc.gov.in','mpsc.gov.in','ssc.gov.in','ibps.in','ncs.gov.in','apprenticeshipindia.gov.in'];
let text='',sourceUrl='',sourceName='';
if(/^https:\/\//i.test(input)){
  const url=new URL(input);if(!allowed.some(h=>url.hostname===h||url.hostname.endsWith(`.${h}`)))throw new Error('URL domain is not on the official source allow-list.');
  const robotsUrl=`${url.origin}/robots.txt`;const robots=await fetch(robotsUrl,{headers:{'user-agent':'YojanaMitra-KB/1.0'}});
  if(robots.ok){const rules=await robots.text();const pathName=url.pathname;const blocked=rules.split(/\r?\n/).some(line=>/^\s*disallow:\s*(\/[^\s]*)/i.test(line)&&pathName.startsWith(line.split(':')[1].trim()));if(blocked)throw new Error('robots.txt disallows this page.');}
  await new Promise(resolve=>setTimeout(resolve,1500));const response=await fetch(url,{headers:{'user-agent':'YojanaMitra-KB/1.0'}});if(!response.ok)throw new Error(`Fetch failed with HTTP ${response.status}.`);text=(await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&');sourceUrl=url.toString();sourceName=url.hostname;
}else{
  const root=path.resolve('knowledge/sources');const resolved=path.resolve(input);if(!resolved.startsWith(root+path.sep))throw new Error('Local sources must be inside server/knowledge/sources/.');if(!/\.(txt|md)$/i.test(resolved))throw new Error('Local ingestion supports .txt and .md files. Convert PDFs to text first.');text=await readFile(resolved,'utf8');sourceUrl=`local:${path.basename(resolved)}`;sourceName=path.basename(resolved);
}
const chunks=text.replace(/\s+/g,' ').trim().match(/.{1,1200}(?:\s|$)/g)||[];
for(const chunk of chunks){if(chunk.trim().length<60)continue;await db.knowledgeChunk.create({data:{topic:sourceName,language:'en',text:chunk.trim(),sourceUrl,sourceName,reviewStatus:'unreviewed'}});}
console.log(`Stored ${chunks.length} unreviewed guidance chunks from ${sourceName}.`);await db.$disconnect();
