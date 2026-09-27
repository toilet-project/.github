const fs=require('node:fs'),path=require('node:path');
const sharp = require('sharp');
const root=path.resolve(__dirname,'..');
function components(mask,w,h){
  const seen=new Uint8Array(w*h),sizes=[];
  for(let p=0;p<mask.length;p++){
    if(!mask[p]||seen[p])continue;
    const stack=[p];seen[p]=1;let count=0;
    while(stack.length){const at=stack.pop();count++;const x=at%w,y=Math.floor(at/w);
      for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++){const q=yy*w+xx;if(mask[q]&&!seen[q]){seen[q]=1;stack.push(q)}}
    }sizes.push(count);
  }return sizes.sort((a,b)=>b-a);
}
async function main(){
 const checks=[];
 function check(name,pass,detail){checks.push({name,pass,detail});if(!pass)process.exitCode=1;}
 for(const file of fs.readdirSync(path.join(root,'svg'))){
   const s=fs.readFileSync(path.join(root,'svg',file),'utf8');
   check(file+' vector independence',!/<(?:text|image|foreignObject)\b|(?:href|src)\s*=|@import|@font-face/.test(s),'Paths/shapes only; no raster, external assets, or live font dependency.');
 }
 for(const file of ['symbol-green-1024.png','symbol-white-1024.png','symbol-black-1024.png','lockup-ko.png','lockup-en.png','lockup-ko-white.png','lockup-en-white.png']){
   const p=path.join(root,'png',file),m=await sharp(p).metadata(),r=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   let zero=0,opaque=0;for(let i=3;i<r.data.length;i+=4){zero+=r.data[i]===0;opaque+=r.data[i]===255}
   check(file+' alpha',m.hasAlpha&&zero>0&&opaque>0,{hasAlpha:m.hasAlpha,transparentPixels:zero,opaquePixels:opaque});
 }
 for(const [file,size]of [['app-icon-1024.png',1024],['avatar-1080.png',1080]]){
   const p=path.join(root,'png',file),m=await sharp(p).metadata();
   check(file+' square opaque',m.width===size&&m.height===size&&!m.hasAlpha,{width:m.width,height:m.height,hasAlpha:m.hasAlpha});
 }
 for(const file of ['symbol-green-1024.png',...([16,24,32,48,64].map(s=>'favicon-'+s+'.png'))]){
   const r=await sharp(path.join(root,'png',file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});const{width:w,height:h}=r.info;
   const mask=new Uint8Array(w*h);
   for(let p=0;p<mask.length;p++)mask[p]=file.startsWith('symbol')?r.data[p*4+3]>127:r.data[p*4]>160&&r.data[p*4+1]>180&&r.data[p*4+2]>160;
   const sizes=components(mask,w,h);
   check(file+' three distinct components',sizes.length===3,{componentPixelAreas:sizes});
 }
 const html=fs.readFileSync(path.join(root,'preview/index.html'),'utf8');
 new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
 for(const match of html.matchAll(/(?:src|href)="(\.\.\/[^\"]+)"/g))check('preview link '+match[1],fs.existsSync(path.resolve(root,'preview',match[1])),'Local asset exists.');
 const report={checkedAt:new Date().toISOString(),pass:checks.every(x=>x.pass),checks,limitations:['Vector and raster asset QA only. No production deployment, native app build, screen-reader pass, or physical device validation performed.']};
 fs.writeFileSync(path.join(root,'qa-report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
