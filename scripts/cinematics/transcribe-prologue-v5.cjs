// Synthetic production voices only; never send learner recordings. Read PROJECT_MEMORY.md.
const fs=require('node:fs'); const path=require('node:path'); const OpenAI=require('openai');
const root=path.resolve(__dirname,'../..'); require('dotenv').config({path:path.join(root,'.env.local'),quiet:true});require('dotenv').config({path:path.join(root,'.env'),quiet:true});
const dir=path.join(root,'public/cinematics/prologue-v5');
(async()=>{
 if(!process.env.OPENAI_API_KEY)throw Error('Transcription credential unavailable; no secret displayed');
 const id=process.argv[2],second=process.argv[3]==='second'; const file=path.join(dir,'audio',id+'.wav'); const target=path.join(dir,'review',id+(second?'-second':'')+'-transcript.json');
 let r;if(fs.existsSync(target))r=JSON.parse(fs.readFileSync(target));else{r=await new OpenAI().audio.transcriptions.create({file:fs.createReadStream(file),model:second?'gpt-4o-transcribe':'whisper-1',language:'en',response_format:second?'json':'verbose_json',...(second?{}:{timestamp_granularities:['word','segment']})});fs.writeFileSync(target,JSON.stringify(r,null,2));}
 console.log(JSON.stringify({id,text:r.text,words:r.words}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
