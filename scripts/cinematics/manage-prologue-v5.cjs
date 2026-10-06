// Read PROJECT_MEMORY.md before work. No credentials or upload tickets in outputs.
const fs=require('node:fs'); const path=require('node:path'); const cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'); const dir=path.join(root,'public/cinematics/prologue-v5');
const tools=JSON.parse(fs.readFileSync(path.join(root,'public/cinematics/prologue-v3/tool-paths.json')));
function run(exe,args){const r=cp.spawnSync(exe,args,{windowsHide:true,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.error?.message||'Media command failed');return r.stdout;}
(async()=>{
 const [action,id,url]=process.argv.slice(2);
 const source=path.join(dir,...(action.endsWith('-loop')?[]:['sources']),id+'.mp4');
 if(action==='seam'||action==='seam-loop'){
  const next=action==='seam-loop'?source:path.join(dir,'sources',url+'.mp4');
  const info=JSON.parse(run(tools.ffprobe,['-v','error','-show_entries','format=duration','-of','json',source]));
  const seconds=Number(info.format.duration);
  run(tools.ffmpeg,['-hide_banner','-loglevel','error','-y','-ss',String(Math.max(0,seconds-0.6)),'-i',source,'-i',next,'-filter_complex','[0:v]trim=duration=0.6,setpts=PTS-STARTPTS,scale=400:-1[a];[1:v]trim=duration=0.6,setpts=PTS-STARTPTS,scale=400:-1[b];[a][b]concat=n=2:v=1:a=0,fps=12,tile=4x4[v]','-map','[v]','-frames:v','1',path.join(dir,'review',id+'-'+url+'-seam.jpg')]);
  console.log('Saved12fps transition review '+id+' -> '+url);return;
 }
 if(action==='download'){
  if(!fs.existsSync(source)){const r=await fetch(url);if(!r.ok)throw Error('Download HTTP '+r.status);fs.writeFileSync(source,Buffer.from(await r.arrayBuffer()));}
 }
 if(action==='download'||action==='review'||action==='review-loop'){
  const info=JSON.parse(run(tools.ffprobe,['-v','error','-show_entries','format=duration,size','-show_entries','stream=codec_type,codec_name,width,height','-of','json',source]));
  run(tools.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',source,'-vf','fps=2,scale=320:-1,tile=5x6','-frames:v','1',path.join(dir,'review',id+'-timeline.jpg')]);
  run(tools.ffmpeg,['-hide_banner','-loglevel','error','-y','-sseof','-0.08','-i',source,'-frames:v','1',path.join(dir,'references',id+'-tail.png')]);
  if(info.streams.some(s=>s.codec_type==='audio'))run(tools.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',source,'-vn','-ar','24000','-ac','1',path.join(dir,'audio',id+'.wav')]);
  fs.writeFileSync(path.join(dir,'review',id+'-probe.json'),JSON.stringify(info,null,2));
  console.log(JSON.stringify({id,duration:info.format.duration,bytes:info.format.size,review:'review/'+id+'-timeline.jpg'}));
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
