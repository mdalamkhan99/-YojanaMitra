import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trackerMarksVerified } from './tracker-rules.js';

test('tracker verification accepts exactly Yes and ignores no other evidence',()=>{
  assert.equal(trackerMarksVerified('Yes'),true);
  for(const value of ['yes','YES','No','Maybe','',' Yes','Yes ']) assert.equal(trackerMarksVerified(value),false,`unexpectedly accepted ${JSON.stringify(value)}`);
});
