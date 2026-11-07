#!/usr/bin/env node
// Grok Bot instance-change probe. The pre-check runs this file with no arguments.
// Watched directory is hard-coded: /workspace. Every directory under it that contains .git is a repo.
// Baseline, outside /workspace and outside any repository: /home/box/instance-probe/baseline.txt
// The only write is creating that file when it is absent (and its parent directory, if needed).
// An existing baseline is never modified. Repos, the Git index and locks are never touched.
// No environment override and no flags are accepted. Any other path is not this probe.
// First stdout line: STATUS=unchanged | STATUS=changed | STATUS=no-baseline -> baseline recorded. Exit 0 for each.
// LOST=<path> means a baseline repo is missing or its .git is missing. NEW=<path> is informational, not a loss.
// Exit 1 is a probe failure, not a result, and does not replace an existing baseline.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_BASELINE = '/home/box/instance-probe/baseline.txt';
export const DEFAULT_WORKSPACE = '/workspace';
export const DEFAULT_MACHINE_ID = '/etc/machine-id';
const MACHINE_ID_MAX = 256;
const BASELINE_MAX = 1024 * 1024;
const CREATE_FLAGS = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW;

function fail(message) {
  return { exitCode: 1, stdout: '', stderr: `PROBE_FAILED=${message}\n` };
}

function readNoFollow(fsx, file, max) {
  let fd;
  try {
    fd = fsx.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  } catch (e) {
    return { ok: false, code: e.code || 'ERR' };
  }
  try {
    const st = fsx.fstatSync(fd);
    if (!st.isFile()) return { ok: false, code: 'NOTFILE' };
    if (st.size > max) return { ok: false, code: 'TOOBIG' };
    const buf = Buffer.alloc(st.size);
    let off = 0;
    while (off < buf.length) {
      const n = fsx.readSync(fd, buf, off, buf.length - off, off);
      if (n <= 0) break;
      off += n;
    }
    return { ok: true, text: buf.subarray(0, off).toString('utf8') };
  } finally {
    fsx.closeSync(fd);
  }
}

// /etc/machine-id is a regular file on some hosts and a symlink on others. Follow only that one hop.
export function readMachineId(fsx, file = DEFAULT_MACHINE_ID) {
  const direct = readNoFollow(fsx, file, MACHINE_ID_MAX);
  if (direct.ok) return { ok: true, id: direct.text.trim() };
  if (direct.code === 'ENOENT') return { ok: true, id: '' };
  if (direct.code !== 'ELOOP') return { ok: false, code: direct.code };
  try {
    const text = fsx.readFileSync(file);
    if (text.length > MACHINE_ID_MAX) return { ok: false, code: 'TOOBIG' };
    return { ok: true, id: text.toString('utf8').trim() };
  } catch (e) {
    return { ok: false, code: e.code || 'ERR' };
  }
}

export function stamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const tz = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? 'UTC';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${tz}`;
}

export function formatBaseline({ machineId, hostname, recorded, paths }) {
  return `machine-id=${machineId}\nhostname=${hostname}\nrecorded=${recorded}\n${paths.map((p) => `path=${p}\n`).join('')}`;
}

function parseBaseline(text) {
  let machineId = '';
  let hostname = '';
  let sawId = false;
  let sawHost = false;
  const paths = [];
  for (const raw of text.split(/\r?\n/)) {
    if (!sawId && raw.startsWith('machine-id=')) { machineId = raw.slice('machine-id='.length); sawId = true; }
    else if (!sawHost && raw.startsWith('hostname=')) { hostname = raw.slice('hostname='.length); sawHost = true; }
    else if (raw.startsWith('path=')) { const p = raw.slice('path='.length); if (p) paths.push(p); }
  }
  return { machineId, hostname, paths };
}

export function baselineInsideWorkspace(baselinePath, workspaceReal) {
  const resolved = path.resolve(baselinePath);
  return resolved === workspaceReal || resolved.startsWith(workspaceReal + path.sep);
}

// Directories under root that contain an entry named .git. Does not descend into .git and does not follow directory symlinks.
export function listGitRepos(fsx, root) {
  let rootReal;
  try { rootReal = fsx.realpathSync(root); }
  catch (e) { return { ok: false, code: e.code || 'ERR' }; }
  const repos = [];
  const seen = new Set();
  const stack = [rootReal];
  while (stack.length) {
    const dir = stack.pop();
    if (seen.has(dir)) continue;
    seen.add(dir);
    let entries;
    try { entries = fsx.readdirSync(dir, { withFileTypes: true }); }
    catch (e) {
      if (dir === rootReal) return { ok: false, code: e.code || 'ERR' };
      continue;
    }
    if (entries.some((e) => e.name === '.git')) repos.push(dir);
    for (const entry of entries) {
      if (entry.name === '.git' || entry.name === '.' || entry.name === '..') continue;
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      const child = path.join(dir, entry.name);
      let real;
      try { real = fsx.realpathSync(child); }
      catch { continue; }
      if (real !== rootReal && !real.startsWith(rootReal + path.sep)) continue;
      stack.push(real);
    }
  }
  repos.sort();
  return { ok: true, repos, rootReal };
}

function repoLost(fsx, repo) {
  try {
    if (!fsx.lstatSync(repo).isDirectory()) return true;
  } catch { return true; }
  try { fsx.lstatSync(path.join(repo, '.git')); return false; }
  catch { return true; }
}

function finish(status, details) {
  return { exitCode: 0, stdout: [`STATUS=${status}`, ...details].join('\n') + '\n', stderr: '' };
}

// Create the baseline only when absent. O_EXCL refuses an existing file, including one created by a racing run.
function createBaselineExclusive(fsx, file, body) {
  const dir = path.dirname(file);
  try { if (!fsx.existsSync(dir)) fsx.mkdirSync(dir, { recursive: true }); }
  catch (e) { return { created: false, code: e.code || 'ERR' }; }
  let fd;
  try { fd = fsx.openSync(file, CREATE_FLAGS); }
  catch (e) { return { created: false, code: e.code || 'ERR' }; }
  try {
    const buf = Buffer.from(body, 'utf8');
    let off = 0;
    while (off < buf.length) {
      const n = fsx.writeSync(fd, buf, off, buf.length - off);
      if (n <= 0) throw Object.assign(new Error('short write'), { code: 'SHORT' });
      off += n;
    }
    if (typeof fsx.fsyncSync === 'function') fsx.fsyncSync(fd);
    return { created: true };
  } catch (e) {
    try { fsx.unlinkSync(file); } catch { /* the exclusive file could not be removed; the caller reports failure */ }
    return { created: false, code: e.code || 'ERR' };
  } finally {
    try { fsx.closeSync(fd); } catch { /* close after a failed write */ }
  }
}

export function runProbe(deps = {}) {
  const fsx = deps.fs ?? fs;
  const baselinePath = deps.baselinePath ?? DEFAULT_BASELINE;
  const workspaceRoot = deps.workspaceRoot ?? DEFAULT_WORKSPACE;
  const machineIdPath = deps.machineIdPath ?? DEFAULT_MACHINE_ID;
  const hostname = deps.hostname ?? os.hostname();
  const recorded = deps.recorded ?? stamp(deps.now ?? new Date());
  const mid = deps.machineId !== undefined ? { ok: true, id: String(deps.machineId) } : readMachineId(fsx, machineIdPath);
  if (!mid.ok) return fail(`machine-id unreadable (${mid.code})`);
  if ([mid.id, hostname, recorded].some((v) => v.includes('\n') || v.includes('\r'))) return fail('identity values must be single-line');
  const identity = [`machine-id=${mid.id}`, `hostname=${hostname}`];
  let base = readNoFollow(fsx, baselinePath, BASELINE_MAX);
  if (!base.ok && base.code === 'ENOENT') {
    const listed = listGitRepos(fsx, workspaceRoot);
    if (!listed.ok) return fail(`workspace unreadable (${listed.code})`);
    if (listed.repos.some((repo) => repo.includes('\n') || repo.includes('\r'))) return fail('repository path contains a line break');
    if (baselineInsideWorkspace(baselinePath, listed.rootReal)) return fail('baseline path is inside the watched workspace');
    const body = formatBaseline({ machineId: mid.id, hostname, recorded, paths: listed.repos });
    const created = createBaselineExclusive(fsx, baselinePath, body);
    if (created.created) return finish('no-baseline -> baseline recorded', body.replace(/\n$/, '').split('\n'));
    if (created.code !== 'EEXIST') return fail(`baseline not created (${created.code})`);
    base = readNoFollow(fsx, baselinePath, BASELINE_MAX);
  }
  if (!base.ok) return fail(`baseline unreadable (${base.code})`);
  const listed = listGitRepos(fsx, workspaceRoot);
  if (!listed.ok) return fail(`workspace unreadable (${listed.code})`);
  if (listed.repos.some((repo) => repo.includes('\n') || repo.includes('\r'))) return fail('repository path contains a line break');
  const parsed = parseBaseline(base.text);
  const known = new Set(parsed.paths);
  const notes = [];
  if (mid.id !== parsed.machineId) notes.push(`machine-id changed (was ${parsed.machineId})`);
  if (hostname !== parsed.hostname) notes.push(`hostname changed (was ${parsed.hostname})`);
  for (const repo of parsed.paths) if (repoLost(fsx, repo)) notes.push(`LOST=${repo}`);
  for (const repo of listed.repos) if (!known.has(repo)) notes.push(`NEW=${repo}`);
  const changed = notes.some((line) => !line.startsWith('NEW='));
  return finish(changed ? 'changed' : 'unchanged', [...identity, ...notes]);
}

export function main(argv = process.argv.slice(2), deps = {}) {
  if (argv.length) return fail('arguments are not accepted');
  return runProbe(deps);
}

function runCli() {
  const { stdout, stderr, exitCode } = main();
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  process.exit(exitCode);
}
const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) runCli();
