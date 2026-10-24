import '../src/load-env.js';
import {PrismaClient} from '@prisma/client';
const db=new PrismaClient();
const guides=[
 {title:'UPSC Civil Services Examination',organization:'Union Public Service Commission',url:'https://upsc.gov.in/',source:'UPSC official site'},
 {title:'MPSC State Services Examination',organization:'Maharashtra Public Service Commission',url:'https://mpsc.gov.in/',source:'MPSC official site'},
 {title:'SSC Combined Graduate Level Examination',organization:'Staff Selection Commission',url:'https://ssc.gov.in/',source:'SSC official site'},
 {title:'IBPS Probationary Officer Examination',organization:'Institute of Banking Personnel Selection',url:'https://www.ibps.in/',source:'IBPS official site'},
 {title:'RRB NTPC Examination',organization:'Railway Recruitment Boards',url:'https://www.rrbcdg.gov.in/',source:'Railway Recruitment Board official site'},
];
for(const g of guides){const prior=await db.jobPost.findFirst({where:{title:g.title,evergreen:true}});if(!prior)await db.jobPost.create({data:{title:g.title,organization:g.organization,postNames:[],vacancies:null,qualification:{label:'Typical pattern — verify in the current notification'},ageLimit:{},applicationFee:{},importantDates:{},howToApply:[],documentsRequired:[],selectionProcess:[],officialNotificationUrl:g.url,applyUrl:null,sourceName:g.source,sourceUrls:[g.url],sourceQuotes:{qualification:'Typical pattern — verify in the current notification'},lastChecked:null,status:'published',verified:false,evergreen:true}})}
console.log(`Ensured ${guides.length} evergreen exam guides.`);await db.$disconnect();
