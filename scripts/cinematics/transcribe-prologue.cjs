// Read PROJECT_MEMORY.md and style guide before further production.
// This verifies synthetic production dialogue; never use for learner recordings.
const fs = require('node:fs');
const path = require('node:path');
const OpenAI = require('openai');
const root = path.resolve(__dirname, '../..');
require('dotenv').config({ path: path.join(root, '.env.local'), quiet: true });
require('dotenv').config({ path: path.join(root, '.env'), quiet: true });
if (!process.env.OPENAI_API_KEY) { console.error('Transcription API credential unavailable; no secret displayed.'); process.exit(2); }
const production = path.join(root, 'public/cinematics/prologue-v1');
const shots = JSON.parse(fs.readFileSync(path.join(production, 'shots.json'))).scenes;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const normalize = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
function wrap(text) { const lines=[]; let line=''; for(const word of text.split(/\s+/)) { if(line && line.length+word.length+1>48) { lines.push(line); line=word; } else line += (line?' ':'')+word; } if(line) lines.push(line); return lines.join('\n'); }
function stamp(seconds) { const ms = Math.round(seconds * 1000); return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`; }
(async () => {
  const entries = await Promise.all(shots.map(async (shot, index) => {
    const resultPath = path.join(production, 'audio', shot.id + '-transcript.json');
    let transcript;
    if (fs.existsSync(resultPath)) transcript = JSON.parse(fs.readFileSync(resultPath));
    else {
      transcript = await client.audio.transcriptions.create({file:fs.createReadStream(path.join(production, 'audio', shot.id + '.wav')), model:'whisper-1', language:'en', response_format:'verbose_json', timestamp_granularities:['word','segment']});
      fs.writeFileSync(resultPath, JSON.stringify(transcript,null,2));
    }
    const words = transcript.words || [];
    const start = words.length ? words[0].start : 0;
    const end = words.length ? words[words.length-1].end : 5;
    const matches = normalize(transcript.text) === normalize(shot.line);
    console.log(JSON.stringify({id:shot.id,expected:shot.line,heard:transcript.text,matches,start,end}));
    return {shot,index,transcript,start,end,matches};
  }));
  fs.writeFileSync(path.join(production,'speech-validation.json'),JSON.stringify(entries.map(e=>({id:e.shot.id,expected:e.shot.line,heard:e.transcript.text,matches:e.matches,start:e.start,end:e.end})),null,2));
  let vtt = 'WEBVTT\n\nNOTE Captions aligned to generated speech; sources and audio are independently editable.\n\n';
  for (const e of entries) {
    const text = e.matches ? e.shot.line : e.transcript.text.trim();
    vtt += `${e.shot.id}\n${stamp(e.index*5+Math.max(0,e.start))} --> ${stamp(e.index*5+Math.min(5,e.end+0.15))}\n${wrap(e.shot.speaker.toUpperCase()+': '+text)}\n\n`;
  }
  fs.writeFileSync(path.join(production,'prologue.en.vtt'),vtt);
})().catch(err=>{ console.error('Speech verification failed:', err.message); process.exitCode=1; });
