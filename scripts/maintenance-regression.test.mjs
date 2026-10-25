// V1.2 确定性回归；隔离夹具与现有仓库只读 Git 对象，不提交或调用模型。
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import * as V from './validate-config.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const temp=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'tl-v12-checkers-')));
const citationParent=path.join(root,'.task-lifecycle');fs.mkdirSync(citationParent,{recursive:true});
const citationTemp=fs.realpathSync(fs.mkdtempSync(path.join(citationParent,'tl-v12-citations-')));
const owns=p=>[temp,citationTemp].some(base=>{const r=path.relative(base,path.resolve(p));return r!==''&&!r.startsWith('..'+path.sep)&&r!=='..'&&!path.isAbsolute(r);});
let serial=0;
function dir(label='case'){const p=path.join(temp,String(++serial)+'-'+label);fs.mkdirSync(p,{recursive:true});return p;}
function put(p,s){assert.ok(owns(p));fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);}
after(()=>{assert.equal(path.dirname(temp),fs.realpathSync(os.tmpdir()));assert.ok(path.basename(temp).startsWith('tl-v12-checkers-'));fs.rmSync(temp,{recursive:true});});
after(()=>{assert.equal(path.dirname(citationTemp),fs.realpathSync(citationParent));assert.ok(path.basename(citationTemp).startsWith('tl-v12-citations-'));fs.rmSync(citationTemp,{recursive:true});});
const run=(script,args=[],cwd=root)=>spawnSync(process.execPath,[script,...args],{cwd,encoding:'utf8',timeout:10000});
function docs(label='plain',newline='\n',omit=''){
  const d=dir(label);
  const texts={'skills/task-lifecycle/SKILL.md':'---\nname: sample\ndescription: '+('x'.repeat(210))+'\n---\n# Example\n\n[Anchor](#example)\n','docs/a.md':'# Doc\n','README.md':'# Readme\n','CHANGELOG.md':'# Changes\n'};
  for(const [n,s] of Object.entries(texts))if(n!==omit && !n.startsWith(omit+'/'))put(path.join(d,n),s.replaceAll('\n',newline));
  fs.mkdirSync(path.join(d,'scripts'),{recursive:true});
  fs.copyFileSync(path.join(root,'scripts/check-docs.mjs'),path.join(d,'scripts/check-docs.mjs'));
  return d;
}
const checkDocs=d=>run(path.join(d,'scripts/check-docs.mjs'),[],temp);
test('T43/T49/T50 特殊路径和LF/CRLF，cwd不影响4文件扫描',()=>{
  for(const name of ['ascii','with space','中文','percent%','hash#'])for(const nl of ['\n','\r\n']){
    const r=checkDocs(docs(name,nl));assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/检查 4 个/);
  }
});
test('T44 必需目标及入口缺失不能零扫描假绿',()=>{
  for(const absent of ['skills/task-lifecycle','docs','README.md','CHANGELOG.md','skills/task-lifecycle/SKILL.md']){
    const r=checkDocs(docs('missing','\n',absent));assert.notEqual(r.status,0,absent);assert.doesNotMatch(r.stdout,/^OK/);
  }
  for(const name of ['skills/task-lifecycle/SKILL.md','README.md','CHANGELOG.md']){
    const d=docs('empty');put(path.join(d,name),'');assert.equal(checkDocs(d).status,1,name);
  }
  const d=docs('unreadable'),target=path.join(d,'README.md'),preload=path.join(d,'deny-read.mjs');
  put(preload,'import fs from "node:fs";const read=fs.readFileSync;fs.readFileSync=(p,...a)=>{if(p==='+JSON.stringify(target)+'){const e=Error("fixture EACCES");e.code="EACCES";throw e;}return read(p,...a);};');
  const denied=run('--import',[pathToFileURL(preload).href,path.join(d,'scripts/check-docs.mjs')]);
  assert.equal(denied.status,1);assert.match(denied.stderr,/读取失败/);assert.doesNotMatch(denied.stdout,/^OK/);
});
test('T49/T52 原长行、链接、锚点和内部引用断言保留',()=>{
  for(const nl of ['\n','\r\n']){
    const d=docs('boundaries',nl);put(path.join(d,'docs/a.md'),'a'.repeat(200)+nl);assert.equal(checkDocs(d).status,0);
    for(const bad of ['a'.repeat(201),'[bad](missing.md)','[bad](#absent)','\`references/不存在.md\`']){
      put(path.join(d,'docs/a.md'),bad+nl);assert.equal(checkDocs(d).status,1,bad);
    }
  }
});
test('T51 compare保持字节/集合，缺参exit2，未知参数不夹带变化',()=>{
  const d=docs(),script=path.join(d,'scripts/check-docs.mjs'),other=dir('copy');
  fs.cpSync(path.join(d,'skills/task-lifecycle'),other,{recursive:true});assert.equal(run(script,['--compare',other]).status,0);
  put(path.join(other,'extra.md'),'# extra\n');assert.equal(run(script,['--compare',other]).status,1);
  const exact=dir('newline');fs.cpSync(path.join(d,'skills/task-lifecycle'),exact,{recursive:true});
  put(path.join(exact,'SKILL.md'),fs.readFileSync(path.join(exact,'SKILL.md'),'utf8').replaceAll('\n','\r\n'));
  assert.equal(run(script,['--compare',exact]).status,1);assert.equal(run(script,['--compare']).status,2);
  assert.notEqual(run(script,['--compare',path.join(temp,'absent')]).status,0);assert.equal(run(script,['--unknown']).status,0);
});
const cite=path.join(root,'scripts/check-citations.mjs');
const rel='skills/task-lifecycle/references/任务识别与合法路由.md';
const rev=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
function cited(text){const p=path.join(citationTemp,String(++serial)+'.md');fs.writeFileSync(p,text);return p;}
test('T61 标准格式和UNCHECKED不改变逐项stdout，汇总写stderr',()=>{
  const f=cited('\`'+rel+':1\` 「# 任务识别与合法路由」\n\`'+rel+'\` 第 1 行\n');
  const r=run(cite,['--root',root,f]);assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/^OK\t/);assert.match(r.stdout,/\nUNCHECKED\t/);assert.match(r.stderr,/recognized=2/);assert.match(r.stderr,/unchecked=1/);
});
test('T61 每个输入零识别都失败，不以其他文件命中抵消',()=>{
  const good=cited('\`'+rel+':1\` 「# 任务识别与合法路由」\n'),plain=cited(rel+':999 「bad」\n');
  const r=run(cite,['--root',root,good,plain]);assert.equal(r.status,1);assert.match(r.stderr,/recognized=0/);
  assert.equal(run(cite,['--root',root,plain]).status,1);
});
test('T62 冻结路径只读文件blob，正确相对引用通过而commit头伪引文失败',()=>{
  const f=cited(''),relative=path.relative(path.dirname(f),path.join(root,rel)).split(path.sep).join('/');
  put(f,'\`'+relative+':1\` 「# 任务识别与合法路由」\n');
  assert.equal(run(cite,['--root',root,'--rev',rev,f]).status,0);
  put(f,'\`'+relative+':1\` 「commit '+rev+'」\n');assert.equal(run(cite,['--root',root,'--rev',rev,f]).status,1);
  for(const p of ['skills','../../outside']){put(f,'\`'+p+':1\` 「x」\n');assert.equal(run(cite,['--root',root,'--rev',rev,f]).status,1);}
});
test('T62 工作区模式与无效参数保持',()=>{
  const f=cited('\`'+rel+':1\` 「# 任务识别与合法路由」\n');
  assert.equal(run(cite,['--root',root,f],temp).status,0);
  assert.equal(run(cite,['--rev','not-a-real-ref',f]).status,2);assert.equal(run(cite,['--root']).status,2);
});
test('T62 冻结引用拒收绝对/父级路径与合法技能回退目标的碰撞',()=>{
  for(const [p,s] of [['/references/任务识别与合法路由.md','# 任务识别与合法路由'],['../../README.md','# DevCodex Task Lifecycle'],['templates/../../../README.md','# DevCodex Task Lifecycle']]){
    // 多一层目录，使 ../../README.md 不再恰好是合法的仓库根引用。
    const f=path.join(citationTemp,'nested',String(++serial)+'.md');put(f,'`'+p+':1` 「'+s+'」\n');
    const r=run(cite,['--root',root,'--rev',rev,f]);
    assert.equal(r.status,1,r.stdout);assert.match(r.stdout,/^NOFILE\t/);
    // 只收紧冻结模式，既有工作区别名查找行为保持。
    assert.equal(run(cite,['--root',root,f]).status,0);
  }
});
test('T62 冻结引用保留根相对、报告相对、技能短名和POSIX仓库内绝对路径',()=>{
  const f=cited(''),relative=path.relative(path.dirname(f),path.join(root,rel)).split(path.sep).join('/');
  const paths=[rel,relative,'references/任务识别与合法路由.md','任务识别与合法路由.md'];
  paths.push('templates/../references/任务识别与合法路由.md','templates/../references/./任务识别与合法路由.md');
  if(process.platform==='win32')paths.push('templates\\..\\references\\任务识别与合法路由.md');
  // 现有引用语法不支持含盘符冒号；不借此测试扩展该语法。
  if(process.platform!=='win32')paths.push(path.join(root,rel));
  for(const p of paths){
    put(f,'`'+p+':1` 「# 任务识别与合法路由」\n');
    const r=run(cite,['--root',root,'--rev',rev,f]);assert.equal(r.status,0,r.stdout+r.stderr);
  }
});
function config(){
  const d=dir('config'),home=path.join(d,'home'),record=path.join(d,'evidence.md');put(record,'# Source\n');
  const obj={schemaVersion:1,approvalSource:{messageId:'t1u',quote:'测试用设置',record},delegation:{enabled:false}};
  put(path.join(home,'.config/task-lifecycle/config.json'),JSON.stringify(obj));return {d,home,record,obj};
}
test('T75/T76 HOME环境分支与真实输出；不读真实账户配置',()=>{
  const f=config(),deps={userInfo:()=>({homedir:f.home}),scriptPath:path.join(root,'scripts/validate-config.mjs')};
  const missing=V.validate([],{}, {...deps,platform:'win32'});assert.equal(missing.status,'valid',JSON.stringify(missing.reasons));assert.equal(missing.env.home,'');
  for(const platform of ['win32','linux']){
    for(const HOME of ['',f.home+'-other'])assert.equal(V.validate([],{HOME},{...deps,platform}).status,'disabled');
    assert.equal(V.validate([],{HOME:f.home},{...deps,platform}).status,'valid');
    assert.equal(V.validate([],{}, {...deps,platform,userInfo:()=>{throw Error('unavailable');}}).status,'disabled');
  }
  assert.equal(V.validate([],{}, {...deps,platform:'linux'}).status,'disabled');
});
test('T77 插件内配置拒收、同级前缀可用、安全legacy可读',()=>{
  const f=config(),base={userInfo:()=>({homedir:f.home}),platform:process.platform};
  assert.equal(V.validate([],{HOME:f.home},{...base,scriptPath:path.join(f.home,'.config/scripts/validate-config.mjs')}).status,'disabled');
  assert.equal(V.validate([],{HOME:f.home},{...base,scriptPath:path.join(f.home+'.other','scripts/validate-config.mjs')}).status,'valid');
  const ws=path.join(f.d,'ws');put(path.join(ws,'.task-lifecycle/工作区约定.md'),'执行时默认采用 fast\n');
  const r=V.validate(['--workspace',ws,'--project-id','P1'],{HOME:f.home},{...base,scriptPath:path.join(root,'scripts/validate-config.mjs')});
  assert.equal(r.status,'valid');assert.equal(r.legacy[0].kind,'depth-execution-default');
});
test('T77 路径组件边界：Windows与POSIX纯函数不代表跨平台实跑',()=>{
  for(const api of [path.win32,path.posix]){
    const prefix=api===path.win32?'C:\\project':'/project';
    assert.equal(V.underPrefix(prefix,prefix,api),true);assert.equal(V.underPrefix(api.join(prefix,'a'),prefix,api),true);
    assert.equal(V.underPrefix(prefix+'-sibling',prefix,api),false);assert.equal(V.underPrefix(api.dirname(prefix),prefix,api),false);
    assert.equal(V.underPrefix(prefix,api.parse(prefix).root,api),true);assert.equal(V.underPrefix(api.join(prefix,'a'),prefix+api.sep,api),true);
  }
  assert.equal(V.underPrefix('D:\\project\\a','C:\\project',path.win32),false);
});
test('T78 enabled结构及不同用途保持独立',()=>{
  const f=config();f.obj.review={enabled:true,fallback:{...V.REVIEW_FALLBACK},hosts:[{command:'codex',id:'codex-cli'}]};
  put(path.join(f.home,'.config/task-lifecycle/config.json'),JSON.stringify(f.obj));
  const r=V.validate([],{HOME:f.home},{userInfo:()=>({homedir:f.home})});
  assert.equal(r.status,'valid');assert.deepEqual(r.effective.review.enabled,{sourceLayer:'global',value:true});
  assert.deepEqual(r.effective.delegation.enabled,{sourceLayer:'global',value:false});
});

test('T75 包装器JavaScript逻辑：成功/失败/缺脚本/缺Node/真实30秒超时', {timeout:40000},()=>{
  const protocol=fs.readFileSync(path.join(root,'skills/task-lifecycle/references/任务拆分并行与整合.md'),'utf8');
  const wrapper=protocol.match(/^node -e "([^"]+)" /m)?.[1];assert.ok(wrapper,'实际文档必须提供包装命令');
  const invoke=args=>spawnSync(process.execPath,['-e',wrapper,'--',...args],{encoding:'utf8',timeout:35000});
  const ok=invoke(['-e','process.stdout.write("ok");']);assert.equal(ok.status,0);assert.equal(ok.stdout,'ok');
  const failed=invoke(['-e','process.stderr.write("bad");process.exit(2);']);assert.equal(failed.status,2);assert.equal(failed.stderr,'bad');
  const missing=invoke([path.join(temp,'missing-validator.mjs')]);assert.equal(missing.status,1);assert.match(missing.stderr,/MODULE_NOT_FOUND/);
  assert.equal(spawnSync(path.join(temp,'missing-node.exe'),[]).error.code,'ENOENT');
  const start=Date.now(),timed=invoke(['-e','process.stdout.write(String(process.pid));setInterval(()=>{},1000);']);
  assert.equal(timed.status,1);assert.match(timed.stderr,/ETIMEDOUT/);assert.ok(Date.now()-start>=29000&&Date.now()-start<35000);
  const pid=Number(timed.stdout);assert.ok(pid>0);assert.throws(()=>process.kill(pid,0),e=>e.code==='ESRCH');
  console.log('30秒包装验证：子进程 '+pid+' 已退出；未修改长期环境，未启动服务端口。');
});

test('T75 Windows PowerShell原样文档入口及30秒子进程清理', {skip:process.platform!=='win32',timeout:50000},()=>{
  const shell=path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe');
  assert.ok(fs.existsSync(shell),'Windows支持面必须提供实际PowerShell入口');
  const protocol=fs.readFileSync(path.join(root,'skills/task-lifecycle/references/任务拆分并行与整合.md'),'utf8');
  const line=protocol.match(/^node -e .+$/m)?.[0];assert.ok(line);
  const d=dir('PowerShell with space 中文'),script=path.join(d,'scripts/validate-config.mjs');
  const ws=path.join(d,'workspace with space'),project='fixture-project';
  const entry=line.replace('<插件根>',d.replaceAll('\\','/')).replace('<绑定项目根的父目录>',ws.replaceAll('\\','/')).replace('<绑定 Project ID>',project);
  const env={...process.env};for(const key of Object.keys(env))if(key.toLowerCase()==='path')delete env[key];
  env.Path=path.dirname(process.execPath)+path.delimiter+(process.env.Path??process.env.PATH??'');
  const invoke=(missingNode=false)=>spawnSync(shell,['-NoLogo','-NoProfile','-NonInteractive','-Command',entry+(missingNode?'':'\nexit $LASTEXITCODE')],
    {cwd:d,env:{...env,...(missingNode?{Path:''}:{})},encoding:'utf8',timeout:40000});
  put(script,'import assert from "node:assert/strict";assert.deepEqual(process.argv.slice(2),'+JSON.stringify(['--workspace',ws.replaceAll('\\','/'),'--project-id',project])+');process.stdout.write("ok");');
  const ok=invoke();assert.equal(ok.status,0,ok.stderr);assert.equal(ok.stdout,'ok');
  put(script,'process.stderr.write("bad");process.exit(2);');const failed=invoke();assert.equal(failed.status,2);assert.match(failed.stderr,/bad/);
  fs.unlinkSync(script);const missing=invoke();assert.equal(missing.status,1);assert.match(missing.stderr,/MODULE_NOT_FOUND/);
  const noNode=invoke(true);assert.notEqual(noNode.status,0);assert.match(noNode.stderr,/CommandNotFoundException/);
  put(script,'process.stdout.write(String(process.pid));setInterval(()=>{},1000);');
  const started=Date.now(),timed=invoke();assert.equal(timed.status,1);assert.match(timed.stderr,/ETIMEDOUT/);
  assert.ok(Date.now()-started>=29000&&Date.now()-started<40000);const pid=Number(timed.stdout.trim());
  assert.ok(pid>0);assert.throws(()=>process.kill(pid,0),e=>e.code==='ESRCH');
  console.log('PowerShell原文命令：成功/exit2/缺脚本/缺Node/30秒超时通过，子进程 '+pid+' 已退出。');
});

test('T76 输入schema支持两平台绝对路径，仍拒绝相对路径',()=>{
  const re=new RegExp(V.buildSchemaDefs().approvalSource.properties.record.pattern);
  for(const p of ['/home/me/a.md','C:/Users/me/a.md','C:\\Users\\me\\a.md','\\\\server\\share\\a.md'])assert.ok(re.test(p),p);
  for(const p of ['relative.md','C:relative.md','/home/me/a.txt'])assert.ok(!re.test(p),p);
});
