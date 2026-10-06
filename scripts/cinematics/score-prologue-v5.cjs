// Original, quiet instrumental cue for Primer. No samples or external licensing.
// Read PROJECT_MEMORY.md; keep score separate so the user can replace it later.
const fs=require('node:fs');const path=require('node:path');
const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5/audio');fs.mkdirSync(dir,{recursive:true});
const rate=44100,seconds=240,total=rate*seconds,pcm=Buffer.alloc(total*2);
const hz=n=>440*Math.pow(2,(n-69)/12);
const chords=[[52,59,64,67],[48,55,60,64],[55,62,67,71],[50,57,62,66]];
const melody=[64,67,71,69,67,64,62,59,60,64,67,66,64,62,60,59,67,71,74,72,71,67,66,64,62,66,69,67,66,64,62,59];
for(let i=0;i<total;i++){
 const t=i/rate,section=Math.floor(t/10)%4,phase=t%10;
 let value=0;
 for(const note of chords[section]){const f=hz(note);const amp=Math.min(1,phase/1.3,(10-phase)/1.3)*0.018;value+=amp*(Math.sin(2*Math.PI*f*t)+0.22*Math.sin(4*Math.PI*f*t)+0.08*Math.sin(6*Math.PI*f*t));}
 const j=Math.floor(t/1.25),local=t%1.25;const f=hz(melody[j%melody.length]);const env=Math.min(1,local/0.12)*Math.exp(-local*1.9)*0.034;
 value+=env*(Math.sin(2*Math.PI*f*t)+0.26*Math.sin(4*Math.PI*f*t)+0.09*Math.sin(6*Math.PI*f*t));
 const pulse=(t%0.625);const bass=hz(chords[section][0]-12);value+=0.018*Math.exp(-pulse*8)*Math.sin(2*Math.PI*bass*t);
 value*=Math.min(1,t/2,(seconds-t)/2);pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),i*2);
}
const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(pcm.length+36,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);
fs.writeFileSync(path.join(dir,'adventure-theme-original.wav'),Buffer.concat([header,pcm]));
fs.writeFileSync(path.join(dir,'score.json'),JSON.stringify({title:'Fortuna expedition',origin:'Original procedural instrumental composed for this project; no borrowed samples',seconds,chords,melody,notes:'Quiet adventurous harmonic cue. Mix under briefing and safe recovery; fade out before takeoff. Engine/wind/alarms carry flight and emergency.'},null,2));
console.log('Saved separate original adventure cue and editable score');
