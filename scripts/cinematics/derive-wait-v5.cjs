// Read PROJECT_MEMORY.md. Reuse reviewed closed-mouth footage instead of a paid waiting job.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5');
const bins=JSON.parse(fs.readFileSync(path.join(dir,'../prologue-v3/tool-paths.json')));
const args=['-hide_banner','-loglevel','error','-y','-ss','14.5','-i',path.join(dir,'sources/g08.mp4'),'-an','-vf','trim=duration=0.5,setpts=6*(PTS-STARTPTS),scale=1920:1080,fps=24,tpad=stop_mode=clone:stop_duration=0.3','-t','3','-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',path.join(dir,'sources/wait.mp4')];
const r=cp.spawnSync(bins.ffmpeg,args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||r.error?.message||'Wait derivation failed');
const loop=cp.spawnSync(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',path.join(dir,'sources/wait.mp4'),'-filter_complex','[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]','-map','[v]','-an','-c:v','libx264','-crf','23','-movflags','+faststart',path.join(dir,'waiting-loop.mp4')],{encoding:'utf8',windowsHide:true});if(loop.status!==0)throw Error(loop.stderr||'Loop export failed');
fs.writeFileSync(path.join(dir,'wait-derived.json'),JSON.stringify({source:'sources/g08.mp4',in:14.5,out:15,speed:1/6,credits:0,reason:'Reviewed closed-mouth reward endpoint. Exporter pairs forward/reverse for identical loop endpoints.'},null,2));
console.log('Derived silent waiting motion from accepted reward tail; zero Kling credits.');
