#!/usr/bin/env node
// task-lifecycle 放权类配置校验（只读、零依赖、Node >= 20）。
// 契约：使用契约（A02）§1–§4；结构：技术方案（A03）§2–§4、§11.3。
// 不写文件、不联网、不启动任何子进程；只读两层 config.json、两份约定 Markdown 与路径元数据。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const VALIDATOR = Object.freeze({ name: 'task-lifecycle-validate-config', version: '1' });
export const STAGES = Object.freeze(['env', 'locate', 'parse', 'version', 'structure', 'merge']);
export const REASON_CODES = Object.freeze({
  'invalid-argument': 'env',
  'home-unverifiable': 'env',
  'config-location-forbidden': 'env|locate',
  'config-missing': 'locate',
  'project-identity-unverified': 'locate',
  'config-unreadable': 'locate',
  'config-parse-error': 'parse',
  'duplicate-key': 'parse',
  'schema-version-unknown': 'version',
  'missing-field': 'version|structure',
  'invalid-type': 'version|structure',
  'invalid-value': 'structure',
  'unknown-field': 'structure',
  'forbidden-mapping': 'structure',
  'approval-source-missing': 'structure',
  'project-layer-widening': 'merge',
});
export const CATEGORY_KEYS = Object.freeze(['drafting', 'implementation', 'readonly-investigation', 'test-run']);
// 任务拆分并行与整合.md 类别上限表（阶段代号）；测试对照该文件解析结果。
export const CATEGORY_STAGE_LIMITS = Object.freeze({
  implementation: ['A05', 'B04', 'DOC05'],
  'readonly-investigation': ['A01', 'A02', 'A03', 'A10', 'B10', 'DOC10', 'B01', 'DOC02'],
  'test-run': ['A05', 'A06', 'B02', 'B06', 'DOC07'],
  drafting: ['A07', 'B07'],
});
// 任务拆分并行与整合.md「类别与上限」表逐字文本与永不委派两行（测试逐字比对，防漂移；改规则须同步）。
export const CATEGORY_STAGE_LIMIT_TEXT = Object.freeze({
  "drafting": "A07 按已生效契约起草使用文档与示例；B07 按已定修复起草文档与契约同步文本",
  "implementation": "A05 实现已批准 WI 的代码与测试；B04 实现已批准最小修复并补失败→修复测试；DOC05 按已批准内容契约和修改清单编写",
  "readonly-investigation": "A01 现有行为事实；A02 实际调用表面盘点；A03 依赖版本与源码结构核对；A10/B10/DOC10 受影响面收集；B01 环境/日志/消费者；DOC02 事实盘点",
  "test-run": "A05 开工基线检查（既有测试/lint/类型检查）；A06 按冻结验证方案运行并交回原始输出；B02 编写并运行复现脚本；B06 原 Bug 与回归测试；DOC07 docs build/链接/`check-docs` 等脚本"
});
export const NEVER_DELEGATE_TEXT = Object.freeze([
  "- **永不委派**：00、A04、A08、A09、B03、B05、B08、B09、DOC01、DOC03、DOC04、DOC06、DOC08、DOC09 全部内容；",
  "以及任何阶段的 SelfReview/FormalReview/Approval、Finding 关闭、E1～E4 判定与证据签署、根因与回归结论、整合、commit/push/发布/删除、最终验收。"
]);
export const NEVER_DELEGATE_STAGES = Object.freeze(['00', 'A04', 'A08', 'A09', 'B03', 'B05', 'B08', 'B09', 'DOC01', 'DOC03', 'DOC04', 'DOC06', 'DOC08', 'DOC09']);
const STAGE_NAMES = [];
for (let i = 1; i <= 10; i++) { const n = String(i).padStart(2, '0'); STAGE_NAMES.push(`A${n}`, `B${n}`, `DOC${n}`); }
export const FORBIDDEN_MAPPING_KEYS = Object.freeze(['00', ...STAGE_NAMES.sort(), 'SelfReview', 'FormalReview', 'Approval', 'FindingClose', 'EvidenceSign', 'Integration', 'Commit', 'Push', 'Release', 'Delete', 'FinalAcceptance']);
export const DEPTH_VALUES = Object.freeze(['fast', 'standard', 'thorough']);
export const REASONING_EFFORT_VALUES = Object.freeze(['high', 'medium', 'low']);
export const PATTERNS = Object.freeze({
  executorId: '^[a-z][a-z0-9-]{1,31}$',
  command: '^[A-Za-z0-9._-]{1,64}$',
  model: '^[A-Za-z0-9._:-]{1,64}$',
  messageId: '^(t[0-9]+u|t[0-9]+s[0-9]+)$',
  projectId: '^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$',
});
export const REVIEW_FALLBACK = Object.freeze({
  noIndependentSession: 'blocked-needs-evidence',
  oneExternal: 'host-fresh-session-else-isolated-sessions-of-external',
  zeroExternal: 'isolated-host-sessions',
});
export const REVIEW_HOSTS_MAX = 4;
export const QUOTE_MAX = 500;
// 逐字段规则（单一来源）；schema 一致性测试逐项对照 assets/config.schema.json。
export const FIELD_RULES_GLOBAL = Object.freeze({
  root: { type: 'object', required: ['schemaVersion', 'approvalSource', 'delegation'], properties: ['approvalSource', 'delegation', 'review', 'schemaVersion', 'workflowDepth'] },
  approvalSource: { type: 'object', required: ['messageId', 'quote', 'record'], properties: ['messageId', 'quote', 'record'] },
  delegation: { type: 'object', required: ['enabled'], requiredIfEnabled: ['categories', 'executors'], properties: ['categories', 'enabled', 'executors'] },
  executor: { type: 'object', required: ['command'], properties: ['command', 'model', 'reasoningEffort'] },
  workflowDepth: { type: 'object', required: ['executionDefault'], properties: ['executionDefault'] },
  review: { type: 'object', required: ['enabled', 'fallback'], requiredIfEnabled: ['hosts'], properties: ['enabled', 'fallback', 'hosts'] },
  reviewHost: { type: 'object', required: ['command', 'id'], properties: ['command', 'id', 'model', 'reasoningEffort'] },
  reviewFallback: { type: 'object', required: ['noIndependentSession', 'oneExternal', 'zeroExternal'], properties: ['noIndependentSession', 'oneExternal', 'zeroExternal'] },
});
export const FIELD_RULES_PROJECT = Object.freeze({
  root: { type: 'object', required: ['schemaVersion', 'approvalSource'], properties: ['approvalSource', 'delegation', 'review', 'schemaVersion', 'workflowDepth'] },
  approvalSource: FIELD_RULES_GLOBAL.approvalSource,
  delegation: { type: 'object', required: [], properties: ['categories', 'enabled', 'executors'] },
  workflowDepth: { type: 'object', required: [], properties: ['executionDefault'], executionDefaultNullable: true },
  review: { type: 'object', onlyAllowed: { enabled: false } },
});

// 人读 schema 的 $defs 由上列常量生成；测试断言 assets/config.schema.json 的 $defs（去掉 $comment）与之逐字段相等。
const pick = (names, map) => Object.fromEntries(names.map((k) => { if (!(k in map)) throw new Error(`FIELD_RULES 字段 ${k} 无 schema 定义`); return [k, map[k]]; }));
export function buildSchemaDefs() {
  const str = (pattern) => (pattern ? { type: 'string', pattern: PATTERNS[pattern] } : { type: 'string' });
  const effort = { type: 'string', enum: [...REASONING_EFFORT_VALUES] };
  const ifEnabled = { if: { properties: { enabled: { const: true } }, required: ['enabled'] } };
  const G = FIELD_RULES_GLOBAL, P = FIELD_RULES_PROJECT;
  return {
    approvalSource: { type: G.approvalSource.type, properties: pick(G.approvalSource.properties, { messageId: str('messageId'), quote: { type: 'string', minLength: 1, maxLength: QUOTE_MAX, pattern: '\\S' }, record: { type: 'string', pattern: '^/.*\\.md$' } }), required: [...G.approvalSource.required], additionalProperties: false },
    categories: { type: 'object', properties: Object.fromEntries(CATEGORY_KEYS.map((k) => [k, { type: 'string' }])), additionalProperties: false },
    executor: { type: G.executor.type, properties: pick(G.executor.properties, { command: str('command'), model: str('model'), reasoningEffort: effort }), required: [...G.executor.required], additionalProperties: false },
    globalDelegation: { type: G.delegation.type, properties: pick(G.delegation.properties, { categories: { $ref: '#/$defs/categories' }, enabled: { type: 'boolean' }, executors: { type: 'object', propertyNames: { pattern: PATTERNS.executorId }, additionalProperties: { $ref: '#/$defs/executor' } } }), required: [...G.delegation.required], ...ifEnabled, then: { required: [...G.delegation.requiredIfEnabled] }, additionalProperties: false },
    projectDelegation: { type: P.delegation.type, properties: { categories: { $ref: '#/$defs/categories' }, enabled: { const: false } }, additionalProperties: false },
    globalWorkflowDepth: { type: G.workflowDepth.type, properties: { executionDefault: { enum: [...DEPTH_VALUES] } }, required: [...G.workflowDepth.required], additionalProperties: false },
    projectWorkflowDepth: { type: P.workflowDepth.type, properties: { executionDefault: { enum: [...DEPTH_VALUES, null] } }, additionalProperties: false },
    reviewHost: { type: G.reviewHost.type, properties: pick(G.reviewHost.properties, { command: str('command'), id: str('executorId'), model: str('model'), reasoningEffort: effort }), required: [...G.reviewHost.required], additionalProperties: false },
    reviewFallback: { type: G.reviewFallback.type, properties: Object.fromEntries(Object.entries(REVIEW_FALLBACK).map(([k, v]) => [k, { const: v }])), required: [...G.reviewFallback.required], additionalProperties: false },
    globalReview: { type: G.review.type, properties: pick(G.review.properties, { enabled: { type: 'boolean' }, fallback: { $ref: '#/$defs/reviewFallback' }, hosts: { type: 'array', minItems: 1, maxItems: REVIEW_HOSTS_MAX, items: { $ref: '#/$defs/reviewHost' } } }), required: [...G.review.required], ...ifEnabled, then: { required: [...G.review.requiredIfEnabled] }, additionalProperties: false },
    projectReview: { type: P.review.type, properties: { enabled: { const: false } }, required: ['enabled'], additionalProperties: false },
    globalConfig: { type: G.root.type, properties: { approvalSource: { $ref: '#/$defs/approvalSource' }, delegation: { $ref: '#/$defs/globalDelegation' }, review: { $ref: '#/$defs/globalReview' }, schemaVersion: { const: 1 }, workflowDepth: { $ref: '#/$defs/globalWorkflowDepth' } }, required: [...G.root.required], additionalProperties: false },
    projectConfig: { type: P.root.type, properties: { approvalSource: { $ref: '#/$defs/approvalSource' }, delegation: { $ref: '#/$defs/projectDelegation' }, review: { $ref: '#/$defs/projectReview' }, schemaVersion: { const: 1 }, workflowDepth: { $ref: '#/$defs/projectWorkflowDepth' } }, required: [...P.root.required], additionalProperties: false },
  };
}

const defaultDeps = () => ({
  fs,
  userInfo: () => os.userInfo(),
  scriptPath: fileURLToPath(import.meta.url),
});

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const typeName = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v);
const re = (k) => new RegExp(PATTERNS[k]);
const reason = (code, stage, layer, p = '', detail = '') => ({ code, detail, layer, path: p, stage });
const errCode = (e) => (e && typeof e === 'object' && typeof e.code === 'string' ? e.code : null);

// ---------- Git 边界（纯函数，lstat 可注入；只取 err.code，不 open/read） ----------
export const GIT_MARKERS = Object.freeze(['.git', 'HEAD', 'commondir', 'gitdir']);
export function gitBoundary(startDir, lstat) {
  let d = startDir;
  for (;;) {
    for (const m of GIT_MARKERS) {
      try { lstat(path.join(d, m)); return { ok: false, detail: `git-marker:${path.join(d, m)}` }; }
      catch (e) {
        const c = errCode(e);
        if (c === 'ENOENT' || c === 'ENOTDIR') continue;
        return { ok: false, detail: `unverifiable:${c ?? 'exception'}:${path.join(d, m)}` };
      }
    }
    const up = path.dirname(d);
    if (up === d) return { ok: true, detail: '' };
    d = up;
  }
}

// ---------- 重复键 / 尾随内容词法扫描 ----------
export function scanJson(text) {
  let i = 0; const n = text.length;
  const ws = () => { while (i < n && ' \t\n\r'.includes(text[i])) i++; };
  const fail = (m) => { const e = new Error(m); e.kind = 'parse'; throw e; };
  const str = () => {
    if (text[i] !== '"') fail('expected string');
    let j = i + 1;
    while (j < n && text[j] !== '"') { if (text[j] === '\\') j++; j++; }
    if (j >= n) fail('unterminated string');
    const raw = text.slice(i, j + 1); i = j + 1;
    try { return JSON.parse(raw); } catch { fail('bad string'); }
  };
  const dup = [];
  const value = (p) => {
    ws();
    const c = text[i];
    if (c === '{') {
      i++; const keys = new Set(); ws();
      if (text[i] === '}') { i++; return; }
      for (;;) {
        ws(); const k = str();
        const kp = p ? `${p}.${k}` : k;
        if (keys.has(k)) dup.push(kp); keys.add(k);
        ws(); if (text[i] !== ':') fail('expected :'); i++;
        value(kp); ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] === '}') { i++; return; }
        fail('expected , or }');
      }
    } else if (c === '[') {
      i++; ws();
      if (text[i] === ']') { i++; return; }
      let idx = 0;
      for (;;) {
        value(`${p}[${idx++}]`); ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] === ']') { i++; return; }
        fail('expected , or ]');
      }
    } else if (c === '"') { str(); }
    else {
      const m = /^(-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?|true|false|null)/.exec(text.slice(i));
      if (!m) fail('unexpected token'); i += m[0].length;
    }
  };
  value('');
  ws();
  if (i < n) fail('trailing content');
  return dup;
}

// ---------- 参数 ----------
export function parseArgs(argv) {
  const out = { workspace: undefined, projectId: undefined, sawProjectFlag: false, errors: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--workspace' || a === '--project-id') {
      const key = a === '--workspace' ? 'workspace' : 'projectId';
      out.sawProjectFlag = true;
      if (i + 1 >= argv.length) { out.errors.push(`missing value for ${a}`); continue; }
      if (out[key] !== undefined) { out.errors.push(`duplicate ${a}`); i++; continue; }
      out[key] = argv[++i];
    } else out.errors.push(`unknown argument ${a}`);
  }
  return out;
}

// ---------- 定位辅助 ----------
function lstatOrNull(fsx, p) { try { return fsx.lstatSync(p); } catch (e) { const c = errCode(e); if (c === 'ENOENT' || c === 'ENOTDIR') return null; throw e; } }
function underPrefix(p, prefix) { return p === prefix || p.startsWith(prefix.endsWith('/') ? prefix : prefix + '/'); }
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }

// 只读打开（O_NOFOLLOW）后用 fstat 绑定到先前 lstat 核验过的同一对象（dev+ino），再从该 fd 读取，防检查与读取之间被替换。
// 返回 { ok:true, bytes } / { ok:false, kind:'changed'|'unreadable', detail }
// 另在打开前拒绝非普通文件、以 O_NONBLOCK 打开（FIFO 不阻塞），读取后复核整条路径：realpath 仍等于先前核验值、lstat 仍指向同一对象（防父目录被换成 symlink）。
export function readBound(fsx, file, expectSt, expectReal) {
  if (!expectSt || !expectSt.isFile()) return { ok: false, kind: 'unreadable', detail: 'not-regular-file' };
  const pathStill = () => {
    try { const l = fsx.lstatSync(file); return fsx.realpathSync(file) === expectReal && l.dev === expectSt.dev && l.ino === expectSt.ino; } catch { return false; }
  };
  if (!pathStill()) return { ok: false, kind: 'changed', detail: 'changed-during-check' };
  let fd;
  try { fd = fsx.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK); }
  catch (e) { const c = errCode(e); return { ok: false, kind: c === 'ELOOP' ? 'changed' : 'unreadable', detail: c === 'ELOOP' ? 'changed-during-check:symlink' : (c ?? 'exception') }; }
  try {
    const st = fsx.fstatSync(fd);
    if (!expectSt || st.dev !== expectSt.dev || st.ino !== expectSt.ino) return { ok: false, kind: 'changed', detail: 'changed-during-check' };
    if (!st.isFile()) return { ok: false, kind: 'unreadable', detail: 'not-regular-file' };
    if (!pathStill()) return { ok: false, kind: 'changed', detail: 'changed-during-check' }; // A3-01：读取前再核整路径
    const bytes = fsx.readFileSync(fd);
    if (!pathStill()) return { ok: false, kind: 'changed', detail: 'changed-during-check' };
    return { ok: true, bytes };
  } catch (e) { return { ok: false, kind: 'unreadable', detail: errCode(e) ?? 'exception' }; }
  finally { try { fsx.closeSync(fd); } catch { /* 只读 fd，关闭失败不影响结论 */ } }
}
function readLayerFile(fsx, file, layer, out, reasons, expectSt) {
  const r = readBound(fsx, file, expectSt, out.realpath);
  if (r.ok) { out.readable = true; out.sha256 = sha256(r.bytes); return r.bytes; }
  reasons.push(reason(r.kind === 'changed' ? 'config-location-forbidden' : 'config-unreadable', 'locate', layer, file, r.detail));
  out.readable = false; out.realpath = null; out.sha256 = null;
  return null;
}

function locateGlobal(ctx, reasons) {
  const { fsx, accountHome, pluginRoot } = ctx;
  const file = path.join(accountHome, '.config', 'task-lifecycle', 'config.json');
  const out = { exists: null, path: file, readable: null, realpath: null, sha256: null };
  let st;
  try { st = lstatOrNull(fsx, file); } catch (e) { const r0 = reason('config-unreadable', 'locate', 'global', file, errCode(e) ?? 'exception'); PRE_SAFETY.add(r0); reasons.push(r0); out.exists = null; return { out, bytes: null }; }
  if (!st) {
    // 缺失时仍不得经 symlink 链离开：组件存在且是 symlink 视为 forbidden 不必要；按原规则 config-missing。
    out.exists = false; out.readable = false;
    reasons.push(reason('config-missing', 'locate', 'global', file, ''));
    return { out, bytes: null };
  }
  out.exists = true;
  let rp;
  try { rp = fsx.realpathSync(file); } catch (e) { reasons.push(reason('config-location-forbidden', 'locate', 'global', file, `realpath-failed:${errCode(e) ?? 'exception'}`)); return { out, bytes: null }; }
  out.realpath = rp;
  if (rp !== file || st.isSymbolicLink()) { reasons.push(reason('config-location-forbidden', 'locate', 'global', file, 'symlink-or-alias')); return { out, bytes: null }; }
  if (underPrefix(rp, '/workspace')) { reasons.push(reason('config-location-forbidden', 'locate', 'global', file, 'workspace-subtree')); return { out, bytes: null }; }
  const pluginDirs = [path.join(accountHome, '.codex', 'plugins'), path.join(accountHome, '.grok', 'installed-plugins'), path.join(accountHome, '.grok', 'bundled')];
  if (pluginRoot) pluginDirs.push(pluginRoot);
  for (const d of pluginDirs) if (underPrefix(rp, d)) { reasons.push(reason('config-location-forbidden', 'locate', 'global', file, 'plugin-directory')); return { out, bytes: null }; }
  const gb = gitBoundary(path.dirname(rp), (p) => fsx.lstatSync(p));
  if (!gb.ok) { reasons.push(reason('config-location-forbidden', 'locate', 'global', file, gb.detail)); return { out, bytes: null }; }
  const bytes = readLayerFile(fsx, file, 'global', out, reasons, st);
  return { out, bytes };
}

// 项目身份核实（使用契约 §4「身份责任分工」）；返回 { ok, detail, exists, start, projDir, wsReal }
function verifyProjectIdentity(fsx, ws, id) {
  const bad = (detail) => ({ ok: false, detail });
  if (typeof ws !== 'string' || !path.isAbsolute(ws)) return bad('workspace-not-absolute');
  if (!re('projectId').test(id)) return bad('project-id-invalid');
  let wsReal;
  try { const s = fsx.statSync(ws); if (!s.isDirectory()) return bad('workspace-not-directory'); wsReal = fsx.realpathSync(ws); }
  catch (e) { return bad(`workspace-unverifiable:${errCode(e) ?? 'exception'}`); }
  const tl = path.join(ws, '.task-lifecycle');
  const projDir = path.join(tl, id);
  const cfg = path.join(projDir, 'config.json');
  const expTl = path.join(wsReal, '.task-lifecycle');
  const expProj = path.join(expTl, id);
  try {
    const stTl = lstatOrNull(fsx, tl);
    if (!stTl) return { ok: true, exists: false, start: wsReal, projDir: expProj, wsReal };
    if (stTl.isSymbolicLink()) return bad('task-lifecycle-dir-symlink');
    if (fsx.realpathSync(tl) !== expTl) return bad('task-lifecycle-dir-alias');
    const lower = id.toLowerCase();
    for (const name of fsx.readdirSync(tl)) {
      if (name === id || name.toLowerCase() !== lower) continue;
      const v = lstatOrNull(fsx, path.join(tl, name));
      if (v && (v.isDirectory() || v.isSymbolicLink())) return bad('case-variant-project-dir');
    }
    const stP = lstatOrNull(fsx, projDir);
    if (!stP) return { ok: true, exists: false, start: expTl, projDir: expProj, wsReal };
    if (stP.isSymbolicLink()) return bad('project-dir-symlink');
    if (!stP.isDirectory()) return bad('project-dir-not-directory');
    const pr = fsx.realpathSync(projDir);
    if (pr !== expProj) return bad('project-dir-alias');
    const stC = lstatOrNull(fsx, cfg);
    if (!stC) return { ok: true, exists: false, start: pr, projDir: pr, wsReal };
    if (stC.isSymbolicLink()) return bad('config-symlink');
    let cr;
    try { cr = fsx.realpathSync(cfg); } catch (e) { return { ok: true, exists: true, realpathFailed: errCode(e) ?? 'exception', projDir: pr, wsReal }; }
    if (path.dirname(cr) !== pr) return bad('config-alias');
    return { ok: true, exists: true, realpath: cr, start: path.dirname(cr), projDir: pr, wsReal, lst: stC };
  } catch (e) { return bad(`identity-unverifiable:${errCode(e) ?? 'exception'}`); }
}

function locateProject(ctx, args, reasons) {
  const { fsx } = ctx;
  const out = { exists: null, path: null, readable: null, realpath: null, sha256: null };
  if (args.workspace === undefined || args.projectId === undefined) {
    reasons.push(reason('project-identity-unverified', 'locate', 'project', '', args.workspace === undefined ? 'missing --workspace' : 'missing --project-id'));
    return { out, bytes: null, id: null };
  }
  const file = path.join(args.workspace, '.task-lifecycle', args.projectId, 'config.json');
  out.path = file;
  const id = verifyProjectIdentity(fsx, args.workspace, args.projectId);
  if (!id.ok) { reasons.push(reason('project-identity-unverified', 'locate', 'project', file, id.detail)); return { out, bytes: null, id }; }
  if (id.realpathFailed) { out.exists = true; reasons.push(reason('config-location-forbidden', 'locate', 'project', file, `realpath-failed:${id.realpathFailed}`)); return { out, bytes: null, id }; }
  const gb = gitBoundary(id.start, (p) => fsx.lstatSync(p));
  if (!gb.ok) { out.exists = id.exists; reasons.push(reason('config-location-forbidden', 'locate', 'project', file, gb.detail)); return { out, bytes: null, id }; }
  out.exists = id.exists;
  if (!id.exists) { out.readable = false; return { out, bytes: null, id }; }
  out.realpath = id.realpath;
  const bytes = readLayerFile(fsx, file, 'project', out, reasons, id.lst);
  return { out, bytes, id };
}

// ---------- 解析 ----------
function parseLayer(bytes, layer, file, reasons) {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) { reasons.push(reason('config-parse-error', 'parse', layer, file, 'bom')); return undefined; }
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { reasons.push(reason('config-parse-error', 'parse', layer, file, 'invalid-utf8')); return undefined; }
  let dups;
  try { dups = scanJson(text); } catch (e) { reasons.push(reason('config-parse-error', 'parse', layer, file, e.message)); return undefined; }
  if (dups.length) { for (const d of dups) reasons.push(reason('duplicate-key', 'parse', layer, d, '')); return undefined; }
  return JSON.parse(text);
}

// ---------- 版本 ----------
function checkVersion(doc, layer, reasons) {
  if (!isObj(doc)) { reasons.push(reason('invalid-type', 'version', layer, '', `root:${typeName(doc)}`)); return; }
  if (!('schemaVersion' in doc)) reasons.push(reason('missing-field', 'version', layer, 'schemaVersion', ''));
  else if (!Number.isInteger(doc.schemaVersion)) reasons.push(reason('invalid-type', 'version', layer, 'schemaVersion', typeName(doc.schemaVersion)));
  else if (doc.schemaVersion !== 1) reasons.push(reason('schema-version-unknown', 'version', layer, 'schemaVersion', String(doc.schemaVersion)));
}

// ---------- 结构 ----------
function checkApprovalSource(ctx, doc, layer, reasons) {
  const a = doc.approvalSource; const probs = [];
  if (a === undefined) probs.push('missing');
  else if (!isObj(a)) probs.push(`type:${typeName(a)}`);
  else {
    for (const k of Object.keys(a)) if (!FIELD_RULES_GLOBAL.approvalSource.properties.includes(k)) probs.push(`unknown:${k}`);
    if (typeof a.messageId !== 'string' || !re('messageId').test(a.messageId)) probs.push('messageId');
    if (typeof a.quote !== 'string' || a.quote.length < 1 || [...a.quote].length > QUOTE_MAX || a.quote.trim() === '') probs.push('quote');
    if (typeof a.record !== 'string' || !path.isAbsolute(a.record) || !a.record.endsWith('.md')) probs.push('record');
    else {
      let st = null;
      try { st = ctx.fsx.statSync(a.record); } catch { probs.push('record-missing'); }
      if (st) {
        if (!st.isFile()) probs.push('record-not-file');
        else {
          let rp;
          try { rp = ctx.fsx.realpathSync(a.record); } catch (e) { probs.push(`record-realpath-failed:${errCode(e) ?? 'exception'}`); }
          if (rp) { const gb = gitBoundary(path.dirname(rp), (p) => ctx.fsx.lstatSync(p)); if (!gb.ok) probs.push(`record-${gb.detail}`); }
        }
      }
    }
  }
  if (probs.length) reasons.push(reason('approval-source-missing', 'structure', layer, 'approvalSource', probs.join(';')));
}

function checkKeys(obj, allowed, base, layer, reasons) {
  for (const k of Object.keys(obj)) if (!allowed.includes(k)) reasons.push(reason('unknown-field', 'structure', layer, base ? `${base}.${k}` : k, ''));
}
function need(obj, keys, base, layer, reasons) {
  for (const k of keys) if (!(k in obj)) reasons.push(reason('missing-field', 'structure', layer, `${base}.${k}`, ''));
}
function checkString(v, p, layer, reasons, pattern, en) {
  if (typeof v !== 'string') { reasons.push(reason('invalid-type', 'structure', layer, p, typeName(v))); return false; }
  if (pattern && !re(pattern).test(v)) { reasons.push(reason('invalid-value', 'structure', layer, p, '')); return false; }
  if (en && !en.includes(v)) { reasons.push(reason('invalid-value', 'structure', layer, p, '')); return false; }
  return true;
}
function checkModelEffort(o, base, layer, reasons) {
  if ('model' in o) checkString(o.model, `${base}.model`, layer, reasons, 'model');
  if ('reasoningEffort' in o) checkString(o.reasoningEffort, `${base}.reasoningEffort`, layer, reasons, null, REASONING_EFFORT_VALUES);
}
function checkCategories(cats, layer, reasons, executorIds) {
  if (!isObj(cats)) { reasons.push(reason('invalid-type', 'structure', layer, 'delegation.categories', typeName(cats))); return; }
  for (const [k, v] of Object.entries(cats)) {
    const p = `delegation.categories.${k}`;
    if (FORBIDDEN_MAPPING_KEYS.includes(k)) { reasons.push(reason('forbidden-mapping', 'structure', layer, p, '')); continue; }
    if (!CATEGORY_KEYS.includes(k)) { reasons.push(reason('unknown-field', 'structure', layer, p, '')); continue; }
    if (typeof v !== 'string') { reasons.push(reason('invalid-type', 'structure', layer, p, typeName(v))); continue; }
    if (executorIds && v !== 'none' && !executorIds.includes(v)) reasons.push(reason('invalid-value', 'structure', layer, p, 'undefined-executor'));
  }
}
function checkWorkflowDepth(doc, layer, reasons, nullable, required) {
  if (!('workflowDepth' in doc)) return;
  const w = doc.workflowDepth;
  if (!isObj(w)) { reasons.push(reason('invalid-type', 'structure', layer, 'workflowDepth', typeName(w))); return; }
  checkKeys(w, ['executionDefault'], 'workflowDepth', layer, reasons);
  if (!('executionDefault' in w)) { if (required) reasons.push(reason('missing-field', 'structure', layer, 'workflowDepth.executionDefault', '')); return; }
  if (w.executionDefault === null && nullable) return;
  checkString(w.executionDefault, 'workflowDepth.executionDefault', layer, reasons, null, DEPTH_VALUES);
}

function checkGlobalStructure(ctx, doc, reasons) {
  const L = 'global';
  checkKeys(doc, FIELD_RULES_GLOBAL.root.properties, '', L, reasons);
  checkApprovalSource(ctx, doc, L, reasons);
  if (!('delegation' in doc)) reasons.push(reason('missing-field', 'structure', L, 'delegation', ''));
  else if (!isObj(doc.delegation)) reasons.push(reason('invalid-type', 'structure', L, 'delegation', typeName(doc.delegation)));
  else {
    const d = doc.delegation;
    checkKeys(d, FIELD_RULES_GLOBAL.delegation.properties, 'delegation', L, reasons);
    need(d, ['enabled'], 'delegation', L, reasons);
    if ('enabled' in d && typeof d.enabled !== 'boolean') reasons.push(reason('invalid-type', 'structure', L, 'delegation.enabled', typeName(d.enabled)));
    if (d.enabled === true) need(d, ['categories', 'executors'], 'delegation', L, reasons);
    let ids = null;
    if ('executors' in d) {
      if (!isObj(d.executors)) reasons.push(reason('invalid-type', 'structure', L, 'delegation.executors', typeName(d.executors)));
      else {
        ids = [];
        for (const [id, e] of Object.entries(d.executors)) {
          const p = `delegation.executors.${id}`;
          if (!re('executorId').test(id)) { reasons.push(reason('invalid-value', 'structure', L, p, 'executor-id')); continue; }
          ids.push(id);
          if (!isObj(e)) { reasons.push(reason('invalid-type', 'structure', L, p, typeName(e))); continue; }
          checkKeys(e, FIELD_RULES_GLOBAL.executor.properties, p, L, reasons);
          need(e, ['command'], p, L, reasons);
          if ('command' in e) checkString(e.command, `${p}.command`, L, reasons, 'command');
          checkModelEffort(e, p, L, reasons);
        }
      }
    }
    if ('categories' in d) checkCategories(d.categories, L, reasons, ids ?? []);
  }
  checkWorkflowDepth(doc, L, reasons, false, true);
  if ('review' in doc) {
    const r = doc.review;
    if (!isObj(r)) reasons.push(reason('invalid-type', 'structure', L, 'review', typeName(r)));
    else {
      checkKeys(r, FIELD_RULES_GLOBAL.review.properties, 'review', L, reasons);
      need(r, ['enabled', 'fallback'], 'review', L, reasons);
      if ('enabled' in r && typeof r.enabled !== 'boolean') reasons.push(reason('invalid-type', 'structure', L, 'review.enabled', typeName(r.enabled)));
      if (r.enabled === true) need(r, ['hosts'], 'review', L, reasons);
      if ('hosts' in r) {
        if (!Array.isArray(r.hosts)) reasons.push(reason('invalid-type', 'structure', L, 'review.hosts', typeName(r.hosts)));
        else if (r.hosts.length === 0) reasons.push(reason('invalid-value', 'structure', L, 'review.hosts', 'empty'));
        else {
          if (r.hosts.length > REVIEW_HOSTS_MAX) reasons.push(reason('invalid-value', 'structure', L, 'review.hosts', 'too-many'));
          const seen = new Set();
          r.hosts.forEach((h, i) => {
            const p = `review.hosts[${i}]`;
            if (!isObj(h)) { reasons.push(reason('invalid-type', 'structure', L, p, typeName(h))); return; }
            checkKeys(h, FIELD_RULES_GLOBAL.reviewHost.properties, p, L, reasons);
            need(h, ['command', 'id'], p, L, reasons);
            if ('id' in h && checkString(h.id, `${p}.id`, L, reasons, 'executorId')) {
              if (seen.has(h.id)) reasons.push(reason('invalid-value', 'structure', L, `${p}.id`, 'duplicate-host-id'));
              seen.add(h.id);
            }
            if ('command' in h) checkString(h.command, `${p}.command`, L, reasons, 'command');
            checkModelEffort(h, p, L, reasons);
          });
        }
      }
      if ('fallback' in r) {
        const f = r.fallback;
        if (!isObj(f)) reasons.push(reason('invalid-type', 'structure', L, 'review.fallback', typeName(f)));
        else {
          checkKeys(f, FIELD_RULES_GLOBAL.reviewFallback.properties, 'review.fallback', L, reasons);
          need(f, FIELD_RULES_GLOBAL.reviewFallback.required, 'review.fallback', L, reasons);
          for (const [k, v] of Object.entries(REVIEW_FALLBACK)) if (k in f) checkString(f[k], `review.fallback.${k}`, L, reasons, null, [v]);
        }
      }
    }
  }
}

function checkProjectStructure(ctx, doc, reasons) {
  const L = 'project';
  checkKeys(doc, FIELD_RULES_PROJECT.root.properties, '', L, reasons);
  checkApprovalSource(ctx, doc, L, reasons);
  if ('delegation' in doc) {
    const d = doc.delegation;
    if (!isObj(d)) reasons.push(reason('invalid-type', 'structure', L, 'delegation', typeName(d)));
    else {
      checkKeys(d, FIELD_RULES_PROJECT.delegation.properties, 'delegation', L, reasons);
      if ('enabled' in d && typeof d.enabled !== 'boolean') reasons.push(reason('invalid-type', 'structure', L, 'delegation.enabled', typeName(d.enabled)));
      if ('categories' in d) checkCategories(d.categories, L, reasons, null);
    }
  }
  checkWorkflowDepth(doc, L, reasons, true, false);
  if ('review' in doc && !isObj(doc.review)) reasons.push(reason('invalid-type', 'structure', L, 'review', typeName(doc.review)));
}

// ---------- 合并 ----------
function mergeLayers(g, p, reasons) {
  if (p) {
    const L = 'project';
    const d = p.delegation;
    if (isObj(d)) {
      if (d.enabled === true) reasons.push(reason('project-layer-widening', 'merge', L, 'delegation.enabled', ''));
      if ('executors' in d) reasons.push(reason('project-layer-widening', 'merge', L, 'delegation.executors', ''));
      if (isObj(d.categories)) for (const [k, v] of Object.entries(d.categories)) {
        const gv = isObj(g.delegation.categories) && k in g.delegation.categories ? g.delegation.categories[k] : 'none';
        if (v !== 'none' && v !== gv) reasons.push(reason('project-layer-widening', 'merge', L, `delegation.categories.${k}`, ''));
      }
    }
    if (isObj(p.review)) {
      for (const k of Object.keys(p.review)) if (k !== 'enabled') reasons.push(reason('project-layer-widening', 'merge', L, `review.${k}`, ''));
      if (!('enabled' in p.review) || p.review.enabled !== false) reasons.push(reason('project-layer-widening', 'merge', L, 'review.enabled', ''));
    }
  }
  if (reasons.length) return null;
  const gd = g.delegation; const pd = p && isObj(p.delegation) ? p.delegation : {};
  const pEnabledFalse = pd.enabled === false;
  const enabledVal = gd.enabled === true && !pEnabledFalse;
  const enabledSrc = gd.enabled === false ? 'global' : pEnabledFalse ? 'project' : 'global';
  const categories = {};
  for (const k of CATEGORY_KEYS) {
    if (!enabledVal) { categories[k] = { sourceLayer: enabledSrc, value: 'none' }; continue; }
    if (isObj(pd.categories) && k in pd.categories) categories[k] = { sourceLayer: 'project', value: pd.categories[k] };
    else if (isObj(gd.categories) && k in gd.categories) categories[k] = { sourceLayer: 'global', value: gd.categories[k] };
    else categories[k] = { sourceLayer: 'default', value: 'none' };
  }
  const executors = {};
  if (enabledVal) for (const [id, e] of Object.entries(gd.executors)) executors[id] = { command: e.command, model: e.model ?? null, reasoningEffort: e.reasoningEffort ?? null };
  let review;
  const fallback = { ...REVIEW_FALLBACK };
  if (!isObj(g.review)) review = { enabled: { sourceLayer: 'default', value: false }, fallback, hosts: [] };
  else {
    const pFalse = p && isObj(p.review);
    const val = g.review.enabled === true && !pFalse;
    const src = g.review.enabled === false ? 'global' : pFalse ? 'project' : 'global';
    review = { enabled: { sourceLayer: src, value: val }, fallback, hosts: val ? g.review.hosts.map((h) => ({ command: h.command, id: h.id, model: h.model ?? null, reasoningEffort: h.reasoningEffort ?? null })) : [] };
  }
  let ed;
  if (p && isObj(p.workflowDepth) && 'executionDefault' in p.workflowDepth) ed = { sourceLayer: 'project', value: p.workflowDepth.executionDefault };
  else if (isObj(g.workflowDepth)) ed = { sourceLayer: 'global', value: g.workflowDepth.executionDefault };
  else ed = { sourceLayer: 'default', value: null };
  return { delegation: { categories, enabled: { sourceLayer: enabledSrc, value: enabledVal }, executors }, review, workflowDepth: { executionDefault: ed } };
}

// 安全核实前失败的 reason（B2-01）：该层约定不得读取
const PRE_SAFETY = new WeakSet();

// ---------- legacy 检测 ----------
const LEGACY_DEPTH_RE = /(执行时默认采用|以后默认采用|默认采用)\s*(fast|standard|thorough|custom)?/g;
function matchLegacyDepth(line) {
  for (const m of line.matchAll(LEGACY_DEPTH_RE)) if (m[1] === '执行时默认采用' || m[2]) return { tier: m[2] ?? null };
  return null;
}
export function detectLegacyText(text) {
  const hits = [];
  const lines = text.split('\n');
  let fence = null;
  lines.forEach((line, i) => {
    const f = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (f) {
      if (!fence) { if (!(f[1][0] === '`' && f[2].includes('`'))) { fence = f[1]; return; } }
      else if (f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*$/.test(f[2])) { fence = null; return; }
    }
    if (fence) return;
    const next = lines[i + 1] ?? '';
    const atx = /^\s{0,3}#{1,6}\s/.test(line);
    const setext = /^\s{0,3}\S/.test(line) && /^\s{0,3}(=+|-+)\s*$/.test(next);
    if ((atx || setext) && line.includes('外部执行器委派')) hits.push({ kind: 'delegation-section', line: i + 1, suggestedJson: { delegation: { categories: null, enabled: null, executors: null } } });
    const m = matchLegacyDepth(line);
    if (m) {
      const tier = m.tier;
      hits.push({ kind: 'depth-execution-default', line: i + 1, suggestedJson: { workflowDepth: { executionDefault: tier && DEPTH_VALUES.includes(tier) ? tier : null } } });
    }
  });
  return hits;
}
function legacyForFile(fsx, file, tlReal, layer, out) {
  let st;
  try { st = lstatOrNull(fsx, file); } catch (e) { out.push({ detail: 'unreadable', file, kind: 'legacy-check-skipped', layer, line: 0, suggestedJson: null }); return; }
  if (!st) return;
  let rp = null;
  try { rp = fsx.realpathSync(file); } catch { /* fallthrough */ }
  if (st.isSymbolicLink() || !rp || !underPrefix(rp, tlReal)) { out.push({ detail: 'unsafe-path', file, kind: 'legacy-check-skipped', layer, line: 0, suggestedJson: null }); return; }
  const rb = readBound(fsx, file, st, rp);
  if (!rb.ok) { out.push({ detail: rb.kind === 'changed' ? 'unsafe-path' : 'unreadable', file, kind: 'legacy-check-skipped', layer, line: 0, suggestedJson: null }); return; }
  const bytes = rb.bytes;
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { out.push({ detail: 'invalid-encoding', file, kind: 'legacy-check-skipped', layer, line: 0, suggestedJson: null }); return; }
  for (const h of detectLegacyText(text)) out.push({ detail: '', file, kind: h.kind, layer, line: h.line, suggestedJson: h.suggestedJson });
}
function detectLegacy(ctx, args, projectLocate, locateReasons) {
  const out = []; const { fsx } = ctx;
  if (typeof args.workspace !== 'string' || !path.isAbsolute(args.workspace)) return out;
  let wsReal;
  try { if (!fsx.statSync(args.workspace).isDirectory()) return out; wsReal = fsx.realpathSync(args.workspace); } catch { return out; }
  const tl = path.join(args.workspace, '.task-lifecycle');
  const tlReal = path.join(wsReal, '.task-lifecycle');
  let tlSt;
  try { tlSt = lstatOrNull(fsx, tl); } catch { return out; }
  if (!tlSt) return out;
  if (tlSt.isSymbolicLink()) { out.push({ detail: 'unsafe-path', file: path.join(tl, '工作区约定.md'), kind: 'legacy-check-skipped', layer: 'global', line: 0, suggestedJson: null }); return out; }
  const globalBlocked = locateReasons.some((r) => r.layer === 'global' && (r.code === 'config-location-forbidden' || PRE_SAFETY.has(r)));
  if (!globalBlocked) legacyForFile(fsx, path.join(tl, '工作区约定.md'), tlReal, 'global', out);
  const projBlocked = locateReasons.some((r) => r.layer === 'project' && (r.code === 'project-identity-unverified' || r.code === 'config-location-forbidden'));
  if (args.projectId !== undefined && !projBlocked && projectLocate && projectLocate.id && projectLocate.id.ok) {
    const pd = path.join(tl, args.projectId);
    legacyForFile(fsx, path.join(pd, '项目约定.md'), path.join(tlReal, args.projectId), 'project', out);
  }
  return out;
}

// ---------- 稳定序列化 ----------
export function render(v) {
  const sortRec = (x) => (Array.isArray(x) ? x.map(sortRec) : isObj(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, sortRec(x[k])])) : x);
  return JSON.stringify(sortRec(v), null, 2) + '\n';
}
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sortReasons = (rs) => rs.sort((a, b) => cmp(a.stage, b.stage) || cmp(a.code, b.code) || cmp(a.layer, b.layer) || cmp(a.path, b.path) || cmp(a.detail, b.detail));
const sortLegacy = (ls) => ls.sort((a, b) => cmp(a.layer, b.layer) || cmp(a.file, b.file) || a.line - b.line || cmp(a.kind, b.kind));

// ---------- 主流程 ----------
export function validate(argv, env, depsIn = {}) {
  const deps = { ...defaultDeps(), ...depsIn };
  const fsx = deps.fs;
  const args = parseArgs(argv);
  const anyProjectArg = args.sawProjectFlag;
  const result = { approvalSources: [], effective: null, env: { accountHome: null, home: typeof env.HOME === 'string' ? env.HOME : '' }, layers: {}, legacy: [], reasons: [], schemaVersion: 1, status: 'disabled', validator: { ...VALIDATOR } };
  const nullLayer = (p) => ({ exists: null, path: p, readable: null, realpath: null, sha256: null });
  const projPath = args.workspace !== undefined && args.projectId !== undefined ? path.join(args.workspace, '.task-lifecycle', args.projectId, 'config.json') : null;
  // 1 env
  const envReasons = [];
  for (const e of args.errors) envReasons.push(reason('invalid-argument', 'env', 'env', '', e));
  let accountHome = null;
  try { const h = deps.userInfo().homedir; if (typeof h === 'string' && path.isAbsolute(h)) accountHome = h; } catch { /* home-unverifiable */ }
  result.env.accountHome = accountHome;
  if (accountHome === null) envReasons.push(reason('home-unverifiable', 'env', 'env', '', ''));
  else if (env.HOME !== accountHome) envReasons.push(reason('config-location-forbidden', 'env', 'env', '', 'home-mismatch'));
  const globalExpected = accountHome === null ? null : path.join(accountHome, '.config', 'task-lifecycle', 'config.json');
  if (envReasons.length) {
    result.layers.global = nullLayer(globalExpected);
    if (anyProjectArg) result.layers.project = nullLayer(projPath);
    result.reasons = sortReasons(envReasons);
    return result;
  }
  const pluginRoot = deps.scriptPath ? path.dirname(path.dirname(deps.scriptPath)) : null;
  const ctx = { fsx, accountHome, pluginRoot };
  // 2 locate
  const locR = [];
  const g = locateGlobal(ctx, locR);
  result.layers.global = g.out;
  let pl = null;
  if (anyProjectArg) { pl = locateProject(ctx, args, locR); result.layers.project = pl.out; }
  result.legacy = sortLegacy(detectLegacy(ctx, args, pl, locR));
  const finish = (rs) => { result.reasons = sortReasons(rs); return result; };
  if (locR.length) return finish(locR);
  // 3 parse
  const parR = [];
  const gDoc = parseLayer(g.bytes, 'global', g.out.path, parR);
  const pDoc = pl && pl.bytes ? parseLayer(pl.bytes, 'project', pl.out.path, parR) : undefined;
  if (parR.length) return finish(parR);
  // 4 version
  const verR = [];
  checkVersion(gDoc, 'global', verR);
  if (pl && pl.bytes) checkVersion(pDoc, 'project', verR);
  if (verR.length) return finish(verR);
  // 5 structure
  const stR = [];
  checkGlobalStructure(ctx, gDoc, stR);
  if (pl && pl.bytes) checkProjectStructure(ctx, pDoc, stR);
  if (stR.length) return finish(stR);
  // 6 merge
  const mR = [];
  const eff = mergeLayers(gDoc, pl && pl.bytes ? pDoc : null, mR);
  if (mR.length) return finish(mR);
  result.status = 'valid';
  result.effective = eff;
  result.approvalSources = [{ layer: 'global', ...gDoc.approvalSource }];
  if (pl && pl.bytes) result.approvalSources.push({ layer: 'project', ...pDoc.approvalSource });
  result.approvalSources = result.approvalSources.map((a) => ({ layer: a.layer, messageId: a.messageId, quote: a.quote, record: a.record }));
  return result;
}

export function main(argv = process.argv.slice(2), env = process.env, deps = {}) {
  try {
    const r = validate(argv, env, deps);
    return { stdout: render(r), exitCode: r.status === 'valid' ? 0 : 2 };
  } catch (e) {
    return { stdout: '', stderr: `validate-config internal error: ${e && e.message ? e.message : String(e)}\n`, exitCode: 1 };
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) {
  const { stdout, stderr, exitCode } = main();
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  process.exitCode = exitCode;
}
