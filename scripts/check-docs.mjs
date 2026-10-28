#!/usr/bin/env node
// Documentation self-check (zero dependencies). Usage:
//   node scripts/check-docs.mjs                 # long lines + relative links/anchors
//   node scripts/check-docs.mjs --compare <dir> # also compare skills/task-lifecycle with <dir> (e.g. the Grok skill directory)
// Rules:
//   (a) each .md line is at most MAX_LEN=200 characters (Unicode code points); excluded: lines inside ``` code blocks, table rows (starting with |),
//       the YAML frontmatter at file start (the SKILL.md description must be a single line, see (f)).
//   (b) relative links [x](path#anchor) must point to existing files; with an anchor on a .md target, the anchor must match a heading (approx. GitHub slug rules).
//       Excluded: http(s)/mailto links, external protocols other than pure #anchors, links inside code blocks.
//   (c) in-plugin references inside backticks must exist: paths starting with references/ templates/ examples/ scripts/ docs/ assets/ skills/,
//       or bare *.md names under skills/task-lifecycle; resolved against the containing dir, skill root, repo root (bare names also in references/templates/examples).
//       Excluded: inside code blocks, values with wildcards/placeholders (* { } < >); runtime directories and consumer project paths are out of scope.
//   (d) Length limits (§7.10 item 7): skills/task-lifecycle/SKILL.md at most 300 lines;
//       each .md under skills/task-lifecycle/references/ at most 600 lines (D7; Rocky t948u raised it from 500).
//   (f) the SKILL.md frontmatter must contain a description written on a single line (no block scalar, no continuation lines).
//   (g) no CJK in skills/task-lifecycle/**/*.md, docs/**/*.md and CHANGELOG.md, except exact literals listed in scripts/cjk-allowlist.json
//       (each entry scoped to its files, with bucket and reason); allowlist entries no longer found in their files also fail.
//   (e) README consistency (M-12): README.md and README.zh-CN.md have the same heading-level sequence; both badge versions = plugin.json version.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_LEN = 200;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['skills/task-lifecycle', 'docs', 'README.md', 'CHANGELOG.md'];
const optionalTargets = ['README.zh-CN.md']; // checked only when present (D2=B)
const errors = [];
const skillRoot = path.join(root, 'skills/task-lifecycle');
const PREFIX = /^(references|templates|examples|scripts|docs|assets|skills)\//;
const inSkill = f => !path.relative(skillRoot, f).startsWith('..');

function walk(p, out = []) {
  const st = fs.statSync(p);
  if (st.isFile()) { if (p.endsWith('.md')) out.push(p); return out; }
  for (const e of fs.readdirSync(p)) walk(path.join(p, e), out);
  return out;
}
function slug(h) {
  return h.trim().toLowerCase().replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
}
const anchorCache = new Map();
function anchors(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const set = new Set(); const seen = {}; let inCode = false;
  for (const l of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (/^\s*```/.test(l)) { inCode = !inCode; continue; }
    const m = !inCode && /^#{1,6}\s+(.*)$/.exec(l);
    if (m) { let s = slug(m[1]); const n = seen[s] ?? 0; seen[s] = n + 1; set.add(n ? `${s}-${n}` : s); }
  }
  anchorCache.set(file, set); return set;
}

const files = [];
for (const t of targets) {
  try {
    const p = path.join(root, t), st = fs.statSync(p);
    if (t.endsWith('.md') ? !st.isFile() : !st.isDirectory()) throw new Error('target type mismatch');
    const found = walk(p);
    if (!found.length) throw new Error('no Markdown to check');
    files.push(...found);
  } catch (e) { errors.push(`${t}: required target not checkable (${e.message})`); }
}
for (const t of optionalTargets) { const p = path.join(root, t); if (fs.existsSync(p) && fs.statSync(p).isFile()) files.push(p); }
if (fs.existsSync(path.join(root, 'plugin.json')) && fs.existsSync(path.join(root, 'README.md'))) { // a missing manifest or README is reported by other gates; do not crash here
  const ver = JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8')).version;
  const heads = f => { let c = false; return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => { if (/^\s*```/.test(l)) { c = !c; return false; } return !c && /^#{1,6}\s/.test(l); }).map(l => l.match(/^#+/)[0].length); };
  const en = path.join(root, 'README.md'), zh = path.join(root, 'README.zh-CN.md');
  for (const f of [en, zh]) if (fs.existsSync(f)) {
    const m = /badge\/version-([0-9][^-]*)-/.exec(fs.readFileSync(f, 'utf8'));
    if (!m || m[1] !== ver) errors.push(`${path.relative(root, f)}: version badge ${m ? m[1] : 'missing'} ≠ plugin.json ${ver}`);
  }
  if (fs.existsSync(zh) && heads(en).join() !== heads(zh).join()) errors.push(`README.md and README.zh-CN.md heading-level sequences differ`);
}
try {
  const entry = path.join(skillRoot, 'SKILL.md');
  if (!fs.statSync(entry).isFile() || !fs.readFileSync(entry).length) throw new Error('entry must be a non-empty regular file');
} catch (e) { errors.push(`skills/task-lifecycle/SKILL.md: required entry not checkable (${e.message})`); }
if (!files.length) errors.push('no Markdown scanned; cannot report success');
for (const f of files) {
  const rel = path.relative(root, f);
  let inCode = false; let inFm = false;
  let body;
  try { body = fs.readFileSync(f, 'utf8'); } catch (e) { errors.push(`${rel}: read failed (${e.message})`); continue; }
  if (targets.includes(rel) && !body.length) errors.push(`${rel}: required file is empty`);
  body.split(/\r?\n/).forEach((line, i) => {
    if (i === 0 && line === '---') { inFm = true; return; }
    if (inFm) { if (line === '---') inFm = false; return; }
    if (/^\s*```/.test(line)) { inCode = !inCode; return; }
    if (inCode) return;
    const len = [...line].length;
    if (len > MAX_LEN && !/^\s*\|/.test(line)) errors.push(`${rel}:${i + 1}: line length ${len} > ${MAX_LEN}`);
    for (const m of line.matchAll(/`([^`\s]+)`/g)) {
      const ref = m[1].replace(/[:#].*$/, '');
      if (/[*{}<>]/.test(ref)) continue;
      const prefixed = PREFIX.test(ref);
      const bare = inSkill(f) && /^[^/]+\.md$/.test(ref);
      if (!prefixed && !bare) continue;
      const bases = [path.dirname(f), skillRoot, root, ...(bare ? ['references', 'templates', 'examples'].map(d => path.join(skillRoot, d)) : [])];
      if (!bases.some(b => fs.existsSync(path.resolve(b, ref)))) errors.push(`${rel}:${i + 1}: referenced path does not exist ${ref}`);
    }
    const clean = line.replace(/`[^`]*`/g, '');
    for (const m of clean.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const href = m[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
      let [p, a] = href.split('#');
      p = decodeURIComponent(p || '');
      const tgt = p ? path.resolve(path.dirname(f), p) : f;
      if (!fs.existsSync(tgt)) { errors.push(`${rel}:${i + 1}: link target does not exist ${href}`); continue; }
      if (a && tgt.endsWith('.md') && !anchors(tgt).has(decodeURIComponent(a).toLowerCase()))
        errors.push(`${rel}:${i + 1}: anchor does not exist ${href}`);
    }
  });
}

// (d) Length limits: SKILL.md <= 300 lines; references/*.md <= 600 lines (D4 raised SKILL.md from 180, D7 references from 300, t948u to 600)
const SKILL_MAX_LINES = 300;
const REF_MAX_LINES = 600;
function countLines(text) {
  if (!text.length) return 0;
  return text.split(/\r?\n/).length - (text.endsWith('\n') || text.endsWith('\r\n') ? 1 : 0);
}
try {
  const skillPath = path.join(skillRoot, 'SKILL.md');
  const skillBody = fs.readFileSync(skillPath, 'utf8');
  const n = countLines(skillBody);
  if (n > SKILL_MAX_LINES) errors.push(`skills/task-lifecycle/SKILL.md: line count ${n} > ${SKILL_MAX_LINES}`);
} catch (e) { /* missing entry already reported above */ }
const refDir = path.join(skillRoot, 'references');
if (fs.existsSync(refDir) && fs.statSync(refDir).isDirectory()) {
  for (const name of fs.readdirSync(refDir).sort()) {
    if (!name.endsWith('.md')) continue;
    const fp = path.join(refDir, name);
    if (!fs.statSync(fp).isFile()) continue;
    try {
      const n = countLines(fs.readFileSync(fp, 'utf8'));
      if (n > REF_MAX_LINES) errors.push(`skills/task-lifecycle/references/${name}: line count ${n} > ${REF_MAX_LINES}`);
    } catch (e) { errors.push(`skills/task-lifecycle/references/${name}: read failed (${e.message})`); }
  }
}

// (f) SKILL.md description must be a single line
try {
  const lines = fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8').split(/\r?\n/);
  const end = lines[0] === '---' ? lines.indexOf('---', 1) : -1;
  const fm = end > 0 ? lines.slice(1, end) : [];
  const di = fm.findIndex(l => /^description:/.test(l));
  const v = di < 0 ? '' : fm[di].replace(/^description:\s*/, '');
  if (di < 0 || !v.trim() || /^[|>][-+0-9]*\s*$/.test(v) || (di + 1 < fm.length && /^\s+\S/.test(fm[di + 1])))
    errors.push('skills/task-lifecycle/SKILL.md: frontmatter description must be a single non-empty line');
} catch (e) { /* missing entry already reported above */ }

// (g) CJK allowlist gate
const CJK = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/u;
const allowPath = path.join(root, 'scripts', 'cjk-allowlist.json');
let allow = [];
if (fs.existsSync(allowPath)) {
  try { allow = JSON.parse(fs.readFileSync(allowPath, 'utf8')).entries; if (!Array.isArray(allow)) throw new Error('entries must be an array'); }
  catch (e) { errors.push(`scripts/cjk-allowlist.json: unreadable (${e.message})`); allow = []; }
}
const cjkRel = f => path.relative(root, f).split(path.sep).join('/');
const cjkFiles = files.filter(f => inSkill(f) || cjkRel(f) === 'CHANGELOG.md' || cjkRel(f).startsWith('docs/'));
const used = new Set();
for (const f of cjkFiles) {
  const rel = path.relative(root, f).split(path.sep).join('/');
  const lits = allow.filter(e => Array.isArray(e.files) && e.files.includes(rel)).map(e => e.literal).sort((a, b) => b.length - a.length);
  let body; try { body = fs.readFileSync(f, 'utf8'); } catch { continue; }
  body.split(/\r?\n/).forEach((line, i) => {
    if (!CJK.test(line)) return;
    let rest = line;
    for (const l of lits) if (rest.includes(l)) { used.add(`${l}\u0000${rel}`); rest = rest.split(l).join(' '); }
    const m = [...rest].filter(ch => CJK.test(ch)).join('');
    if (m) errors.push(`${rel}:${i + 1}: CJK outside allowlist: ${m.slice(0, 40)}`);
  });
}
for (const e of allow) for (const rel of e.files ?? []) {
  if (!fs.existsSync(path.join(root, rel))) { errors.push(`scripts/cjk-allowlist.json: file not found ${rel} (${e.literal})`); continue; }
  if (!used.has(`${e.literal}\u0000${rel}`)) errors.push(`scripts/cjk-allowlist.json: stale entry ${e.literal} for ${rel}`);
}

const ci = process.argv.indexOf('--compare');
if (ci > -1) {
  const other = process.argv[ci + 1];
  if (!other) { console.error('--compare needs a directory argument'); process.exit(2); }
  const a = path.join(root, 'skills/task-lifecycle'), b = path.resolve(other);
  const list = d => walk2(d).map(x => path.relative(d, x)).sort();
  function walk2(p, out = []) { for (const e of fs.readdirSync(p)) { const q = path.join(p, e); fs.statSync(q).isDirectory() ? walk2(q, out) : out.push(q); } return out; }
  const la = list(a), lb = list(b);
  for (const x of la) if (!lb.includes(x)) errors.push(`sync: skill directory missing ${x}`);
  for (const x of lb) if (!la.includes(x)) errors.push(`sync: skill directory has extra ${x}`);
  for (const x of la) if (lb.includes(x) && !fs.readFileSync(path.join(a, x)).equals(fs.readFileSync(path.join(b, x))))
    errors.push(`sync: content differs ${x}`);
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s) (checked ${files.length} .md files)`); process.exit(1); }
console.log(`OK: checked ${files.length} .md files; no overlong lines/broken links/dangling references/length overruns/CJK outside allowlist${ci > -1 ? '; skill directories match' : ''}`);
