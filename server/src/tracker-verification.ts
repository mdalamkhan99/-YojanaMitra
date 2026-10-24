export type TrackerCheck={verified:boolean;reason:string};
const placeholder=/not provided in seed|check official site|\bverify\b|\bunverified\b|\bunknown\b|\bplaceholder\b/i;
function containsPlaceholder(value:unknown):boolean{if(typeof value==='string')return placeholder.test(value);if(Array.isArray(value))return value.some(containsPlaceholder);if(value&&typeof value==='object')return Object.values(value).some(containsPlaceholder);return false;}
const roots=new Set(['mahadbt.maharashtra.gov.in','scholarships.gov.in','aicte-india.org','upsc.gov.in','mpsc.gov.in','ssc.gov.in','ibps.in','ncs.gov.in','apprenticeshipindia.gov.in','nta.ac.in','rrbcdg.gov.in']);
function specificOfficialPage(value:string){try{const url=new URL(value);const host=url.hostname.toLowerCase();if(url.protocol!=='https:'||![...roots].some(root=>host===root||host.endsWith(`.${root}`)))return false;if(url.pathname==='/'||url.pathname.length<2)return false;const generic=/^\/(schemes?|scholarships?|home|index\.html?)\/?$/i;if(generic.test(url.pathname))return false;if(host==='mahadbt.maharashtra.gov.in'&&url.pathname.toLowerCase().includes('schemedata'))return Boolean(url.searchParams.get('str'));return true}catch{return false}}
export function verifyTrackerRecord(input:{value:string;date:unknown;officialLink:string;rules:unknown;documents:unknown;notes:string}):TrackerCheck{
 if(input.value!=='Yes')return{verified:false,reason:'Correct? is not exactly Yes'};
 if(!(input.date instanceof Date)||!Number.isFinite(input.date.getTime()))return{verified:false,reason:'Date verified is missing or is not an Excel date value'};
 if(containsPlaceholder(input.rules)||containsPlaceholder(input.documents))return{verified:false,reason:'Eligibility rules or required documents contain a placeholder/check instruction'};
 const resolvedCurrentPage=/current official page\s+(?:says|lists)[\s\S]*use current detail page linked here/i.test(input.notes);
 if(/not yet verified|not confirmed|not verified|not checked|next batch|conflict|page not opened|older\s+(?:page|source|version)\s+says|older\s+.*\b(?:₹|rs\.?|inr|amount|limit)\b|differs? from|discrepanc|inconsistent/i.test(input.notes)&&!resolvedCurrentPage)return{verified:false,reason:'Notes indicate this row is unconfirmed or has conflicting information'};
 if(!specificOfficialPage(input.officialLink))return{verified:false,reason:'Official link is missing, generic, or not a specific official scheme page'};
 return{verified:true,reason:'Exact Yes, real verification date, complete structured fields, and specific official source'};
}
