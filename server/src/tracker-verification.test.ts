import {test} from 'node:test';import assert from 'node:assert/strict';import {verifyTrackerRecord} from './tracker-verification.js';
const base={value:'Yes',date:new Date('2026-09-01T00:00:00Z'),officialLink:'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=ABC123',rules:{incomeLimit:250000,categories:['OBC']},documents:['Income certificate'],notes:'Eligibility checked'};
test('verification requires exact Yes, a real date, structured rules without placeholders and a specific official page',()=>{
 assert.equal(verifyTrackerRecord(base).verified,true);
 assert.equal(verifyTrackerRecord({...base,value:'yes'}).verified,false);
 assert.equal(verifyTrackerRecord({...base,date:'2026-09-01'}).verified,false);
 assert.equal(verifyTrackerRecord({...base,rules:{incomeLimit:'Not provided in seed'}}).verified,false);
 assert.equal(verifyTrackerRecord({...base,officialLink:'https://mahadbt.maharashtra.gov.in/'}).verified,false);
 assert.equal(verifyTrackerRecord({...base,notes:'NOT confirmed by you yet.'}).verified,false);
 assert.equal(verifyTrackerRecord({...base,notes:'An older page says ₹1.5 lakh; the current limit is not yet verified.'}).verified,false);
 assert.equal(verifyTrackerRecord({...base,notes:'Current official page says ₹2.5 lakh; an older page says ₹1.5 lakh. Use current detail page linked here.'}).verified,true);
});
