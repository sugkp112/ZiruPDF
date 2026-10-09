import * as pdfjs from '../vendor/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc=new URL('../vendor/pdf.worker.mjs',import.meta.url).href;
const $=id=>document.getElementById(id), modes={merge:'PDF 合并',split:'PDF 提取／拆分',organize:'PDF 旋转／删除／排序',export:'PDF 转图片',watermark:'PDF 水印／页码'};
const requested=document.body.dataset.toolMode||new URLSearchParams(location.search).get('mode');const mode=Object.hasOwn(modes,requested)?requested:'merge';const purposeMode=document.body.dataset.preset==='id-copy';
$('toolTitle').textContent=purposeMode?'证件复印件用途水印':modes[mode];$('toolHint').textContent=mode==='merge'?'调整文件顺序，再生成合并文件。':'勾选要处理的页面；页码范围对应下方当前显示顺序。';
$('splitOptions').hidden=mode!=='split';$('exportOptions').hidden=mode!=='export';$('markOptions').hidden=mode!=='watermark';$('settings').hidden=mode==='merge';$('files').multiple=mode==='merge';
document.querySelector(`.tool-tabs a[href="?mode=${mode}"]`)?.classList.add('active');
let docs=[],pages=[],busy=false,urls=[],previewVersion=0;
const {PDFDocument,degrees}=window.PDFLib;const status=s=>$('status').textContent=s;
function revoke(){urls.forEach(URL.revokeObjectURL);urls=[];$('results').replaceChildren();}
function state(){ $('run').disabled=busy||!pages.some(p=>p.selected);$('files').disabled=busy;$('clear').disabled=busy;document.querySelectorAll('#settings input,#settings select,#settings button,#fileList button,#pages button,#pages input').forEach(e=>e.disabled=busy);if(mode==='merge')document.querySelectorAll('#pages input').forEach(e=>e.disabled=true);}
function link(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);urls.push(a.href);a.download=name;a.textContent='下载 '+name;$('results').append(a);}
function refreshFiles(){
 $('fileList').replaceChildren();docs.forEach((d,i)=>{const row=document.createElement('div');row.className='file-row';const t=document.createElement('span');t.textContent=`${d.file.name} · ${d.reader.numPages} 页`;row.append(t);
 if(mode==='merge')for(const [text,delta] of [['上移',-1],['下移',1],['移除',0]]){const b=document.createElement('button');b.textContent=text;b.disabled=busy||(delta&&(i+delta<0||i+delta>=docs.length));b.onclick=async()=>{if(delta&&(i+delta<0||i+delta>=docs.length))return;if(delta)[docs[i],docs[i+delta]]=[docs[i+delta],docs[i]];else{docs.splice(i,1);d.task.destroy().catch(()=>{});}pages=docs.flatMap(x=>x.pages);revoke();refreshFiles();await renderPages();};row.append(b);} $('fileList').append(row);});state();
}
function markCanvas(width,height,index){
 if(width*height*4>20000000)throw Error('水印页面过大，请使用电脑软件处理');const c=document.createElement('canvas');c.width=Math.ceil(width*2);c.height=Math.ceil(height*2);const ctx=c.getContext('2d');ctx.scale(2,2);ctx.fillStyle=$('color').value;ctx.globalAlpha=Number($('opacity').value)/100;ctx.textAlign='center';ctx.textBaseline='middle';
 const font=Math.max(8,Math.min(100,Number($('fontSize').value)||36));ctx.font=`${font}px sans-serif`;const pos=$('position').value;if(purposeMode){ctx.save();ctx.translate(width/2,height/2);ctx.rotate(-Math.PI/8);for(let yy=-height;yy<=height;yy+=Math.max(80,font*4)){for(let xx=-width;xx<=width;xx+=Math.max(160,width*.8)){ctx.fillText($('markText').value,xx,yy,Math.max(1,width*.75));}}ctx.restore();return c;}const y=pos==='top'?Math.min(height/2,font+18):pos==='bottom'?Math.max(height/2,height-font-18):height/2;
 ctx.fillText($('markText').value,width/2,y,Math.max(1,width-24));if($('pageNumbers').checked){ctx.font='12px sans-serif';ctx.fillText(`${index+1} / ${pages.length}`,width/2,Math.max(8,height-16));}return c;
}
async function draw(page,canvas,index,scale=1,marks=true){const source=await page.doc.reader.getPage(page.number);const v=source.getViewport({scale,rotation:page.rotation});if(v.width*v.height>20000000)throw Error('页面输出过大，请选择较低分辨率');canvas.width=Math.ceil(v.width);canvas.height=Math.ceil(v.height);const ctx=canvas.getContext('2d');await source.render({canvasContext:ctx,viewport:v,background:'white'}).promise;if(mode==='watermark'&&marks){const overlay=markCanvas(v.width/scale,v.height/scale,index);ctx.drawImage(overlay,0,0,canvas.width,canvas.height);}source.cleanup();}
async function renderPages(){
 const token=++previewVersion;$('pages').replaceChildren();
 for(let i=0;i<pages.length;i++){
 if(token!==previewVersion)return;const p=pages[i],card=document.createElement('div');card.className='page-card'+(p.selected?' selected':'');card.draggable=mode==='organize'&&!busy;
 const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=p.selected;check.disabled=mode==='merge'||busy;check.onchange=()=>{p.selected=check.checked;card.classList.toggle('selected',p.selected);revoke();state();};label.append(check,document.createTextNode(` 第 ${i+1} 页`));const c=document.createElement('canvas');card.append(label,c);
 if(mode==='organize'){
 const row=document.createElement('div');row.className='control-row';for(const [text,action] of [['↶','left'],['↷','right'],['上移','up'],['下移','down'],['删除','delete']]){const b=document.createElement('button');b.textContent=text;b.title={left:'逆时针旋转',right:'顺时针旋转',up:'上移',down:'下移',delete:'删除此页'}[action];b.disabled=busy;b.onclick=async()=>{if(busy)return;if(action==='left'||action==='right')p.rotation=(p.rotation+(action==='left'?270:90))%360;else if(action==='delete')pages.splice(i,1);else{const next=i+(action==='up'?-1:1);if(next>=0&&next<pages.length)[pages[i],pages[next]]=[pages[next],pages[i]];}revoke();await renderPages();};row.append(b);}card.append(row);
 card.ondragstart=e=>{if(busy)return e.preventDefault();e.dataTransfer.setData('text/plain',String(i));};card.ondragover=e=>e.preventDefault();card.ondrop=async e=>{e.preventDefault();if(busy)return;const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from)&&from>=0&&from<pages.length&&from!==i){const [m]=pages.splice(from,1);pages.splice(i,0,m);revoke();await renderPages();}};
 }
 $('pages').append(card);try{const source=await p.doc.reader.getPage(p.number);const v=source.getViewport({scale:1,rotation:p.rotation});await draw(p,c,i,Math.min(.8,180/v.width));}catch(e){if(token===previewVersion)status('预览失败：'+e.message);}
 }state();
}
async function load(files){
 if(busy||!files.length)return;if((mode!=='merge'&&files.length!==1)||docs.length+files.length>20){status(mode==='merge'?'最多 20 个 PDF':'此工具一次处理一个 PDF');return;}
 if((mode==='merge'?docs.reduce((n,d)=>n+d.file.size,0):0)+files.reduce((n,f)=>n+f.size,0)>100*1024*1024){status('文件合计不能超过 100 MB');return;}
 busy=true;state();status('正在本地读取…');revoke();const added=[];
 try{
 for(const file of files){const bytes=new Uint8Array(await file.arrayBuffer());const editable=await PDFDocument.load(bytes);if(editable.isEncrypted)throw Error('暂不支持加密 PDF，请在电脑软件中解除密码');const task=pdfjs.getDocument({data:bytes.slice(),isEvalSupported:false,enableXfa:false,useSystemFonts:true,cMapUrl:new URL("../vendor/cmaps/",import.meta.url).href,cMapPacked:true,standardFontDataUrl:new URL("../vendor/standard_fonts/",import.meta.url).href,wasmUrl:new URL("../vendor/wasm/",import.meta.url).href});const reader=await task.promise;const d={file,bytes,editable,reader,task,pages:[]};added.push(d);for(let i=0;i<reader.numPages;i++)d.pages.push({doc:d,number:i+1,rotation:editable.getPage(i).getRotation().angle,selected:true});}
 if((mode==='merge'?pages.length:0)+added.reduce((n,d)=>n+d.pages.length,0)>200)throw Error('最多处理 200 页');
 if(mode!=='merge'){docs.forEach(d=>d.task.destroy().catch(()=>{}));docs=[];pages=[];}
 docs.push(...added);pages.push(...added.flatMap(d=>d.pages));$('range').value='';refreshFiles();await renderPages();status(`已读取 ${pages.length} 页。`);
 }catch(e){added.forEach(d=>d.task.destroy().catch(()=>{}));status('无法读取：'+e.message);}finally{busy=false;$('files').value='';refreshFiles();state();}
}
$('files').onchange=()=>load([...$('files').files]);const zone=$('dropzone');zone.ondragover=e=>{e.preventDefault();zone.classList.add('dragging');};zone.ondragleave=()=>zone.classList.remove('dragging');zone.ondrop=e=>{e.preventDefault();zone.classList.remove('dragging');load([...e.dataTransfer.files]);};
$('applyRange').onclick=()=>{if(busy)return;try{const value=$('range').value.trim();const chosen=new Set();if(!value)pages.forEach((_,i)=>chosen.add(i+1));else for(const part of value.split(/[,，]/)){const m=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!m)throw Error('请输入如 1-3,5 的页码');const a=+m[1],b=+(m[2]||m[1]);if(a<1||b<a||b>pages.length)throw Error('页码超出范围');for(let n=a;n<=b;n++)chosen.add(n);}pages.forEach((p,i)=>p.selected=chosen.has(i+1));revoke();renderPages();status(`已选择 ${chosen.size} 页。`);}catch(e){status(e.message);}};
for(const [id,selected] of [['selectAll',true],['selectNone',false]])$(id).onclick=()=>{if(busy)return;pages.forEach(p=>p.selected=selected);revoke();renderPages();};
let timer;document.querySelectorAll('#markOptions input,#markOptions select').forEach(el=>el.oninput=()=>{if(busy)return;revoke();clearTimeout(timer);timer=setTimeout(()=>renderPages(),200);});document.querySelectorAll('#exportOptions select,#splitType').forEach(el=>el.onchange=revoke);
$('clear').onclick=async()=>{if(busy)return;++previewVersion;docs.forEach(d=>d.task.destroy().catch(()=>{}));docs=[];pages=[];revoke();refreshFiles();$('pages').replaceChildren();status('');state();};
async function output(selection,watermark=false){const out=await PDFDocument.create();for(const p of selection){const [copy]=await out.copyPages(p.doc.editable,[p.number-1]);copy.setRotation(degrees(p.rotation));out.addPage(copy);if(watermark){const w=copy.getWidth(),h=copy.getHeight(),r=((p.rotation%360)+360)%360;const overlay=markCanvas(r%180?h:w,r%180?w:h,pages.indexOf(p));const image=await out.embedPng(overlay.toDataURL());copy.drawImage(image,{x:r===90||r===180?w:0,y:r===180||r===270?h:0,width:r%180?h:w,height:r%180?w:h,rotate:degrees(r)});}}return new Blob([await out.save()],{type:'application/pdf'});}
$('run').onclick=async()=>{if(busy)return;const selected=pages.filter(p=>p.selected);if(!selected.length)return;busy=true;++previewVersion;clearTimeout(timer);revoke();state();status('正在本地生成…');try{
 if(purposeMode&&(!$('recipient').value.trim()||!$('purpose').value.trim()))throw Error('请填写接收方和用途');
 if(mode==='export'){for(const p of selected){const c=document.createElement('canvas');await draw(p,c,pages.indexOf(p),Number($('scale').value),false);const type=$('format').value==='PNG'?'image/png':'image/jpeg';const blob=await new Promise(resolve=>c.toBlob(resolve,type,.92));if(!blob)throw Error('图片编码失败');link(blob,`page-${pages.indexOf(p)+1}.${type==='image/png'?'png':'jpg'}`);}}
 else if(mode==='split'&&$('splitType').value==='each'){for(const p of selected)link(await output([p]),`page-${pages.indexOf(p)+1}.pdf`);}
 else link(await output(selected,mode==='watermark'),`${mode}.pdf`);status('已生成，请点击下载链接保存。');
 }catch(e){revoke();status('生成失败：'+e.message);}finally{busy=false;state();}};
state();

if(purposeMode){
 $('fontSize').value='18';$('opacity').value='30';$('position').closest('label').hidden=true;$('pageNumbers').closest('label').hidden=true;
 $('markText').closest('label').hidden=true;$('date').value=new Date().toLocaleDateString('sv-SE');
 const update=()=>{$('markText').value=`仅供${$('recipient').value.trim()||'指定接收方'}办理${$('purpose').value.trim()||'指定用途'}使用 · ${$('date').value}`;revoke();clearTimeout(timer);timer=setTimeout(()=>renderPages(),200);};
 ['recipient','purpose','date'].forEach(id=>$(id).oninput=update);update();
}
