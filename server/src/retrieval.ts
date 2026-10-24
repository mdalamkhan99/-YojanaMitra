import { Prisma, type PrismaClient } from '@prisma/client';

const synonyms: Record<string, string[]> = {
  scholarship: ['scholarship', 'scholar', 'ship', 'shishyavrutti', 'scholarships', 'freeship'],
  mahadbt: ['mahadbt', 'maha', 'dbt', 'maharashtra'],
  income: ['income', 'family', 'annual', 'limit'],
  apply: ['apply', 'application', 'registration', 'how'],
  caste: ['caste', 'category', 'sc', 'obc', 'vjnt'],
};
const normalize = (q: string) => q.toLocaleLowerCase('en-IN').normalize('NFKD')
  .replace(/[़्]/g, '').replace(/scholar\s+ship/g, 'scholarship').replace(/शिष्यवृत्ति|शिष्यवृत्ती/g, 'shishyavrutti')
  .replace(/छात्रवृत्ति/g, 'scholarship').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function retrievalTerms(query: string): string[] {
  const words = normalize(query).split(/\s+/).filter(w => w.length > 2);
  const expanded = new Set(words);
  if(/[\u0900-\u097f]/.test(query)) { expanded.add('scholarship'); expanded.add('shishyavrutti'); }
  for (const [key, values] of Object.entries(synonyms)) if (words.some(w => w === key || values.includes(w))) values.forEach(v => expanded.add(v));
  return [...expanded].slice(0, 16);
}

export async function retrieve(db: PrismaClient, query: string) {
  const terms = retrievalTerms(query);
  const expression = terms.map(term => `"${term.replace(/"/g, '""')}"*`).join(' OR ');
  let schemeIds:string[]=[], chunkIds:string[]=[];
  if(expression){try{
    const rows=await db.$queryRaw<Array<{schemeId:string}>>(Prisma.sql`SELECT schemeId FROM SchemeSearch WHERE SchemeSearch MATCH ${expression} ORDER BY bm25(SchemeSearch, 0, 1, 2, 1) LIMIT 8`);
    schemeIds=rows.map(r=>r.schemeId);
    const kb=await db.$queryRaw<Array<{chunkId:string}>>(Prisma.sql`SELECT chunkId FROM KnowledgeSearch WHERE KnowledgeSearch MATCH ${expression} ORDER BY bm25(KnowledgeSearch, 0, 1, 2) LIMIT 8`);
    chunkIds=kb.map(r=>r.chunkId);
  }catch{/* FTS migration may not yet be applied; use conservative Prisma fallback below. */}}
  const or = terms.flatMap(term => [{ title: { contains: term } }, { provider: { contains: term } }, { benefits: { contains: term } }]);
  const schemes = schemeIds.length ? await db.scheme.findMany({where:{id:{in:schemeIds}}}) : (or.length ? await db.scheme.findMany({ where: { OR: or }, take: 8 }) : []);
  const chunks = chunkIds.length ? await db.knowledgeChunk.findMany({where:{id:{in:chunkIds}}}) : await db.knowledgeChunk.findMany({ where: { OR: terms.map(term => ({ text: { contains: term } })) }, take: 8 });
  const score = (text: string) => terms.reduce((n, term) => n + (text.toLowerCase().includes(term) ? (term.length > 5 ? 2 : 1) : 0), 0);
  return {
    schemes: schemes.map(s => ({ ...s, relevance: score(`${s.title} ${s.provider} ${s.benefits}`) })).sort((a,b) => b.relevance - a.relevance).slice(0,5),
    chunks: chunks.map(c => ({ ...c, relevance: score(`${c.topic} ${c.text}`) })).sort((a,b) => b.relevance - a.relevance).slice(0,5),
  };
}
