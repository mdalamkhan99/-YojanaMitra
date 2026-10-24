import '../src/load-env.js';
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';
import { verifyTrackerRecord } from '../src/tracker-verification.js';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const db = new PrismaClient();
const inputFile = process.argv[2];
if (!inputFile) throw new Error('Usage: npm run import:tracker -- <path-to-xlsx>');
const file=existsSync(inputFile)?resolve(inputFile):resolve(process.cwd(),'..',inputFile);
if(!existsSync(file))throw new Error(`Tracker workbook not found: ${inputFile}`);
const normalized = (value: unknown) => String(value ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const aliases: Record<string,string> = {
  'post matric scholarship to sc students':'Post Matric Scholarship to SC Students',
  'sc tuition examination fee':'Tuition Fees and Examination Fees to SC Students',
  'tuition fees and examination fees to sc students':'Tuition Fees and Examination Fees to SC Students',
  'obc post matric scholarship':'Post Matric Scholarship to OBC Students',
  'post matric scholarship to obc students':'Post Matric Scholarship to OBC Students',
  'obc tuition examination fee':'Tuition Fees and Examination Fees to OBC Students',
  'tuition fees and examination fees to obc students':'Tuition Fees and Examination Fees to OBC Students',
  'vjnt post matric scholarship':'Post Matric Scholarship to VJNT Students',
  'post matric scholarship to vjnt students':'Post Matric Scholarship to VJNT Students',
  'rajarshi chhatrapati shahu maharaj shikshan shulkh shishyavrutti yojna':'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti',
};
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(file);
const sheet = workbook.worksheets[0];
if (!sheet) throw new Error('Workbook has no worksheet.');
const headers = new Map<string,number>();
sheet.getRow(1).eachCell((cell,col)=>headers.set(normalized(cell.text),col));
const column = (...names:string[]) => names.map(n=>headers.get(normalized(n))).find(Boolean);
const nameCol=column('Scheme name'), statusCol=column('Correct? (Yes/No)','Correct?'), dateCol=column('Date verified'), linkCol=column('Official link'), notesCol=column('Notes');
if (!nameCol||!statusCol) throw new Error('Required headers missing: Scheme name and Correct? (Yes/No).');
const records=await db.scheme.findMany(); const byTitle=new Map(records.map(r=>[normalized(r.title),r]));
const officialHosts=['mahadbt.maharashtra.gov.in','scholarships.gov.in','aicte-india.org','upsc.gov.in','mpsc.gov.in','ssc.gov.in','ibps.in','ncs.gov.in','apprenticeshipindia.gov.in'];
let verified=0, unverified=0, unmatched=0;
for(let row=2;row<=sheet.rowCount;row++){
  const r=sheet.getRow(row); const rawName=r.getCell(nameCol).text.trim(); if(!rawName)continue;
  const key=normalized(rawName); const title=aliases[key]||rawName; const seedId=`seed-${normalized(title).replace(/\s+/g,'-')}`; const record=byTitle.get(normalized(title))||records.find(r=>r.id===seedId);
  if(!record){console.log(`Unmatched row ${row}: ${rawName}`);unmatched++;continue;}
  const value=statusCol?r.getCell(statusCol).text:''; const notes=notesCol?r.getCell(notesCol).text.trim():''; const link=linkCol?r.getCell(linkCol).text.trim():'';
  const dateVal=dateCol?r.getCell(dateCol).value:null; const date=dateVal instanceof Date?dateVal:null;
  const result=verifyTrackerRecord({value,date,officialLink:link,rules:record.rules,documents:record.documents,notes});
  let noteWarning='';
  if(notes&&/conflict|unconfirm|not verified|not confirmed/i.test(notes))noteWarning='; warning: notes mention a conflict or unconfirmed value';
  if(link){try{const host=new URL(link).hostname.toLowerCase();if(!officialHosts.some(h=>host===h||host.endsWith(`.${h}`)))noteWarning+='; warning: link host is outside the current official allow-list';}catch{noteWarning+='; warning: source link is not a valid URL';}}
  if(result.verified){await db.scheme.update({where:{id:record.id},data:{verified:true,verifiedOn:date,lastVerified:date,officialLink:link,sourceUrl:link,verifyNotice:notes||'Verified from the scheme verification tracker.'}});verified++;}
  else {await db.scheme.update({where:{id:record.id},data:{verified:false,verifiedOn:null,lastVerified:null,officialLink:link||record.officialLink,sourceUrl:link||record.sourceUrl,verifyNotice:notes||'Eligibility rules have not been verified for this record.'}});unverified++;}
  console.log(`Row ${row}: matched="${record.title}" value="${value}" result=${result.verified?'verified':'unverified'} reason=${result.reason}${noteWarning}`);
}
console.log(`Tracker import complete: ${verified} verified, ${unverified} left unverified, ${unmatched} unmatched.`);
await db.$disconnect();
