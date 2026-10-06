// Read PROJECT_MEMORY.md. Temporary loopback-only review server; no learner data.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const directory=path.resolve(__dirname,'../../public/cinematics/prologue-v5');
const types={'.mp4':'video/mp4','.vtt':'text/vtt','.html':'text/html','.json':'application/json','.png':'image/png','.jpg':'image/jpeg'};
http.createServer((req,res)=>{try{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const prefix='/cinematics/prologue-v5/';if(!pathname.startsWith(prefix)){res.writeHead(404);return res.end();}
 const file=path.resolve(directory,pathname.slice(prefix.length));
 if(!file.startsWith(directory+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 const size=fs.statSync(file).size;let start=0,end=size-1,status=200;
 if(req.headers.range){const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!match){res.writeHead(416);return res.end();}start=Number(match[1]);end=match[2]?Math.min(end,Number(match[2])):end;if(start>end||start>=size){res.writeHead(416,{'Content-Range':'bytes */'+size});return res.end();}status=206;}
 const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-store'};
 if(status===206)headers['Content-Range']='bytes '+start+'-'+end+'/'+size;res.writeHead(status,headers);if(req.method==='HEAD')return res.end();
 const stream=fs.createReadStream(file,{start,end});res.on('close',()=>stream.destroy());stream.on('error',()=>res.destroy());stream.pipe(res);
 }catch(e){if(!res.headersSent)res.writeHead(500);res.end();}
}).listen(4177,'127.0.0.1',()=>console.log(JSON.stringify({pid:process.pid,origin:'http://127.0.0.1:4177'})));
