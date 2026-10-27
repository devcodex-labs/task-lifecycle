#!/usr/bin/env node
// 文档自检（零依赖）。用法：
//   node scripts/check-docs.mjs                 # 长行 + 相对链接/锚点
//   node scripts/check-docs.mjs --compare <dir> # 另比对 skills/task-lifecycle 与 <dir>（如 Grok 技能目录）
// 规则：
//   (a) .md 每行按字符（Unicode 码点）计不超过 MAX_LEN=200；排除：``` 代码块内的行、表格行（以 | 开头）、
//       文件开头的 YAML frontmatter（SKILL.md 的 description 必须单行）。
//   (b) 相对链接 [x](path#anchor) 指向的文件必须存在；若带锚点且目标为 .md，锚点须匹配某个标题（GitHub slug 规则近似）。
//       排除：http(s)/mailto 链接、纯 #锚点之外的外部协议、代码块内链接。
//   (c) 反引号内插件内引用必须存在：以 references/ templates/ examples/ scripts/ docs/ assets/ skills/ 开头的路径，
//       或 skills/task-lifecycle 下的裸 *.md 文件名；按所在目录、技能根、仓库根（裸名另查 references/templates/examples）解析。
//       排除：代码块内、含通配/占位符（* { } < >）的值；运行期目录与使用方项目路径不在检查范围。
//   (d) 篇幅上限（§7.10 第 7 条）：skills/task-lifecycle/SKILL.md 行数 ≤180；
//       skills/task-lifecycle/references/ 下每个 .md 行数 ≤300。
//   (e) README 一致性（M-12）：README.md 与 README.zh-CN.md 标题层级序列一致；两份徽章版本＝plugin.json version。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_LEN = 200;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['skills/task-lifecycle', 'docs', 'README.md', 'CHANGELOG.md'];
const optionalTargets = ['README.zh-CN.md']; // 存在才查（D2=B）
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
    if (t.endsWith('.md') ? !st.isFile() : !st.isDirectory()) throw new Error('目标类型不符');
    const found = walk(p);
    if (!found.length) throw new Error('没有可检查的 Markdown');
    files.push(...found);
  } catch (e) { errors.push(`${t}: 必需目标不可检查 (${e.message})`); }
}
for (const t of optionalTargets) { const p = path.join(root, t); if (fs.existsSync(p) && fs.statSync(p).isFile()) files.push(p); }
if (fs.existsSync(path.join(root, 'plugin.json')) && fs.existsSync(path.join(root, 'README.md'))) { // 清单或 README 缺失时由其他门禁报，不在此崩溃
  const ver = JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8')).version;
  const heads = f => { let c = false; return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => { if (/^\s*```/.test(l)) { c = !c; return false; } return !c && /^#{1,6}\s/.test(l); }).map(l => l.match(/^#+/)[0].length); };
  const en = path.join(root, 'README.md'), zh = path.join(root, 'README.zh-CN.md');
  for (const f of [en, zh]) if (fs.existsSync(f)) {
    const m = /badge\/version-([0-9][^-]*)-/.exec(fs.readFileSync(f, 'utf8'));
    if (!m || m[1] !== ver) errors.push(`${path.relative(root, f)}: 版本徽章 ${m ? m[1] : '缺失'} ≠ plugin.json ${ver}`);
  }
  if (fs.existsSync(zh) && heads(en).join() !== heads(zh).join()) errors.push(`README.md 与 README.zh-CN.md 标题层级序列不一致`);
}
try {
  const entry = path.join(skillRoot, 'SKILL.md');
  if (!fs.statSync(entry).isFile() || !fs.readFileSync(entry).length) throw new Error('入口须为非空普通文件');
} catch (e) { errors.push(`skills/task-lifecycle/SKILL.md: 必需入口不可检查 (${e.message})`); }
if (!files.length) errors.push('未扫描任何 Markdown，不能报告成功');
for (const f of files) {
  const rel = path.relative(root, f);
  let inCode = false; let inFm = false;
  let body;
  try { body = fs.readFileSync(f, 'utf8'); } catch (e) { errors.push(`${rel}: 读取失败 (${e.message})`); continue; }
  if (targets.includes(rel) && !body.length) errors.push(`${rel}: 必需文件为空`);
  body.split(/\r?\n/).forEach((line, i) => {
    if (i === 0 && line === '---') { inFm = true; return; }
    if (inFm) { if (line === '---') inFm = false; return; }
    if (/^\s*```/.test(line)) { inCode = !inCode; return; }
    if (inCode) return;
    const len = [...line].length;
    if (len > MAX_LEN && !/^\s*\|/.test(line)) errors.push(`${rel}:${i + 1}: 行长 ${len} > ${MAX_LEN}`);
    for (const m of line.matchAll(/`([^`\s]+)`/g)) {
      const ref = m[1].replace(/[:#].*$/, '');
      if (/[*{}<>]/.test(ref)) continue;
      const prefixed = PREFIX.test(ref);
      const bare = inSkill(f) && /^[^/]+\.md$/.test(ref);
      if (!prefixed && !bare) continue;
      const bases = [path.dirname(f), skillRoot, root, ...(bare ? ['references', 'templates', 'examples'].map(d => path.join(skillRoot, d)) : [])];
      if (!bases.some(b => fs.existsSync(path.resolve(b, ref)))) errors.push(`${rel}:${i + 1}: 引用路径不存在 ${ref}`);
    }
    const clean = line.replace(/`[^`]*`/g, '');
    for (const m of clean.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const href = m[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
      let [p, a] = href.split('#');
      p = decodeURIComponent(p || '');
      const tgt = p ? path.resolve(path.dirname(f), p) : f;
      if (!fs.existsSync(tgt)) { errors.push(`${rel}:${i + 1}: 链接目标不存在 ${href}`); continue; }
      if (a && tgt.endsWith('.md') && !anchors(tgt).has(decodeURIComponent(a).toLowerCase()))
        errors.push(`${rel}:${i + 1}: 锚点不存在 ${href}`);
    }
  });
}

// (d) 篇幅上限：SKILL.md ≤180；references/*.md ≤300
const SKILL_MAX_LINES = 180;
const REF_MAX_LINES = 300;
function countLines(text) {
  if (!text.length) return 0;
  return text.split(/\r?\n/).length - (text.endsWith('\n') || text.endsWith('\r\n') ? 1 : 0);
}
try {
  const skillPath = path.join(skillRoot, 'SKILL.md');
  const skillBody = fs.readFileSync(skillPath, 'utf8');
  const n = countLines(skillBody);
  if (n > SKILL_MAX_LINES) errors.push(`skills/task-lifecycle/SKILL.md: 行数 ${n} > ${SKILL_MAX_LINES}`);
} catch (e) { /* 入口缺失已在上方报错 */ }
const refDir = path.join(skillRoot, 'references');
if (fs.existsSync(refDir) && fs.statSync(refDir).isDirectory()) {
  for (const name of fs.readdirSync(refDir).sort()) {
    if (!name.endsWith('.md')) continue;
    const fp = path.join(refDir, name);
    if (!fs.statSync(fp).isFile()) continue;
    try {
      const n = countLines(fs.readFileSync(fp, 'utf8'));
      if (n > REF_MAX_LINES) errors.push(`skills/task-lifecycle/references/${name}: 行数 ${n} > ${REF_MAX_LINES}`);
    } catch (e) { errors.push(`skills/task-lifecycle/references/${name}: 读取失败 (${e.message})`); }
  }
}

const ci = process.argv.indexOf('--compare');
if (ci > -1) {
  const other = process.argv[ci + 1];
  if (!other) { console.error('--compare 需要目录参数'); process.exit(2); }
  const a = path.join(root, 'skills/task-lifecycle'), b = path.resolve(other);
  const list = d => walk2(d).map(x => path.relative(d, x)).sort();
  function walk2(p, out = []) { for (const e of fs.readdirSync(p)) { const q = path.join(p, e); fs.statSync(q).isDirectory() ? walk2(q, out) : out.push(q); } return out; }
  const la = list(a), lb = list(b);
  for (const x of la) if (!lb.includes(x)) errors.push(`同步: 技能目录缺少 ${x}`);
  for (const x of lb) if (!la.includes(x)) errors.push(`同步: 技能目录多出 ${x}`);
  for (const x of la) if (lb.includes(x) && !fs.readFileSync(path.join(a, x)).equals(fs.readFileSync(path.join(b, x))))
    errors.push(`同步: 内容不同 ${x}`);
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n共 ${errors.length} 处问题（检查 ${files.length} 个 .md）`); process.exit(1); }
console.log(`OK：检查 ${files.length} 个 .md，无超长行/断链/悬空引用/篇幅超限${ci > -1 ? '，技能目录一致' : ''}`);
