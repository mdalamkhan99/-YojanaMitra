import '../src/load-env.js';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Five MahaDBT rows were checked against their direct official detail pages on 2026-10-16; the remaining catalog records stay conservative until reviewed.
// Keep original seed titles as stable IDs so reseeding updates existing rows.
const base = [
  ['Post Matric Scholarship to SC Students', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Tuition Fees and Examination Fees to SC Students', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Post Matric Scholarship to OBC Students', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Tuition Fees and Examination Fees to OBC Students', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Post Matric Scholarship to VJNT Students', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Post Matric Scholarship to SBC Students', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['State Government Open Merit Scholarship', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Minority Scholarship for Higher and Professional Courses', 'scholarship', 'Government of Maharashtra', 'MahaDBT'],
  ['Government of India Post Matric Scholarship for SC', 'scholarship', 'Government of India', 'National Scholarship Portal'],
  ['Post Matric Scholarship for Students with Disabilities', 'scholarship', 'Government of India', 'National Scholarship Portal'],
  ['Top Class Education Scheme for SC Students', 'scholarship', 'Government of India', 'National Scholarship Portal'],
  ['National Means-cum-Merit Scholarship', 'scholarship', 'Government of India', 'National Scholarship Portal'],
  ['Central Sector Scheme of Scholarship for College and University Students', 'scholarship', 'Government of India', 'National Scholarship Portal'],
  ['AICTE Pragati Scholarship for Girls', 'scholarship', 'AICTE', 'AICTE'],
  ['AICTE Saksham Scholarship for Specially Abled Students', 'scholarship', 'AICTE', 'AICTE'],
  ['AICTE Swanath Scholarship', 'scholarship', 'AICTE', 'AICTE'],
  ['National Fellowship and Scholarship for Higher Education of ST Students', 'scholarship', 'Ministry of Tribal Affairs', 'National Scholarship Portal'],
  ['Post Matric Scholarship for OBC Students', 'scholarship', 'Government of India', 'National Scholarship Portal'],
  ['UPSC Civil Services Examination', 'govt_job', 'Union Public Service Commission', 'UPSC'],
  ['Maharashtra Public Service Commission State Services Examination', 'govt_job', 'Maharashtra Public Service Commission', 'MPSC'],
  ['Staff Selection Commission Combined Graduate Level Examination', 'govt_job', 'Staff Selection Commission', 'SSC'],
  ['IBPS Probationary Officer recruitment', 'govt_job', 'Institute of Banking Personnel Selection', 'IBPS'],
  ['Railway Recruitment Board NTPC recruitment', 'govt_job', 'Railway Recruitment Board', 'RRB'],
  ['National Eligibility Test Junior Research Fellowship', 'govt_job', 'National Testing Agency', 'NTA'],
  ['Apprenticeship India opportunities', 'internship', 'Government of India', 'Apprenticeship India'],
  ['AICTE Internship Portal opportunities', 'internship', 'AICTE', 'AICTE Internship Portal'],
  ['National Career Service job listings', 'private_job', 'Ministry of Labour and Employment', 'National Career Service'],
  ['Internshala internships and jobs', 'internship', 'Internshala', 'Internshala'],
] as const;

const links: Record<string, string> = {
  MahaDBT: 'https://mahadbt.maharashtra.gov.in/',
  'National Scholarship Portal': 'https://scholarships.gov.in/',
  AICTE: 'https://www.aicte-india.org/bureaus/rifd/Scholarship-Schemes',
  UPSC: 'https://upsc.gov.in/', MPSC: 'https://mpsc.gov.in/', SSC: 'https://ssc.gov.in/',
  IBPS: 'https://www.ibps.in/', RRB: 'https://indianrailways.gov.in/', NTA: 'https://ugcnet.nta.ac.in/',
  'Apprenticeship India': 'https://www.apprenticeshipindia.gov.in/',
  'AICTE Internship Portal': 'https://internship.aicte-india.org/',
  'National Career Service': 'https://www.ncs.gov.in/', Internshala: 'https://internshala.com/',
};

const source = (id: string) => `https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=${id}`;
const verified: Record<string, any> = {
  'Post Matric Scholarship to SC Students': {
    title: 'Government of India Post-Matric Scholarship',
    provider: 'Government of Maharashtra — Social Justice and Special Assistance Department',
    officialLink: source('E9DDFA703C38E51ACE99921E698B1EE85995B38445F14746E1B0DD7E66FFF88B'),
    rules: { incomeLimit: 250000, categories: ['SC', 'Neo-Buddhist'], state: 'Maharashtra', manualChecks: ['Pass SSC/equivalent matric; no percentage threshold is listed.', 'Only two professional courses are allowed.', 'Other course, renewal, and current-cycle conditions must be checked on MahaDBT.'] },
    documents: ['Income certificate issued by Tahsildar', 'Caste certificate', 'Marksheet for last appeared examination', 'SSC or HSC marksheet', 'Father death certificate (if required)', 'Gap and self-declaration (if required)', 'Hostel certificate (if required)', 'Husband income certificate (if married)'],
  },
  'Tuition Fees and Examination Fees to SC Students': {
    title: 'Post-Matric Tuition Fee and Examination Fee (Freeship)',
    provider: 'Government of Maharashtra — Social Justice and Special Assistance Department',
    officialLink: source('E9DDFA703C38E51AE0CB048159E784170A4F3BD768B3A64E4772B0EF7B9990B2'),
    rules: { incomeAbove: 250000, categories: ['SC', 'Neo-Buddhist'], state: 'Maharashtra', manualChecks: ['Pass SSC/equivalent matric and study at a recognized Maharashtra institute.', 'CAP admission is required for professional courses.', 'Course eligibility, one-failure limit, and current-cycle conditions must be checked on MahaDBT.'] },
    documents: ['Income certificate issued by Tahsildar', 'Caste certificate', 'Caste validity certificate', 'Marksheet for last appeared examination', 'SSC or HSC marksheet', 'Father death certificate (if required)', 'Hostel certificate (if required)', 'CAP round allotment letter'],
  },
  'Post Matric Scholarship to OBC Students': {
    title: 'Post Matric Scholarship to OBC Students',
    officialLink: source('E9DDFA703C38E51AB02E984835E89FEFDB316E301CE6A991F41C5D42B01A7D7E'),
    rules: { incomeLimit: 250000, categories: ['OBC'], state: 'Maharashtra', manualChecks: ['Government-approved post-matric course; CAP admission for professional courses.', 'Current attendance, renewal/failure, family-beneficiary, and concurrent-scholarship conditions must be checked on MahaDBT.'] },
    documents: ['Maharashtra caste certificate (also proof of residence)', 'Income certificate or income declaration', 'Caste validity certificate (mandatory for professional degree and professional postgraduate courses)', 'HSC/SSC or last examination marksheet', 'Gap certificate (if there is an education gap)', 'Father/guardian death certificate (if applicable)', 'Ration card', 'Leaving certificate', 'Parent/guardian declaration about beneficiary children'],
  },
  'Tuition Fees and Examination Fees to OBC Students': {
    title: 'Tuition Fees and Examination Fees to OBC Students',
    officialLink: source('E9DDFA703C38E51A19A7691F3B40AD4EE0F3DDA5DE324AC54819922BB3D36B63'),
    rules: { categories: ['OBC'], state: 'Maharashtra', manualChecks: ['The official detail page does not list an income limit; check the current scheme/GR before relying on this record.', 'Course and institute restrictions apply; CAP is required for professional courses.', 'Fee reimbursement differs by gender, institution, and course; Deemed University exclusions and renewal rules apply.'] },
    documents: ['Caste certificate', 'Income certificate or non-creamy-layer certificate', 'HSC/SSC or last examination marksheet', 'Gap certificate (if there is an education gap)', 'Parent/guardian declaration about beneficiary children', 'Father death certificate (if applicable)', 'CAP allotment letter (professional courses)', 'Caste validity certificate (applicable professional courses)', 'Leaving certificate', 'Ration card'],
  },
  'Post Matric Scholarship to VJNT Students': {
    title: 'Post Matric Scholarship to VJNT Students',
    officialLink: source('E9DDFA703C38E51AFD83FFC8C5199983E26D3BE9645241F26E1947ED73B2823D'),
    rules: { incomeLimit: 250000, categories: ['VJNT'], state: 'Maharashtra', manualChecks: ['The current MahaDBT detail page lists annual parent/guardian income up to ₹2,50,000.', 'Government-approved post-matric course; CAP admission for professional courses.', '75% attendance, renewal/failure, family-beneficiary, and concurrent-scholarship conditions also apply; check the current MahaDBT details.'] },
    documents: ['Maharashtra caste certificate (also proof of residence)', 'Income certificate or income declaration', 'Caste validity certificate (mandatory for professional degree and professional postgraduate courses)', 'HSC/SSC or last examination marksheet', 'Gap certificate (if there is an education gap)', 'Father/guardian death certificate (if applicable)', 'Ration card', 'Leaving certificate', 'Parent/guardian declaration about beneficiary children'],
  },
};

async function main() {
  for (const [seedTitle, type, baseProvider, sourceKey] of base) {
    const id = `seed-${seedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
    const fallback = links[sourceKey] || 'https://scholarships.gov.in/';
    const isVerified = Boolean(verified[seedTitle]);
    const officialReviewDate = new Date('2026-10-16T00:00:00.000Z');
    const details = verified[seedTitle] || {};
    const data: any = {
      title: seedTitle,
      type: type as any,
      provider: baseProvider,
      rules: {},
      benefits: 'See the official portal for current benefit details.',
      documents: ['Identity proof as required by portal', 'Income/caste/domicile documents if applicable', 'Academic records'],
      deadline: 'Check official site',
      officialLink: fallback,
      sourceUrl: fallback,
      ...details,
      verified: isVerified,
      verifiedOn: isVerified ? officialReviewDate : null,
      lastVerified: isVerified ? officialReviewDate : null,
      verifyNotice: isVerified ? 'Reviewed from the direct official MahaDBT detail page on 2026-10-16. Always verify current dates on the portal.' : 'Verify on official portal',
    };
    const { officialLink:_officialLink, sourceUrl:_sourceUrl, lastVerified:_lastVerified, verified:_verified, verifiedOn:_verifiedOn, verifyNotice:_verifyNotice, ...seedUpdate } = data;
    await db.scheme.upsert({ where: { id }, create: { id, ...data }, update: { ...seedUpdate, ...(isVerified ? { verified: true, verifiedOn: officialReviewDate, lastVerified: officialReviewDate, verifyNotice: data.verifyNotice } : {}) } });
  }
  const guidance = [
    ['MahaDBT application process', 'For Maharashtra state schemes, use the official MahaDBT portal. Sign in or register using the currently supported portal identity flow, complete the profile, choose the scheme matching your course and category, review each eligibility condition, upload only the requested documents, submit, and save the application number. Check the portal for current steps and deadlines.', 'https://mahadbt.maharashtra.gov.in/'],
    ['Scholarship application safety', 'Before applying, check the official scheme page for current eligibility, required documents, application dates, and renewal steps. Keep copies of submitted forms and acknowledgements. Do not share passwords, OTPs, Aadhaar numbers, or bank details in chat or with unofficial agents.', 'https://scholarships.gov.in/'],
    ['Document preparation', 'Commonly requested documents may include identity proof, income certificate, category certificate, domicile proof, recent marksheets, and institute details. Requirements vary by scheme and year. Use the exact checklist on the official scheme page and do not assume that a document is required unless the portal asks for it.', 'https://mahadbt.maharashtra.gov.in/'],
    ['Application status and rejection', 'Application status labels and appeal or correction steps depend on the portal and scheme. Read the status details on the official portal, contact the listed institution or department helpdesk, and follow the specific correction instructions. YojanaMitra cannot determine the reason for an individual rejection.', 'https://mahadbt.maharashtra.gov.in/'],
  ] as const;
  for (let i=0;i<guidance.length;i++) { const [topic,text,sourceUrl]=guidance[i]; const id=`seed-kb-${i+1}`; await db.knowledgeChunk.upsert({where:{id},create:{id,topic,language:'en',text,sourceUrl,sourceName:'Official portal (general guidance)',reviewStatus:'unreviewed'},update:{topic,text,sourceUrl,sourceName:'Official portal (general guidance)',reviewStatus:'unreviewed'}}); }
  console.log(`Seeded ${base.length} catalog entries. The five dated official-source reviews were applied; other existing verification flags and source links were preserved.`);
}

main().finally(() => db.$disconnect());
