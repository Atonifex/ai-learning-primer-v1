// Read PROJECT_MEMORY.md. Keep clean media, editable captions and exact edit decisions.
const fs=require('node:fs');const path=require('node:path');const cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'public/cinematics/prologue-v5');
const bins=JSON.parse(fs.readFileSync(path.join(root,'public/cinematics/prologue-v3/tool-paths.json')));
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'shots.json')));
const briefingOnly=process.argv.includes('--briefing-only');
const prepareReviewed=process.argv.includes('--prepare-reviewed');
const priorEdits=fs.existsSync(path.join(dir,'edit-decisions.json'))?JSON.parse(fs.readFileSync(path.join(dir,'edit-decisions.json'))):{};
const priorExports=fs.existsSync(path.join(dir,'exports.json'))?JSON.parse(fs.readFileSync(path.join(dir,'exports.json'))):{};
const unchanged=new Set();
function run(exe,args){const r=cp.spawnSync(exe,args,{windowsHide:true,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||'Media export failed');return r.stdout;}
function probe(file){return JSON.parse(run(bins.ffprobe,['-v','error','-show_entries','format=duration,size','-show_entries','stream=codec_type','-of','json',file]));}
function stamp(t){const n=Math.max(0,Math.round(t*1000));return `${String(Math.floor(n/3600000)).padStart(2,'0')}:${String(Math.floor(n/60000)%60).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')}.${String(n%1000).padStart(3,'0')}`;}
function captionText(text){const lines=[];let line='';for(const w of text.split(/\s+/)){if(line.length+w.length+1>48){lines.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)lines.push(line);return lines.join('\n');}
function captionChunks(text){return (text.match(/[^.!?]+[.!?]?/g)||[text]).flatMap(sentence=>{const chunks=[];let chunk='';for(const word of sentence.trim().split(/\s+/)){const next=chunk+(chunk?' ':'')+word;if(captionText(next).split('\n').length>2){chunks.push(chunk);chunk=word;}else chunk=next;}if(chunk)chunks.push(chunk);return chunks;});}
function spokenTokens(text){return text.toLowerCase().replace(/all right/g,'alright').replace(/10/g,'ten').replace(/15/g,'fifteen').replace(/20/g,'twenty').replace(/%/g,' percent ').replace(/[^a-z\s]/g,'').trim().split(/\s+/).filter(Boolean);}
function captionBounds(chunks,words){
 const tokens=words.flatMap(w=>spokenTokens(w.word).map(token=>({token,start:w.start,end:w.end})));let cursor=0;
 return chunks.map(chunk=>{const wanted=spokenTokens(chunk);let found=[];
  for(const token of wanted){const at=tokens.findIndex((w,i)=>i>=cursor&&i<cursor+8&&w.token===token);if(at>=0){found.push(tokens[at]);cursor=at+1;}}
  return found.length>=wanted.length*0.7?{start:found[0].start,end:found.at(-1).end}:null;
 });
}
function encode(input,output,duration,audioFilter){
 // Preserve reviewed H.264 when it fits; avoid a needless encode and generation loss.
 if(!audioFilter&&fs.statSync(input).size<79000000){fs.copyFileSync(input,output);return probe(output);}
 const bitrate=Math.min(4500000,Math.floor(70000000*8/duration)-160000);
 const base=['-hide_banner','-loglevel','error','-y','-i',input];
 if(audioFilter)base.push('-af',audioFilter);
 run(bins.ffmpeg,[...base,'-c:v','libx264','-preset','fast','-b:v',String(bitrate),'-maxrate',String(Math.ceil(bitrate*1.3)),'-bufsize',String(bitrate*2),'-c:a','aac','-b:a','128k','-pix_fmt','yuv420p','-movflags','+faststart',output]);
 const info=probe(output);if(Number(info.format.size)>=80000000)throw Error('MP4 over 80MB: '+output);return info;
}
const edits=prepareReviewed?{...priorEdits}:{};
for(const shot of manifest.scenes.filter(s=>prepareReviewed?s.status==='reviewed':!briefingOnly||manifest.edits.briefing.includes(s.id))){
 if(shot.status!=='reviewed')throw Error('Unreviewed source '+shot.id);
 if(shot.speechVerification?.startsWith('pending'))throw Error('Speech verification pending '+shot.id);
 const source=path.join(dir,'sources',shot.id+'.mp4');if(!fs.existsSync(source))throw Error('Missing reviewed source '+shot.id);
 const actual=Number(probe(source).format.duration);let start=0,end=Math.min(actual,shot.duration);let transcript=null;
 const tfile=path.join(dir,'review',shot.id+'-transcript.json');if(fs.existsSync(tfile))transcript=JSON.parse(fs.readFileSync(tfile));
 // Preserve action and endpoint anchors after speech (handshake, blue handle,
 // map zoom, waiting pose). Trims require an explicit reviewed edit decision.
 if(Number.isFinite(shot.in))start=shot.in;
 if(Number.isFinite(shot.out))end=Math.min(actual,shot.out);
 const length=Math.ceil((end-start)*24)/24;
 edits[shot.id]={start,end:start+length,duration:length,line:shot.line,speaker:shot.speaker,audioGain:shot.audioGain??1,fadeIn:shot.fadeIn??0,fadeOut:shot.fadeOut??0};
 const output=path.join(dir,'sources',shot.id+'-edit.mp4');const hasAudio=probe(source).streams.some(s=>s.codec_type==='audio');
 const prior=priorEdits[shot.id];
 if(fs.existsSync(output)&&prior?.start===start&&prior?.duration===length&&(prior.audioGain??1)===(shot.audioGain??1)&&(prior.fadeIn??0)===(shot.fadeIn??0)&&(prior.fadeOut??0)===(shot.fadeOut??0)&&prior.line===shot.line&&fs.statSync(output).mtimeMs>fs.statSync(source).mtimeMs){unchanged.add(shot.id);continue;}
 const args=['-hide_banner','-loglevel','error','-y','-ss',String(start),'-i',source];
 if(!hasAudio)args.push('-f','lavfi','-i','anullsrc=r=48000:cl=stereo');
 const vf=['scale=1920:1080:force_original_aspect_ratio=decrease','pad=1920:1080:(ow-iw)/2:(oh-ih)/2','setsar=1','fps=24'];
 if(shot.fadeIn)vf.push(`fade=t=in:d=${shot.fadeIn}`);
 if(shot.fadeOut)vf.push(`fade=t=out:st=${length-shot.fadeOut}:d=${shot.fadeOut}`);
 args.push('-t',String(length),'-vf',vf.join(','),'-map','0:v:0','-map',hasAudio?'0:a:0':'1:a:0','-af',`loudnorm=I=-18:TP=-2:LRA=9,aresample=48000,afade=t=in:d=0.015,afade=t=out:st=${length-0.02}:d=0.02,volume=${shot.audioGain??1}`,'-c:v','libx264','-crf','23','-preset','fast','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-ac','2','-b:a','128k','-movflags','+faststart',output);
 run(bins.ffmpeg,args);
}
fs.writeFileSync(path.join(dir,'edit-decisions.json'),JSON.stringify(edits,null,2));
// Cache reviewed edits while queued jobs finish; never mark an export complete.
if(prepareReviewed){console.log(JSON.stringify({prepared:Object.keys(edits),exportsUnchanged:true}));process.exit(0);}
const sets=briefingOnly?{briefing:manifest.edits.briefing}:{...manifest.edits,preview10:[...manifest.edits.briefing,...manifest.edits.continuation],preview20:[...manifest.edits.briefing,'n15','n20',...manifest.edits.continuation]};
const summary=[];
const soundCaptions={c03:'[Footsteps]',c05:'[Plane engines rev; wheels roll]',c06:'[Propellers and wind]',c08:'[Thunder; engine falters]',c11:'[Wind; parachutes flutter]',c12:'[Splash; surf]'};
for(const [name,ids]of Object.entries(sets)){
 const previous=priorExports.summary?.find(s=>s.name===name);
 const existing=path.join(dir,name+'.mp4');
 if(name==='briefing'&&!briefingOnly&&priorExports.captionVersion===2&&previous&&ids.every(id=>unchanged.has(id))&&fs.existsSync(existing)&&fs.statSync(existing).mtimeMs>fs.statSync(path.join(dir,'audio/adventure-theme-original.wav')).mtimeMs){summary.push(previous);continue;}
 const list=path.join(dir,name+'-edit-list.txt');fs.writeFileSync(list,ids.map(id=>`file 'sources/${id}-edit.mp4'`).join('\n'));
 const raw=path.join(dir,name+'-clean.mp4');run(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',list,'-c','copy','-movflags','+faststart',raw]);
 let vtt='WEBVTT\n\nNOTE Editable captions. Shot timing comes from synthetic speech transcription and edit-decisions.json.\n\n';let offset=0;
 for(const id of ids){const e=edits[id];const tfile=path.join(dir,'review',id+'-transcript.json');const t=fs.existsSync(tfile)?JSON.parse(fs.readFileSync(tfile)):null;
  if(e.line){const words=t?.words||[];const speechStart=words.length?words[0].start:e.start;const speechEnd=words.length?words.at(-1).end:e.end-0.2;
   const start=offset+Math.max(0,speechStart-e.start);const end=offset+Math.min(e.duration,speechEnd-e.start+0.1);const text=e.line;
   // Small caption blocks rather than a whole paragraph at once.
   const chunks=captionChunks(text);let at=start;const total=chunks.reduce((n,c)=>n+c.trim().split(/\s+/).length,0);const bounds=captionBounds(chunks,words);
   for(let j=0;j<chunks.length;j++){const c=chunks[j].trim();const b=bounds[j];const cueStart=b?Math.max(at,offset+b.start-e.start):at;const next=b?Math.min(offset+e.duration,offset+b.end-e.start+0.1):(j===chunks.length-1?end:at+(end-start)*c.split(/\s+/).length/total);if(next>cueStart)vtt+=`${id}-${j}\n${stamp(cueStart)} --> ${stamp(next)}\n${captionText(c)}\n\n`;at=next;}
  }else if(soundCaptions[id]){vtt+=`${id}-sound\n${stamp(offset)} --> ${stamp(offset+Math.min(4,e.duration))}\n${soundCaptions[id]}\n\n`;}offset+=e.duration;
 }
 const vttPath=path.join(dir,name+'.en.vtt');fs.writeFileSync(vttPath,vtt);run(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',vttPath,path.join(dir,name+'.en.srt')]);
 const duration=Number(probe(raw).format.duration);const output=path.join(dir,name+'.mp4');
 const briefingLength=manifest.edits.briefing.reduce((n,id)=>n+edits[id].duration,0);
 const musicEnabled=['briefing','continuation','preview10','preview20'].includes(name);
 if(musicEnabled){
  let fadeOut=duration;let recovery=duration;
  // Keep the first dawn responsiveness check quiet; the theme returns once safe.
  if(name==='continuation'){fadeOut=ids.slice(0,ids.indexOf('c05')).reduce((n,id)=>n+edits[id].duration,0);recovery=ids.slice(0,ids.indexOf('c14')).reduce((n,id)=>n+edits[id].duration,0);}
  else if(name.startsWith('preview')){fadeOut=ids.slice(0,ids.indexOf('c05')).reduce((n,id)=>n+edits[id].duration,0);recovery=ids.slice(0,ids.indexOf('c14')).reduce((n,id)=>n+edits[id].duration,0);}
  const filter=`[1:a]atrim=duration=${duration},asetpts=PTS-STARTPTS,volume='if(lt(t,${Math.max(0,fadeOut-2)}),0.8,if(lt(t,${fadeOut}),0.4*(${fadeOut}-t),if(lt(t,${recovery}),0,0.65*min(1,(t-${recovery})/2))))':eval=frame[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]`;
  const bitrate=Math.min(4500000,Math.floor(70000000*8/duration)-160000);
  run(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',raw,'-stream_loop','-1','-i',path.join(dir,'audio/adventure-theme-original.wav'),'-filter_complex',filter,'-map','0:v:0','-map','[a]','-t',String(duration),...(fs.statSync(raw).size<79000000?['-c:v','copy']:['-c:v','libx264','-preset','fast','-b:v',String(bitrate),'-maxrate',String(Math.ceil(bitrate*1.3)),'-bufsize',String(bitrate*2),'-pix_fmt','yuv420p']),'-c:a','aac','-b:a','128k','-movflags','+faststart',output]);
 }else encode(raw,output,duration);
 const cleanSafe=path.join(dir,name+'-clean-small.mp4');encode(raw,cleanSafe,duration);fs.renameSync(cleanSafe,raw);
 const soft=path.join(dir,name+'-soft.tmp.mp4');
 run(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',output,'-i',vttPath,'-map','0','-map','1','-c','copy','-c:s','mov_text','-metadata:s:s:0','language=eng','-disposition:s:0','default','-movflags','+faststart',soft]);
 fs.renameSync(soft,output);
 const info=probe(output);if(Number(info.format.size)>=80000000)throw Error('Over80MB '+name);summary.push({name,duration,bytes:Number(info.format.size)});
}
if(!briefingOnly)run(bins.ffmpeg,['-hide_banner','-loglevel','error','-y','-i',path.join(dir,'sources/wait-edit.mp4'),'-filter_complex','[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]','-map','[v]','-an','-c:v','libx264','-crf','23','-movflags','+faststart',path.join(dir,'waiting-loop.mp4')]);
const mp4s=fs.readdirSync(dir,{recursive:true}).filter(n=>n.endsWith('.mp4')).map(n=>({file:n,bytes:fs.statSync(path.join(dir,n)).size}));
if(mp4s.some(n=>n.bytes>=80000000))throw Error('One MP4 exceeds preferred80MB ceiling');
fs.writeFileSync(path.join(dir,'exports.json'),JSON.stringify({complete:!briefingOnly,captionVersion:2,summary,mp4s},null,2));console.log(JSON.stringify(summary));
