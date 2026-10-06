// Real headless browser playback verification; no learner session changes.
// Read PROJECT_MEMORY.md. This verifies decoding/motion, not human listening.
const {chromium}=require('@playwright/test');const path=require('node:path');const fs=require('node:fs');
(async()=>{
 const id=process.argv[2];const browser=await chromium.launch({headless:true,args:['--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--disable-background-timer-throttling']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto((process.env.CINEMATIC_REVIEW_ORIGIN||'http://localhost:3000')+'/cinematics/prologue-v5/review-player.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('#shots').selectOption(id);await page.locator('#load').click();
  await page.waitForFunction(id=>{const v=document.querySelector('video');return v.readyState>=2&&v.videoWidth>0&&v.currentSrc.endsWith('/sources/'+id+'.mp4');},id,{timeout:60000});
  const video=page.locator('video');await video.evaluate(async v=>{v.muted=true;await v.play();});
  await page.waitForTimeout(1000);
  const first=await video.evaluate(v=>({time:v.currentTime,width:v.videoWidth,height:v.videoHeight,error:v.error?.message}));
  try{await page.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:180000});}
  catch(error){const state=await video.evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,readyState:v.readyState,networkState:v.networkState,error:v.error?.message,src:v.currentSrc}));console.error(JSON.stringify({id,state}));throw error;}
  const last=await video.evaluate(v=>({time:v.currentTime,duration:v.duration,ended:v.ended,width:v.videoWidth,src:v.currentSrc,error:v.error?.message}));
  if(last.time<=0||last.width===0||last.error||!last.ended||!last.src.endsWith('/sources/'+id+'.mp4'))throw Error('Playback did not complete: '+JSON.stringify({first,last}));
  const dir=path.resolve(__dirname,'../../public/cinematics/prologue-v5/review');
  await page.screenshot({path:path.join(dir,id+'-browser.jpg'),type:'jpeg',quality:80});
  fs.writeFileSync(path.join(dir,id+'-browser.json'),JSON.stringify({first,last},null,2));console.log(JSON.stringify({id,first,last}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
