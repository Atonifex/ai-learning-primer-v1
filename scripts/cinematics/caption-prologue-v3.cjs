// Synthetic production audio only; read PROJECT_MEMORY.md and update meaningful findings. No learner audio.
const fs=require('node:fs'),path=require('node:path'),OpenAI=require('openai');
const root=path.resolve(__dirname,'../..'),production=path.join(root,'public/cinematics/prologue-v3');
require('dotenv').config({path:path.join(root,'.env.local'),quiet:true});
require('dotenv').config({path:path.join(root,'.env'),quiet:true});
if(!process.env.OPENAI_API_KEY)throw new Error('Transcription credential unavailable; never display its value.');
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const manifest=JSON.parse(fs.readFileSync(path.join(production,'shots.json')));
const clean=t=>t.toLowerCase().replace(/[^a-z0-9]/g,'');
const equivalent=t=>clean(t.replace(/\b10\s*%/g,'ten percent').replace(/\b15\s*%/g,'fifteen percent').replace(/\b20\s*%/g,'twenty percent').replace(/\bRo\b/gi,'Rho').replace(/\balright\b/gi,'all right').replace(/^\s*Hmm\.?\s*/i,''));
const stamp=s=>{const ms=Math.round(s*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`};
function wrap(t){const out=[];let line='';for(const w of t.split(/\s+/)){if(line&&line.length+w.length+1>44){out.push(line);line=w}else line+=(line?' ':'')+w}if(line)out.push(line);return out.join('\n')}
(async()=>{
  const transcripts={};
  // Limited parallelism avoids rate spikes; preserve accepted transcripts across reruns.
  const spoken=manifest.scenes.filter(s=>s.audio);
  for(let index=0;index<spoken.length;index+=3)await Promise.all(spoken.slice(index,index+3).map(async shot=>{
    const target=path.join(production,'audio',shot.id+'-transcript.json');
    const result=fs.existsSync(target)?JSON.parse(fs.readFileSync(target)):await client.audio.transcriptions.create({file:fs.createReadStream(path.join(production,'audio',shot.id+'.wav')),model:'whisper-1',language:'en',response_format:'verbose_json',timestamp_granularities:['word','segment']});
    fs.writeFileSync(target,JSON.stringify(result,null,2));transcripts[shot.id]=result;
    console.log(JSON.stringify({id:shot.id,expected:shot.line,heard:result.text,matches:clean(shot.line)===clean(result.text)}));
  }));
  const validation=spoken.map(s=>({id:s.id,expected:s.line,heard:transcripts[s.id].text,matches:clean(s.line)===clean(transcripts[s.id].text),equivalentWords:equivalent(s.line)===equivalent(transcripts[s.id].text),note:s.id==='n15'?'Minor generated Hmm interjection retained in captions.':s.id==='a05'?'Transcript Ro represents the intended pronunciation row; caption spelling corrected to Rho.':'Numeral percent notation, punctuation and alright spelling may differ without changing the spoken content.'}));
  fs.writeFileSync(path.join(production,'speech-validation.json'),JSON.stringify(validation,null,2));
  for(const [editName,ids]of Object.entries(manifest.edits)){
    let offset=0,vtt='WEBVTT\n\nNOTE Editable captions aligned to actual branch audio; word matching does not certify pronunciation.\n\n';
    for(const id of ids){const shot=manifest.scenes.find(s=>s.id===id),transcript=transcripts[id];
      if(transcript){const words=transcript.words||[];let group=[];
        function flush(nextStart=Infinity){if(!group.length)return;vtt+=`${id}-${group[0].start}\n${stamp(offset+group[0].start)} --> ${stamp(offset+Math.min(shot.duration,nextStart,group.at(-1).end+0.08))}\n${wrap(group.map(w=>w.word).join(' '))}\n\n`;group=[]}
        for(const originalWord of words){const word={...originalWord,word:originalWord.word.replace(/\bRo\b/gi,'Rho')};if(group.length&&(wrap([...group,word].map(w=>w.word).join(' ')).split('\n').length>2||word.end-group[0].start>4))flush(word.start);group.push(word)}flush();
        if(!words.length)vtt+=`${id}\n${stamp(offset)} --> ${stamp(offset+shot.duration)}\n${wrap(transcript.text.trim())}\n\n`;
      }offset+=shot.duration;
    }fs.writeFileSync(path.join(production,editName+'.en.vtt'),vtt);
  }
})().catch(e=>{console.error('Caption export failed:',e.message);process.exitCode=1});
