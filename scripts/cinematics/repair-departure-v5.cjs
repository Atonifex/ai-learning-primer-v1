// Read PROJECT_MEMORY.md. Keep silent departure free of unintended dialogue.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5');const bins=JSON.parse(fs.readFileSync(path.join(dir,'../prologue-v3/tool-paths.json')));
const source=path.join(dir,'sources/c03.mp4'),archive=path.join(dir,'attempts/c03-native');fs.mkdirSync(archive,{recursive:true});const original=path.join(archive,'c03.mp4');if(!fs.existsSync(original))fs.copyFileSync(source,original);
const rate=48000,seconds=4.05,frames=Math.ceil(rate*seconds),data=Buffer.alloc(frames*2);let seed=7351,prev=0;
const steps=[1.7,2.35,3,3.65];
for(let i=0;i<frames;i++){const t=i/rate;seed=(1664525*seed+1013904223)>>>0;const noise=seed/4294967296*2-1;prev=prev*0.92+noise*0.08;let value=0;
 for(const at of steps){const q=t-at;if(q>=0&&q<0.22)value+=0.075*Math.exp(-q*32)*(Math.sin(2*Math.PI*95*q)+prev*0.85)+0.012*Math.exp(-q*22)*noise;}
 data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),i*2);}
const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(data.length+36,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(data.length,40);
const cue=path.join(dir,'audio/departure-footsteps-original.wav');fs.writeFileSync(cue,Buffer.concat([h,data]));
const tmp=path.join(dir,'sources/c03-quiet.tmp.mp4');const r=cp.spawnSync(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',original,'-i',cue,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',tmp],{windowsHide:true,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.error?.message||'Departure repair failed');fs.renameSync(tmp,source);
fs.writeFileSync(path.join(dir,'c03-repair.json'),JSON.stringify({visualSource:'attempts/c03-native/c03.mp4',audio:'audio/departure-footsteps-original.wav',origin:'Original procedural quiet soft boot thuds and cloth scrape; no recordings or voices',reason:'Silent scene native audio produced stray transcription. Replaced with dialogue-free local cue.',credits:0},null,2));console.log('Preserved departure visuals; replaced audio with original quiet footsteps, no voices.');
