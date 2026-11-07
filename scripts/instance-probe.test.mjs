// Bundled Grok Bot instance probe: create a missing baseline once, then only compare.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BASELINE, DEFAULT_WORKSPACE, main as probeMain, runProbe } from '../skills/task-lifecycle/scripts/instance-probe.mjs';
import { main as refreshMain, refreshBaseline } from '../skills/task-lifecycle/scripts/record-instance-baseline.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const probeFile = path.join(root, 'skills/task-lifecycle/scripts/instance-probe.mjs');
const writerFile = path.join(root, 'skills/task-lifecycle/scripts/record-instance-baseline.mjs');
const WRITE_FLAGS = fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_APPEND;

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'tl-probe-'));
}
function gitRepo(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.git'), 'gitdir: fake\n');
  fs.writeFileSync(path.join(dir, 'README'), 'x\n');
}
function guard(real, calls) {
  return new Proxy(real, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && /^(write|append|mkdir|unlink|rmdir|rename|truncate|copyFile|chmod|utimes|link|symlink|rm|fsync)/.test(prop)) {
        return () => { calls.push(prop); throw new Error(`write side effect ${prop}`); };
      }
      if (prop === 'openSync') {
        return (file, flags, ...rest) => {
          if (typeof flags === 'number' && (flags & WRITE_FLAGS) !== 0) { calls.push('open-write'); throw new Error(`write open ${file}`); }
          return real.openSync(file, flags, ...rest);
        };
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(real) : value;
    },
  });
}

test('T148 absent baseline is created once; an existing baseline is not written', () => {
  const dir = tempDir();
  try {
    const workspace = path.join(dir, 'workspace');
    const kept = path.join(workspace, 'kept');
    const nested = path.join(workspace, 'kept', 'nested');
    const later = path.join(workspace, 'later');
    gitRepo(kept);
    gitRepo(nested);
    fs.mkdirSync(path.join(workspace, 'notes'));
    const baseline = path.join(dir, 'outside', 'baseline.txt');
    const common = { baselinePath: baseline, workspaceRoot: workspace, machineId: 'abc', hostname: 'box', recorded: '2026-11-07 00:00:00 UTC' };
    const first = runProbe(common);
    assert.equal(first.exitCode, 0, first.stderr);
    assert.match(first.stdout, /^STATUS=no-baseline -> baseline recorded\n/);
    assert.match(first.stdout, /no-baseline -> baseline recorded/);
    const body = fs.readFileSync(baseline, 'utf8');
    assert.equal(body, `machine-id=abc\nhostname=box\nrecorded=2026-11-07 00:00:00 UTC\npath=${path.resolve(kept)}\npath=${path.resolve(nested)}\n`);
    const gitBytes = fs.readFileSync(path.join(kept, '.git'));
    const calls = [];
    const second = runProbe({ ...common, fs: guard(fs, calls) });
    assert.equal(second.exitCode, 0, second.stderr);
    assert.match(second.stdout, /^STATUS=unchanged\n/);
    assert.doesNotMatch(second.stdout, /LOST=|NEW=|changed \(was/);
    assert.deepEqual(calls, []);
    assert.equal(fs.readFileSync(baseline, 'utf8'), body);
    assert.deepEqual(fs.readFileSync(path.join(kept, '.git')), gitBytes);

    gitRepo(later);
    const added = runProbe(common);
    assert.match(added.stdout, /^STATUS=unchanged\n/);
    assert.match(added.stdout, new RegExp(`NEW=${path.resolve(later).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    assert.doesNotMatch(added.stdout, /LOST=/);
    assert.equal(fs.readFileSync(baseline, 'utf8'), body);

    fs.rmSync(path.join(nested, '.git'));
    const lost = runProbe(common);
    assert.match(lost.stdout, /^STATUS=changed\n/);
    assert.match(lost.stdout, new RegExp(`LOST=${path.resolve(nested).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    assert.equal(fs.readFileSync(baseline, 'utf8'), body);
    const moved = runProbe({ ...common, hostname: 'other' });
    assert.match(moved.stdout, /hostname changed \(was box\)/);
    assert.equal(fs.readFileSync(baseline, 'utf8'), body);

    const inside = path.join(workspace, 'baseline.txt');
    const refused = runProbe({ ...common, baselinePath: inside });
    assert.equal(refused.exitCode, 1);
    assert.match(refused.stderr, /inside the watched workspace/);
    assert.equal(fs.existsSync(inside), false);
    const missingRoot = path.join(dir, 'missing-workspace');
    const noRoot = runProbe({ ...common, workspaceRoot: missingRoot, baselinePath: path.join(dir, 'no-root.txt') });
    assert.equal(noRoot.exitCode, 1);
    assert.equal(fs.existsSync(path.join(dir, 'no-root.txt')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('T148 probe source allows only the exclusive create, and the CLI accepts no arguments', () => {
  const source = fs.readFileSync(probeFile, 'utf8');
  assert.match(source, /O_CREAT \| fs\.constants\.O_EXCL \| fs\.constants\.O_NOFOLLOW/);
  for (const bad of [/child_process/, /worker_threads/, /node:net/, /O_TRUNC/, /O_APPEND/, /O_RDWR/, /execFile|spawnSync|execSync/])
    assert.equal(bad.test(source), false, String(bad));
  assert.equal(source.includes('record-instance-baseline'), false);
  assert.equal(source.includes(DEFAULT_WORKSPACE), true);
  assert.equal(DEFAULT_BASELINE.startsWith(`${DEFAULT_WORKSPACE}${path.sep}`) || DEFAULT_BASELINE === DEFAULT_WORKSPACE, false);
  const home = '/home/box';
  const before = fs.existsSync(home);
  const rejected = spawnSync(process.execPath, [probeFile, '--refresh'], { encoding: 'utf8', timeout: 5000 });
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /PROBE_FAILED=arguments are not accepted/);
  assert.equal(fs.existsSync(home), before);
  assert.equal(probeMain(['--baseline']).exitCode, 1);
});

test('T149 baseline refresh is an explicit --refresh write and is not the probe', () => {
  const source = fs.readFileSync(writerFile, 'utf8');
  for (const phrase of ['WRITE OPERATION', 'explicitly asks', 'The pre-check never runs this script', 'never passes --refresh', 'not a probe and not a declaration'])
    assert.ok(source.includes(phrase), phrase);
  const dir = tempDir();
  try {
    const workspace = path.join(dir, 'workspace');
    const repo = path.join(workspace, 'repo');
    gitRepo(repo);
    const baseline = path.join(dir, 'outside', 'baseline.txt');
    fs.mkdirSync(path.dirname(baseline), { recursive: true });
    fs.writeFileSync(baseline, 'machine-id=old\nhostname=old\nrecorded=old\npath=/gone\n');
    const blocked = refreshBaseline({ baselinePath: baseline, workspaceRoot: workspace });
    assert.equal(blocked.exitCode, 1);
    assert.equal(fs.readFileSync(baseline, 'utf8').includes('machine-id=old'), true);
    const refreshed = refreshBaseline({ refresh: true, baselinePath: baseline, workspaceRoot: workspace, machineId: 'abc', hostname: 'box', recorded: '2026-11-07 01:00:00 UTC' });
    assert.equal(refreshed.exitCode, 0, refreshed.stderr);
    assert.match(refreshed.stderr, /WRITE: refreshing baseline/);
    assert.match(refreshed.stderr, /explicit user request only; not the instance probe/);
    assert.equal(fs.readFileSync(baseline, 'utf8'), `machine-id=abc\nhostname=box\nrecorded=2026-11-07 01:00:00 UTC\npath=${path.resolve(repo)}\n`);
    const compared = runProbe({ baselinePath: baseline, workspaceRoot: workspace, machineId: 'abc', hostname: 'box' });
    assert.match(compared.stdout, /^STATUS=unchanged\n/);
    const bare = refreshMain([]);
    assert.equal(bare.exitCode, 1);
    assert.match(bare.stderr, /pass --refresh only/);
    const home = '/home/box';
    const before = fs.existsSync(home);
    const spawned = spawnSync(process.execPath, [writerFile], { encoding: 'utf8', timeout: 5000 });
    assert.equal(spawned.status, 1);
    assert.equal(fs.existsSync(home), before);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
