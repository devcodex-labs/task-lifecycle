// V1.2 deterministic regression; isolated fixtures and read-only Git objects of the existing repo; no commits, no model calls.
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
test('T43/T49/T50 special paths and LF/CRLF, cwd does not affect the 4-file scan',()=>{
  for(const name of ['ascii','with space','中文','percent%','hash#'])for(const nl of ['\n','\r\n']){
    const r=checkDocs(docs(name,nl));assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/checked 4 \.md/);
  }
});
test('T44 missing required targets or entry cannot pass green with zero scanned',()=>{
  for(const absent of ['skills/task-lifecycle','docs','README.md','CHANGELOG.md','skills/task-lifecycle/SKILL.md']){
    const r=checkDocs(docs('missing','\n',absent));assert.notEqual(r.status,0,absent);assert.doesNotMatch(r.stdout,/^OK/);
  }
  for(const name of ['skills/task-lifecycle/SKILL.md','README.md','CHANGELOG.md']){
    const d=docs('empty');put(path.join(d,name),'');assert.equal(checkDocs(d).status,1,name);
  }
  const d=docs('unreadable'),target=path.join(d,'README.md'),preload=path.join(d,'deny-read.mjs');
  put(preload,'import fs from "node:fs";const read=fs.readFileSync;fs.readFileSync=(p,...a)=>{if(p==='+JSON.stringify(target)+'){const e=Error("fixture EACCES");e.code="EACCES";throw e;}return read(p,...a);};');
  const denied=run('--import',[pathToFileURL(preload).href,path.join(d,'scripts/check-docs.mjs')]);
  assert.equal(denied.status,1);assert.match(denied.stderr,/read failed/);assert.doesNotMatch(denied.stdout,/^OK/);
});
test('T49/T52 original long-line, link, anchor and internal-reference assertions kept',()=>{
  for(const nl of ['\n','\r\n']){
    const d=docs('boundaries',nl);put(path.join(d,'docs/a.md'),'a'.repeat(200)+nl);assert.equal(checkDocs(d).status,0);
    for(const bad of ['a'.repeat(201),'[bad](missing.md)','[bad](#absent)','\`references/does-not-exist.md\`']){
      put(path.join(d,'docs/a.md'),bad+nl);assert.equal(checkDocs(d).status,1,bad);
    }
  }
});
test('T53 length caps SKILL≤300 references≤500',()=>{
  const d=docs('limits');
  // fixture SKILL is short and references are absent → should pass
  assert.equal(checkDocs(d).status,0);
  // build an over-limit SKILL.md (301 lines)
  const skill=path.join(d,'skills/task-lifecycle/SKILL.md');
  put(skill,'---\nname: sample\ndescription: ok\n---\n'+Array.from({length:297},(_,i)=>`# L${i}`).join('\n')+'\n');
  let r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/SKILL\.md: line count/);
  // restore a valid SKILL, build an over-limit reference
  put(skill,'---\nname: sample\ndescription: ok\n---\n# Example\n');
  const ref=path.join(d,'skills/task-lifecycle/references');fs.mkdirSync(ref,{recursive:true});
  put(path.join(ref,'big.md'),Array.from({length:501},(_,i)=>`# R${i}`).join('\n')+'\n');
  r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/references\/big\.md: line count/);
  // boundary: 500 lines passes
  put(path.join(ref,'big.md'),Array.from({length:500},(_,i)=>`# R${i}`).join('\n')+'\n');
  assert.equal(checkDocs(d).status,0);
});
test('T51 compare keeps bytes/sets, missing arg exits 2, unknown args carry no change',()=>{
  const d=docs(),script=path.join(d,'scripts/check-docs.mjs'),other=dir('copy');
  fs.cpSync(path.join(d,'skills/task-lifecycle'),other,{recursive:true});assert.equal(run(script,['--compare',other]).status,0);
  put(path.join(other,'extra.md'),'# extra\n');assert.equal(run(script,['--compare',other]).status,1);
  const exact=dir('newline');fs.cpSync(path.join(d,'skills/task-lifecycle'),exact,{recursive:true});
  put(path.join(exact,'SKILL.md'),fs.readFileSync(path.join(exact,'SKILL.md'),'utf8').replaceAll('\n','\r\n'));
  assert.equal(run(script,['--compare',exact]).status,1);assert.equal(run(script,['--compare']).status,2);
  assert.notEqual(run(script,['--compare',path.join(temp,'absent')]).status,0);assert.equal(run(script,['--unknown']).status,0);
});
const cite=path.join(root,'scripts/check-citations.mjs');
const rel='skills/task-lifecycle/references/task-recognition-and-routing.md';
// Frozen-mode tests need a commit containing the current files. Use HEAD when it already has them; otherwise build an
// unreferenced snapshot commit (temp index, HEAD tree + working-tree blobs of the files used here). No ref, index or branch changes.
function frozenRev(){
  const git=(a,env)=>execFileSync('git',['-C',root,...a],{encoding:'utf8',env:{...process.env,...env}}).trim();
  const head=git(['rev-parse','HEAD']);
  const need=[rel,'README.md'];
  if(need.every(f=>{try{git(['cat-file','-e',head+':'+f]);return git(['rev-parse',head+':'+f])===git(['hash-object',f]);}catch{return false;}}))return head;
  const idx=path.join(temp,'snapshot-index'),env={GIT_INDEX_FILE:idx};
  git(['read-tree',head],env);
  for(const f of need)git(['update-index','--add','--cacheinfo','100644,'+git(['hash-object','-w',f])+','+f],env);
  const tree=git(['write-tree'],env);
  return git(['commit-tree',tree,'-p',head,'-m','check-citations frozen-mode test snapshot (unreferenced)'],{GIT_AUTHOR_NAME:'test',GIT_AUTHOR_EMAIL:'test@example.invalid',GIT_COMMITTER_NAME:'test',GIT_COMMITTER_EMAIL:'test@example.invalid'});
}
const rev=frozenRev();
function cited(text){const p=path.join(citationTemp,String(++serial)+'.md');fs.writeFileSync(p,text);return p;}
test('T61 standard format and UNCHECKED keep per-item stdout, summary to stderr',()=>{
  const f=cited('\`'+rel+':1\` 「# task-recognition-and-routing」\n\`'+rel+'\` 第 1 行\n');
  const r=run(cite,['--root',root,f]);assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/^OK\t/);assert.match(r.stdout,/\nUNCHECKED\t/);assert.match(r.stderr,/recognized=2/);assert.match(r.stderr,/unchecked=1/);
});
test('T61 each input with zero recognized fails, not offset by hits in other files',()=>{
  const good=cited('\`'+rel+':1\` 「# task-recognition-and-routing」\n'),plain=cited(rel+':999 「bad」\n');
  const r=run(cite,['--root',root,good,plain]);assert.equal(r.status,1);assert.match(r.stderr,/recognized=0/);
  assert.equal(run(cite,['--root',root,plain]).status,1);
});
test('T62 frozen paths read only file blobs; correct relative refs pass, fake quotes from the commit header fail',()=>{
  const f=cited(''),relative=path.relative(path.dirname(f),path.join(root,rel)).split(path.sep).join('/');
  put(f,'\`'+relative+':1\` 「# task-recognition-and-routing」\n');
  assert.equal(run(cite,['--root',root,'--rev',rev,f]).status,0);
  put(f,'\`'+relative+':1\` 「commit '+rev+'」\n');assert.equal(run(cite,['--root',root,'--rev',rev,f]).status,1);
  for(const p of ['skills','../../outside']){put(f,'\`'+p+':1\` 「x」\n');assert.equal(run(cite,['--root',root,'--rev',rev,f]).status,1);}
});
test('T62 working-tree mode and invalid arguments unchanged',()=>{
  const f=cited('\`'+rel+':1\` 「# task-recognition-and-routing」\n');
  assert.equal(run(cite,['--root',root,f],temp).status,0);
  assert.equal(run(cite,['--rev','not-a-real-ref',f]).status,2);assert.equal(run(cite,['--root']).status,2);
});
test('T62 frozen refs reject collisions of absolute/parent paths with valid skill fallback targets',()=>{
  for(const [p,s] of [['/references/task-recognition-and-routing.md','# task-recognition-and-routing'],['../../README.md','# DevCodex Task Lifecycle'],['templates/../../../README.md','# DevCodex Task Lifecycle']]){
    // one extra directory level so ../../README.md is no longer exactly a valid repo-root reference.
    const ln=p.endsWith('README.md')?fs.readFileSync(path.join(root,'README.md'),'utf8').replace(/\r\n/g,'\n').split('\n').indexOf(s)+1:1;
    const f=path.join(citationTemp,'nested',String(++serial)+'.md');put(f,'`'+p+':'+ln+'` 「'+s+'」\n');
    const r=run(cite,['--root',root,'--rev',rev,f]);
    assert.equal(r.status,1,r.stdout);assert.match(r.stdout,/^NOFILE\t/);
    // tighten only frozen mode; existing working-tree alias lookup unchanged.
    assert.equal(run(cite,['--root',root,f]).status,0);
  }
});
test('T62 frozen refs keep root-relative, report-relative, skill short names and POSIX in-repo absolute paths',()=>{
  const f=cited(''),relative=path.relative(path.dirname(f),path.join(root,rel)).split(path.sep).join('/');
  const paths=[rel,relative,'references/task-recognition-and-routing.md','task-recognition-and-routing.md'];
  paths.push('templates/../references/task-recognition-and-routing.md','templates/../references/./task-recognition-and-routing.md');
  if(process.platform==='win32')paths.push('templates\\..\\references\\task-recognition-and-routing.md');
  // the existing reference syntax does not support drive-letter colons; this test does not extend it.
  if(process.platform!=='win32')paths.push(path.join(root,rel));
  for(const p of paths){
    put(f,'`'+p+':1` 「# task-recognition-and-routing」\n');
    const r=run(cite,['--root',root,'--rev',rev,f]);assert.equal(r.status,0,r.stdout+r.stderr);
  }
});
function config(){
  const d=dir('config'),home=path.join(d,'home'),record=path.join(d,'evidence.md');put(record,'# Source\n');
  const obj={schemaVersion:1,approvalSource:{messageId:'t1u',quote:'test setting',record},delegation:{enabled:false}};
  put(path.join(home,'.config/task-lifecycle/config.json'),JSON.stringify(obj));return {d,home,record,obj};
}
test('T75/T76 HOME env branches and real output; real account config not read',()=>{
  const f=config(),deps={userInfo:()=>({homedir:f.home}),scriptPath:path.join(root,'scripts/validate-config.mjs')};
  const missing=V.validate([],{}, {...deps,platform:'win32'});assert.equal(missing.status,'valid',JSON.stringify(missing.reasons));assert.equal(missing.env.home,'');
  for(const platform of ['win32','linux']){
    for(const HOME of ['',f.home+'-other'])assert.equal(V.validate([],{HOME},{...deps,platform}).status,'disabled');
    assert.equal(V.validate([],{HOME:f.home},{...deps,platform}).status,'valid');
    assert.equal(V.validate([],{}, {...deps,platform,userInfo:()=>{throw Error('unavailable');}}).status,'disabled');
  }
  assert.equal(V.validate([],{}, {...deps,platform:'linux'}).status,'disabled');
});
test('T77 in-plugin config rejected, sibling prefix usable, safe legacy readable',()=>{
  const f=config(),base={userInfo:()=>({homedir:f.home}),platform:process.platform};
  assert.equal(V.validate([],{HOME:f.home},{...base,scriptPath:path.join(f.home,'.config/scripts/validate-config.mjs')}).status,'disabled');
  assert.equal(V.validate([],{HOME:f.home},{...base,scriptPath:path.join(f.home+'.other','scripts/validate-config.mjs')}).status,'valid');
  const ws=path.join(f.d,'ws');put(path.join(ws,'.task-lifecycle/工作区约定.md'),'执行时默认采用 fast\n');
  const r=V.validate(['--workspace',ws,'--project-id','P1'],{HOME:f.home},{...base,scriptPath:path.join(root,'scripts/validate-config.mjs')});
  assert.equal(r.status,'valid');assert.equal(r.legacy[0].kind,'depth-execution-default');
});
test('T77 path component boundaries: Windows and POSIX pure functions do not mean cross-platform runs',()=>{
  for(const api of [path.win32,path.posix]){
    const prefix=api===path.win32?'C:\\project':'/project';
    assert.equal(V.underPrefix(prefix,prefix,api),true);assert.equal(V.underPrefix(api.join(prefix,'a'),prefix,api),true);
    assert.equal(V.underPrefix(prefix+'-sibling',prefix,api),false);assert.equal(V.underPrefix(api.dirname(prefix),prefix,api),false);
    assert.equal(V.underPrefix(prefix,api.parse(prefix).root,api),true);assert.equal(V.underPrefix(api.join(prefix,'a'),prefix+api.sep,api),true);
  }
  assert.equal(V.underPrefix('D:\\project\\a','C:\\project',path.win32),false);
});
test('T78 enabled structure and different purposes stay independent',()=>{
  const f=config();f.obj.review={enabled:true,fallback:{...V.REVIEW_FALLBACK},hosts:[{command:'codex',id:'codex-cli'}]};
  put(path.join(f.home,'.config/task-lifecycle/config.json'),JSON.stringify(f.obj));
  const r=V.validate([],{HOME:f.home},{userInfo:()=>({homedir:f.home})});
  assert.equal(r.status,'valid');assert.deepEqual(r.effective.review.enabled,{sourceLayer:'global',value:true});
  assert.deepEqual(r.effective.delegation.enabled,{sourceLayer:'global',value:false});
});

test('T75 wrapper JavaScript logic: success/failure/missing script/missing Node/real 30-second timeout', {timeout:40000},()=>{
  const protocol=fs.readFileSync(path.join(root,'skills/task-lifecycle/references/task-split-parallel-and-integration.md'),'utf8');
  const wrapper=protocol.match(/^node -e "([^"]+)" /m)?.[1];assert.ok(wrapper,'the actual doc must provide the wrapper command');
  const invoke=args=>spawnSync(process.execPath,['-e',wrapper,'--',...args],{encoding:'utf8',timeout:35000});
  const ok=invoke(['-e','process.stdout.write("ok");']);assert.equal(ok.status,0);assert.equal(ok.stdout,'ok');
  const failed=invoke(['-e','process.stderr.write("bad");process.exit(2);']);assert.equal(failed.status,2);assert.equal(failed.stderr,'bad');
  const missing=invoke([path.join(temp,'missing-validator.mjs')]);assert.equal(missing.status,1);assert.match(missing.stderr,/MODULE_NOT_FOUND/);
  assert.equal(spawnSync(path.join(temp,'missing-node.exe'),[]).error.code,'ENOENT');
  const start=Date.now(),timed=invoke(['-e','process.stdout.write(String(process.pid));setInterval(()=>{},1000);']);
  assert.equal(timed.status,1);assert.match(timed.stderr,/ETIMEDOUT/);assert.ok(Date.now()-start>=29000&&Date.now()-start<35000);
  const pid=Number(timed.stdout);assert.ok(pid>0);assert.throws(()=>process.kill(pid,0),e=>e.code==='ESRCH');
  console.log('30-second wrapper check: child process '+pid+' exited; long-term environment not modified, no service port started.');
});

test('T75 Windows PowerShell verbatim doc entry and 30-second child process cleanup', {skip:process.platform!=='win32',timeout:50000},()=>{
  const shell=path.join(process.env.SystemRoot,'System32/WindowsPowerShell/v1.0/powershell.exe');
  assert.ok(fs.existsSync(shell),'the Windows support surface must provide an actual PowerShell entry');
  const protocol=fs.readFileSync(path.join(root,'skills/task-lifecycle/references/task-split-parallel-and-integration.md'),'utf8');
  const line=protocol.match(/^node -e .+$/m)?.[0];assert.ok(line);
  const d=dir('PowerShell with space 中文'),script=path.join(d,'scripts/validate-config.mjs');
  const ws=path.join(d,'workspace with space'),project='fixture-project';
  const entry=line.replace('<plugin root>',d.replaceAll('\\','/')).replace('<parent dir of the bound project root>',ws.replaceAll('\\','/')).replace('<bound Project ID>',project);
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
  console.log('PowerShell verbatim command: success/exit2/missing script/missing Node/30-second timeout passed, child process '+pid+' exited.');
});

test('T76 input schema supports absolute paths on both platforms, still rejects relative paths',()=>{
  const re=new RegExp(V.buildSchemaDefs().approvalSource.properties.record.pattern);
  for(const p of ['/home/me/a.md','C:/Users/me/a.md','C:\\Users\\me\\a.md','\\\\server\\share\\a.md'])assert.ok(re.test(p),p);
  for(const p of ['relative.md','C:relative.md','/home/me/a.txt'])assert.ok(!re.test(p),p);
});
test('T60 manifest shared fields match: plugin.json / .cursor-plugin/plugin.json / marketplace.json (D4=A, M-08/M-09)',()=>{
  const j=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const a=j('plugin.json'),c=j('.cursor-plugin/plugin.json'),m=j('.agents/plugins/marketplace.json');
  const ui=a.extensions['com.openai'].interface;
  for(const k of ['name','version','description','license','homepage','repository','keywords'])assert.deepEqual(c[k],a[k],k);
  assert.equal(c.author.name,a.author.name,'author.name');assert.equal(c.author.email,a.author.email,'author.email');
  assert.equal(a.author.name,'Rocky Shi');assert.equal(ui.developerName,a.author.name,'developerName');
  assert.match(c.name,/^[a-z0-9]+(-[a-z0-9]+)*$/);
  // keys outside the official Cursor doc field table (cursor.com/docs/plugins/building, checked 2026-10-27) must not appear
  const allowed=['name','description','version','author','homepage','repository','license','keywords','logo','rules','agents','skills','commands','hooks','mcpServers','variables'];
  for(const k of Object.keys(c))assert.ok(allowed.includes(k),'cursor undocumented field '+k);
  for(const k of Object.keys(c.author))assert.ok(['name','email'].includes(k),'author.'+k);
  for(const k of ['logo','skills']){assert.ok(c[k],k+' missing');assert.ok(fs.existsSync(path.join(root,c[k])),k);}
  assert.ok(fs.existsSync(path.join(root,c.skills,'task-lifecycle/SKILL.md')),'skills/*/SKILL.md');
  assert.equal(m.name,'devcodex-task-lifecycle','marketplace name');assert.equal(m.interface.displayName,ui.displayName,'displayName');
  const e=m.plugins.find(p=>p.name===a.name);assert.ok(e,'marketplace entry');
  assert.equal(e.category,ui.category,'category');
});
test('T79 CJK gate: only allowlisted exact literals, scoped per file (skills, docs, CHANGELOG); stale entries fail',()=>{
  const d=docs('cjk'),f=path.join(d,'skills/task-lifecycle/references/x.md'),al=path.join(d,'scripts/cjk-allowlist.json');
  const allow=(entries)=>put(al,JSON.stringify({entries}));
  put(f,'# X\n\nRuntime file 项目约定.md here.\n');
  let r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/x\.md:3: CJK outside allowlist: 项目约定/);
  allow([{literal:'项目约定.md',bucket:'RUNTIME_NAMES',reason:'fixture',files:['skills/task-lifecycle/references/x.md']}]);
  r=checkDocs(d);assert.equal(r.status,0,r.stderr);
  put(f,'# X\n\nRuntime file 项目约定.md and 中文 prose.\n');
  r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/CJK outside allowlist: 中文/);
  put(f,'# X\n');
  r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/stale entry 项目约定\.md/);
  allow([{literal:'项目约定.md',bucket:'RUNTIME_NAMES',reason:'fixture',files:['CHANGELOG.md']}]);put(f,'项目约定.md\n');
  r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/x\.md:1: CJK outside allowlist/);
  allow([]);put(f,'# X\n');put(path.join(d,'docs/a.md'),'# 文档\n');
  r=checkDocs(d);assert.equal(r.status,1);assert.match(r.stderr,/docs\/a\.md:1: CJK outside allowlist/);put(path.join(d,'docs/a.md'),'# Docs\n');
  assert.equal(checkDocs(d).status,0);
  put(path.join(d,'CHANGELOG.md'),'# 更新\n');assert.equal(checkDocs(d).status,1);
});
test('T80 SKILL.md frontmatter description must be a single line',()=>{
  const d=docs('desc'),skill=path.join(d,'skills/task-lifecycle/SKILL.md');
  assert.equal(checkDocs(d).status,0);
  for(const bad of ['description: >\n  folded text\n','description: |\n  literal\n','description: first line\n  continued\n','description:\n','name2: x\n']){
    put(skill,'---\nname: sample\n'+bad+'---\n# Example\n');
    const r=checkDocs(d);assert.equal(r.status,1,bad);assert.match(r.stderr,/description must be a single non-empty line/);
  }
  put(skill,'---\nname: sample\ndescription: one line only\n---\n# Example\n');assert.equal(checkDocs(d).status,0);
});
test('T81 English citation form: `path` line N passes',()=>{
  const r=run(cite,['--root',root,cited('`'+rel+'` line 1 「# task-recognition-and-routing」\n')]);
  assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stdout,/^OK\t/);assert.match(r.stderr,/recognized=1/);
});
test('T81 English citation form: `path` lines N-M passes (with "…" fragment too)',()=>{
  const r=run(cite,['--root',root,cited('`'+rel+'` lines 1-3 「# task-recognition-and-routing」\n`'+rel+'` lines 1-2 "# task-recognition-and-routing"\n')]);
  assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stderr,/recognized=2/);for(const l of r.stdout.trim().split('\n'))assert.match(l,/^OK\t/);
});
test('T81 English citation form out of range fails with RANGE',()=>{
  const r=run(cite,['--root',root,cited('`'+rel+'` lines 1-999999 「# task-recognition-and-routing」\n')]);
  assert.equal(r.status,1);assert.match(r.stdout,/^RANGE\t/);
  const n=run(cite,['--root',root,cited('`references/no-such-file.md` line 1 「x」\n')]);assert.equal(n.status,1);assert.match(n.stdout,/^NOFILE\t/);
});
test('T81 legacy Chinese citation form 第 N～M 行 still passes',()=>{
  const r=run(cite,['--root',root,cited('`'+rel+'` 第 1～2 行 「# task-recognition-and-routing」\n`'+rel+'` 第 1 行\n')]);
  assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stderr,/recognized=2/);
});
test('T82 SKILL.md inline label map matches entry-quickref LABELS verbatim (D8)',()=>{
  const sk=path.join(root,'skills/task-lifecycle');
  const rows=t=>t.split(/\r?\n/).filter(l=>/^\| [^|]+ \| [^|]/.test(l)&&!/^\|\s*(Category|---)/.test(l)).map(l=>l.slice(1,-1).split(' | ').map(c=>c.trim()));
  const rd=f=>fs.readFileSync(path.join(sk,f),'utf8').replace(/\r\n/g,'\n'); // CRLF-safe on Windows checkouts
  const s=rd('SKILL.md'),q=rd('references/entry-quickref.md');
  const i=s.indexOf('**Inline label map (D8)**');assert.ok(i>=0,'inline label map missing');
  const tbl=s.slice(i).split(/\n\n(?!\|)/)[0];const mine=rows(tbl.slice(tbl.indexOf('| Category')));
  const qs=q.slice(q.indexOf('## LABELS'));const labels=new Map(rows(qs.slice(0,qs.indexOf('`PHASE_NAMES`'))).map(r=>[r[0],r]));
  assert.ok(mine.length>=12,'expected at least 12 rows, got '+mine.length);
  for(const r of mine){assert.ok(labels.has(r[0]),'unknown category '+r[0]);assert.deepEqual(r,labels.get(r[0]),'pair differs: '+r[0]);}
  for(const c of ['Entry notice','Light items','Status (three states)','Progress card (4 lines)',...[1,2,3,4,5,6,7].map(n=>'Execution item '+n)])assert.ok(mine.some(r=>r[0]===c),'missing '+c);
});
test('T83 check-citations is CRLF-safe: English and legacy forms on CRLF files',()=>{
  const tgt=path.join(citationTemp,'t83-target.md');fs.writeFileSync(tgt,'# T83 target\r\nalpha line\r\nbeta end\r\n');
  const f=cited('`t83-target.md` line 3 「beta end」\r\n`t83-target.md` lines 2-3 "alpha line…beta end"\r\n`t83-target.md` 第 2～3 行 「beta end」\r\n`t83-target.md` 第 3 行\r\n');
  const r=run(cite,['--root',root,f]);
  assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stderr,/recognized=4/);
  for(const l of r.stdout.trim().split('\n'))assert.match(l,/^(OK|UNCHECKED)\t/);
  const o=run(cite,['--root',root,cited('`t83-target.md` lines 2-9 「beta end」\r\n')]);assert.equal(o.status,1);assert.match(o.stdout,/^RANGE\t/);
});
test('T84 10c and 10f forbid number-only flowchart nodes and Page labels',()=>{
  const t=fs.readFileSync(path.join(root,'skills/task-lifecycle/references/verification-and-evidence-routing.md'),'utf8').replace(/\s+/g,' ');
  const c=t.match(/- 10c .*?(?= - 10[d-z] )/);assert.ok(c,'10c item missing');
  assert.match(c[0],/number-only nodes are forbidden/);
  const f=t.match(/- 10f .*?Reason:/);assert.ok(f,'10f item missing');
  assert.match(f[0],/number-only labels .*are forbidden/);
});
