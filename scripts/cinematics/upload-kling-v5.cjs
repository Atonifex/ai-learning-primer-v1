// Read PROJECT_MEMORY.md before production; never persist tickets or credentials.
const fs = require('node:fs');
(async () => {
  const [file, ticket] = process.argv.slice(2);
  const form = new FormData();
  form.set('ticket', ticket);
  form.set('file', new Blob([fs.readFileSync(file)], {type:'image/png'}), require('node:path').basename(file));
  const response = await fetch('https://kling.ai/api/mcp/files',{method:'POST',body:form});
  if(!response.ok) throw new Error('Upload HTTP '+response.status);
  console.log(await response.text());
})().catch(error=>{console.error(error.message);process.exitCode=1;});
