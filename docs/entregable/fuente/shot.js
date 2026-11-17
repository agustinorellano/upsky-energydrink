const { chromium } = require('playwright');
const D=__dirname;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await (await b.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:2})).newPage();
await p.goto('file://'+D+'/deck.html',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
const n=await p.locator('.slide').count();
for(let i=0;i<n;i++){await p.locator('.slide').nth(i).screenshot({path:`${D}/s${String(i+1).padStart(2,'0')}.png`});}
if(process.argv[2]==='pdf')await p.pdf({path:D+'/UPSKY-entregable.pdf',width:'1920px',height:'1080px',printBackground:true});
console.log(n);await b.close();})();
