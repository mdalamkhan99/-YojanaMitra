import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isJobQuestion} from './job-retrieval.js';

test('recognizes at least 15 common job questions',()=>{
 const questions=['How do I apply for UPSC?','What is the last date for MPSC recruitment?','SSC CGL vacancies','When is the admit card released?','IBPS PO application fee','RRB NTPC eligibility','Government job age limit','Which documents for this post?','How to check exam result?','Where is the official notification?','What are the selection steps?','Show closing soon jobs','Can I track my application?','Does this job have category relaxation?','What qualification is needed for recruitment?','Naukri bharti details'];
 assert.equal(questions.filter(isJobQuestion).length,questions.length);
});
