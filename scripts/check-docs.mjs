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
import fs from 'node:fs';
import path from 'node:path';

const MAX_LEN = 200;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const targets = ['skills/task-lifecycle', 'docs', 'README.md', 'CHANGELOG.md'];
const errors = [];
const skillRoot = path.join(root, 'skills/task-lifecycle');
const PREFIX = /^(references|templates|examples|scripts|docs|assets|skills)\//;
const inSkill = f => !path.relative(skillRoot, f).startsWith('..');

function walk(p, out = []) {
  if (!fs.existsSync(p)) return out;
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
  for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
    if (/^\s*```/.test(l)) { inCode = !inCode; continue; }
    const m = !inCode && /^#{1,6}\s+(.*)$/.exec(l);
    if (m) { let s = slug(m[1]); const n = seen[s] ?? 0; seen[s] = n + 1; set.add(n ? `${s}-${n}` : s); }
  }
  anchorCache.set(file, set); return set;
}

const files = targets.flatMap(t => walk(path.join(root, t)));
for (const f of files) {
  const rel = path.relative(root, f);
  let inCode = false; let inFm = false;
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
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
console.log(`OK：检查 ${files.length} 个 .md，无超长行/断链/悬空引用${ci > -1 ? '，技能目录一致' : ''}`);
