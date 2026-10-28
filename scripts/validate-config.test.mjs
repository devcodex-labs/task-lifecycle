// validate-config.mjs fixture tests (node:test, zero dependencies; fixtures generated in temp dirs).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
// Probe system fixture capabilities first; skip only special objects that cannot be built, without changing product assertions.
const probe = mk();
function capability(label, fn) {
  try { fn(); return false; } catch (e) {
    if (!['EPERM', 'EACCES', 'ENOSYS', 'ENOTSUP', 'ENOENT'].includes(e.code)) throw e;
    return `UNVERIFIED: ${label} fixture unavailable (${e.code})`;
  }
}
const fileLinkSkip = capability('file symlink', () => fs.symlinkSync(probe.record, path.join(probe.base, 'file-link'), 'file'));
const dirLinkSkip = capability('directory symlink', () => fs.symlinkSync(probe.home, path.join(probe.base, 'dir-link'), 'dir'));
const renameOpenSkip = capability('rename parent directory after opening a file', () => {
  const d = path.join(probe.base, 'open-dir'); fs.mkdirSync(d); const p = path.join(d, 'file'); fs.writeFileSync(p, 'x');
  const fd = fs.openSync(p, 'r'); try { fs.renameSync(d, d + '-moved'); } finally { fs.closeSync(fd); }
});
fs.mkdirSync(path.join(probe.base, 'CaseProbe'));
const caseSkip = fs.existsSync(path.join(probe.base, 'caseprobe')) ? 'UNVERIFIED: filesystem does not support coexisting names differing only by case' : false;
const fifoProbe = spawnSync('mkfifo', [path.join(probe.base, 'fifo-probe')], { encoding: 'utf8', timeout: 5000 });
// Windows Git Bash mkfifo exits 0 but creates no FIFO Node can see; require a real FIFO via lstat.
const fifoReal = fifoProbe.status === 0 && (() => { try { return fs.lstatSync(path.join(probe.base, 'fifo-probe')).isFIFO(); } catch { return false; } })();
const fifoSkip = fifoReal ? false : `UNVERIFIED: FIFO fixture unavailable (${fifoProbe.error?.code ?? (fifoProbe.status === 0 ? 'not-a-fifo' : fifoProbe.status)})`;
const gpath = (f) => path.join(f.home, '.config', 'task-lifecycle', 'config.json');
function writeG(f, obj) { fs.mkdirSync(path.dirname(gpath(f)), { recursive: true }); fs.writeFileSync(gpath(f), typeof obj === 'string' || Buffer.isBuffer(obj) ? obj : JSON.stringify(obj)); }
const ppath = (f, id = 'P1') => path.join(f.ws, '.task-lifecycle', id, 'config.json');
function writeP(f, obj, id = 'P1') { fs.mkdirSync(path.dirname(ppath(f, id)), { recursive: true }); fs.writeFileSync(ppath(f, id), typeof obj === 'string' ? obj : JSON.stringify(obj)); }
const src = (f, m = 't300u') => ({ messageId: m, quote: 'enable read-only investigation delegation to codex, default standard', record: f.record });
const G1 = (f) => ({ approvalSource: src(f), delegation: { categories: { 'readonly-investigation': 'codex-cli' }, enabled: true, executors: { 'codex-cli': { command: 'codex' } } }, schemaVersion: 1, workflowDepth: { executionDefault: 'standard' } });
const P1 = (f) => ({ approvalSource: src(f, 't301u'), delegation: { categories: { 'test-run': 'none' } }, schemaVersion: 1, workflowDepth: { executionDefault: 'thorough' } });
const REVIEW = () => ({ enabled: true, fallback: { ...V.REVIEW_FALLBACK }, hosts: [{ command: 'codex', id: 'codex-cli', model: 'gpt-6-astra', reasoningEffort: 'high' }] });
const deps = (f, extra = {}) => ({ userInfo: () => ({ homedir: f.home }), scriptPath: SCRIPT, ...extra });
const HIT = new Map(); // code -> Set(stage); the T-A3 coverage gate collects from actual run results
const run = (f, argv = [], extra = {}, env = { HOME: f.home }) => {
  const r = V.validate(argv, env, deps(f, extra));
  for (const x of r.reasons) { if (!HIT.has(x.code)) HIT.set(x.code, new Set()); HIT.get(x.code).add(x.stage); }
  return r;
};
const pargs = (f, id = 'P1') => ['--workspace', f.ws, '--project-id', id];
const codes = (r) => r.reasons.map((x) => x.code);
const disabledWith = (r, code) => { assert.equal(r.status, 'disabled'); assert.ok(codes(r).includes(code), `${code} not in ${JSON.stringify(r.reasons)}`); assert.equal(r.effective, null); assert.deepEqual(r.approvalSources, []); };

test('E1 no global file → config-missing', () => { const f = mk(); disabledWith(run(f), 'config-missing'); });
test('E2 G1 valid, no project file → valid', () => {
  const f = mk(); writeG(f, G1(f));
  const r = run(f, pargs(f));
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.equal(r.layers.project.exists, false);
  assert.deepEqual(r.effective.delegation.categories['readonly-investigation'], { sourceLayer: 'global', value: 'codex-cli' });
  assert.deepEqual(r.effective.delegation.categories.drafting, { sourceLayer: 'default', value: 'none' });
});
test('E4 G1+P1 → §4.2 output shape', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const r = run(f, pargs(f));
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.deepEqual(r.effective, {
    delegation: { categories: { drafting: { sourceLayer: 'default', value: 'none' }, implementation: { sourceLayer: 'default', value: 'none' }, 'readonly-investigation': { sourceLayer: 'global', value: 'codex-cli' }, 'test-run': { sourceLayer: 'project', value: 'none' } }, enabled: { sourceLayer: 'global', value: true }, executors: { 'codex-cli': { command: 'codex', model: null, reasoningEffort: null } } },
    parallel: PAR_OFF(), // FEAT-20261028-001: effective.parallel is always present when valid (additive expectation)
    review: { enabled: { sourceLayer: 'default', value: false }, fallback: { ...V.REVIEW_FALLBACK }, hosts: [] },
    workflowDepth: { executionDefault: { sourceLayer: 'project', value: 'thorough' } },
  });
  assert.deepEqual(r.approvalSources.map((a) => a.layer), ['global', 'project']);
  assert.match(r.layers.global.sha256, /^[0-9a-f]{64}$/);
  assert.equal(r.legacy.length, 0);
});
test('E3/E19 project layer references another id → project-layer-widening (merge stage)', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), delegation: { categories: { implementation: 'grok-build' } } });
  const r = run(f, pargs(f)); disabledWith(r, 'project-layer-widening'); assert.equal(r.reasons[0].stage, 'merge');
});
test('E5 project layer executionDefault:null → value null, project', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), workflowDepth: { executionDefault: null } });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.deepEqual(r.effective.workflowDepth.executionDefault, { sourceLayer: 'project', value: null });
});
test('E6 project layer enabled:false → four categories none (project)', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, { approvalSource: src(f, 't301u'), delegation: { enabled: false }, schemaVersion: 1 });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid');
  assert.deepEqual(r.effective.delegation.enabled, { sourceLayer: 'project', value: false });
  for (const k of V.CATEGORY_KEYS) assert.deepEqual(r.effective.delegation.categories[k], { sourceLayer: 'project', value: 'none' });
  assert.deepEqual(r.effective.delegation.executors, {});
});
test('E7 "enabled":"true" → invalid-type', () => { const f = mk(); const g = G1(f); g.delegation.enabled = 'true'; writeG(f, g); disabledWith(run(f), 'invalid-type'); });
test('E8 categories.B05 → forbidden-mapping (takes precedence over unknown-field)', () => {
  const f = mk(); const g = G1(f); g.delegation.categories.B05 = 'codex-cli'; writeG(f, g);
  const r = run(f); disabledWith(r, 'forbidden-mapping'); assert.ok(!codes(r).includes('unknown-field'));
});
test('E9 "auto": true → unknown-field', () => { const f = mk(); writeG(f, { ...G1(f), auto: true }); disabledWith(run(f), 'unknown-field'); });
test('E10 global missing delegation → missing-field', () => { const f = mk(); const g = G1(f); delete g.delegation; writeG(f, g); disabledWith(run(f), 'missing-field'); });
test('E11 schemaVersion:"1" → invalid-type（version）', () => { const f = mk(); writeG(f, { ...G1(f), schemaVersion: '1' }); const r = run(f); disabledWith(r, 'invalid-type'); assert.equal(r.reasons[0].stage, 'version'); });
test('schemaVersion 2 → schema-version-unknown; missing → missing-field', () => {
  let f = mk(); writeG(f, { ...G1(f), schemaVersion: 2 }); disabledWith(run(f), 'schema-version-unknown');
  f = mk(); const g = G1(f); delete g.schemaVersion; writeG(f, g); disabledWith(run(f), 'missing-field');
});
test('E12 valid JSON + legacy 《项目约定.md》 delegation section → valid + legacy', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  fs.writeFileSync(path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'), '# 项目约定\n\n## 外部执行器委派\n以后默认采用 fast\n');
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid');
  assert.deepEqual(r.legacy.map((l) => [l.kind, l.line, l.layer]), [['delegation-section', 3, 'project'], ['depth-execution-default', 4, 'project']]);
  assert.deepEqual(r.legacy[1].suggestedJson, { workflowDepth: { executionDefault: 'fast' } });
});
test('E12b no JSON + legacy convention → config-missing + legacy', () => {
  const f = mk(); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'), { recursive: true });
  fs.writeFileSync(path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'), 'x\n'.repeat(11) + '## 外部执行器委派\n');
  const r = run(f, pargs(f)); disabledWith(r, 'config-missing'); assert.equal(r.legacy[0].line, 12); assert.equal(r.legacy[0].kind, 'delegation-section');
});
test('workspace convention (global layer) detected only when arguments are passed', () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle'), { recursive: true });
  fs.writeFileSync(path.join(f.ws, '.task-lifecycle', '工作区约定.md'), '执行时默认采用\n');
  assert.equal(run(f).legacy.length, 0);
  const r = run(f, pargs(f)); assert.deepEqual(r.legacy.map((l) => [l.kind, l.layer, l.suggestedJson.workflowDepth.executionDefault]), [['depth-execution-default', 'global', null]]);
});
test('E20 only --workspace given → project-identity-unverified, project layer path null', () => {
  const f = mk(); writeG(f, G1(f));
  const r = run(f, ['--workspace', f.ws]); disabledWith(r, 'project-identity-unverified');
  assert.deepEqual(r.layers.project, { exists: null, path: null, readable: null, realpath: null, sha256: null });
  assert.equal(r.reasons[0].detail, 'missing --project-id');
});
test('E22 project directory is a symlink → project-identity-unverified', { skip: dirLinkSkip }, () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f), 'B'); fs.symlinkSync(path.join(f.ws, '.task-lifecycle', 'B'), path.join(f.ws, '.task-lifecycle', 'A'), 'dir');
  disabledWith(run(f, pargs(f, 'A')), 'project-identity-unverified');
});
test('case-variant same-name directory → project-identity-unverified', { skip: caseSkip }, () => {
  let f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'p1'), { recursive: true }); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'));
  disabledWith(run(f, pargs(f)), 'project-identity-unverified');
});
test('invalid id / non-absolute workspace → project-identity-unverified', () => {
  let f = mk(); writeG(f, G1(f)); disabledWith(run(f, ['--workspace', f.ws, '--project-id', '../x']), 'project-identity-unverified');
  f = mk(); writeG(f, G1(f)); disabledWith(run(f, ['--workspace', 'rel', '--project-id', 'P1']), 'project-identity-unverified');
});
test('project config.json is a symlink → project-identity-unverified', { skip: fileLinkSkip }, () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'), { recursive: true });
  fs.writeFileSync(path.join(f.base, 'other.json'), JSON.stringify(P1(f))); fs.symlinkSync(path.join(f.base, 'other.json'), ppath(f));
  disabledWith(run(f, pargs(f)), 'project-identity-unverified');
});
test('E23 《项目约定.md》 out-of-bounds symlink → legacy-check-skipped unsafe-path, status valid', { skip: fileLinkSkip }, () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  fs.writeFileSync(path.join(f.base, 'x.md'), '## 外部执行器委派\n'); fs.symlinkSync(path.join(f.base, 'x.md'), path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'));
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid');
  assert.deepEqual(r.legacy.map((l) => [l.kind, l.detail, l.line, l.suggestedJson]), [['legacy-check-skipped', 'unsafe-path', 0, null]]);
});
test('E24 .task-lifecycle absent entirely → project layer exists=false', () => { const f = mk(); writeG(f, G1(f)); const r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.equal(r.layers.project.exists, false); });
test('E25 convention path safe but unreadable / non-UTF-8 → legacy-check-skipped', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const pm = path.join(f.ws, '.task-lifecycle', 'P1', '项目约定.md'); fs.writeFileSync(pm, Buffer.from([0xff, 0xfe, 0x00]));
  let r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.equal(r.legacy[0].detail, 'invalid-encoding');
  const realFs = fs; const fakeFs = { ...realFs, openSync: (p, ...a) => { if (p === pm) { const e = new Error('x'); e.code = 'EACCES'; throw e; } return realFs.openSync(p, ...a); } };
  r = run(f, pargs(f), { fs: fakeFs }); assert.equal(r.status, 'valid'); assert.equal(r.legacy[0].detail, 'unreadable');
});
test('E13 HOME mismatch → home-mismatch, global path by account home', () => {
  const f = mk(); writeG(f, G1(f));
  const r = run(f, [], {}, { HOME: '/tmp/x' });
  disabledWith(r, 'config-location-forbidden');
  assert.deepEqual(r.reasons, [{ code: 'config-location-forbidden', detail: 'home-mismatch', layer: 'env', path: '', stage: 'env' }]);
  assert.equal(r.layers.global.path, gpath(f)); assert.equal(r.layers.global.exists, null); assert.equal(r.env.home, '/tmp/x');
});
test('home-unverifiable: userInfo throws → global path null', () => {
  const f = mk(); const r = run(f, [], { userInfo: () => { throw new Error('nss'); } });
  disabledWith(r, 'home-unverifiable'); assert.equal(r.layers.global.path, null); assert.equal(r.env.accountHome, null);
});
test('invalid-argument: unknown argument (stage env)', () => { const f = mk(); writeG(f, G1(f)); const r = run(f, ['--config', '/x']); disabledWith(r, 'invalid-argument'); assert.equal(r.reasons[0].stage, 'env'); });
// Path-mapping fs: maps the virtual prefix /workspace/tlvc-e18 to a temp dir; writes nothing to the real /workspace
function mapFs(virt, real) {
  const map = (p, from, to) => typeof p === 'string' && V.underPrefix(p, from) ? path.join(to, path.relative(from, p)) : p;
  const to = p => map(p, virt, real);
  const back = p => map(p, real, virt);
  return { ...fs, lstatSync: (p, ...a) => fs.lstatSync(to(p), ...a), statSync: (p, ...a) => fs.statSync(to(p), ...a), readFileSync: (p, ...a) => fs.readFileSync(to(p), ...a), openSync: (p, ...a) => fs.openSync(to(p), ...a), readdirSync: (p, ...a) => fs.readdirSync(to(p), ...a), realpathSync: (p) => back(fs.realpathSync(to(p))) };
}
test('E18 /workspace/.task-lifecycle/<ID>/config.json valid project layer (virtual /workspace path)', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const virt = path.join(path.parse(f.ws).root, 'workspace', 'tlvc-e18');
  const r = run(f, ['--workspace', virt, '--project-id', 'P1'], { fs: mapFs(virt, f.ws) });
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.equal(r.layers.project.realpath, path.join(virt, '.task-lifecycle', 'P1', 'config.json'));
});
test('global config under the /workspace subtree → config-location-forbidden (workspace-subtree)', () => {
  const f = mk(); writeG(f, G1(f));
  const virt = path.join(path.parse(f.home).root, 'workspace', 'tlvc-home');
  const r = V.validate([], { HOME: virt }, { userInfo: () => ({ homedir: virt }), scriptPath: SCRIPT, fs: mapFs(virt, f.home) });
  disabledWith(r, 'config-location-forbidden'); assert.equal(r.reasons[0].detail, 'workspace-subtree');
});
test('global config is a symlink → config-location-forbidden', { skip: fileLinkSkip }, () => {
  const f = mk(); fs.writeFileSync(path.join(f.base, 'g.json'), JSON.stringify(G1(f))); fs.mkdirSync(path.dirname(gpath(f)), { recursive: true }); fs.symlinkSync(path.join(f.base, 'g.json'), gpath(f));
  disabledWith(run(f), 'config-location-forbidden');
});
test('global config in the plugin directory → config-location-forbidden', () => {
  const f = mk(); writeG(f, G1(f));
  disabledWith(run(f, [], { scriptPath: path.join(f.home, '.config', 'scripts', 'validate-config.mjs') }), 'config-location-forbidden');
});
test('config-unreadable: directory or read failure', () => {
  let f = mk(); fs.mkdirSync(gpath(f), { recursive: true }); disabledWith(run(f), 'config-unreadable');
  f = mk(); writeG(f, G1(f)); const fakeFs = { ...fs, openSync: (p, ...a) => { if (p === gpath(f)) { const e = new Error('x'); e.code = 'EIO'; throw e; } return fs.openSync(p, ...a); } };
  const r = run(f, [], { fs: fakeFs }); disabledWith(r, 'config-unreadable');
  assert.deepEqual(r.layers.global, { exists: true, path: gpath(f), readable: false, realpath: null, sha256: null });
  const f3 = mk(); writeG(f3, G1(f3)); writeP(f3, P1(f3));
  const fake3 = { ...fs, openSync: (p, ...a) => { if (p === ppath(f3)) { const e = new Error('x'); e.code = 'EACCES'; throw e; } return fs.openSync(p, ...a); } };
  const r3 = run(f3, pargs(f3), { fs: fake3 }); disabledWith(r3, 'config-unreadable');
  assert.deepEqual(r3.layers.project, { exists: true, path: ppath(f3), readable: false, realpath: null, sha256: null });
});
test('A1-02 project argument missing value: invalid-argument and project layer kept (all null)', () => {
  for (const argv of [['--workspace'], ['--project-id']]) {
    const f = mk(); writeG(f, G1(f)); const r = run(f, argv); disabledWith(r, 'invalid-argument');
    assert.deepEqual(r.layers.project, { exists: null, path: null, readable: null, realpath: null, sha256: null });
  }
});
test('legacy three phrasings × tiers: suggestedJson carries the tier (custom → null)', () => {
  for (const [t, v] of [['执行时默认采用 fast', 'fast'], ['执行时默认采用standard', 'standard'], ['以后默认采用 thorough', 'thorough'], ['默认采用 fast', 'fast'], ['默认采用 custom', null], ['执行时默认采用', null]]) {
    const h = V.detectLegacyText(t); assert.equal(h.length, 1, t); assert.deepEqual(h[0].suggestedJson, { workflowDepth: { executionDefault: v } }, t);
  }
  assert.equal(V.detectLegacyText('默认采用的是').length, 0);
});
test('parse: BOM, non-UTF-8, non-JSON, trailing content → config-parse-error; duplicate key → duplicate-key (CO-A04-01)', () => {
  const cases = [Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('{}')]), Buffer.from([0x7b, 0xff, 0x7d]), '{', '{} x'];
  for (const c of cases) { const f = mk(); writeG(f, c); disabledWith(run(f), 'config-parse-error'); }
  const f = mk(); writeG(f, '{"schemaVersion":1,"schemaVersion":1}'); const r = run(f); disabledWith(r, 'duplicate-key'); assert.equal(r.reasons[0].stage, 'parse');
  const f2 = mk(); writeG(f2, '{"a":{"b":1,"b":2}}'); assert.equal(run(f2).reasons[0].path, 'a.b');
});
test('approvalSource subtree reports only approval-source-missing', () => {
  const variants = [(g) => delete g.approvalSource, (g) => (g.approvalSource = 'x'), (g) => (g.approvalSource.messageId = 'u1'), (g) => (g.approvalSource.quote = '  '), (g) => (g.approvalSource.quote = 'x'.repeat(501)), (g) => (g.approvalSource.record = 'rel.md'), (g) => (g.approvalSource.record = '/nonexistent/x.md'), (g) => (g.approvalSource.extra = 1)];
  for (const v of variants) { const f = mk(); const g = G1(f); v(g); writeG(f, g); const r = run(f); disabledWith(r, 'approval-source-missing'); assert.deepEqual([...new Set(codes(r))], ['approval-source-missing']); }
  const f = mk(); const g = G1(f); g.approvalSource.messageId = 't12s34'; writeG(f, g); assert.equal(run(f).status, 'valid');
});
test('E30 record ancestor hits a Git marker → approval-source-missing', () => {
  const f = mk(); fs.mkdirSync(path.join(path.dirname(f.record), '.git')); writeG(f, G1(f)); disabledWith(run(f), 'approval-source-missing');
});
test('E26 global ancestors four markers × file/dir/symlink, start and parents', async t => {
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
test('E27 project config ancestor hit → forbidden as a whole, no fallback to global', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f)); fs.writeFileSync(path.join(f.ws, 'HEAD'), '');
  const r = run(f, pargs(f)); disabledWith(r, 'config-location-forbidden'); assert.equal(r.reasons[0].layer, 'project');
});
test('E28 project file missing, nearest ancestor hit → forbidden', () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.git')); disabledWith(run(f, pargs(f)), 'config-location-forbidden');
});
test('E29 lstat marker EACCES/EIO/ELOOP/non-errno → forbidden; pure function', () => {
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
test('start realpath fails: config → config-location-forbidden; record → approval-source-missing', () => {
  let f = mk(); writeG(f, G1(f));
  let fakeFs = { ...fs, realpathSync: (p) => { if (p === gpath(f)) { const e = new Error('x'); e.code = 'EIO'; throw e; } return fs.realpathSync(p); } };
  disabledWith(run(f, [], { fs: fakeFs }), 'config-location-forbidden');
  f = mk(); writeG(f, G1(f));
  fakeFs = { ...fs, realpathSync: (p) => { if (p === f.record) { const e = new Error('x'); e.code = 'EIO'; throw e; } return fs.realpathSync(p); } };
  disabledWith(run(f, [], { fs: fakeFs }), 'approval-source-missing');
});
test('E32 valid review → hosts in config order', () => {
  const f = mk(); const g = { ...G1(f), review: REVIEW() }; g.review.hosts.push({ command: 'other', id: 'b-host' }); writeG(f, g);
  const r = run(f); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.deepEqual(r.effective.review.hosts, [{ command: 'codex', id: 'codex-cli', model: 'gpt-6-astra', reasoningEffort: 'high' }, { command: 'other', id: 'b-host', model: null, reasoningEffort: null }]);
  assert.deepEqual(r.effective.review.enabled, { sourceLayer: 'global', value: true });
});
test('E33/E34 reasoningEffort out of range, model with spaces or ; → invalid-value', () => {
  for (const [k, v] of [['reasoningEffort', 'xhigh'], ['reasoningEffort', 'minimal'], ['model', 'a b'], ['model', 'a;b']]) {
    let f = mk(); let g = { ...G1(f), review: REVIEW() }; g.review.hosts[0][k] = v; writeG(f, g); disabledWith(run(f), 'invalid-value');
    f = mk(); g = G1(f); g.delegation.executors['codex-cli'][k] = v; writeG(f, g); disabledWith(run(f), 'invalid-value');
  }
  const f = mk(); const g = G1(f); g.delegation.executors['codex-cli'].model = 5; writeG(f, g); disabledWith(run(f), 'invalid-type');
});
test('E35 hosts:[], missing enabled, duplicate id, >4 hosts', () => {
  let f = mk(); let g = { ...G1(f), review: { ...REVIEW(), hosts: [] } }; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = { ...G1(f), review: REVIEW() }; delete g.review.enabled; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = { ...G1(f), review: REVIEW() }; g.review.hosts.push({ ...g.review.hosts[0] }); writeG(f, g); const r = run(f); disabledWith(r, 'invalid-value'); assert.equal(r.reasons[0].detail, 'duplicate-host-id');
  f = mk(); g = { ...G1(f), review: REVIEW() }; for (const id of ['h-b', 'h-c', 'h-d', 'h-e']) g.review.hosts.push({ command: 'c', id }); writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = { ...G1(f), review: REVIEW() }; delete g.review.hosts; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = { ...G1(f), review: { enabled: false, fallback: { ...V.REVIEW_FALLBACK } } }; writeG(f, g); assert.equal(run(f).status, 'valid');
});
test('E36 other fallback values → invalid-value; missing fallback → missing-field', () => {
  let f = mk(); let g = { ...G1(f), review: REVIEW() }; g.review.fallback.zeroExternal = 'skip-review'; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = { ...G1(f), review: REVIEW() }; delete g.review.fallback; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = { ...G1(f), review: REVIEW() }; g.review.x = 1; writeG(f, g); disabledWith(run(f), 'unknown-field');
});
test('E37 project layer review.hosts / executors.model → widening; review:{enabled:false} valid', () => {
  let f = mk(); writeG(f, { ...G1(f), review: REVIEW() }); writeP(f, { ...P1(f), review: { enabled: false, hosts: [] } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), delegation: { executors: { 'codex-cli': { command: 'codex', model: 'm' } } } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, G1(f)); writeP(f, { ...P1(f), delegation: { enabled: true } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, { ...G1(f), review: REVIEW() }); writeP(f, { ...P1(f), review: { enabled: true } }); disabledWith(run(f, pargs(f)), 'project-layer-widening');
  f = mk(); writeG(f, { ...G1(f), review: REVIEW() }); writeP(f, { ...P1(f), review: { enabled: false } });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid'); assert.deepEqual(r.effective.review.enabled, { sourceLayer: 'project', value: false }); assert.deepEqual(r.effective.review.hosts, []);
});
test('E38/CO-A04-05 review four combinations sourceLayer', () => {
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
test('CO-A04-04 only model written: effective reasoningEffort is null', () => {
  const f = mk(); const g = { ...G1(f), review: REVIEW() }; delete g.review.hosts[0].reasoningEffort; g.delegation.executors['codex-cli'].model = 'gpt-6-astra'; writeG(f, g);
  const r = run(f); assert.equal(r.status, 'valid');
  assert.equal(r.effective.review.hosts[0].reasoningEffort, null); assert.equal(r.effective.review.hosts[0].model, 'gpt-6-astra');
  assert.deepEqual(r.effective.delegation.executors['codex-cli'], { command: 'codex', model: 'gpt-6-astra', reasoningEffort: null });
});
test('CO-A04-04 symmetric: only reasoningEffort written → model is null (both host kinds)', () => {
  const f = mk(); const g = { ...G1(f), review: REVIEW() }; delete g.review.hosts[0].model; g.review.hosts[0].reasoningEffort = 'high';
  delete g.delegation.executors['codex-cli'].model; g.delegation.executors['codex-cli'].reasoningEffort = 'high'; writeG(f, g);
  const r = run(f); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.equal(r.effective.review.hosts[0].model, null); assert.equal(r.effective.review.hosts[0].reasoningEffort, 'high');
  assert.deepEqual(r.effective.delegation.executors['codex-cli'], { command: 'codex', model: null, reasoningEffort: 'high' });
});
test('global enabled:false → executors {}, four categories none (global), executors/categories may be omitted', () => {
  const f = mk(); writeG(f, { approvalSource: src(f), delegation: { enabled: false }, schemaVersion: 1 });
  const r = run(f); assert.equal(r.status, 'valid');
  assert.deepEqual(r.effective.delegation.enabled, { sourceLayer: 'global', value: false });
  assert.deepEqual(r.effective.delegation.categories.implementation, { sourceLayer: 'global', value: 'none' });
  assert.deepEqual(r.effective.workflowDepth.executionDefault, { sourceLayer: 'default', value: null });
});
test('enabled:true missing categories/executors → missing-field; categories pointing to undefined id → invalid-value; unknown category → unknown-field', () => {
  let f = mk(); writeG(f, { approvalSource: src(f), delegation: { enabled: true }, schemaVersion: 1 }); disabledWith(run(f), 'missing-field');
  f = mk(); let g = G1(f); g.delegation.categories.implementation = 'nope'; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.delegation.categories.misc = 'none'; writeG(f, g); disabledWith(run(f), 'unknown-field');
  f = mk(); g = G1(f); g.delegation.executors.Bad = { command: 'x' }; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.delegation.executors['codex-cli'].command = 'codex --x'; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.workflowDepth = { executionDefault: 'custom' }; writeG(f, g); disabledWith(run(f), 'invalid-value');
  f = mk(); g = G1(f); g.workflowDepth = {}; writeG(f, g); disabledWith(run(f), 'missing-field');
  f = mk(); g = G1(f); g.workflowDepth = { executionDefault: null }; writeG(f, g); disabledWith(run(f), 'invalid-type');
});
test('multiple codes in the same stage all listed, sorted by stage→code→layer→path', () => {
  const f = mk(); const g = G1(f); g.zz = 1; g.aa = 1; g.delegation.enabled = 'x'; writeG(f, g);
  const r = run(f); const keyed = r.reasons.map((x) => `${x.stage}|${x.code}|${x.layer}|${x.path}`);
  assert.deepEqual(keyed, [...keyed].sort()); assert.ok(r.reasons.length >= 3);
});
test('§3 determinism: given fixture, main 3 consecutive stdout byte-identical (including E38 default review shape)', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const outs = [0, 1, 2].map(() => V.main(pargs(f), { HOME: f.home }, deps(f)));
  for (const o of outs) { assert.equal(o.exitCode, 0); assert.equal(o.stdout, outs[0].stdout); }
  const parsed = JSON.parse(outs[0].stdout);
  assert.equal(parsed.status, 'valid'); assert.equal(parsed.layers.global.path, gpath(f));
  assert.deepEqual(parsed.effective.review, { enabled: { sourceLayer: 'default', value: false }, fallback: { ...V.REVIEW_FALLBACK }, hosts: [] });
  assert.ok(outs[0].stdout.endsWith('}\n'));
  assert.equal(V.main([], { HOME: '/nope' }, deps(f)).exitCode, 2);
});
test('sha256 is the raw-byte digest (CO-A04-06 output side)', () => {
  const f = mk(); writeG(f, G1(f));
  const sum = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const a = run(f).layers.global.sha256; assert.equal(a, sum(gpath(f)));
  fs.appendFileSync(gpath(f), ' '); const b = run(f).layers.global.sha256; assert.equal(b, sum(gpath(f))); assert.notEqual(a, b);
  writeG(f, '{"a":1,"a":2}'); const r = run(f); disabledWith(r, 'duplicate-key'); assert.equal(r.layers.global.sha256, sum(gpath(f)));
});
test('CLI child process runs (HOME conflict exits before reading real account config)', () => {
  const p = spawnSync(process.execPath, [SCRIPT], { env: { ...process.env, HOME: os.userInfo().homedir + '-fixture-mismatch' }, encoding: 'utf8', timeout: 5000 });
  assert.equal(p.status, 2); const r = JSON.parse(p.stdout); assert.equal(r.status, 'disabled'); assert.equal(r.reasons[0].detail, 'home-mismatch');
});
test('render sorts keys recursively, independent of insertion order', () => { assert.equal(V.render({ b: 1, a: { d: 1, c: [{ z: 1, y: 2 }] } }), V.render({ a: { c: [{ y: 2, z: 1 }], d: 1 }, b: 1 })); });
test('internal exception → exit code 1, empty stdout', () => {
  const f = mk(); writeG(f, G1(f));
  const r = V.main([], { HOME: f.home }, deps(f, { fs: new Proxy({}, { get: () => () => { throw new TypeError('boom'); } }) }));
  assert.ok(r.exitCode === 1 || r.exitCode === 2); // lstat throwing a non-errno → location-stage exit; only a render failure reaches 1
  const r2 = V.main([], { HOME: f.home }, { userInfo: () => ({ homedir: f.home }), scriptPath: 123 });
  assert.equal(r2.exitCode, 1); assert.equal(r2.stdout, '');
});
test('static scan (auxiliary): source has no write APIs, network or child-process modules', () => {
  const s = fs.readFileSync(SCRIPT, 'utf8');
  for (const bad of [/child_process/, /worker_threads/, /node:net/, /node:http/, /node:dgram/, /writeFile/, /appendFile/, /mkdir/, /rmSync|unlink|rename/, /createWriteStream/, /O_WRONLY|O_RDWR|O_CREAT|O_TRUNC|O_APPEND/]) assert.ok(!bad.test(s), String(bad));
  for (const m of s.matchAll(/openSync\(([^;]*)/g)) assert.match(m[1], /O_RDONLY \| fs\.constants\.O_NOFOLLOW/, 'only read-only, non-symlink-following opens allowed');
});
test('B1-01 object replaced between check and read: dev/ino mismatch or last component becomes symlink → config-location-forbidden, replacement not read', () => {
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
test('B1-02 global location gate fails → workspace convention not read (global legacy skipped)', () => {
  const f = mk(); writeG(f, G1(f)); fs.writeFileSync(path.join(f.home, 'HEAD'), '');
  fs.mkdirSync(path.join(f.ws, '.task-lifecycle'), { recursive: true });
  const wm = path.join(f.ws, '.task-lifecycle', '工作区约定.md'); fs.writeFileSync(wm, '## 外部执行器委派\n');
  const opened = []; const spy = { ...fs, openSync: (p, ...a) => { opened.push(p); return fs.openSync(p, ...a); }, readFileSync: (p, ...a) => { opened.push(p); return fs.readFileSync(p, ...a); } };
  const r = run(f, pargs(f), { fs: spy }); disabledWith(r, 'config-location-forbidden');
  assert.ok(!opened.includes(wm)); assert.deepEqual(r.legacy, []);
});
test('B2-01 global lstat throws EACCES/EIO (before safety verification) → workspace convention not read', () => {
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
test('B2-02 Setext heading hits; ATX inside code fences does not', () => {
  assert.deepEqual(V.detectLegacyText('外部执行器委派\n==============\n').map((h) => [h.kind, h.line]), [['delegation-section', 1]]);
  assert.deepEqual(V.detectLegacyText('外部执行器委派\n---\n').map((h) => h.line), [1]);
  assert.deepEqual(V.detectLegacyText('```\n## 外部执行器委派\n```\n'), []);
  assert.deepEqual(V.detectLegacyText('~~~md\n## 外部执行器委派\n~~~\n## 外部执行器委派\n').map((h) => h.line), [4]);
});
test('A3-01 convention and config: parent replaced after open → rejected before reading (readFileSync(fd) called zero times)', { skip: dirLinkSkip || renameOpenSkip }, () => {
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
test('A3-02 fence must use the same char and be no shorter than the opener; closing line whitespace only', () => {
  assert.deepEqual(V.detectLegacyText('````md\n```\n## 外部执行器委派\n````\n'), []);
  assert.deepEqual(V.detectLegacyText('````md\n```\n````\n## 外部执行器委派\n').map((h) => h.line), [4]);
  assert.deepEqual(V.detectLegacyText('```\n``` x\n## 外部执行器委派\n```\n'), []);
});
test('B3-02 schema types generated from FIELD_RULES: changing a constant type changes the result (mutation detected)', () => {
  const pairs = [[V.FIELD_RULES_GLOBAL.executor, 'executor'], [V.FIELD_RULES_GLOBAL.review, 'globalReview'], [V.FIELD_RULES_PROJECT.root, 'projectConfig']];
  for (const [rule, def] of pairs) {
    const old = rule.type; rule.type = 'array';
    try { assert.equal(V.buildSchemaDefs()[def].type, 'array', def); } finally { rule.type = old; }
    assert.equal(V.buildSchemaDefs()[def].type, old);
  }
});
test('A3-02(b2) packaged output protocol contains all reason codes and the three fixed fallback keys', () => {
  const t = fs.readFileSync(path.join(path.dirname(SCRIPT), '..', 'skills', 'task-lifecycle', 'references', 'validator-output-protocol.md'), 'utf8');
  for (const c of Object.keys(V.REASON_CODES)) assert.ok(t.includes('`' + c + '`'), c);
  for (const [k, v] of Object.entries(V.REVIEW_FALLBACK)) assert.ok(t.includes('`' + k + '`: `"' + v + '"`'), k);
});
test('B1-03 same name differing only by case is a regular file → not a project directory alias', { skip: caseSkip }, () => {
  const f = mk(); writeG(f, G1(f)); fs.mkdirSync(path.join(f.ws, '.task-lifecycle', 'P1'), { recursive: true }); fs.writeFileSync(path.join(f.ws, '.task-lifecycle', 'p1'), '');
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid', JSON.stringify(r.reasons)); assert.equal(r.layers.project.exists, false);
});
test('B1-03 case-variant symlink → project-identity-unverified', { skip: caseSkip || fileLinkSkip }, () => {
  const g = mk(); writeG(g, G1(g)); fs.mkdirSync(path.join(g.ws, '.task-lifecycle', 'P1'), { recursive: true }); fs.symlinkSync('/nonexistent', path.join(g.ws, '.task-lifecycle', 'p1'));
  disabledWith(run(g, pargs(g)), 'project-identity-unverified');
});
test('B1-04 project layer sha256 is the raw-byte digest; a fixed digest is detected', () => {
  const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
  const sum = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const r = run(f, pargs(f)); assert.equal(r.layers.project.sha256, sum(ppath(f))); assert.notEqual(r.layers.project.sha256, '0'.repeat(64));
  writeP(f, '{'); const r2 = run(f, pargs(f)); disabledWith(r2, 'config-parse-error'); assert.equal(r2.layers.project.sha256, sum(ppath(f)));
});
// ---------- Rule table single source ----------
const schema = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'config.schema.json'), 'utf8'));
const stripComments = (x) => (Array.isArray(x) ? x.map(stripComments) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).filter(([k]) => k !== '$comment').map(([k, v]) => [k, stripComments(v)])) : x);
test('schema and constants match field by field ($defs full comparison; global / project separate; root anyOf)', () => {
  assert.deepEqual(stripComments(schema.$defs), V.buildSchemaDefs());
  assert.deepEqual(schema.anyOf, [{ $ref: '#/$defs/globalConfig' }, { $ref: '#/$defs/projectConfig' }]);
  assert.equal(schema.oneOf, undefined);
  // Assertion validity counterexamples: common drift must be detected
  const mut = [(d) => (d.executor.properties.command.type = 'number'), (d) => (d.globalReview.required = []), (d) => (d.globalReview.then.required = []), (d) => (d.approvalSource.additionalProperties = true), (d) => (d.reviewHost.properties.model.pattern = '.*')];
  for (const m of mut) { const d = structuredClone(stripComments(schema.$defs)); m(d); assert.notDeepEqual(d, V.buildSchemaDefs()); }
  // Constants and schema key values cross-check
  const d = schema.$defs;
  assert.deepEqual(Object.keys(d.globalConfig.properties).sort(), [...V.FIELD_RULES_GLOBAL.root.properties].sort());
  assert.deepEqual(Object.keys(d.projectConfig.properties).sort(), [...V.FIELD_RULES_PROJECT.root.properties].sort());
});
function FIELD(a) { return [...a].sort(); }
test('assets/config.example.json: delegation and review both enabled:false, and pass structure validation', () => {
  const ex = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'config.example.json'), 'utf8'));
  assert.equal(ex.delegation.enabled, false); assert.equal(ex.review.enabled, false);
  const f = mk(); ex.approvalSource.record = f.record; writeG(f, ex); const r = run(f);
  assert.equal(r.status, 'valid', JSON.stringify(r.reasons)); assert.equal(r.effective.delegation.enabled.value, false); assert.equal(r.effective.review.enabled.value, false);
});
test('category table and never-delegate list match task-split-parallel-and-integration.md verbatim (anti-drift)', () => {
  const full = fs.readFileSync(path.join(root, 'skills', 'task-lifecycle', 'references', 'task-split-parallel-and-integration.md'), 'utf8');
  const a = full.indexOf('| Category | Phases and sub-steps that may be handed over (ceiling) |'); assert.ok(a > 0);
  const t = full.slice(a, full.indexOf('An external CLI as a read-only review session', a));
  const rows = {};
  for (const m of t.matchAll(/^\| `([a-z-]+)` \| (.+) \|$/gm)) rows[m[1]] = m[2];
  assert.deepEqual(rows, { ...V.CATEGORY_STAGE_LIMIT_TEXT });
  for (const k of V.CATEGORY_KEYS) assert.deepEqual([...new Set([...rows[k].matchAll(/\b(A\d\d|B\d\d|DOC\d\d)\b/g)].map((x) => x[1]))].sort(), [...V.CATEGORY_STAGE_LIMITS[k]].sort(), k);
  const lines = t.split('\n').map((x) => x.trim());
  const i = lines.indexOf(V.NEVER_DELEGATE_TEXT[0]); assert.ok(i > 0, 'never-delegate first line changed'); assert.equal(lines[i + 1], V.NEVER_DELEGATE_TEXT[1]);
  const nd = /\*\*Never delegate\*\*: all content of ([^\n]+?);/.exec(V.NEVER_DELEGATE_TEXT[0]);
  assert.deepEqual(nd[1].split(',').map((x) => x.trim()).filter(Boolean), [...V.NEVER_DELEGATE_STAGES]);
  // Counterexamples: removing a duty or loosening a ceiling must be detected
  assert.notEqual(V.NEVER_DELEGATE_TEXT[1].replace('SelfReview/', ''), lines[i + 1]);
  assert.notDeepEqual({ ...rows, implementation: 'A05 all content' }, { ...V.CATEGORY_STAGE_LIMIT_TEXT });
  assert.equal(rows['test-run'], 'A06 run per the frozen verification plan and return raw output; B02 write and run the repro script; B06 original Bug and regression tests; DOC07 no sub-step may be handed over (static scripts and the phase\'s other sub-steps are all outside the ceiling)');
  assert.ok(!V.CATEGORY_STAGE_LIMITS['test-run'].includes('A05'));
  assert.ok(![...rows['test-run'].matchAll(/\b(A\d\d|B\d\d|DOC\d\d)\b/g)].some((x) => x[1] === 'A05'));
  for (const w of ['start baseline', 'docs build', 'check-docs', 'real browser', 'reader task', 'example']) assert.ok(!rows['test-run'].includes(w), w);
  assert.notEqual(rows['test-run'], 'A05 start baseline check (existing tests/lint/type check); A06 run per the frozen verification plan and return raw output; B02 write and run the repro script; B06 original Bug and regression tests; DOC07 docs build/links/`check-docs` and other scripts');
});
test('A2-01 parent replaced at open by a symlink to the original dir (file inode unchanged) → config-location-forbidden', { skip: dirLinkSkip }, () => {
  for (const layer of ['global', 'project']) {
    const f = mk(); writeG(f, G1(f)); writeP(f, P1(f));
    const target = layer === 'global' ? gpath(f) : ppath(f);
    const dir = path.dirname(target); let done = false;
    const swapFs = { ...fs, openSync: (p, ...a) => { if (p === target && !done) { done = true; fs.renameSync(dir, dir + '-Moved'); fs.symlinkSync(dir + '-Moved', dir, 'dir'); } return fs.openSync(p, ...a); } };
    const r = run(f, pargs(f), { fs: swapFs }); disabledWith(r, 'config-location-forbidden'); assert.ok(done);
    assert.equal(r.reasons[0].detail, 'changed-during-check');
  }
});
test('A2-02 config or convention is a FIFO → closed/skipped immediately, no blocking', { skip: fifoSkip }, () => {
  const f = mk(); fs.mkdirSync(path.dirname(gpath(f)), { recursive: true });
  assert.equal(spawnSync('mkfifo', [gpath(f)]).status, 0);
  const t0 = Date.now(); const r = run(f); assert.ok(Date.now() - t0 < 5000); disabledWith(r, 'config-unreadable');
  const g = mk(); writeG(g, G1(g)); writeP(g, P1(g));
  assert.equal(spawnSync('mkfifo', [path.join(g.ws, '.task-lifecycle', 'P1', '项目约定.md')]).status, 0);
  const r2 = run(g, pargs(g)); assert.equal(r2.status, 'valid'); assert.equal(r2.legacy[0].kind, 'legacy-check-skipped'); assert.equal(r2.legacy[0].detail, 'unreadable');
});
test('A2-03 compound sentence: invalid prefix + valid later sentence still yields the tier', () => {
  assert.deepEqual(V.detectLegacyText('默认采用的是推荐值；以后默认采用 fast')[0].suggestedJson, { workflowDepth: { executionDefault: 'fast' } });
});
test('A2-04 FIELD_RULES allowed fields match schema properties keys one by one', () => {
  const d = schema.$defs, G = V.FIELD_RULES_GLOBAL;
  const pairs = [[G.root, d.globalConfig], [G.approvalSource, d.approvalSource], [G.delegation, d.globalDelegation], [G.executor, d.executor], [G.review, d.globalReview], [G.reviewHost, d.reviewHost], [G.reviewFallback, d.reviewFallback], [G.workflowDepth, d.globalWorkflowDepth], [V.FIELD_RULES_PROJECT.root, d.projectConfig], [G.parallel, d.globalParallel], [V.FIELD_RULES_PROJECT.parallel, d.projectParallel]];
  for (const [rule, def] of pairs) assert.deepEqual([...rule.properties].sort(), Object.keys(def.properties).sort());
  const f = mk(); const g = G1(f); g.delegation.executors['codex-cli'].auto = true; writeG(f, g); disabledWith(run(f), 'unknown-field');
});
test('A2-05 each phase/duty name listed in contract §2.2 :77 → forbidden-mapping (independent list)', () => {
  const contract = ['00', 'SelfReview', 'FormalReview', 'Approval', 'FindingClose', 'EvidenceSign', 'Integration', 'Commit', 'Push', 'Release', 'Delete', 'FinalAcceptance'];
  for (let i = 1; i <= 10; i++) { const n = String(i).padStart(2, '0'); contract.push(`A${n}`, `B${n}`, `DOC${n}`); }
  for (const k of contract) { const f = mk(); const g = G1(f); g.delegation.categories[k] = 'codex-cli'; writeG(f, g); const r = run(f); disabledWith(r, 'forbidden-mapping'); }
});
test('A2-06 frozen §11.4 example: review enabled does not enable delegation', () => {
  const f = mk(); writeG(f, { approvalSource: src(f, 't343u'), delegation: { enabled: false }, review: REVIEW(), schemaVersion: 1 });
  const r = run(f); assert.equal(r.status, 'valid', JSON.stringify(r.reasons));
  assert.deepEqual(r.effective.review.enabled, { sourceLayer: 'global', value: true });
  assert.deepEqual(r.effective.delegation.enabled, { sourceLayer: 'global', value: false }); assert.deepEqual(r.effective.delegation.executors, {});
  for (const k of V.CATEGORY_KEYS) assert.equal(r.effective.delegation.categories[k].value, 'none');
});
// ---------- Host-native parallel config (FEAT-20261028-001, T104–T107) ----------
function PAR_OFF() {
  return { categories: { drafting: { sourceLayer: 'default', value: false }, implementation: { sourceLayer: 'default', value: false }, 'readonly-investigation': { sourceLayer: 'default', value: true }, 'test-run': { sourceLayer: 'default', value: false } }, enabled: { sourceLayer: 'default', value: false }, maxConcurrent: { sourceLayer: 'default', value: 3 }, sameRepoWrites: { sourceLayer: 'default', value: 'disjoint-files-only' } };
}
const GP = (f, parallel) => ({ ...G1(f), parallel });
test('T104 parallel omitted, enabled:false and {} give byte-identical effective.parallel, all sourceLayer default (D31, AC10)', () => {
  const outs = [];
  for (const par of [undefined, { enabled: false }, {}, { enabled: false, maxConcurrent: 2, sameRepoWrites: 'never', categories: { implementation: true } }]) {
    const f = mk(); writeG(f, par === undefined ? G1(f) : GP(f, par)); const r = run(f);
    assert.equal(r.status, 'valid', JSON.stringify(r.reasons)); outs.push(r.effective.parallel);
  }
  for (const o of outs) assert.deepEqual(o, PAR_OFF());
  // project layer enabled:false over a globally enabled config is also the fixed default block
  const f = mk(); writeG(f, GP(f, { enabled: true, maxConcurrent: 4 })); writeP(f, { ...P1(f), parallel: { enabled: false } });
  const r = run(f, pargs(f)); assert.equal(r.status, 'valid', JSON.stringify(r.reasons)); assert.deepEqual(r.effective.parallel, PAR_OFF());
  // enabled: omitted fields take defaults, written fields carry global
  const g = mk(); writeG(g, GP(g, { enabled: true, categories: { implementation: true } })); const r2 = run(g);
  assert.deepEqual(r2.effective.parallel, { categories: { drafting: { sourceLayer: 'default', value: false }, implementation: { sourceLayer: 'global', value: true }, 'readonly-investigation': { sourceLayer: 'default', value: true }, 'test-run': { sourceLayer: 'default', value: false } }, enabled: { sourceLayer: 'global', value: true }, maxConcurrent: { sourceLayer: 'default', value: 3 }, sameRepoWrites: { sourceLayer: 'default', value: 'disjoint-files-only' } });
  // enabling parallel does not enable delegation or review
  const h = mk(); writeG(h, { approvalSource: src(h), delegation: { enabled: false }, parallel: { enabled: true }, schemaVersion: 1 }); const r3 = run(h);
  assert.equal(r3.effective.delegation.enabled.value, false); assert.equal(r3.effective.review.enabled.value, false); assert.equal(r3.effective.parallel.enabled.value, true);
});
test('T105 invalid parallel values → invalid-type / invalid-value / unknown-field / forbidden-mapping, whole config disabled (AC10)', () => {
  const cases = [
    [true, 'invalid-type'], [[], 'invalid-type'], [{ enabled: 'true' }, 'invalid-type'], [{ maxConcurrent: '3' }, 'invalid-type'], [{ maxConcurrent: 2.5 }, 'invalid-type'],
    [{ maxConcurrent: 0 }, 'invalid-value'], [{ maxConcurrent: 5 }, 'invalid-value'], [{ sameRepoWrites: 'always' }, 'invalid-value'], [{ sameRepoWrites: 1 }, 'invalid-type'],
    [{ auto: true }, 'unknown-field'], [{ categories: { review: true } }, 'unknown-field'], [{ categories: 'all' }, 'invalid-type'], [{ categories: { implementation: 'codex-cli' } }, 'invalid-type'],
    [{ categories: { A05: true } }, 'forbidden-mapping'], [{ categories: { Push: true } }, 'forbidden-mapping'],
  ];
  for (const [par, code] of cases) {
    const f = mk(); writeG(f, GP(f, par)); const r = run(f); disabledWith(r, code); assert.equal(r.reasons[0].stage, 'structure', JSON.stringify(par));
    const g = mk(); writeG(g, G1(g)); writeP(g, { ...P1(g), parallel: par }); disabledWith(run(g, pargs(g)), code);
  }
  for (const m of [1, 4]) { const f = mk(); writeG(f, GP(f, { enabled: true, maxConcurrent: m })); assert.equal(run(f).status, 'valid'); }
  for (const w of V.SAME_REPO_WRITES) { const f = mk(); writeG(f, GP(f, { sameRepoWrites: w })); assert.equal(run(f).status, 'valid'); }
  assert.deepEqual(V.SAME_REPO_WRITES, ['disjoint-files-only', 'worktree-with-per-time-authorization', 'never']);
  assert.deepEqual(V.PARALLEL_MAX_CONCURRENT, { min: 1, max: 4, default: 3 });
});
test('T106 project layer may only narrow parallel; equal to global passes; omitted keys inherit; structure errors first (D21, D26, R-2)', () => {
  const glob = { enabled: true, maxConcurrent: 3, categories: { implementation: true, 'test-run': false }, sameRepoWrites: 'disjoint-files-only' };
  const ok = [{ enabled: true }, { enabled: false }, { maxConcurrent: 3 }, { maxConcurrent: 1 }, { categories: { implementation: false } }, { categories: { implementation: true } },
    { sameRepoWrites: 'disjoint-files-only' }, { sameRepoWrites: 'never' }, {}];
  for (const pp of ok) { const f = mk(); writeG(f, GP(f, glob)); writeP(f, { ...P1(f), parallel: pp }); const r = run(f, pargs(f)); assert.equal(r.status, 'valid', JSON.stringify([pp, r.reasons])); }
  const wide = [[{ maxConcurrent: 4 }, 'parallel.maxConcurrent'], [{ categories: { 'test-run': true } }, 'parallel.categories.test-run'], [{ categories: { drafting: true } }, 'parallel.categories.drafting'],
    [{ sameRepoWrites: 'worktree-with-per-time-authorization' }, 'parallel.sameRepoWrites']];
  for (const [pp, at] of wide) {
    const f = mk(); writeG(f, GP(f, glob)); writeP(f, { ...P1(f), parallel: pp }); const r = run(f, pargs(f));
    disabledWith(r, 'project-layer-widening'); assert.equal(r.reasons[0].stage, 'merge'); assert.equal(r.reasons[0].path, at);
  }
  // R-2: with global worktree-with-per-time-authorization, the project layer may write only that value or never; disjoint-files-only is widening
  for (const [w, okv] of [['worktree-with-per-time-authorization', true], ['never', true], ['disjoint-files-only', false]]) {
    const f = mk(); writeG(f, GP(f, { enabled: true, sameRepoWrites: 'worktree-with-per-time-authorization' })); writeP(f, { ...P1(f), parallel: { sameRepoWrites: w } });
    const r = run(f, pargs(f)); if (okv) assert.equal(r.status, 'valid', w); else disabledWith(r, 'project-layer-widening');
  }
  // global never: the project layer may only write never
  { const f = mk(); writeG(f, GP(f, { enabled: true, sameRepoWrites: 'never' })); writeP(f, { ...P1(f), parallel: { sameRepoWrites: 'disjoint-files-only' } }); disabledWith(run(f, pargs(f)), 'project-layer-widening'); }
  // global omitted or off: project enabled:true is widening
  for (const gpar of [undefined, { enabled: false }]) {
    const f = mk(); writeG(f, gpar === undefined ? G1(f) : GP(f, gpar)); writeP(f, { ...P1(f), parallel: { enabled: true } });
    const r = run(f, pargs(f)); disabledWith(r, 'project-layer-widening'); assert.equal(r.reasons[0].path, 'parallel.enabled');
  }
  // omitted sub-keys inherit global; written ones are project
  { const f = mk(); writeG(f, GP(f, glob)); writeP(f, { ...P1(f), parallel: { maxConcurrent: 2, categories: { implementation: false } } }); const r = run(f, pargs(f));
    assert.deepEqual(r.effective.parallel.maxConcurrent, { sourceLayer: 'project', value: 2 }); assert.deepEqual(r.effective.parallel.enabled, { sourceLayer: 'global', value: true });
    assert.deepEqual(r.effective.parallel.categories.implementation, { sourceLayer: 'project', value: false }); assert.deepEqual(r.effective.parallel.categories['test-run'], { sourceLayer: 'global', value: false });
    assert.deepEqual(r.effective.parallel.sameRepoWrites, { sourceLayer: 'global', value: 'disjoint-files-only' }); }
  // project layer without parallel inherits global
  { const f = mk(); writeG(f, GP(f, glob)); writeP(f, P1(f)); const r = run(f, pargs(f)); assert.deepEqual(r.effective.parallel.maxConcurrent, { sourceLayer: 'global', value: 3 }); assert.equal(r.effective.parallel.enabled.value, true); }
  // structure error reported before widening
  { const f = mk(); writeG(f, GP(f, glob)); writeP(f, { ...P1(f), parallel: { enabled: true, maxConcurrent: 9 } }); const r = run(f, pargs(f)); disabledWith(r, 'invalid-value'); assert.ok(!codes(r).includes('project-layer-widening')); }
});
test('T107 schemaVersion stays 1; a 0.2.6-shaped root (no parallel key) reports parallel as unknown-field (AC14)', async () => {
  const f = mk(); writeG(f, { ...GP(f, { enabled: false }), schemaVersion: 2 }); disabledWith(run(f), 'schema-version-unknown');
  assert.equal(schema.$defs.globalConfig.properties.schemaVersion.const, 1);
  const legacyRoot = ['approvalSource', 'delegation', 'review', 'schemaVersion', 'workflowDepth']; // FIELD_RULES_GLOBAL.root.properties at f47c527 (0.2.6)
  assert.deepEqual(V.FIELD_RULES_GLOBAL.root.properties.filter((k) => k !== 'parallel'), legacyRoot);
  // Build a 0.2.6-shaped validator: same script with `parallel` removed from both root key lists (f47c527 FIELD_RULES), then validate a config containing parallel
  const legacyDir = mk(); const lp = path.join(legacyDir.base, 'plugin', 'scripts', 'validate-config-0.2.6-shape.mjs'); fs.mkdirSync(path.dirname(lp), { recursive: true });
  const srcText = fs.readFileSync(SCRIPT, 'utf8').replaceAll("properties: ['approvalSource', 'delegation', 'parallel', 'review', 'schemaVersion', 'workflowDepth'] },", "properties: ['approvalSource', 'delegation', 'review', 'schemaVersion', 'workflowDepth'] },");
  assert.notEqual(srcText, fs.readFileSync(SCRIPT, 'utf8')); fs.writeFileSync(lp, srcText);
  const L = await import(pathToFileURL(lp).href);
  assert.deepEqual([...L.FIELD_RULES_GLOBAL.root.properties], legacyRoot);
  writeG(f, GP(f, { enabled: false }));
  const lr = L.validate([], { HOME: f.home }, { userInfo: () => ({ homedir: f.home }), scriptPath: lp });
  assert.equal(lr.status, 'disabled'); assert.ok(lr.reasons.some((x) => x.code === 'unknown-field' && x.path === 'parallel'), JSON.stringify(lr.reasons)); assert.equal(lr.effective, null);
});
test('T-A3 coverage gate (runs last): actually hit reason codes ⊇ REASON_CODES, with matching stage ownership', () => {
  for (const [code, stages] of Object.entries(V.REASON_CODES)) {
    assert.ok(HIT.has(code), `reason code ${code} has no triggering fixture`);
    for (const st of HIT.get(code)) assert.ok(stages.split('|').includes(st), `${code} appears in stage ${st}`);
  }
  for (const code of HIT.keys()) assert.ok(code in V.REASON_CODES, `unregistered reason code ${code}`);
});
