import test from 'node:test';
import assert from 'node:assert/strict';
import { retrievalTerms } from './retrieval.js';

const samples=[
  ['How can I apply for MahaDBT scholarship?','mahadbt','scholarship'],['scholar ship for SC students','scholarship'],
  ['shishyavrutti for Maharashtra','shishyavrutti','maharashtra'],['Maha DBT registration','mahadbt','registration'],
  ['freeship eligibility','freeship'],['छात्रवृत्ति आवेदन','scholarship'],['शिष्यवृत्ती कुठे अर्ज करायचा','shishyavrutti'],
  ['annual family income limit','income'],['OBC caste certificate','caste'],['SC post matric scholarship','scholarship'],
  ['VJNT scheme application','vjnt'],['MahaDBT renewal process','mahadbt'],['how to check application status','application'],
  ['income certificate documents','income'],['maharashtra scholarship portal','maharashtra'],['scholarships for college','scholarship'],
  ['where do I apply','apply'],['Hindi छात्रवृत्ति','scholarship'],['Marathi शिष्यवृत्ती','shishyavrutti'],
  ['typo scholar ship application','scholarship'],['freeship for OBC students','freeship'],['apply MahaDBT scheme','apply'],
];
test('normalizes at least 20 scholarship search queries',()=>{
  assert.ok(samples.length>=20);
  for(const [query,...expected] of samples){const terms=retrievalTerms(query);for(const term of expected)assert.ok(terms.includes(term),`${query} should include ${term}`);}
});
