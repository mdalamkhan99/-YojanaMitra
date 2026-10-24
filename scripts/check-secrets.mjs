import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,statSync} from 'node:fs';

const files=new Set(['.env.example']);
try{for(const file of execFileSync('git',['ls-files'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean))files.add(file)}catch{console.error('Unable to list tracked files.');process.exit(2)}
const ignored=new Set(['.git','node_modules','dist','coverage','outputs','data']);function visit(dir=''){for(const name of readdirSync(dir||'.')){if((!dir&&ignored.has(name))||name==='.env')continue;const file=dir?`${dir}/${name}`:name;let info;try{info=statSync(file)}catch{continue}if(info.isDirectory())visit(file);else if(/\.(?:ts|tsx|js|mjs|json|html|css|md|yml|yaml|toml|sql)$/.test(file)||file==='.env.example')files.add(file)}}visit();
const googlePrefix=['AI','za'].join('');
const groqPrefix=['g','sk_'].join('');
const openaiPrefix=['s','k-'].join('');
const patterns=[new RegExp(`${googlePrefix}[A-Za-z0-9_-]{30,}`),new RegExp(`${groqPrefix}[A-Za-z0-9_-]{20,}`),new RegExp(`${openaiPrefix}[A-Za-z0-9_-]{20,}`)];
let failed=false;
for(const file of files){if(file==='.env'||file.includes('node_modules/'))continue;let text;try{text=readFileSync(file,'utf8')}catch{continue}if(patterns.some(pattern=>pattern.test(text))){console.error(`Possible credential found in ${file}`);failed=true}}
if(failed)process.exit(1);console.log(`Secret scan passed for ${files.size} tracked/example files.`);
