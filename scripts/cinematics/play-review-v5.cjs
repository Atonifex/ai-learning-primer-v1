// Real headless browser playback verification; no learner session changes.
// Read PROJECT_MEMORY.md. This verifies decoding/motion, not human listening.
const {chromium}=require('@playwright/test');const path=require('node:path');const fs=require('node:fs');
(async()=>{
 const id=process.argv[2];const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto('http://localhost:3000/cinematics/prologue-v5/review-player.html');
  await page.locator('#shots').selectOption(id);await page.locator('#load').click();
  const video=page.locator('video');await video.evaluate(async v=>{v.muted=true;await v.play();});
  await page.waitForTimeout(1000);
  const first=await video.evaluate(v=>({time:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error?.message}));
  await page.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:25000});
  const last=await video.evaluate(v=>({time:v.currentTime,duration:v.duration,ended:v.ended,error:v.error?.message}));
  if(first.time<=0||first.width===0||last.error||!last.ended)throw Error('Playback did not complete');
  const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5/review');
  await page.screenshot({path:path.join(dir,id+'-browser.jpg'),type:'jpeg',quality:80});
  fs.writeFileSync(path.join(dir,id+'-browser.json'),JSON.stringify({first,last},null,2));console.log(JSON.stringify({id,first,last}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
