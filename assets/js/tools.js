(() => {
'use strict';
const T=window.ZiruT||((s,...a)=>String(s).replace(/\{(\d+)\}/g,(m,i)=>a[i]===undefined?m:String(a[i])));   // UI text by page language (assets/js/lang.js)
const $ = id => document.getElementById(id);
const requested=document.body.dataset.toolMode||new URLSearchParams(location.search).get('mode');const mode=['pdf','resize','ico'].includes(requested)?requested:'pdf';
const names = {pdf:T('图片转 PDF'),resize:T('图片缩放'),ico:T('PNG 转 ICO')};
$('toolTitle').textContent = names[mode];
$('toolHint').textContent = mode === 'pdf' ? T('每张图片一页；使用上移、下移调整顺序。') : mode === 'ico' ? T('生成包含七种尺寸的图标，保留透明背景。') : T('保持图片比例，设置最长边后生成 PNG。');
$('resizeOptions').hidden = mode !== 'resize';
if (mode === 'ico') $('files').accept = 'image/png';
let items = [], urls = [], busy = false, revision = 0;
const status = message => $('status').textContent = message;
function clearResults(){urls.forEach(URL.revokeObjectURL);urls=[];$('results').replaceChildren();}
function render(){
 $('fileList').replaceChildren();
 items.forEach((item,index) => {
 const row = document.createElement('div'); row.className = 'file-row';
 const img = document.createElement('img'); img.src = mode==='resize' ? canvasFor(canvasFor(item.bitmap,Math.max(16,Math.min(4096,Number($('maxSize').value)||1600))),160).toDataURL('image/png') : item.preview; img.alt = T('处理预览');
 const label = document.createElement('span'); label.textContent = `${index+1}. ${item.file.name} · ${item.bitmap.width} × ${item.bitmap.height}`;
 row.append(img,label);
 [['上移',-1],['下移',1],['移除',0]].forEach(([text,delta]) => {
 const b = document.createElement('button');b.type='button';b.textContent=T(text);b.disabled=busy || (delta && (index+delta<0 || index+delta>=items.length));
 b.onclick=()=>{clearResults();if(delta)[items[index],items[index+delta]]=[items[index+delta],items[index]];else {item.bitmap.close();items.splice(index,1);}render();};row.append(b);
 });$('fileList').append(row);
 });$('run').disabled=busy || !items.length;$('files').disabled=busy;$('clear').disabled=busy;
}
function canvasFor(bitmap,size,white=false,square=false){
 const c=document.createElement('canvas');let scale=Math.min(1,size/Math.max(bitmap.width,bitmap.height));
 c.width=square?size:Math.max(1,Math.round(bitmap.width*scale));c.height=square?size:Math.max(1,Math.round(bitmap.height*scale));
 const ctx=c.getContext('2d');if(white){ctx.fillStyle='white';ctx.fillRect(0,0,c.width,c.height);}
 if(square)scale=size/Math.max(bitmap.width,bitmap.height);
 ctx.drawImage(bitmap,(c.width-bitmap.width*scale)/2,(c.height-bitmap.height*scale)/2,bitmap.width*scale,bitmap.height*scale);return c;
}
const blobOf=(canvas,type='image/png',quality)=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error(T('图片编码失败'))),type,quality));
$('files').onchange=async()=>{
 const files=[...$('files').files];if(!files.length)return;
 if(items.length+files.length>20){status(T('每次最多 20 张，请减少所选图片。'));$('files').value='';return;}
 busy=true;const token=++revision;clearResults();render();const errors=[];
 for(const file of files){
 let bitmap;
 try{
 if(file.size>20*1024*1024)throw Error(T('超过 20 MB'));
 if(!(mode==='ico'?['image/png']:['image/png','image/jpeg','image/webp']).includes(file.type))throw Error(T('不支持此格式'));
 bitmap=await createImageBitmap(file);
 if(bitmap.width*bitmap.height>16000000)throw Error(T('超过 1600 万像素'));
 if(token!==revision){bitmap.close();return;}
 const preview=canvasFor(bitmap,160,false,mode==='ico').toDataURL('image/png');items.push({file,bitmap,preview});bitmap=null;
 }catch(e){if(bitmap)bitmap.close();errors.push(T('{0}：{1}',file.name,e.message));}
 }
 busy=false;$('files').value='';render();status(errors.join(T('；')) || T('已选择 {0} 张图片。',items.length));
};
$('maxSize').oninput=()=>{if(!busy){clearResults();render();}};
$('clear').onclick=()=>{revision++;items.forEach(i=>i.bitmap.close());items=[];clearResults();$('files').value='';status('');render();};
function download(blob,name){const url=URL.createObjectURL(blob);urls.push(url);const a=document.createElement('a');a.href=url;a.download=name;a.textContent=T('下载 {0}',name);$('results').append(a);}
async function ico(bitmap){
 const parts=[];for(const size of [16,24,32,48,64,128,256])parts.push({size,bytes:new Uint8Array(await (await blobOf(canvasFor(bitmap,size,false,true))).arrayBuffer())});
 const header=new Uint8Array(6+16*parts.length);const v=new DataView(header.buffer);v.setUint16(2,1,true);v.setUint16(4,parts.length,true);let offset=header.length;
 parts.forEach((p,i)=>{const o=6+i*16;header[o]=header[o+1]=p.size===256?0:p.size;v.setUint16(o+4,1,true);v.setUint16(o+6,32,true);v.setUint32(o+8,p.bytes.length,true);v.setUint32(o+12,offset,true);offset+=p.bytes.length;});return new Blob([header,...parts.map(p=>p.bytes)],{type:'image/x-icon'});
}
async function pdf(){
 const encoder=new TextEncoder(),chunks=[],offsets=[0];let length=0;
 const append=x=>{const bytes=typeof x==='string'?encoder.encode(x):x;chunks.push(bytes);length+=bytes.length;};
 const object=(id,content)=>{offsets[id]=length;append(`${id} 0 obj\n`);append(content);append('\nendobj\n');};
 append('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,`<< /Type /Pages /Count ${items.length} /Kids [${items.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] >>`);
 for(let i=0;i<items.length;i++){
 const c=canvasFor(items[i].bitmap,2400,true);const bytes=new Uint8Array(await (await blobOf(c,'image/jpeg',.9)).arrayBuffer());const id=3+i*3;const w=(c.width*.75).toFixed(2),h=(c.height*.75).toFixed(2);
 object(id,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Img ${id+1} 0 R >> >> /Contents ${id+2} 0 R >>`);
 offsets[id+1]=length;append(`${id+1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`);append(bytes);append('\nendstream\nendobj\n');
 const stream=`q\n${w} 0 0 ${h} 0 0 cm\n/Img Do\nQ\n`;object(id+2,`<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}endstream`);
 }
 const start=length;append(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);offsets.slice(1).forEach(o=>append(`${String(o).padStart(10,'0')} 00000 n \n`));append(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`);return new Blob(chunks,{type:'application/pdf'});
}
$('run').onclick=async()=>{
 if(busy||!items.length)return;
 const size=Number($('maxSize').value);if(mode==='resize'&&(!Number.isInteger(size)||size<16||size>4096)){status(T('最长边请输入 16–4096 的整数。'));return;}
 busy=true;clearResults();render();status(T('正在本地处理…'));
 try{
 if(mode==='pdf')download(await pdf(),'images.pdf');else for(const [index,item] of items.entries()){
 const stem=item.file.name.replace(/\.[^.]+$/,'').replace(/[\\/:*?"<>|]/g,'_');
 download(mode==='ico'?await ico(item.bitmap):await blobOf(canvasFor(item.bitmap,size)),`${index+1}-${stem}.${mode==='ico'?'ico':'png'}`);
 }status(T('已生成，请点击下载链接保存。'));
 }catch(e){clearResults();status(T('处理失败：{0}',e.message));}finally{busy=false;render();}
};
window.addEventListener('pagehide',()=>{items.forEach(i=>i.bitmap.close());clearResults();});
})();
