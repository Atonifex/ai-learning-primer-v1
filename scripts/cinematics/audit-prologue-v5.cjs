// Read PROJECT_MEMORY.md. Audit saved media and deduplicated charges, never credentials.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5');
const bins=JSON.parse(fs.readFileSync(path.join(dir,'../prologue-v3/tool-paths.json')));
function walk(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(folder,e.name)):[path.join(folder,e.name)]);}
const files=walk(dir),jobs=new Map();
for(const file of files.filter(f=>f.endsWith('-job.json'))){const j=JSON.parse(fs.readFileSync(file));const t=j.task;if(t)jobs.set(t.generationId||t.generation_id,t);}
const charged=[...jobs.values()].reduce((n,t)=>n+(t.creditsConsumed||t.credits_consumed||0),0);
const media=files.filter(f=>f.endsWith('.mp4')).map(file=>{
 const p=cp.spawnSync(bins.ffprobe,['-v','error','-show_entries','format=duration,size','-show_entries','stream=codec_type,codec_name,width,height','-of','json',file],{windowsHide:true,encoding:'utf8'});
 if(p.status!==0)throw Error(p.stderr||p.error?.message||'Probe failed');
 const data=JSON.parse(p.stdout);return {file:path.relative(dir,file).replaceAll('\\','/'),bytes:fs.statSync(file).size,...data};
});
const tooLarge=media.filter(m=>m.bytes>=80000000);
function saveJSON(name,data){const target=path.join(dir,name),temp=target+'.tmp';fs.writeFileSync(temp,JSON.stringify(data,null,2));fs.renameSync(temp,target);}
saveJSON('credit-ledger.json',{startingCredits:6096,charged,jobs:[...jobs.values()]});
saveJSON('media-audit.json',{charged,uniqueJobs:jobs.size,media,tooLarge});
console.log(JSON.stringify({charged,uniqueJobs:jobs.size,mp4Count:media.length,maxBytes:Math.max(0,...media.map(m=>m.bytes)),tooLarge}));
if(tooLarge.length)process.exitCode=1;
