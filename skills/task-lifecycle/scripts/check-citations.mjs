#!/usr/bin/env node
// Canonical Skill runtime: check frozen line/snippet citations and stable content anchors.
// Usage: node check-citations.mjs [--root <dir>] [--rev <commit>] [--no-citations <reason>] <file.md>...
// Verdicts: OK = snippet within lines N..M and not truncated; TRUNC = snippet in range but followed on the same line by a non-sentence-break char (rest of line cut; end with … for intentional omission);
//       MOVED = not in range but elsewhere in the file (actual line range given); MISSING = not found in the file; EMPTY = snippet empty after removing ellipses;
//       RANGE = line number out of bounds; NOFILE = path does not exist; UNCHECKED = no snippet, only line numbers checked. All except OK/UNCHECKED exit 1.
// Snippets match literally (no whitespace trimming); only full-width … means omission, ASCII ... is literal.
// Per-item results go to stdout; per-input counts go to stderr. Zero references fail unless exactly one input has explicit --no-citations <reason>.
// OK_ANCHOR only checks a durable Markdown heading/explicit anchor; it is not frozen line/snippet evidence. No-citations success is N/A, not a citation pass.
// Only the explicit syntax below is recognized; the coordinator must still reconcile against an independent expected-reference list; UNCHECKED does not replace full snippet review.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
class ArgumentError extends Error {}
function die(m) { throw new ArgumentError(m); }
// Resolve native directory aliases (including Windows 8.3 names). Missing
// suffixes remain usable for files deleted from the worktree since --rev.
function frozenPath(p) {
  let current = path.resolve(p); const suffix = [];
  for (;;) {
    try { return path.join(fs.realpathSync.native(current), ...suffix.reverse()); }
    catch (e) {
      if (!['ENOENT', 'ENOTDIR'].includes(e.code)) throw e;
      const parent = path.dirname(current); if (parent === current) throw e;
      suffix.push(path.basename(current)); current = parent;
    }
  }
}
// The path can include a Windows drive colon; the final :N suffix or external line marker owns the range.
const RE = /`([^`\n]*[^`\s][^`\n]*?)(?::(\d+)(?:[-～~](\d+))?`|`\s*第\s*(\d+)(?:\s*[-～~]\s*(\d+))?\s*行|`\s+lines?\s+(\d+)(?:\s*[-–~]\s*(\d+))?\b)(?:[^「“"`]{0,6}(?:「([^」]+)」|“([^”]+)”|"([^"\n]+)"))?/g;
export function parseLineCitations(line) {
  return [...line.matchAll(RE)].map(m => ({ path: m[1], start: +(m[2] ?? m[4] ?? m[6]), end: +(m[3] ?? m[5] ?? m[7] ?? m[2] ?? m[4] ?? m[6]),
    snippet: m[8] ?? m[9] ?? m[10], range: m[3] ?? m[5] ?? m[7] }));
}
export function contentAnchors(lines) {
  const anchors = new Map(), seen = new Map(); let fence = null;
  const add = id => anchors.set(id, (anchors.get(id) ?? 0) + 1);
  for (const line of lines) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line);
    if (marker) { if (!fence) fence = marker[1]; else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null; continue; }
    if (fence) continue;
    const heading = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading) {
      const slug = heading[1].trim().toLowerCase().replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
      const n = seen.get(slug) ?? 0; seen.set(slug, n + 1); add(n ? `${slug}-${n}` : slug);
    }
    for (const m of line.matchAll(/<a\s+(?:id|name)=["']([^"']+)["']\s*><\/a>/gi)) add(m[1]);
  }
  return anchors;
}
export function main(a = process.argv.slice(2)) {
let root = process.cwd(), rev = null, noCitations = null; const files = [];
for (let i = 0; i < a.length; i++) {
  if (a[i] === '--no-citations') {
    const v = a[++i]; if (!v || !v.trim() || v.startsWith('--') || /[\u0000-\u001f\u007f]/.test(v)) die('--no-citations needs a non-empty single-line reason');
    noCitations = v; continue;
  }
  if (a[i] === '--root' || a[i] === '--rev') { const v = a[i + 1]; if (v === undefined || v === '' || v.startsWith('--')) die(`${a[i]} missing value`); i++; if (a[i - 1] === '--root') root = v; else rev = v; }
  else if (a[i].startsWith('--')) die(`unknown option ${a[i]}`);
  else files.push(a[i]);
}
if (!files.length) die('give at least one file to check');
if (noCitations !== null && files.length !== 1) die('--no-citations applies to exactly one input file');
root = path.resolve(root);
let gitRoot = root;
if (rev) {
  try {
    rev = execFileSync('git', ['-C', root, 'rev-parse', '--verify', `${rev}^{commit}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    gitRoot = frozenPath(execFileSync('git', ['-C', root, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim());
    root = frozenPath(root);
  } catch { die(`--rev ${rev} is not a valid commit`); }
}
for (const f of files) { if (!fs.existsSync(f)) die(`file to check does not exist ${f}`); if (!fs.statSync(f).isFile()) die(`path to check is not a file ${f}`); }
const SK = fs.existsSync(path.join(root, 'SKILL.md')) ? '.' : 'skills/task-lifecycle'; const cache = new Map();
function load(p) {
  if (cache.has(p)) return cache.get(p); let t = null;
  try {
    if (rev) {
      const rel = path.relative(gitRoot, frozenPath(path.resolve(root, p)));
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
  // A foreign Windows drive/UNC path cannot become a relative alias on POSIX.
  if (/^[A-Za-z]:[\\/]/.test(p) || p.startsWith('\\\\')) return path.isAbsolute(p) && load(p) ? p : null;
  // Frozen references keep their original path identity; an absolute path must not turn into a skill short name after failing.
  if (rev && path.isAbsolute(p)) return load(p) ? p : null;
  const source = rev ? frozenPath(from) : path.resolve(from);
  const c = [p, path.join(path.relative(root, path.dirname(source)), p)];
  // Report-relative references resolve first; aliases may normalize internally, but a prefix must not cancel a parent that still escapes.
  const aliasPath = path.normalize(p);
  const escapesAlias = aliasPath === '..' || aliasPath.startsWith('..' + path.sep);
  if (!rev || !escapesAlias) c.push(`${SK}/${p}`,
    ...['references', 'templates', 'examples'].map(d => `${SK}/${d}/${p}`));
  return c.find(x => load(x)) ?? null;
}
// Preferred English form: `path` line N / `path` lines N-M; legacy Chinese `path` 第 N～M 行 still accepted (D2 L18).
// Snippet: paired 「…」, “…” or "…", at least 1 char; must follow within 6 chars (not crossing backticks)
// Durable references use ordinary Markdown links with #anchors. Remote URLs are outside this local checker.
const ANCHOR_RE = /(?<!!)\[[^\]\n]*\]\(\s*(?:<([^>\n]+#[^>\n]+)>|([^\s()]+#[^\s()]+))\s*\)/g;
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
  let recognized = 0, unchecked = 0, failed = 0, anchorRefs = 0;
  fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
    for (const citation of parseLineCitations(line)) {
      recognized++;
      const { path: p, start: n, end: mEnd, range: e, snippet: snip } = citation;
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
    for (const m of line.matchAll(ANCHOR_RE)) {
      const target = m[1] ?? m[2];
      if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(target) && !/^[A-Za-z]:[\\/]/.test(target)) continue;
      recognized++; anchorRefs++;
      const hash = target.indexOf('#'); let p, anchor, st;
      try { p = decodeURIComponent(target.slice(0, hash)) || path.resolve(f); anchor = decodeURIComponent(target.slice(hash + 1)); }
      catch { st = 'ANCHOR'; }
      if (!st) {
        const rp = resolve(p, f), lines = rp && load(rp), count = lines ? contentAnchors(lines).get(anchor) : 0;
        st = !lines ? 'NOFILE' : count === 1 ? 'OK_ANCHOR' : count > 1 ? 'AMBIGUOUS_ANCHOR' : 'ANCHOR';
      }
      if (st !== 'OK_ANCHOR') { bad++; failed++; }
      console.log(`${st}\t${f}:${i + 1}\t${target}`);
    }
  });
  if (noCitations !== null && recognized) die('--no-citations contradicts recognized citations; remove it and check them');
  if (!recognized) {
    if (noCitations === null) bad++;
    else console.log(`N/A\t${f}\t${noCitations}`);
  }
  console.error(`SUMMARY\t${f}\trecognized=${recognized}\tunchecked=${unchecked}\tfailed=${failed}\tanchors=${anchorRefs}${noCitations !== null ? '\tstatus=N/A' : ''}`);
}
return bad ? 1 : 0;
}
export function runCli() {
  try { process.exitCode = main(); }
  catch (e) { console.error(`${e instanceof ArgumentError ? 'argument error' : 'citation check error'}: ${e.message}`); process.exitCode = e instanceof ArgumentError ? 2 : 1; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
