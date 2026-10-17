import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {Resvg} from '@resvg/resvg-js';
import {keySvg} from '../shared/icons.js';
const config=JSON.parse(readFileSync('companion.config.json'));
mkdirSync('test-output/preview',{recursive:true});mkdirSync('docs/images',{recursive:true});
for(let frame=0;frame<72;frame++){
 let body='<rect width="790" height="520" rx="24" fill="#10131c"/><text x="28" y="35" font-family="Segoe UI" font-size="21" font-weight="600" fill="#f4f5fa">'+config.app.replaceAll('&','&amp;')+' Controls</text>';
 for(const [i,command] of config.commands.slice(0,15).entries()){
  const x=28+(i%5)*150,y=60+Math.floor(i/5)*150,svg=keySvg({glyph:command.glyph,theme:command.theme,label:command.name,style:'vivid',motion:{kind:'comp-'+command.id,phase:frame/72}});
  body+=`<defs><clipPath id="tile${i}"><rect x="${x}" y="${y}" width="134" height="134" rx="18"/></clipPath></defs><g clip-path="url(#tile${i})"><g transform="translate(${x} ${y}) scale(${134/144})">${svg}</g></g>`;
 }
 const bytes=new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="790" height="520">${body}</svg>`,{font:{loadSystemFonts:false,...(process.platform==='win32'?{fontFiles:[process.env.WINDIR+'/Fonts/segoeuib.ttf']}:{})}}).render().asPng();
 writeFileSync(join('test-output/preview',`frame-${String(frame).padStart(3,'0')}.png`),bytes);if(!frame)writeFileSync('docs/images/deck.png',bytes);
}
console.log('Rendered 72 frames for '+config.app);
