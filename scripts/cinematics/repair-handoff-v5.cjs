// Read PROJECT_MEMORY.md. Combine reviewed visual staging and existing speech; no paid generation.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5');
const bins=JSON.parse(fs.readFileSync(path.join(dir,'../prologue-v3/tool-paths.json')));
const current=path.join(dir,'sources/c01.mp4'),saved=path.join(dir,'attempts/c01-1');fs.mkdirSync(saved,{recursive:true});
const original=path.join(saved,'c01.mp4');if(!fs.existsSync(original))fs.copyFileSync(current,original);
for(const name of ['c01-job.json','c01-result.json'])if(!fs.existsSync(path.join(saved,name)))fs.copyFileSync(path.join(dir,name),path.join(saved,name));
const prior=path.join(dir,'attempts/c01-0/c01.mp4');
// Keep first-person acceptance and Wilhelm's live "We have a deal".
// After Rho reaches foreground, cut to her close view. Wilhelm is completely
// outside the crop while the un-repeated prior introduction plays offscreen.
const filter="[0:v]trim=duration=4.5,setpts=PTS-STARTPTS,scale=1920:1080,setsar=1,fps=24[a];[0:v]trim=start=4.5:end=6,setpts=2*(PTS-STARTPTS),crop=1216:684:700:0,scale=1920:1080,setsar=1,fps=24,tpad=stop_mode=clone:stop_duration=0.1,trim=duration=3[b];[a][b]concat=n=2:v=1:a=0[v];[0:a]atrim=duration=4.5,asetpts=PTS-STARTPTS,aresample=48000, aformat=channel_layouts=stereo[x];[1:a]atrim=start=1.94:end=4.34,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.025,afade=t=out:st=2.375:d=0.025,apad=pad_dur=0.6,atrim=duration=3[y];[x][y]concat=n=2:v=0:a=1[au]";
const tmp=path.join(dir,'sources/c01-repaired.tmp.mp4');
const r=cp.spawnSync(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',original,'-i',prior,'-filter_complex',filter,'-map','[v]','-map','[au]','-t','7.5','-c:v','libx264','-crf','21','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',tmp],{windowsHide:true,encoding:'utf8'});
if(r.status!==0)throw Error(r.stderr||r.error?.message||'Handoff repair failed');fs.renameSync(tmp,current);
fs.writeFileSync(path.join(dir,'c01-repair.json'),JSON.stringify({visualSource:'attempts/c01-1/c01.mp4',firstShot:[0,4.5],rhoCloseView:{in:4.5,out:6,speed:0.5,crop:[1216,684,700,0]},offscreenWilhelm:{source:'attempts/c01-0/c01.mp4',in:1.94,out:4.34,startsAt:4.5},duration:7.5,additionalKlingCredits:0},null,2));
for(const suffix of ['transcript.json','second-transcript.json']){const f=path.join(dir,'review/c01-'+suffix);if(fs.existsSync(f))fs.renameSync(f,path.join(saved,'c01-'+suffix));}
console.log('Saved local handoff repair; original takes preserved; zero additional Kling credits.');
