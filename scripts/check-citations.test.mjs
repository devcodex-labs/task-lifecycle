import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseLineCitations } from './check-citations.mjs';

const script = fileURLToPath(new URL('./check-citations.mjs', import.meta.url));
const parent = fs.realpathSync(os.tmpdir());
const base = fs.realpathSync(fs.mkdtempSync(path.join(parent, 'tl-citation-')));
after(() => { assert.equal(path.dirname(base), parent); assert.equal(fs.realpathSync(base), base); assert.ok(path.basename(base).startsWith('tl-citation-')); fs.rmSync(base, { recursive: true }); });
let serial = 0;
function fixture(content = '# Stable rule\nExact evidence.\n') {
  const dir = path.join(base, String(++serial)); fs.mkdirSync(dir);
  const target = path.join(dir, 'target.md'), report = path.join(dir, 'report.md');
  fs.writeFileSync(target, content); fs.writeFileSync(report, ''); return { dir, target, report };
}
function run(f, report, options = []) {
  fs.writeFileSync(f.report, report);
  return spawnSync(process.execPath, [script, '--root', f.dir, ...options, f.report], { encoding: 'utf8', windowsHide: true, timeout: 10000 });
}
test('Windows drive and UNC citation syntax is parsed on every platform', () => {
  for (const p of ['C:\\Work folder\\rule.md', 'D:/work/rule.md', '\\\\server\\share\\rule.md']) {
    for (const syntax of ['`' + p + ':2-3`', '`' + p + '` lines 2-3']) {
      const refs = parseLineCitations(syntax + ' "exact"');
      assert.equal(refs.length, 1); assert.equal(refs[0].path, p); assert.equal(refs[0].start, 2); assert.equal(refs[0].end, 3); assert.equal(refs[0].snippet, 'exact');
    }
  }
});
test('native absolute path and source snippet are checked by the actual CLI', () => {
  const f = fixture(); const r = run(f, '`' + f.target + ':2` "Exact evidence."\n');
  assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stdout, /^OK\t/); assert.match(r.stderr, /recognized=1/);
});
test('durable heading and explicit anchors survive source line movement', () => {
  const f = fixture('# Stable rule\nExact evidence.\n<a id="fixed-id"></a>\n## Details\n## Details\n');
  const report = '[Rule](target.md#stable-rule)\n[Identity](target.md#fixed-id)\n[Second](target.md#details-1)\n';
  let r = run(f, report); assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stderr, /anchors=3/);
  fs.writeFileSync(f.target, 'New introduction.\n\n' + fs.readFileSync(f.target, 'utf8'));
  r = run(f, report); assert.equal(r.status, 0); assert.ok(r.stdout.split('\n').filter(Boolean).every(x => x.startsWith('OK_ANCHOR\t')));
  r = run(f, '`target.md:2` "Exact evidence."'); assert.equal(r.status, 1); assert.match(r.stdout, /^MOVED\t/);
});
test('missing, ambiguous and code-fenced anchors fail instead of claiming content evidence', () => {
  const f = fixture('<a id="duplicate"></a>\n<a id="duplicate"></a>\n```md\n# Fake\n```\n');
  for (const [id, verdict] of [['missing', 'ANCHOR'], ['duplicate', 'AMBIGUOUS_ANCHOR'], ['fake', 'ANCHOR']]) {
    const r = run(f, '[Rule](target.md#' + id + ')'); assert.equal(r.status, 1); assert.ok(r.stdout.startsWith(verdict + '\t'));
  }
});
test('angle paths, encoded anchors and explicit N/A stay distinct from remote links', () => {
  const f = fixture('<a id="a:b"></a>\n'); fs.renameSync(f.target, path.join(f.dir, 'with spaces.md'));
  const r = run(f, '[Rule](<with spaces.md#a%3Ab>)\n[Remote](https://example.invalid/doc#anchor)');
  assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stderr, /recognized=1/);
});
test('zero-citation N/A is explicit, single-file and cannot bypass recognized references', () => {
  const f = fixture(); let r = run(f, 'An original note with no citations.'); assert.equal(r.status, 1);
  r = run(f, 'An original note with no citations.', ['--no-citations', 'Independent inventory has no source citations']);
  assert.equal(r.status, 0); assert.match(r.stdout, /^N\/A\t/); assert.match(r.stderr, /recognized=0.*status=N\/A/);
  r = run(f, '[Rule](target.md#stable-rule)', ['--no-citations', 'claimed empty']); assert.equal(r.status, 2);
  r = run(f, 'empty', ['--no-citations', '   ']); assert.equal(r.status, 2);
  r = run(f, 'empty', ['--no-citations', 'reason', f.target]); assert.equal(r.status, 2);
});
test('frozen commit citations and anchors use committed bytes and preserve absolute path identity', () => {
  const f = fixture();
  const git = args => { const r = spawnSync('git', ['-C', f.dir, ...args], { encoding: 'utf8', windowsHide: true, timeout: 10000 }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  git(['init', '--quiet']); git(['add', 'target.md']);
  git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--no-verify', '--quiet', '-m', 'fixture']);
  const rev = git(['rev-parse', 'HEAD']); fs.writeFileSync(f.target, '# New rule\nChanged evidence.\n');
  let r = run(f, '`' + f.target + ':2` "Exact evidence."\n[Rule](target.md#stable-rule)', ['--rev', rev]);
  assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stderr, /recognized=2/);
  r = run(f, '[Rule](target.md#new-rule)', ['--rev', rev]); assert.equal(r.status, 1); assert.match(r.stdout, /^ANCHOR\t/);
  const outside = path.join(base, 'outside.md'); fs.writeFileSync(outside, '# Outside\n');
  r = run(f, '`' + outside + ':1` "# Outside"', ['--rev', rev]); assert.equal(r.status, 1); assert.match(r.stdout, /^NOFILE\t/);
});
test('foreign drive paths are recognized but never silently rebound to a local alias', { skip: process.platform === 'win32' ? 'POSIX-only foreign-path case; native Windows path is exercised above' : false }, () => {
  const f = fixture(); const r = run(f, '`C:\\not-here\\target.md:1` "# Stable rule"');
  assert.equal(r.status, 1); assert.match(r.stdout, /^NOFILE\t/); assert.match(r.stderr, /recognized=1/);
});
