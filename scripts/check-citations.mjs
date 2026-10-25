#!/usr/bin/env node
// 原型（CAND-20261025-010，不在仓库）：核对 Markdown 里 `path:N` / `path:N-M` / `path` 第 N～M 行 引用及其后紧跟的「片段」。
// 用法：node check-citations.mjs [--root <repo>] [--rev <git-rev>] <file.md>...   参数错误退出 2。
// 判定：OK＝片段在 N..M 行内且未截断；TRUNC＝片段在区间内，但其末尾在同一行中后接非断句字符（同行后半句被截断，末尾加 … 表示有意省略）；
//       MOVED＝不在区间但在文件别处（给实际行号范围）；MISSING＝文件中找不到；EMPTY＝片段去掉省略号后无内容；
//       RANGE＝行号越界；NOFILE＝路径不存在；UNCHECKED＝无片段，只核了行号。除 OK/UNCHECKED 外均退出 1。
// 片段按字面匹配（不去空格）；只有全角 … 表示省略，ASCII ... 按字面。
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
function die(m) { console.error(`参数错误：${m}`); process.exit(2); }
const a = process.argv.slice(2); let root = process.cwd(), rev = null; const files = [];
for (let i = 0; i < a.length; i++) {
  if (a[i] === '--root' || a[i] === '--rev') { const v = a[i + 1]; if (v === undefined || v === '' || v.startsWith('--')) die(`${a[i]} 缺值`); i++; if (a[i - 1] === '--root') root = v; else rev = v; }
  else if (a[i].startsWith('--')) die(`未知选项 ${a[i]}`);
  else files.push(a[i]);
}
if (!files.length) die('至少给一个待查文件');
if (rev) { try { execFileSync('git', ['-C', root, 'rev-parse', '--verify', `${rev}^{commit}`], { stdio: 'ignore' }); } catch { die(`--rev ${rev} 不是有效提交`); } }
for (const f of files) { if (!fs.existsSync(f)) die(`待查文件不存在 ${f}`); if (!fs.statSync(f).isFile()) die(`待查路径不是文件 ${f}`); }
const SK = 'skills/task-lifecycle'; const cache = new Map();
function load(p) {
  if (cache.has(p)) return cache.get(p); let t = null;
  try { t = rev ? execFileSync('git', ['-C', root, 'show', `${rev}:${p}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
               : fs.readFileSync(path.resolve(root, p), 'utf8'); } catch { t = null; }
  let v = null; if (t !== null) { v = t.split('\n'); if (t.endsWith('\n')) v.pop(); }   // 末尾换行不算一行；零字节文件为 0 行（split 得 ['']，pop 后为空）
  if (t === '') v = [];
  cache.set(p, v); return v;
}
function resolve(p, from) {
  const c = [p, path.join(path.relative(root, path.dirname(path.resolve(from))), p), `${SK}/${p}`,
    ...['references', 'templates', 'examples'].map(d => `${SK}/${d}/${p}`)];
  return c.find(x => load(x)) ?? null;
}
// 片段：「…」或“…”成对，1 字以上；其后 6 字内须紧跟（不跨反引号）
// 路径：反引号内除冒号、换行外的任意字符（可无扩展名、可含空格）
const RE = /`([^`:\n]*[^`:\s][^`:\n]*)(?::(\d+)(?:[-～~](\d+))?`|`\s*第\s*(\d+)(?:\s*[-～~]\s*(\d+))?\s*行)(?:[^「“`]{0,6}(?:「([^」]+)」|“([^”]+)”))?/g;
const BOUND = /^($|[\s，,。.；;：:、）)（(」”"'！!？?…—|`])/;
const segs = s => s.split(/…+/).filter(x => x !== '');   // 字面，不 trim
// 前缀各段取最早按序位置（最早前缀给末段留最多选择）；返回末段全部可能的 [起点, 终点]，不匹配为 []
function ends(text, sg) {
  let k = 0, st0 = -1; for (const x of sg.slice(0, -1)) { const j = text.indexOf(x, k); if (j < 0) return []; if (st0 < 0) st0 = j; k = j + x.length; }
  const last = sg[sg.length - 1], out = []; for (let j = text.indexOf(last, k); j >= 0; j = text.indexOf(last, j + 1)) out.push([st0 < 0 ? j : st0, j + last.length]);
  return out;
}
let bad = 0;
for (const f of files) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      const p = m[1], n = +(m[2] ?? m[4]), e = m[3] ?? m[5], snip = m[6] ?? m[7]; const mEnd = e ? +e : n;
      const rp = resolve(p, f); const L = rp && load(rp); let st, info = '';
      if (!L) st = 'NOFILE';
      else if (n < 1 || mEnd < n || mEnd > L.length) st = 'RANGE';
      else if (snip === undefined) st = 'UNCHECKED';
      else if (!segs(snip).length) st = 'EMPTY';
      else {
        const sg = segs(snip), text = L.slice(n - 1, mEnd).join('\n'), es = ends(text, sg);
        if (es.length) st = snip.endsWith('…') || es.some(([, k]) => BOUND.test(text.slice(k))) ? 'OK' : 'TRUNC';   // 任一匹配到断句处即 OK
        else {
          // 全文件搜索，不设窗口上限：对首段每个出现位置取按序最早匹配，选行跨度最短者
          const all = L.join('\n'), lineAt = o => all.slice(0, o).split('\n').length; let hit = null;
          for (let j = all.indexOf(sg[0]); j >= 0; j = all.indexOf(sg[0], j + 1)) {
            const r = ends(all.slice(j), sg); if (!r.length) break;
            const span = [lineAt(j), lineAt(j + r[0][1] - 1)]; if (!hit || span[1] - span[0] < hit[1] - hit[0]) hit = span;
          }
          st = hit ? 'MOVED' : 'MISSING'; if (hit) info = ` 实际在第 ${hit[0]}${hit[1] > hit[0] ? '～' + hit[1] : ''} 行`;
        }
      }
      if (!['OK', 'UNCHECKED'].includes(st)) bad++;
      console.log(`${st}\t${f}:${i + 1}\t${p}:${n}${e ? '-' + mEnd : ''}${snip !== undefined ? ' 「' + snip + '」' : ''}${info}`);
    }
  });
}
process.exit(bad ? 1 : 0);
