// validate-config.mjs 夹具测试（node:test，零依赖；夹具在临时目录生成）。
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as V from './validate-config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const SCRIPT = path.join(here, 'validate-config.mjs');
const fixtureRoots = [];
after(() => {
  const parent = fs.realpathSync(os.tmpdir());
  for (const base of fixtureRoots) {
    assert.equal(fs.realpathSync(base), base);
    assert.equal(path.dirname(base), parent);
    assert.ok(path.basename(base).startsWith('tl-vc-'));
    fs.rmSync(base, { recursive: true });
  }
});

function mk() {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'tl-vc-')));
  fixtureRoots.push(base);
  const home = path.join(base, 'home');
  const ws = path.join(base, 'ws');
  const rec = path.join(base, 'rec');
  for (const d of [home, ws, rec]) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(rec, '00-任务记录.md'), '# r\n');
  return { base, home, ws, record: path.join(rec, '00-任务记录.md') };
}
// 先实际探测系统夹具能力；只跳过不可构造的特殊对象，不改变产品断言。
const probe = mk();
function capability(label, fn) {
  try { fn(); return false; } catch (e) {
    if (!['EPERM', 'EACCES', 'ENOSYS', 'ENOTSUP', 'ENOENT'].includes(e.code)) throw e;
    return `UNVERIFIED: ${label} 夹具不可用 (${e.code})`;
  }
}
const fileLinkSkip = capability('文件符号链接', () => fs.symlinkSync(probe.record, path.join(probe.base, 'file-link'), 'file'));
const dirLinkSkip = capability('目录符号链接', () => fs.symlinkSync(probe.home, path.join(probe.base, 'dir-link'), 'dir'));
const renameOpenSkip = capability('打开文件后重命名父目录', () => {
  const d = path.join(probe.base, 'open-dir'); fs.mkdirSync(d); const p = path.join(d, 'file'); fs.writeFileSync(p, 'x');
  const fd = fs.openSync(p, 'r'); try { fs.renameSync(d, d + '-moved'); } finally { fs.closeSync(fd); }
});
fs.mkdirSync(path.join(probe.base, 'CaseProbe'));
const caseSkip = fs.existsSync(path.join(probe.base, 'caseprobe')) ? 'UNVERIFIED: 文件系统不支持仅大小写不同的并存名称' : false;
const fifoProbe = spawnSync('mkfifo', [path.join(probe.base, 'fifo-probe')], { encoding: 'utf8', timeout: 5000 });
const fifoSkip = fifoProbe.status === 0 ? false : `UNVERIFIED: FIFO 夹具不可用 (${fifoProbe.error?.code ?? fifoProbe.status})`;
const gpath = (f) => path.join(f.home, '.config', 'task-lifecycle', 'config.json');
function writeG(f, obj) { fs.mkdirSync(path.dirname(gpath(f)), { recursive: true }); fs.writeFileSync(gpath(f), typeof obj === 'string' || Buffer.isBuffer(obj) ? obj : JSON.stringify(obj)); }
const ppath = (f, id = 'P1') => path.join(f.ws, '.task-lifecycle', id, 'config.json');
function writeP(f, obj, id = 'P1') { fs.mkdirSync(path.dirname(ppath(f, id)), { recursive: true }); fs.writeFileSync(ppath(f, id), typeof obj === 'string' ? obj : JSON.stringify(obj)); }
const src = (f, m = 't300u') => ({ messageId: m, quote: '开启只读调查委派给 codex，默认 standard', record: f.record });
const G1 = (f) => ({ approvalSource: src(f), delegation: { categories: { 'readonly-investigation': 'codex-cli' }, enabled: true, executors: { 'codex-cli': { command: 'codex' } } }, schemaVersion: 1, workflowDepth: { executionDefault: 'standard' } });
const P1 = (f) => ({ approvalSource: src(f, 't301u'), delegation: { categories: { 'test-run': 'none' } }, schemaVersion: 1, workflowDepth: { executionDefault: 'thorough' } });
const REVIEW = () => ({ enabled: true, fallback: { ...V.REVIEW_FALLBACK }, hosts: [{ command: 'codex', id: 'codex-cli', model: 'gpt-6-astra', reasoningEffort: 'high' }] });
const deps = (f, extra = {}) => ({ userInfo: () => ({ homedir: f.home }), scriptPath: SCRIPT, ...extra });
const HIT = new Map(); // code -> Set(stage)，T-A3 覆盖门禁从实际执行结果收集
const run = (f, argv = [], extra = {}, env = { HOME: f.home }) => {
  const r = V.validate(argv, env, deps(f, extra));
  for (const x of r.reasons) { if (!HIT.has(x.code)) HIT.set(x.code, new Set()); HIT.get(x.code).add(x.stage); }
  return r;
};
const pargs = (f, id = 'P1') => ['--workspace', f.ws, '--project-id', id];
const codes = (r) => r.reasons.map((x) => x.code);
const disabledWith = (r, code) => { assert.equal(r.status, 'disabled'); assert.ok(codes(r).includes(code), `${code} not in ${JSON.stringify(r.reasons)}`); assert.equal(r.effective, null); assert.deepEqual(r.approvalSources, []); };

test('E1 无全局文件 → config-missing', () => { const f = mk(); disabledWith(run(f), 'config-missing'); });
test('E2 G1 有效，无项目文件 → valid', () => {
  const f = mk(); writeG(f, G1(f));
  const r = run(f, pargs(f));
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.equal(r.layers.project.exists, false);
  assert.deepEqual(r.effective.delegation.categories['readonly-investigation'], { sourceLayer: 'global', value: 'codex-cli' });
  assert.deepEqual(r.effective.delegation.categories.drafting, { sourceLayer: 'default', value: 'none' });
});
test('E4 G1+P1 → §4.2 输出形状', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const r = run(f, pargs(f));
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.deepEqual(r.effective, {
    delegation: { categories: { drafting: { sourceLayer: 'default', value: 'none' }, implementation: { sourceLayer: 'default', value: 'none' }, 'readonly-investigation': { sourceLayer: 'global', value: 'codex-cli' }, 'test-run': { sourceLayer: 'project', value: 'none' } }, enabled: { sourceLayer: 'global', value: true }, executors: { 'codex-cli': { command: 'codex', model: null, reasoningEffort: null } } },
    review: { enabled: { sourceLayer: 'default', value: false }, fallback: { ...V.REVIEW_FALLBACK }, hosts: [] },
    workflowDepth: { executionDefault: { sourceLayer: 'project', value: 'thorough' } },
  });
  assert.deepEqual(r.approvalSources.map((a) => a.layer), ['global', 'project']);
  assert.match(r.layers.global.sha256, /^[0-9a-f]{64}$/);
  assert.equal(r.legacy.length, 0);
});
test('E3/E19 项目层引用其他 id → project-layer-widening（合并阶段）', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), delegation: { categories: { implementation: 'grok-build' } } });
  const r = run(f, pargs(f)); disabledWith(r, 'project-layer-widening'); assert.equal(r.reasons[0].stage, 'merge');
});
test('E5 项目层 executionDefault:null → value null, project', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), workflowDepth: { executionDefault: null } });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.deepEqual(r.effective.workflowDepth.executionDefault, { sourceLayer: 'project', value: null });
});
test('E6 项目层 enabled:false → 四类 none（project）', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, { approvalSource: src(f, 't301u'), delegation: { enabled: false }, schemaVersion: 1 });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid');
  assert.deepEqual(r.effective.delegation.enabled, { sourceLayer: 'project', value: false });
  for (const k of V.CATEGORY_KEYS) assert.deepEqual(r.effective.delegation.categories[k], { sourceLayer: 'project', value: 'none' });
  assert.deepEqual(r.effective.delegation.executors, {});
});
test('E7 "enabled":"true" → invalid-type', () => { const f = mk(); const g = G1(f); g.delegation.enabled = 'true'; writeG(f, g); disabledWith(run(f), 'invalid-type'); });
test('E8 categories.B05 → forbidden-mapping（优先于 unknown-field）', () => {
  const f = mk(); const g = G1(f); g.delegation.categories.B05 = 'codex-cli'; writeG(f, g);
  const r = run(f); disabledWith(r, 'forbidden-mapping'); assert.ok(!codes(r).includes('unknown-field'));
});
test('E9 "auto": true → unknown-field', () => { const f = mk(); writeG(f, { ...G1(f), auto: true }); disabledWith(run(f), 'unknown-field'); });
test('E10 全局缺 delegation → missing-field', () => { const f = mk(); const g = G1(f); delete g.delegation; writeG(f, g); disabledWith(run(f), 'missing-field'); });
test('E11 schemaVersion:"1" → invalid-type（version）', () => { const f = mk(); writeG(f, { ...G1(f), schemaVersion: '1' }); const r = run(f); disabledWith(r, 'invalid-type'); assert.equal(r.reasons[0].stage, 'version'); });
test('schemaVersion 2 → schema-version-unknown；缺 → missing-field', () => {
  let f = mk(); writeG(f, { ...G1(f), schemaVersion: 2 }); disabledWith(run(f), 'schema-version-unknown');
  f = mk(); const g = G1(f); delete g.schemaVersion; writeG(f, g); disabledWith(run(f), 'missing-field');
});
test('E12 有效 JSON + 旧《项目约定.md》委派节 → valid + legacy', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  fs.writeFileSync(path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'), '# 项目约定\n\n## 外部执行器委派\n以后默认采用 fast\n');
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid');
  assert.deepEqual(r.legacy.map((l) => [l.kind, l.line, l.layer]), [['delegation-section', 3, 'project'], ['depth-execution-default', 4, 'project']]);
  assert.deepEqual(r.legacy[1].suggestedJson, { workflowDepth: { executionDefault: 'fast' } });
});
test('E12b 无 JSON + 旧约定 → config-missing + legacy', () => {
  const f = mk(); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'), { recursive: true });
  fs.writeFileSync(path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'), 'x\n'.repeat(11) + '## 外部执行器委派\n');
  const r = run(f, pargs(f)); disabledWith(r, 'config-missing'); assert.equal(r.legacy[0].line, 12); assert.equal(r.legacy[0].kind, 'delegation-section');
});
test('工作区约定（global 层）仅传参时检测', () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle'), { recursive: true });
  fs.writeFileSync(path.join(f.ws, '.task-lifecycle', '工作区约定.md'), '执行时默认采用\n');
  assert.equal(run(f).legacy.length, 0);
  const r = run(f, pargs(f)); assert.deepEqual(r.legacy.map((l) => [l.kind, l.layer, l.suggestedJson.workflowDepth.executionDefault]), [['depth-execution-default', 'global', null]]);
});
test('E20 只给 --workspace → project-identity-unverified，project 层 path null', () => {
  const f = mk(); writeG(f, G1(f));
  const r = run(f, ['--workspace', f.ws]); disabledWith(r, 'project-identity-unverified');
  assert.deepEqual(r.layers.project, { exists: null, path: null, readable: null, realpath: null, sha256: null });
  assert.equal(r.reasons[0].detail, 'missing --project-id');
});
test('E22 项目目录是 symlink → project-identity-unverified', { skip: dirLinkSkip }, () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f), 'B'); fs.symlinkSync(path.join(f.ws, '.task-lifecycle', 'B'), path.join(f.ws, '.task-lifecycle', 'A'), 'dir');
  disabledWith(run(f, pargs(f, 'A')), 'project-identity-unverified');
});
test('大小写变体同名目录 → project-identity-unverified', { skip: caseSkip }, () => {
  let f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'p1'), { recursive: true }); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'));
  disabledWith(run(f, pargs(f)), 'project-identity-unverified');
});
test('非法 id / workspace 非绝对 → project-identity-unverified', () => {
  let f = mk(); writeG(f, G1(f)); disabledWith(run(f, ['--workspace', f.ws, '--project-id', '../x']), 'project-identity-unverified');
  f = mk(); writeG(f, G1(f)); disabledWith(run(f, ['--workspace', 'rel', '--project-id', 'P1']), 'project-identity-unverified');
});
test('项目 config.json 是 symlink → project-identity-unverified', { skip: fileLinkSkip }, () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'), { recursive: true });
  fs.writeFileSync(path.join(f.base, 'other.json'), JSON.stringify(P1(f))); fs.symlinkSync(path.join(f.base, 'other.json'), ppath(f));
  disabledWith(run(f, pargs(f)), 'project-identity-unverified');
});
test('E23 《项目约定.md》越界 symlink → legacy-check-skipped unsafe-path，status valid', { skip: fileLinkSkip }, () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  fs.writeFileSync(path.join(f.base, 'x.md'), '## 外部执行器委派\n'); fs.symlinkSync(path.join(f.base, 'x.md'), path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'));
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid');
  assert.deepEqual(r.legacy.map((l) => [l.kind, l.detail, l.line, l.suggestedJson]), [['legacy-check-skipped', 'unsafe-path', 0, null]]);
});
test('E24 .task-lifecycle 整体不存在 → 项目层 exists=false', () => { const f = mk(); writeG(f, G1(f)); const r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.equal(r.layers.project.exists, false); });
test('E25 约定路径安全但不可读 / 非 UTF-8 → legacy-check-skipped', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const pm = path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'); fs.writeFileSync(pm, Buffer.from([0xff, 0xfe, 0x00]));
  let r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.equal(r.legacy[0].detail, 'invalid-encoding');
  const realFs = fs; const fakeFs = { ...realFs, openSync: (p, ...a) => { if (p === pm) { const e = new Error('x'); e.code = 'EACCES'; throw e; } return realFs.openSync(p, ...a); } };
  r = run(f, pargs(f), { fs: fakeFs }); assert.equal(r.status, 'valid'); assert.equal(r.legacy[0].detail, 'unreadable');
});
test('E13 HOME 不符 → home-mismatch，global path 按账户 home', () => {
  const f = mk(); writeG(f, G1(f));
  const r = run(f, [], {}, { HOME: '/tmp/x' });
  disabledWith(r, 'config-location-forbidden');
  assert.deepEqual(r.reasons, [{ code: 'config-location-forbidden', detail: 'home-mismatch', layer: 'env', path: '', stage: 'env' }]);
  assert.equal(r.layers.global.path, gpath(f)); assert.equal(r.layers.global.exists, null); assert.equal(r.env.home, '/tmp/x');
});
test('home-unverifiable：userInfo 抛出 → global path null', () => {
  const f = mk(); const r = run(f, [], { userInfo: () => { throw new Error('nss'); } });
  disabledWith(r, 'home-unverifiable'); assert.equal(r.layers.global.path, null); assert.equal(r.env.accountHome, null);
});
test('invalid-argument：未知参数（stage env）', () => { const f = mk(); writeG(f, G1(f)); const r = run(f, ['--config', '/x']); disabledWith(r, 'invalid-argument'); assert.equal(r.reasons[0].stage, 'env'); });
// 路径映射 fs：把虚拟前缀 /workspace/tlvc-e18 映射到临时目录，不在真实 /workspace 写任何文件
function mapFs(virt, real) {
  const map = (p, from, to) => typeof p === 'string' && V.underPrefix(p, from) ? path.join(to, path.relative(from, p)) : p;
  const to = p => map(p, virt, real);
  const back = p => map(p, real, virt);
  return { ...fs, lstatSync: (p, ...a) => fs.lstatSync(to(p), ...a), statSync: (p, ...a) => fs.statSync(to(p), ...a), readFileSync: (p, ...a) => fs.readFileSync(to(p), ...a), openSync: (p, ...a) => fs.openSync(to(p), ...a), readdirSync: (p, ...a) => fs.readdirSync(to(p), ...a), realpathSync: (p) => back(fs.realpathSync(to(p))) };
}
test('E18 /workspace/.task-lifecycle/<ID>/config.json 合法项目层（虚拟 /workspace 路径）', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const virt = path.join(path.parse(f.ws).root, 'workspace', 'tlvc-e18');
  const r = run(f, ['--workspace', virt, '--project-id', 'P1'], { fs: mapFs(virt, f.ws) });
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.equal(r.layers.project.realpath, path.join(virt, '.task-lifecycle', 'P1', 'config.json'));
});
test('全局 config 落在 /workspace 子树 → config-location-forbidden（workspace-subtree）', () => {
  const f = mk(); writeG(f, G1(f));
  const virt = path.join(path.parse(f.home).root, 'workspace', 'tlvc-home');
  const r = V.validate([], { HOME: virt }, { userInfo: () => ({ homedir: virt }), scriptPath: SCRIPT, fs: mapFs(virt, f.home) });
  disabledWith(r, 'config-location-forbidden'); assert.equal(r.reasons[0].detail, 'workspace-subtree');
});
test('全局 config 是 symlink → config-location-forbidden', { skip: fileLinkSkip }, () => {
  const f = mk(); fs.writeFileSync(path.join(f.base, 'g.json'), JSON.stringify(G1(f))); fs.mkdirSync(path.dirname(gpath(f)), { recursive: true }); fs.symlinkSync(path.join(f.base, 'g.json'), gpath(f));
  disabledWith(run(f), 'config-location-forbidden');
});
test('全局 config 在插件目录 → config-location-forbidden', () => {
  const f = mk(); writeG(f, G1(f));
  disabledWith(run(f, [], { scriptPath: path.join(f.home, '.config', 'scripts', 'validate-config.mjs') }), 'config-location-forbidden');
});
test('config-unreadable：目录或读失败', () => {
  let f = mk(); fs.mkdirSync(gpath(f), { recursive: true }); disabledWith(run(f), 'config-unreadable');
  f = mk(); writeG(f, G1(f)); const fakeFs = { ...fs, openSync: (p, ...a) => { if (p === gpath(f)) { const e = new Error('x'); e.code = 'EIO'; throw e; } return fs.openSync(p, ...a); } };
  const r = run(f, [], { fs: fakeFs }); disabledWith(r, 'config-unreadable');
  assert.deepEqual(r.layers.global, { exists: true, path: gpath(f), readable: false, realpath: null, sha256: null });
  const f3 = mk(); writeG(f3, G1(f3)); writeP(f3, P1(f3));
  const fake3 = { ...fs, openSync: (p, ...a) => { if (p === ppath(f3)) { const e = new Error('x'); e.code = 'EACCES'; throw e; } return fs.openSync(p, ...a); } };
  const r3 = run(f3, pargs(f3), { fs: fake3 }); disabledWith(r3, 'config-unreadable');
  assert.deepEqual(r3.layers.project, { exists: true, path: ppath(f3), readable: false, realpath: null, sha256: null });
});
test('A1-02 缺值项目参数：invalid-argument 且保留 project 层（全 null）', () => {
  for (const argv of [['--workspace'], ['--project-id']]) {
    const f = mk(); writeG(f, G1(f)); const r = run(f, argv); disabledWith(r, 'invalid-argument');
    assert.deepEqual(r.layers.project, { exists: null, path: null, readable: null, realpath: null, sha256: null });
  }
});
test('legacy 三种句式 × 档位：suggestedJson 带出档位（custom → null）', () => {
  for (const [t, v] of [['执行时默认采用 fast', 'fast'], ['执行时默认采用standard', 'standard'], ['以后默认采用 thorough', 'thorough'], ['默认采用 fast', 'fast'], ['默认采用 custom', null], ['执行时默认采用', null]]) {
    const h = V.detectLegacyText(t); assert.equal(h.length, 1, t); assert.deepEqual(h[0].suggestedJson, { workflowDepth: { executionDefault: v } }, t);
  }
  assert.equal(V.detectLegacyText('默认采用的是').length, 0);
});
test('解析：BOM、非 UTF-8、非 JSON、尾随内容 → config-parse-error；重复键 → duplicate-key（CO-A04-01）', () => {
  const cases = [Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('{}')]), Buffer.from([0x7b, 0xff, 0x7d]), '{', '{} x'];
  for (const c of cases) { const f = mk(); writeG(f, c); disabledWith(run(f), 'config-parse-error'); }
  const f = mk(); writeG(f, '{"schemaVersion":1,"schemaVersion":1}'); const r = run(f); disabledWith(r, 'duplicate-key'); assert.equal(r.reasons[0].stage, 'parse');
  const f2 = mk(); writeG(f2, '{"a":{"b":1,"b":2}}'); assert.equal(run(f2).reasons[0].path, 'a.b');
});
test('approvalSource 子树只报 approval-source-missing', () => {
  const variants = [(g) => delete g.approvalSource, (g) => (g.approvalSource = 'x'), (g) => (g.approvalSource.messageId = 'u1'), (g) => (g.approvalSource.quote = '  '), (g) => (g.approvalSource.quote = 'x'.repeat(501)), (g) => (g.approvalSource.record = 'rel.md'), (g) => (g.approvalSource.record = '/nonexistent/x.md'), (g) => (g.approvalSource.extra = 1)];
  for (const v of variants) { const f = mk(); const g = G1(f); v(g); writeG(f, g); const r = run(f); disabledWith(r, 'approval-source-missing'); assert.deepEqual([...new Set(codes(r))], ['approval-source-missing']); }
  const f = mk(); const g = G1(f); g.approvalSource.messageId = 't12s34'; writeG(f, g); assert.equal(run(f).status, 'valid');
});
test('E30 record 祖先命中 Git 标记 → approval-source-missing', () => {
  const f = mk(); fs.mkdirSync(path.join(path.dirname(f.record), '.git')); writeG(f, G1(f)); disabledWith(run(f), 'approval-source-missing');
});
test('E26 全局祖先四种标记 × 文件/目录/symlink，起点与上级', async t => {
  for (const m of V.GIT_MARKERS) for (const kind of ['file', 'dir', 'symlink']) for (const where of ['start', 'ancestor']) {
    await t.test(`${m}/${kind}/${where}`, { skip: kind === 'symlink' ? fileLinkSkip : false }, () => {
    const f = mk(); writeG(f, G1(f));
    const d = where === 'start' ? path.dirname(gpath(f)) : f.home;
    const p = path.join(d, m);
    if (kind === 'file') fs.writeFileSync(p, ''); else if (kind === 'dir') fs.mkdirSync(p); else fs.symlinkSync('/nonexistent-target', p);
    const r = run(f); disabledWith(r, 'config-location-forbidden');
    });
  }
});
test('E27 项目 config 祖先命中 → 整体 forbidden，不回退全局', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f)); fs.writeFileSync(path.join(f.ws, 'HEAD'), '');
  const r = run(f, pargs(f)); disabledWith(r, 'config-location-forbidden'); assert.equal(r.reasons[0].layer, 'project');
});
test('E28 项目文件缺失、最近祖先命中 → forbidden', () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.git')); disabledWith(run(f, pargs(f)), 'config-location-forbidden');
});
test('E29 lstat 标记 EACCES/EIO/ELOOP/非 errno → forbidden；纯函数', () => {
  const start = path.join(path.parse(os.tmpdir()).root, 'a', 'b');
  for (const c of ['EACCES', 'EIO', 'ELOOP', null]) {
    const lstat = (p) => { if (p === path.join(start, 'HEAD')) { if (c === null) throw 'weird'; const e = new Error(c); e.code = c; throw e; } const e = new Error('n'); e.code = 'ENOENT'; throw e; };
    assert.equal(V.gitBoundary(start, lstat).ok, false);
  }
  const none = () => { const e = new Error('n'); e.code = 'ENOTDIR'; throw e; };
  assert.equal(V.gitBoundary(start, none).ok, true);
  const f = mk(); writeG(f, G1(f));
  const fakeFs = { ...fs, lstatSync: (p, ...a) => { if (p === path.join(f.home, 'gitdir')) { const e = new Error('x'); e.code = 'EACCES'; throw e; } return fs.lstatSync(p, ...a); } };
  disabledWith(run(f, [], { fs: fakeFs }), 'config-location-forbidden');
});
test('起点 realpath 失败：config → config-location-forbidden；record → approval-source-missing', () => {
  let f = mk(); writeG(f, G1(f));
  let fakeFs = { ...fs, realpathSync: (p) => { if (p === gpath(f)) { const e = new Error('x'); e.code = 'EIO'; throw e; } return fs.realpathSync(p); } };
  disabledWith(run(f, [], { fs: fakeFs }), 'config-location-forbidden');
  f = mk(); writeG(f, G1(f));
  fakeFs = { ...fs, realpathSync: (p) => { if (p === f.record) { const e = new Error('x'); e.code = 'EIO'; throw e; } return fs.realpathSync(p); } };
  disabledWith(run(f, [], { fs: fakeFs }), 'approval-source-missing');
});
test('E32 review 合法 → hosts 按配置顺序', () => {
  const f = mk(); const g = { ...G1(f), review: REVIEW() }; g.review.hosts.push({ command: 'other', id: 'b-host' }); writeG(f, g);
  const r = run(f); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.deepEqual(r.effective.review.hosts, [{ command: 'codex', id: 'codex-cli', model: 'gpt-6-astra', reasoningEffort: 'high' }, { command: 'other', id: 'b-host', model: null, reasoningEffort: null }]);
  assert.deepEqual(r.effective.review.enabled, { sourceLayer: 'global', value: true });
});
test('E33/E34 reasoningEffort 越界、model 含空格或 ; → invalid-value', () => {
  for (const [k, v] of [['reasoningEffort', 'xhigh'], ['reasoningEffort', 'minimal'], ['model', 'a b'], ['model', 'a;b']]) {
    let f = mk(); let g = { ...G1(f), review: REVIEW() }; g.review.hosts[0][k] = v; writeG(f, g); disabledWith(run(f), 'invalid-value');
    f = mk(); g = G1(f); g.delegation.executors['codex-cli'][k] = v; writeG(f, g); disabledWith(run(f), 'invalid-value');
  }
  const f = mk(); const g = G1(f); g.delegation.executors['codex-cli'].model = 5; writeG(f, g); disabledWith(run(f), 'invalid-type');
});
test('E35 hosts:[]、缺 enabled、重复 id、>4 家', () => {
  let f = mk(); let g = { ...G1(f), review: { ...REVIEW(), hosts: [] } }; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = { ...G1(f), review: REVIEW() }; delete g.review.enabled; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = { ...G1(f), review: REVIEW() }; g.review.hosts.push({ ...g.review.hosts[0] }); writeG(f, g); const r = run(f); disabledWith(r, 'invalid-value'); assert.equal(r.reasons[0].detail, 'duplicate-host-id');
  f = mk(); g = { ...G1(f), review: REVIEW() }; for (const id of ['h-b', 'h-c', 'h-d', 'h-e']) g.review.hosts.push({ command: 'c', id }); writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = { ...G1(f), review: REVIEW() }; delete g.review.hosts; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = { ...G1(f), review: { enabled: false, fallback: { ...V.REVIEW_FALLBACK } } }; writeG(f, g); assert.equal(run(f).status, 'valid');
});
test('E36 fallback 其他值 → invalid-value；缺 fallback → missing-field', () => {
  let f = mk(); let g = { ...G1(f), review: REVIEW() }; g.review.fallback.zeroExternal = 'skip-review'; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = { ...G1(f), review: REVIEW() }; delete g.review.fallback; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = { ...G1(f), review: REVIEW() }; g.review.x = 1; writeG(f, g); disabledWith(run(f), 'unknown-field');
});
test('E37 项目层 review.hosts / executors.model → widening；review:{enabled:false} 合法', () => {
  let f = mk(); writeG(f, { ...G1(f), review: REVIEW() }); writeP(f, { ...P1(f), review: { enabled: false, hosts: [] } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), delegation: { executors: { 'codex-cli': { command: 'codex', model: 'm' } } } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), delegation: { enabled: true } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, { ...G1(f), review: REVIEW() }); writeP(f, { ...P1(f), review: { enabled: true } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, { ...G1(f), review: REVIEW() }); writeP(f, { ...P1(f), review: { enabled: false } });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.deepEqual(r.effective.review.enabled, { sourceLayer: 'project', value: false }); assert.deepEqual(r.effective.review.hosts, []);
});
test('E38/CO-A04-05 review 四组合 sourceLayer', () => {
  const R = (en) => ({ enabled: en, fallback: { ...V.REVIEW_FALLBACK }, ...(en ? { hosts: REVIEW().hosts } : {}) });
  const combos = [[undefined, undefined, 'default', false], [undefined, false, 'default', false], [false, undefined, 'global', false], [false, false, 'global', false], [true, false, 'project', false], [true, undefined, 'global', true]];
  for (const [gr, pr, src, val] of combos) {
    const f = mk(); const g = G1(f); if (gr !== undefined) g.review = R(gr); writeG(f, g);
    const p = P1(f); if (pr !== undefined) p.review = { enabled: false }; writeP(f, p);
    const r = run(f, pargs(f)); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
    assert.deepEqual(r.effective.review.enabled, { sourceLayer: src, value: val }, JSON.stringify([gr, pr]));
    assert.deepEqual(r.effective.review.fallback, V.REVIEW_FALLBACK);
    if (!val) assert.deepEqual(r.effective.review.hosts, []);
  }
});
test('CO-A04-04 只写 model：effective reasoningEffort 为 null', () => {
  const f = mk(); const g = { ...G1(f), review: REVIEW() }; delete g.review.hosts[0].reasoningEffort; g.delegation.executors['codex-cli'].model = 'gpt-6-astra'; writeG(f, g);
  const r = run(f); assert.equal(r.status, 'valid');
  assert.equal(r.effective.review.hosts[0].reasoningEffort, null); assert.equal(r.effective.review.hosts[0].model, 'gpt-6-astra');
  assert.deepEqual(r.effective.delegation.executors['codex-cli'], { command: 'codex', model: 'gpt-6-astra', reasoningEffort: null });
});
test('CO-A04-04 对称：只写 reasoningEffort → model 为 null（两类宿主）', () => {
  const f = mk(); const g = { ...G1(f), review: REVIEW() }; delete g.review.hosts[0].model; g.review.hosts[0].reasoningEffort = 'high';
  delete g.delegation.executors['codex-cli'].model; g.delegation.executors['codex-cli'].reasoningEffort = 'high'; writeG(f, g);
  const r = run(f); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.equal(r.effective.review.hosts[0].model, null); assert.equal(r.effective.review.hosts[0].reasoningEffort, 'high');
  assert.deepEqual(r.effective.delegation.executors['codex-cli'], { command: 'codex', model: null, reasoningEffort: 'high' });
});
test('全局 enabled:false → executors {}、四类 none（global），可省 executors/categories', () => {
  const f = mk(); writeG(f, { approvalSource: src(f), delegation: { enabled: false }, schemaVersion: 1 });
  const r = run(f); assert.equal(r.status, 'valid');
  assert.deepEqual(r.effective.delegation.enabled, { sourceLayer: 'global', value: false });
  assert.deepEqual(r.effective.delegation.categories.implementation, { sourceLayer: 'global', value: 'none' });
  assert.deepEqual(r.effective.workflowDepth.executionDefault, { sourceLayer: 'default', value: null });
});
test('enabled:true 缺 categories/executors → missing-field；categories 指向未定义 id → invalid-value；未知类别 → unknown-field', () => {
  let f = mk(); writeG(f, { approvalSource: src(f), delegation: { enabled: true }, schemaVersion: 1 }); disabledWith(run(f), 'missing-field');
  f = mk(); let g = G1(f); g.delegation.categories.implementation = 'nope'; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.delegation.categories.misc = 'none'; writeG(f, g); disabledWith(run(f), 'unknown-field');
  f = mk(); g = G1(f); g.delegation.executors.Bad = { command: 'x' }; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.delegation.executors['codex-cli'].command = 'codex --x'; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.workflowDepth = { executionDefault: 'custom' }; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.workflowDepth = {}; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = G1(f); g.workflowDepth = { executionDefault: null }; writeG(f, g); disabledWith(run(f), 'invalid-type');
});
test('同阶段多码全部列出并按 stage→code→layer→path 排序', () => {
  const f = mk(); const g = G1(f); g.zz = 1; g.aa = 1; g.delegation.enabled = 'x'; writeG(f, g);
  const r = run(f); const keyed = r.reasons.map((x) => `${x.stage}|${x.code}|${x.layer}|${x.path}`);
  assert.deepEqual(keyed, [...keyed].sort()); assert.ok(r.reasons.length >= 3);
});
test('§3 确定性：指定夹具 main 连续 3 次 stdout 逐字节一致（含 E38 默认 review 形状）', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const outs = [0, 1, 2].map(() => V.main(pargs(f), { HOME: f.home }, deps(f)));
  for (const o of outs) { assert.equal(o.exitCode, 0); assert.equal(o.stdout, outs[0].stdout); }
  const parsed = JSON.parse(outs[0].stdout);
  assert.equal(parsed.status, 'valid'); assert.equal(parsed.layers.global.path, gpath(f));
  assert.deepEqual(parsed.effective.review, { enabled: { sourceLayer: 'default', value: false }, fallback: { ...V.REVIEW_FALLBACK }, hosts: [] });
  assert.ok(outs[0].stdout.endsWith('}\n'));
  assert.equal(V.main([], { HOME: '/nope' }, deps(f)).exitCode, 2);
});
test('sha256 为原始字节摘要（CO-A04-06 输出侧）', () => {
  const f = mk(); writeG(f, G1(f));
  const sum = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const a = run(f).layers.global.sha256; assert.equal(a, sum(gpath(f)));
  fs.appendFileSync(gpath(f), ' '); const b = run(f).layers.global.sha256; assert.equal(b, sum(gpath(f))); assert.notEqual(a, b);
  writeG(f, '{"a":1,"a":2}'); const r = run(f); disabledWith(r, 'duplicate-key'); assert.equal(r.layers.global.sha256, sum(gpath(f)));
});
test('CLI 子进程可运行（HOME 冲突在读取真实账户配置前退出）', () => {
  const p = spawnSync(process.execPath, [SCRIPT], { env: { ...process.env, HOME: os.userInfo().homedir + '-fixture-mismatch' }, encoding: 'utf8', timeout: 5000 });
  assert.equal(p.status, 2); const r = JSON.parse(p.stdout); assert.equal(r.status, 'disabled'); assert.equal(r.reasons[0].detail, 'home-mismatch');
});
test('render 递归键排序，不依赖插入顺序', () => { assert.equal(V.render({ b: 1, a: { d: 1, c: [{ z: 1, y: 2 }] } }), V.render({ a: { c: [{ y: 2, z: 1 }], d: 1 }, b: 1 })); });
test('内部异常 → 退出码 1、stdout 空', () => {
  const f = mk(); writeG(f, G1(f));
  const r = V.main([], { HOME: f.home }, deps(f, { fs: new Proxy({}, { get: () => () => { throw new TypeError('boom'); } }) }));
  assert.ok(r.exitCode === 1 || r.exitCode === 2); // lstat 抛非 errno → 定位层出口；渲染失败才到 1
  const r2 = V.main([], { HOME: f.home }, { userInfo: () => ({ homedir: f.home }), scriptPath: 123 });
  assert.equal(r2.exitCode, 1); assert.equal(r2.stdout, '');
});
test('静态扫描（辅助）：源码无写 API、网络、子进程模块', () => {
  const s = fs.readFileSync(SCRIPT, 'utf8');
  for (const bad of [/child_process/, /worker_threads/, /node:net/, /node:http/, /node:dgram/, /writeFile/, /appendFile/, /mkdir/, /rmSync|unlink|rename/, /createWriteStream/, /O_WRONLY|O_RDWR|O_CREAT|O_TRUNC|O_APPEND/]) assert.ok(!bad.test(s), String(bad));
  for (const m of s.matchAll(/openSync\(([^;]*)/g)) assert.match(m[1], /O_RDONLY \| fs\.constants\.O_NOFOLLOW/, '仅允许只读且不跟随 symlink 的打开');
});
test('B1-01 检查后读取前对象被替换：dev/ino 不符或末级变 symlink → config-location-forbidden，不读替换对象', () => {
  for (const layer of ['global', 'project']) {
    const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
    const target = layer === 'global' ? gpath(f) : ppath(f);
    const other = path.join(f.base, 'other.json'); fs.writeFileSync(other, JSON.stringify(G1(f)));
    const fakeFs = { ...fs, fstatSync: (fd) => { const st = fs.fstatSync(fd); return fd === swapFd ? fs.statSync(other) : st; }, openSync: (p, ...a) => { const fd = fs.openSync(p, ...a); if (p === target) swapFd = fd; return fd; } };
    let swapFd = -1;
    const r = run(f, pargs(f), { fs: fakeFs }); disabledWith(r, 'config-location-forbidden');
    assert.equal(r.reasons[0].detail, 'changed-during-check'); assert.equal(r.layers[layer].sha256, null);
    const loopFs = { ...fs, openSync: (p, ...a) => { if (p === target) { const e = new Error('x'); e.code = 'ELOOP'; throw e; } return fs.openSync(p, ...a); } };
    disabledWith(run(f, pargs(f), { fs: loopFs }), 'config-location-forbidden');
  }
});
test('B1-02 全局位置门禁失败 → 不读取工作区约定（global legacy 跳过）', () => {
  const f = mk(); writeG(f, G1(f)); fs.writeFileSync(path.join(f.home, 'HEAD'), '');
  fs.mkdirSync(path.join(f.ws, '.task-lifecycle'), { recursive: true });
  const wm = path.join(f.ws, '.task-lifecycle', '工作区约定.md'); fs.writeFileSync(wm, '## 外部执行器委派\n');
  const opened = []; const spy = { ...fs, openSync: (p, ...a) => { opened.push(p); return fs.openSync(p, ...a); }, readFileSync: (p, ...a) => { opened.push(p); return fs.readFileSync(p, ...a); } };
  const r = run(f, pargs(f), { fs: spy }); disabledWith(r, 'config-location-forbidden');
  assert.ok(!opened.includes(wm)); assert.deepEqual(r.legacy, []);
});
test('B2-01 全局 lstat 抛 EACCES/EIO（安全核实前）→ 不读取工作区约定', () => {
  for (const code of ['EACCES', 'EIO']) {
    const f = mk(); writeG(f, G1(f));
    fs.mkdirSync(path.join(f.ws, '.task-lifecycle'), { recursive: true });
    const wm = path.join(f.ws, '.task-lifecycle', '工作区约定.md'); fs.writeFileSync(wm, '## 外部执行器委派\n');
    const gf = path.join(f.home, '.config', 'task-lifecycle', 'config.json');
    const opened = []; let first = true;
    const spy = { ...fs, lstatSync: (p, ...a) => { if (p === gf && first) { first = false; const e = new Error(code); e.code = code; throw e; } return fs.lstatSync(p, ...a); },
      openSync: (p, ...a) => { opened.push(p); return fs.openSync(p, ...a); }, readFileSync: (p, ...a) => { opened.push(p); return fs.readFileSync(p, ...a); } };
    const r = run(f, pargs(f), { fs: spy }); disabledWith(r, 'config-unreadable');
    assert.ok(!opened.includes(wm), code); assert.deepEqual(r.legacy, []);
  }
});
test('B2-02 Setext 标题命中；代码围栏内的 ATX 不命中', () => {
  assert.deepEqual(V.detectLegacyText('外部执行器委派\n==============\n').map((h) => [h.kind, h.line]), [['delegation-section', 1]]);
  assert.deepEqual(V.detectLegacyText('外部执行器委派\n---\n').map((h) => h.line), [1]);
  assert.deepEqual(V.detectLegacyText('```\n## 外部执行器委派\n```\n'), []);
  assert.deepEqual(V.detectLegacyText('~~~md\n## 外部执行器委派\n~~~\n## 外部执行器委派\n').map((h) => h.line), [4]);
});
test('A3-01 约定与配置：打开后父目录被替换 → 读取前拒绝（readFileSync(fd) 调用零次）', { skip: dirLinkSkip || renameOpenSkip }, () => {
  for (const which of ['config', 'convention']) {
    const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
    const conv = path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'); fs.writeFileSync(conv, '## 外部执行器委派\n');
    const target = which === 'config' ? ppath(f) : conv; const dir = path.dirname(target);
    let done = false; let fdTarget = null; let reads = 0;
    const spy = { ...fs,
      openSync: (p, ...a) => { const fd = fs.openSync(p, ...a); try { if (p === target && !done) { done = true; fdTarget = fd; fs.renameSync(dir, dir + '-Moved'); fs.symlinkSync(dir + '-Moved', dir, 'dir'); } return fd; } catch (e) { fs.closeSync(fd); throw e; } },
      readFileSync: (p, ...a) => { if (p === fdTarget) reads++; return fs.readFileSync(p, ...a); } };
    const r = run(f, pargs(f), { fs: spy }); assert.ok(done, which); assert.equal(reads, 0, which);
    if (which === 'config') disabledWith(r, 'config-location-forbidden');
  }
});
test('A3-02 围栏须同字符且不短于开围栏、闭合行仅空白', () => {
  assert.deepEqual(V.detectLegacyText('````md\n```\n## 外部执行器委派\n````\n'), []);
  assert.deepEqual(V.detectLegacyText('````md\n```\n````\n## 外部执行器委派\n').map((h) => h.line), [4]);
  assert.deepEqual(V.detectLegacyText('```\n``` x\n## 外部执行器委派\n```\n'), []);
});
test('B3-02 schema 类型由 FIELD_RULES 生成：改常量 type 即改变生成结果（变异检出）', () => {
  const pairs = [[V.FIELD_RULES_GLOBAL.executor, 'executor'], [V.FIELD_RULES_GLOBAL.review, 'globalReview'], [V.FIELD_RULES_PROJECT.root, 'projectConfig']];
  for (const [rule, def] of pairs) {
    const old = rule.type; rule.type = 'array';
    try { assert.equal(V.buildSchemaDefs()[def].type, 'array', def); } finally { rule.type = old; }
    assert.equal(V.buildSchemaDefs()[def].type, old);
  }
});
test('A3-02(b2) 随包输出协议含全部原因码与 fallback 三键固定值', () => {
  const t = fs.readFileSync(path.join(path.dirname(SCRIPT), '..', 'skills', 'task-lifecycle', 'references', '校验脚本输出协议.md'), 'utf8');
  for (const c of Object.keys(V.REASON_CODES)) assert.ok(t.includes('`' + c + '`'), c);
  for (const [k, v] of Object.entries(V.REVIEW_FALLBACK)) assert.ok(t.includes('`' + k + '`: `"' + v + '"`'), k);
});
test('B1-03 同名仅大小写不同的是普通文件 → 不算项目目录别名', { skip: caseSkip }, () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'), { recursive: true }); fs.writeFileSync(path.join(f.ws, '.task-lifecycle', 'p1'), '');
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid', JSON.stringify(r.reasons)); assert.equal(r.layers.project.exists, false);
});
test('B1-03 大小写变体 symlink → project-identity-unverified', { skip: caseSkip || fileLinkSkip }, () => {
  const g = mk(); writeG(g, G1(g)); fs.mkdirSync(path.join(g.ws, '.task-lifecycle', 'P1'), { recursive: true }); fs.symlinkSync('/nonexistent', path.join(g.ws, '.task-lifecycle', 'p1'));
  disabledWith(run(g, pargs(g)), 'project-identity-unverified');
});
test('B1-04 项目层 sha256 为原始字节摘要；固定摘要会被检出', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const sum = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const r = run(f, pargs(f)); assert.equal(r.layers.project.sha256, sum(ppath(f))); assert.notEqual(r.layers.project.sha256, '0'.repeat(64));
  writeP(f, '{'); const r2 = run(f, pargs(f)); disabledWith(r2, 'config-parse-error'); assert.equal(r2.layers.project.sha256, sum(ppath(f)));
});
// ---------- 规则表单一来源 ----------
const schema = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'config.schema.json'), 'utf8'));
const stripComments = (x) => (Array.isArray(x) ? x.map(stripComments) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).filter(([k]) => k !== '$comment').map(([k, v]) => [k, stripComments(v)])) : x);
test('schema 与常量逐字段一致（$defs 全量比对；global / project 分开；根 anyOf）', () => {
  assert.deepEqual(stripComments(schema.$defs), V.buildSchemaDefs());
  assert.deepEqual(schema.anyOf, [{ $ref: '#/$defs/globalConfig' }, { $ref: '#/$defs/projectConfig' }]);
  assert.equal(schema.oneOf, undefined);
  // 断言有效性反例：常见漂移必须被检出
  const mut = [(d) => (d.executor.properties.command.type = 'number'), (d) => (d.globalReview.required = []), (d) => (d.globalReview.then.required = []), (d) => (d.approvalSource.additionalProperties = true), (d) => (d.reviewHost.properties.model.pattern = '.*')];
  for (const m of mut) { const d = structuredClone(stripComments(schema.$defs)); m(d); assert.notDeepEqual(d, V.buildSchemaDefs()); }
  // 常量与 schema 关键值互证
  const d = schema.$defs;
  assert.deepEqual(Object.keys(d.globalConfig.properties).sort(), [...V.FIELD_RULES_GLOBAL.root.properties].sort());
  assert.deepEqual(Object.keys(d.projectConfig.properties).sort(), [...V.FIELD_RULES_PROJECT.root.properties].sort());
});
function FIELD(a) { return [...a].sort(); }
test('assets/config.example.json：delegation 与 review 均 enabled:false，且能过结构校验', () => {
  const ex = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'config.example.json'), 'utf8'));
  assert.equal(ex.delegation.enabled, false); assert.equal(ex.review.enabled, false);
  const f = mk(); ex.approvalSource.record = f.record; writeG(f, ex); const r = run(f);
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons)); assert.equal(r.effective.delegation.enabled.value, false); assert.equal(r.effective.review.enabled.value, false);
});
test('类别表与永不委派清单与 任务拆分并行与整合.md 逐字一致（防漂移）', () => {
  const full = fs.readFileSync(path.join(root, 'skills', 'task-lifecycle', 'references', '任务拆分并行与整合.md'), 'utf8');
  const a = full.indexOf('| 类别 | 可交阶段与子步骤（上限） |'); assert.ok(a > 0);
  const t = full.slice(a, full.indexOf('外部 CLI 作为只读审查会话', a));
  const rows = {};
  for (const m of t.matchAll(/^\| `([a-z-]+)` \| (.+) \|$/gm)) rows[m[1]] = m[2];
  assert.deepEqual(rows, { ...V.CATEGORY_STAGE_LIMIT_TEXT });
  for (const k of V.CATEGORY_KEYS) assert.deepEqual([...new Set([...rows[k].matchAll(/\b(A\d\d|B\d\d|DOC\d\d)\b/g)].map((x) => x[1]))].sort(), [...V.CATEGORY_STAGE_LIMITS[k]].sort(), k);
  const lines = t.split('\n').map((x) => x.trim());
  const i = lines.indexOf(V.NEVER_DELEGATE_TEXT[0]); assert.ok(i > 0, '永不委派首行变化'); assert.equal(lines[i + 1], V.NEVER_DELEGATE_TEXT[1]);
  const nd = /\*\*永不委派\*\*：([^\n]+?)全部内容/.exec(V.NEVER_DELEGATE_TEXT[0]);
  assert.deepEqual(nd[1].split('、').map((x) => x.trim()).filter(Boolean), [...V.NEVER_DELEGATE_STAGES]);
  // 反例：删职责或放宽上限必须被检出
  assert.notEqual(V.NEVER_DELEGATE_TEXT[1].replace('SelfReview/', ''), lines[i + 1]);
  assert.notDeepEqual({ ...rows, implementation: 'A05 全部内容' }, { ...V.CATEGORY_STAGE_LIMIT_TEXT });
});
test('A2-01 打开时父目录被换成指向原目录的 symlink（文件 inode 不变）→ config-location-forbidden', { skip: dirLinkSkip }, () => {
  for (const layer of ['global', 'project']) {
    const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
    const target = layer === 'global' ? gpath(f) : ppath(f);
    const dir = path.dirname(target); let done = false;
    const swapFs = { ...fs, openSync: (p, ...a) => { if (p === target && !done) { done = true; fs.renameSync(dir, dir + '-Moved'); fs.symlinkSync(dir + '-Moved', dir, 'dir'); } return fs.openSync(p, ...a); } };
    const r = run(f, pargs(f), { fs: swapFs }); disabledWith(r, 'config-location-forbidden'); assert.ok(done);
    assert.equal(r.reasons[0].detail, 'changed-during-check');
  }
});
test('A2-02 配置或约定是 FIFO → 立即关闭/跳过，不阻塞', { skip: fifoSkip }, () => {
  const f = mk(); fs.mkdirSync(path.dirname(gpath(f)), { recursive: true });
  assert.equal(spawnSync('mkfifo', [gpath(f)]).status, 0);
  const t0 = Date.now(); const r = run(f); assert.ok(Date.now() - t0 < 5000); disabledWith(r, 'config-unreadable');
  const g = mk(); writeG(g, G1(g)); writeP(g, P1(g));
  assert.equal(spawnSync('mkfifo', [path.join(g.ws, '.task-lifecycle', 'P1', '项目约定.md')]).status, 0);
  const r2 = run(g, pargs(g)); assert.equal(r2.status, 'valid'); assert.equal(r2.legacy[0].kind, 'legacy-check-skipped'); assert.equal(r2.legacy[0].detail, 'unreadable');
});
test('A2-03 复合句：无效前缀＋有效后句仍带出档位', () => {
  assert.deepEqual(V.detectLegacyText('默认采用的是推荐值；以后默认采用 fast')[0].suggestedJson, { workflowDepth: { executionDefault: 'fast' } });
});
test('A2-04 FIELD_RULES 允许字段与 schema properties 键逐一一致', () => {
  const d = schema.$defs, G = V.FIELD_RULES_GLOBAL;
  const pairs = [[G.root, d.globalConfig], [G.approvalSource, d.approvalSource], [G.delegation, d.globalDelegation], [G.executor, d.executor], [G.review, d.globalReview], [G.reviewHost, d.reviewHost], [G.reviewFallback, d.reviewFallback], [G.workflowDepth, d.globalWorkflowDepth], [V.FIELD_RULES_PROJECT.root, d.projectConfig]];
  for (const [rule, def] of pairs) assert.deepEqual([...rule.properties].sort(), Object.keys(def.properties).sort());
  const f = mk(); const g = G1(f); g.delegation.executors['codex-cli'].auto = true; writeG(f, g); disabledWith(run(f), 'unknown-field');
});
test('A2-05 契约 §2.2 :77 列出的每个阶段/职责名 → forbidden-mapping（独立清单）', () => {
  const contract = ['00', 'SelfReview', 'FormalReview', 'Approval', 'FindingClose', 'EvidenceSign', 'Integration', 'Commit', 'Push', 'Release', 'Delete', 'FinalAcceptance'];
  for (let i = 1; i <= 10; i++) { const n = String(i).padStart(2, '0'); contract.push(`A${n}`, `B${n}`, `DOC${n}`); }
  for (const k of contract) { const f = mk(); const g = G1(f); g.delegation.categories[k] = 'codex-cli'; writeG(f, g); const r = run(f); disabledWith(r, 'forbidden-mapping'); }
});
test('A2-06 冻结 §11.4 示例：review 开启不启用委派', () => {
  const f = mk(); writeG(f, { approvalSource: src(f, 't343u'), delegation: { enabled: false }, review: REVIEW(), schemaVersion: 1 });
  const r = run(f); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.deepEqual(r.effective.review.enabled, { sourceLayer: 'global', value: true });
  assert.deepEqual(r.effective.delegation.enabled, { sourceLayer: 'global', value: false }); assert.deepEqual(r.effective.delegation.executors, {});
  for (const k of V.CATEGORY_KEYS) assert.equal(r.effective.delegation.categories[k].value, 'none');
});
test('T-A3 覆盖门禁（最后运行）：实际命中的原因码 ⊇ REASON_CODES，且阶段归属一致', () => {
  for (const [code, stages] of Object.entries(V.REASON_CODES)) {
    assert.ok(HIT.has(code), `原因码 ${code} 无触发夹具`);
    for (const st of HIT.get(code)) assert.ok(stages.split('|').includes(st), `${code} 出现在阶段 ${st}`);
  }
  for (const code of HIT.keys()) assert.ok(code in V.REASON_CODES, `未登记原因码 ${code}`);
});
