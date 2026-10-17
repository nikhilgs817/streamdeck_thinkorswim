import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFileSync,existsSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {WebSocketServer} from 'ws';
import {Resvg} from '@resvg/resvg-js';
import {keySvg,THEMES} from '../shared/icons.js';
const config=JSON.parse(readFileSync('companion.config.json'));
const sd=join(process.cwd(),'plugins',config.id,config.uuid+'.sdPlugin');
const manifest=JSON.parse(readFileSync(join(sd,'manifest.json'))),temp=mkdtempSync(join(tmpdir(),'companion-test-')),log=join(temp,'commands.jsonl');
const socketServer=new WebSocketServer({port:0}),received=[];let socket;
socketServer.on('connection',s=>{socket=s;s.on('message',raw=>{const m=JSON.parse(raw);received.push(m);if(m.event==='getGlobalSettings')s.send(JSON.stringify({event:'didReceiveGlobalSettings',payload:{settings:{}}}));});});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const wait=async pred=>{for(let i=0;i<400;i++){if(pred())return;await sleep(20);}throw Error('SDK event timed out');};
const send=m=>socket.send(JSON.stringify(m));
const info={application:{font:'Segoe UI',language:'en',platform:'windows',platformVersion:'10.0.22631',version:'7.6.0.0'},colors:{},devicePixelRatio:2,devices:[{id:'TEST',name:'Stream Deck',size:{columns:5,rows:3},type:0}],plugin:{uuid:config.uuid,version:config.version}};
const proc=spawn(process.execPath,[join(sd,'bin/plugin.js'),'-port',String(socketServer.address().port),'-pluginUUID',config.uuid,'-registerEvent','registerPlugin','-info',JSON.stringify(info)],{cwd:sd,env:{...process.env,DAILYOPS_DRYRUN:'1',DAILYOPS_DRYRUN_LOG:log,DAILYOPS_COMPANION_PIPE:process.platform==='win32'?'\\\\.\\pipe\\companion-test-'+process.pid:join(temp,'test.sock')},stdio:['ignore','pipe','pipe']});
let output='';proc.stdout.on('data',d=>output+=d);proc.stderr.on('data',d=>output+=d);
const commands=()=>existsSync(log)?readFileSync(log,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];
let count=0;const check=(name,condition)=>{assert.ok(condition,name);console.log('PASS '+name);count++;};
try{
 await wait(()=>received.some(m=>m.event==='registerPlugin'));
 check('registers with Stream Deck',true);
 check('all configured actions are in the manifest',manifest.Actions.length===config.commands.length);
 check('editable bundled profile exists',manifest.Profiles[0].Readonly===false&&existsSync(join(sd,config.profile+'.streamDeckProfile')));
 for(const [i,command] of config.commands.entries()){
  const payload={settings:{},coordinates:{column:i%5,row:Math.floor(i/5)},controller:'Keypad',isInMultiAction:false,state:0};
  send({event:'willAppear',action:config.uuid+'.'+command.id,context:command.id,device:'TEST',payload});
 }
 await wait(()=>received.filter(m=>m.event==='setImage').length>=config.commands.length*2);
 for(const command of config.commands){
  const images=received.filter(m=>m.event==='setImage'&&m.context===command.id).map(m=>m.payload.image);
  check(command.id+' renders and animates',images.length>=2&&new Set(images).size>1);
  const needsBinding=!command.operation&&!command.shortcut&&!command.menu;
  if(needsBinding){
   const alerts=received.filter(m=>m.event==='showAlert').length,beforeEmpty=commands().length;
   send({event:'keyDown',action:config.uuid+'.'+command.id,context:command.id,device:'TEST',payload:{settings:{},coordinates:{column:0,row:0},controller:'Keypad',isInMultiAction:false,state:0}});
   await wait(()=>received.filter(m=>m.event==='showAlert').length>alerts);check(command.id+' requests configuration instead of sending an unknown key',commands().length===beforeEmpty);
  }
  const before=commands().length,payload={settings:needsBinding?{shortcut:'Ctrl+Shift+X'}:{},coordinates:{column:0,row:0},controller:'Keypad',isInMultiAction:false,state:0};
  send({event:'keyDown',action:config.uuid+'.'+command.id,context:command.id,device:'TEST',payload});
  if(command.operation==='back')await wait(()=>received.some(m=>m.event==='switchToProfile'));
  else{await wait(()=>commands().length>before);const sent=commands().at(-1);check(command.id+' targets the verified app',sent.data.selector.names.join('|')===config.selector.names.join('|'));if(command.menu)check(command.id+' uses accessible navigation',JSON.stringify(sent.data.menu)===JSON.stringify(command.menu));if(command.shortcut)check(command.id+' uses a keyboard binding',typeof sent.data.keys==='string'&&sent.data.keys.length>0);}
 }
 const last=config.commands.find(c=>c.shortcut),before=commands().length;
 send({event:'keyDown',action:config.uuid+'.'+last.id,context:last.id,device:'TEST',payload:{settings:{shortcut:'Ctrl+Shift+X'},coordinates:{column:0,row:0},controller:'Keypad',isInMultiAction:false,state:0}});
 await wait(()=>commands().length>before);check('custom shortcut overrides the built-in command',commands().at(-1).data.keys==='^+x');
 for(const style of ['neon','vivid','pro'])for(const command of config.commands){
  const render=phase=>new Resvg(keySvg({glyph:command.glyph,theme:command.theme,label:command.name,style,motion:{kind:'comp-'+command.id,phase}})).render().pixels;
  check(command.id+' '+style+' has visible motion and a seamless boundary',!Buffer.from(render(0)).equals(Buffer.from(render(.25)))&&Buffer.from(render(0)).equals(Buffer.from(render(1))));
 }
 check('29 colour themes available',Object.keys(THEMES).length===29);
 check('no default command submits or cancels a trade',!config.commands.some(c=>/buy|sell|submit|cancel order|flatten/i.test(c.name)));
 console.log(`${count} checks passed for ${config.app}`);
}catch(error){console.error(output.slice(-1800));throw error;}finally{proc.kill();socketServer.close();}
