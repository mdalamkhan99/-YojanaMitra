import '../src/load-env.js';
import { runProviderChain } from '../src/ai-provider.js';

const result=await runProviderChain('Answer briefly. Do not include secrets.','How do I apply for MahaDBT scholarship?');
console.log(`provider=${result.provider??'none'} category=${result.category??'none'}`);
for(const report of result.reports)console.log(`provider=${report.provider} working=${report.working} category=${report.category??'none'}${report.status?` status=${report.status}`:''}${report.model?` model=${report.model}`:''}`);
if(!result.provider)process.exitCode=1;
