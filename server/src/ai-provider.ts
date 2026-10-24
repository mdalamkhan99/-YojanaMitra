export type ProviderName = 'Gemini' | 'Groq' | 'OpenAI-compatible' | 'Ollama';
export type ErrorCategory = 'invalid key' | 'model not found' | 'quota/rate limit' | 'permission/region' | 'network' | 'timeout' | 'parse error' | 'no key' | 'provider error';
export type ProviderReport = { provider: ProviderName; working: boolean; category: ErrorCategory | null; status?: number; code?: string; message?: string; model?: string };
export type AIResult = { answer: string; provider: ProviderName | null; category: ErrorCategory | null; reports: ProviderReport[] };

const redact = (value:string, secrets:string[]) => secrets.filter(Boolean).reduce((text,secret)=>text.replaceAll(secret,'[REDACTED KEY]'),value);
function classify(status:number|undefined, code:string, message:string):ErrorCategory {
  const c=`${code} ${message}`.toLowerCase();
  if(status===408)return 'timeout';
  if(status===401||c.includes('api_key_invalid')||c.includes('invalid api key')||c.includes('authentication'))return 'invalid key';
  if(status===404||c.includes('model_not_found')||c.includes('not found'))return 'model not found';
  if(status===429||c.includes('resource_exhausted')||c.includes('quota')||c.includes('rate limit'))return 'quota/rate limit';
  if(status===403||c.includes('permission_denied')||c.includes('region')||c.includes('location'))return 'permission/region';
  return 'provider error';
}
export function classifyNetworkError(error:unknown):ErrorCategory {
  const e=error as {name?:string;code?:string;message?:string};
  if(e?.name==='TimeoutError'||e?.name==='AbortError'||e?.code==='ETIMEDOUT')return 'timeout';
  return 'network';
}

function configuredProviders() {
  const list:{provider:ProviderName;kind:'gemini'|'openai';url:string;key:string;model:string}[]=[];
  if(process.env.GEMINI_API_KEY){const first=process.env.GEMINI_MODEL||'gemini-3.8-flash';const models=[...new Set([first,'gemini-3.8-flash','gemini-3.6-flash','gemini-3.5-flash-lite'])];for(const model of models)list.push({provider:'Gemini',kind:'gemini',url:`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,key:process.env.GEMINI_API_KEY,model});}
  if(process.env.GROQ_API_KEY)list.push({provider:'Groq',kind:'openai',url:'https://api.groq.com/openai/v1/chat/completions',key:process.env.GROQ_API_KEY,model:process.env.GROQ_MODEL||'openai/gpt-oss-120b'});
  if(process.env.OPENAI_COMPAT_BASE_URL&&process.env.OPENAI_COMPAT_API_KEY&&process.env.OPENAI_COMPAT_MODEL)list.push({provider:'OpenAI-compatible',kind:'openai',url:process.env.OPENAI_COMPAT_BASE_URL,key:process.env.OPENAI_COMPAT_API_KEY,model:process.env.OPENAI_COMPAT_MODEL});
  if(process.env.OLLAMA_ENABLED==='true')list.push({provider:'Ollama',kind:'openai',url:`${(process.env.OLLAMA_BASE_URL||'http://127.0.0.1:11434').replace(/\/$/,'')}/v1/chat/completions`,key:'',model:process.env.OLLAMA_MODEL||'llama3.2'});
  const order=(process.env.AI_PROVIDER_ORDER||'Gemini,Groq,OpenAI-compatible,Ollama').split(',').map(x=>x.trim().toLowerCase());
  return list.sort((a,b)=>{const ai=order.indexOf(a.provider.toLowerCase()),bi=order.indexOf(b.provider.toLowerCase());return (ai<0?999:ai)-(bi<0?999:bi)});
}
async function attempt(config:ReturnType<typeof configuredProviders>[number],system:string,prompt:string,fetcher:typeof fetch):Promise<{text:string;report:ProviderReport}> {
  const body=config.kind==='gemini'?{system_instruction:{parts:[{text:system}]},contents:[{parts:[{text:prompt}]}]}:{model:config.model,messages:[{role:'system',content:system},{role:'user',content:prompt}],max_tokens:600};
  const headers:Record<string,string>={'content-type':'application/json'};if(config.provider!=='Gemini'&&config.provider!=='Ollama')headers.authorization=`Bearer ${config.key}`;
  for(let tryNo=0;tryNo<2;tryNo++){
    let response:Response;
    try{response=await fetcher(config.url,{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});}catch(error){const category=classifyNetworkError(error);const message=redact(error instanceof Error?error.message:'Network request failed.',[config.key]).slice(0,500);console.error(`[ai] provider=${config.provider} model=${config.model} category=${category} message=${message}${tryNo===0?'; retrying once':''}`);if(tryNo===0)continue;return{text:'',report:{provider:config.provider,working:false,category,model:config.model,message}};}
    if(!response.ok){let bodyText='';try{bodyText=await response.text()}catch{}let payload:any;try{payload=JSON.parse(bodyText)}catch{}const code=String(payload?.error?.status||payload?.error?.code||payload?.code||'');const message=String(payload?.error?.message||payload?.message||bodyText||response.statusText||'Provider rejected request.');const category=classify(response.status,code,message);const report={provider:config.provider,working:false,category,status:response.status,code:redact(code,[config.key]),message:redact(message,[config.key]).slice(0,500),model:config.model} satisfies ProviderReport;
      console.error(`[ai] provider=${config.provider} model=${config.model} status=${response.status} code=${report.code||'unknown'} category=${category} message=${report.message||'unknown'}`);
      if(response.status>=500&&tryNo===0)continue;
      return{text:'',report};
    }
    let data:any;try{data=await response.json()}catch(error){const message=error instanceof Error?error.message:'Invalid provider response.';console.error(`[ai] provider=${config.provider} model=${config.model} status=${response.status} category=parse error message=${message}`);return{text:'',report:{provider:config.provider,working:false,category:'parse error',status:response.status,model:config.model,message}};}
    const text=config.kind==='gemini'?data?.candidates?.[0]?.content?.parts?.map((part:any)=>part.text||'').join(''):data?.choices?.[0]?.message?.content;
    if(typeof text!=='string'||!text.trim()){const code=String(data?.promptFeedback?.blockReason||data?.error?.code||'empty_response');const message=String(data?.error?.message||data?.promptFeedback?.blockReason||'Provider returned no text.');const category=classify(response.status,code,message);const finalCategory=category==='provider error'?'parse error':category;console.error(`[ai] provider=${config.provider} model=${config.model} status=${response.status} code=${code} category=${finalCategory} message=${redact(message,[config.key]).slice(0,500)}`);return{text:'',report:{provider:config.provider,working:false,category:finalCategory,status:response.status,code:redact(code,[config.key]),message:redact(message,[config.key]).slice(0,500),model:config.model}};}
    return{text,report:{provider:config.provider,working:true,category:null,model:config.model}};
  }
  return{text:'',report:{provider:config.provider,working:false,category:'provider error',model:config.model,message:'Retries exhausted.'}};
}
export async function runProviderChain(system:string,prompt:string,fetcher:typeof fetch=fetch):Promise<AIResult>{
  const providers=configuredProviders();if(!providers.length)return{answer:'',provider:null,category:'no key',reports:[]};const reports:ProviderReport[]=[];
  for(let i=0;i<providers.length;i++){
    const config=providers[i];if(config.provider==='Gemini'&&i>0&&providers[i-1]?.provider==='Gemini'&&reports.at(-1)?.category!=='model not found')continue;
    const result=await attempt(config,system,prompt,fetcher);reports.push(result.report);if(result.text)return{answer:result.text,provider:config.provider,category:null,reports};
    if(config.provider==='Gemini'&&result.report.category!=='model not found')while(providers[i+1]?.provider==='Gemini')i++;
  }
  return{answer:'',provider:null,category:reports.at(-1)?.category||'provider error',reports};
}
export async function probeProviders(fetcher:typeof fetch=fetch){const configs=configuredProviders();if(!configs.length)return{working:false,category:'no key' as ErrorCategory,providers:[] as ProviderReport[]};const byProvider=new Map<ProviderName,ProviderReport>();for(const config of configs){const previous=byProvider.get(config.provider);if(previous&&(previous.working||previous.category!=='model not found'))continue;const result=await attempt(config,'Reply with OK.','OK',fetcher);byProvider.set(config.provider,result.report)}const providers=[...byProvider.values()];return{working:providers.some(p=>p.working),category:providers.find(p=>p.working)?.category??providers.find(p=>!p.working)?.category??null,providers};}
