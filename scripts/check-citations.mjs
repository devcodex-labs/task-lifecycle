#!/usr/bin/env node
// Check `path:N` / `path:N-M` / `path` lines N-M (preferred) / `path` 第 N～M 行 (legacy) references in Markdown and the 「snippet」 right after them.
// Usage:node check-citations.mjs [--root <repo>] [--rev <git-rev>] <file.md>...   Exits 2 on argument errors.
// Verdicts: OK = snippet within lines N..M and not truncated; TRUNC = snippet in range but followed on the same line by a non-sentence-break char (rest of line cut; end with … for intentional omission);
//       MOVED = not in range but elsewhere in the file (actual line range given); MISSING = not found in the file; EMPTY = snippet empty after removing ellipses;
//       RANGE = line number out of bounds; NOFILE = path does not exist; UNCHECKED = no snippet, only line numbers checked. All except OK/UNCHECKED exit 1.
// Snippets match literally (no whitespace trimming); only full-width … means omission, ASCII ... is literal.
// Per-item results go to stdout; per-input recognized/failed/UNCHECKED counts go to stderr; any input with zero recognized references exits 1.
// Only the explicit syntax below is recognized; the coordinator must still reconcile against an independent expected-reference list; UNCHECKED does not replace full snippet review.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
function die(m) { console.error(`argument error: ${m}`); process.exit(2); }
const a = process.argv.slice(2); let root = process.cwd(), rev = null; const files = [];
for (let i = 0; i < a.length; i++) {
  if (a[i] === '--root' || a[i] === '--rev') { const v = a[i + 1]; if (v === undefined || v === '' || v.startsWith('--')) die(`${a[i]} missing value`); i++; if (a[i - 1] === '--root') root = v; else rev = v; }
  else if (a[i].startsWith('--')) die(`unknown option ${a[i]}`);
  else files.push(a[i]);
}
if (!files.length) die('give at least one file to check');
root = path.resolve(root);
let gitRoot = root;
if (rev) {
  try {
    rev = execFileSync('git', ['-C', root, 'rev-parse', '--verify', `${rev}^{commit}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    gitRoot = path.resolve(execFileSync('git', ['-C', root, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim());
  } catch { die(`--rev ${rev} is not a valid commit`); }
}
for (const f of files) { if (!fs.existsSync(f)) die(`file to check does not exist ${f}`); if (!fs.statSync(f).isFile()) die(`path to check is not a file ${f}`); }
const SK = 'skills/task-lifecycle'; const cache = new Map();
function load(p) {
  if (cache.has(p)) return cache.get(p); let t = null;
  try {
    if (rev) {
      const rel = path.relative(gitRoot, path.resolve(root, p));
      if (!rel || path.isAbsolute(rel) || rel === '..' || rel.startsWith('..' + path.sep)) throw new Error('not an in-repo file path');
      const object = `${rev}:${rel.split(path.sep).join('/')}`;
      const git = args => execFileSync('git', ['-C', gitRoot, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (git(['cat-file', '-t', object]).trim() !== 'blob') throw new Error('not a file blob');
      t = git(['cat-file', 'blob', object]);
    } else t = fs.readFileSync(path.resolve(root, p), 'utf8');
  } catch { t = null; }
  if (t !== null) t = t.replace(/\r\n/g, '\n');   // CRLF-safe (Windows checkouts)
  let v = null; if (t !== null) { v = t.split('\n'); if (t.endsWith('\n')) v.pop(); }   // a trailing newline is not a line; a zero-byte file has 0 lines (split gives [''], empty after pop)
  if (t === '') v = [];
  cache.set(p, v); return v;
}
function resolve(p, from) {
  // Frozen references keep their original path identity; an absolute path must not turn into a skill short name after failing.
  if (rev && path.isAbsolute(p)) return load(p) ? p : null;
  const c = [p, path.join(path.relative(root, path.dirname(path.resolve(from))), p)];
  // Report-relative references resolve first; aliases may normalize internally, but a prefix must not cancel a parent that still escapes.
  const aliasPath = path.normalize(p);
  const escapesAlias = aliasPath === '..' || aliasPath.startsWith('..' + path.sep);
  if (!rev || !escapesAlias) c.push(`${SK}/${p}`,
    ...['references', 'templates', 'examples'].map(d => `${SK}/${d}/${p}`));
  return c.find(x => load(x)) ?? null;
}
// Preferred English form: `path` line N / `path` lines N-M; legacy Chinese `path` 第 N～M 行 still accepted (D2 L18).
// Snippet: paired 「…」, “…” or "…", at least 1 char; must follow within 6 chars (not crossing backticks)
// Path: any chars inside backticks except colon and newline (extension optional, spaces allowed)
const RE = /`([^`:\n]*[^`:\s][^`:\n]*)(?::(\d+)(?:[-～~](\d+))?`|`\s*第\s*(\d+)(?:\s*[-～~]\s*(\d+))?\s*行|`\s+lines?\s+(\d+)(?:\s*[-–~]\s*(\d+))?\b)(?:[^「“"`]{0,6}(?:「([^」]+)」|“([^”]+)”|"([^"\n]+)"))?/g;
const BOUND = /^($|[\s，,。.；;：:、）)（(」”"'！!？?…—|`])/;
const segs = s => s.split(/…+/).filter(x => x !== '');   // literal, no trim
// Prefix segments take the earliest in-order positions (leaving the last segment the most choices); returns all possible [start, end] of the last segment, [] if none
function ends(text, sg) {
  let k = 0, st0 = -1; for (const x of sg.slice(0, -1)) { const j = text.indexOf(x, k); if (j < 0) return []; if (st0 < 0) st0 = j; k = j + x.length; }
  const last = sg[sg.length - 1], out = []; for (let j = text.indexOf(last, k); j >= 0; j = text.indexOf(last, j + 1)) out.push([st0 < 0 ? j : st0, j + last.length]);
  return out;
}
let bad = 0;
for (const f of files) {
  let recognized = 0, unchecked = 0, failed = 0;
  fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      recognized++;
      const p = m[1], n = +(m[2] ?? m[4] ?? m[6]), e = m[3] ?? m[5] ?? m[7], snip = m[8] ?? m[9] ?? m[10]; const mEnd = e ? +e : n;
      const rp = resolve(p, f); const L = rp && load(rp); let st, info = '';
      if (!L) st = 'NOFILE';
      else if (n < 1 || mEnd < n || mEnd > L.length) st = 'RANGE';
      else if (snip === undefined) st = 'UNCHECKED';
      else if (!segs(snip).length) st = 'EMPTY';
      else {
        const sg = segs(snip), text = L.slice(n - 1, mEnd).join('\n'), es = ends(text, sg);
        if (es.length) st = snip.endsWith('…') || es.some(([, k]) => BOUND.test(text.slice(k))) ? 'OK' : 'TRUNC';   // OK if any match reaches a sentence break
        else {
          // Whole-file search, no window cap: for each occurrence of the first segment take the earliest in-order match; pick the shortest line span
          const all = L.join('\n'), lineAt = o => all.slice(0, o).split('\n').length; let hit = null;
          for (let j = all.indexOf(sg[0]); j >= 0; j = all.indexOf(sg[0], j + 1)) {
            const r = ends(all.slice(j), sg); if (!r.length) break;
            const span = [lineAt(j), lineAt(j + r[0][1] - 1)]; if (!hit || span[1] - span[0] < hit[1] - hit[0]) hit = span;
          }
          st = hit ? 'MOVED' : 'MISSING'; if (hit) info = ` actually at line ${hit[0]}${hit[1] > hit[0] ? '-' + hit[1] : ''}`;
        }
      }
      if (!['OK', 'UNCHECKED'].includes(st)) { bad++; failed++; }
      if (st === 'UNCHECKED') unchecked++;
      console.log(`${st}\t${f}:${i + 1}\t${p}:${n}${e ? '-' + mEnd : ''}${snip !== undefined ? ' 「' + snip + '」' : ''}${info}`);
    }
  });
  if (!recognized) bad++;
  console.error(`SUMMARY\t${f}\trecognized=${recognized}\tunchecked=${unchecked}\tfailed=${failed}`);
}
process.exit(bad ? 1 : 0);
