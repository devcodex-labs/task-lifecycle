#!/usr/bin/env node
// WRITE OPERATION. Refreshes the Grok Bot instance baseline.
// Run only when the real user explicitly asks, and only with --refresh.
// The pre-check never runs this script and never passes --refresh.
// This file is not a probe and not a declaration. It replaces one baseline file and nothing else.
// Watched directory and output are hard-coded: /workspace and /home/box/instance-probe/baseline.txt.
// Usage: node record-instance-baseline.mjs --refresh
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_BASELINE, DEFAULT_MACHINE_ID, DEFAULT_WORKSPACE, baselineInsideWorkspace, formatBaseline, listGitRepos, readMachineId, stamp,
} from './instance-probe.mjs';

function fail(message) {
  return { exitCode: 1, stdout: '', stderr: `WRITE_FAILED=${message}\n` };
}

function writeBaselineFile(fsx, file, body) {
  const dir = path.dirname(file);
  if (!fsx.existsSync(dir)) fsx.mkdirSync(dir, { recursive: true });
  const fd = fsx.openSync(file, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW);
  try {
    const buf = Buffer.from(body, 'utf8');
    let off = 0;
    while (off < buf.length) {
      const n = fsx.writeSync(fd, buf, off, buf.length - off);
      if (n <= 0) throw new Error('short write');
      off += n;
    }
    if (typeof fsx.fsyncSync === 'function') fsx.fsyncSync(fd);
  } finally {
    fsx.closeSync(fd);
  }
}

export function refreshBaseline(opts = {}) {
  if (opts.refresh !== true) return fail('pass --refresh only; the pre-check never runs this command');
  const fsx = opts.fs ?? fs;
  const baselinePath = opts.baselinePath ?? DEFAULT_BASELINE;
  const workspaceRoot = opts.workspaceRoot ?? DEFAULT_WORKSPACE;
  const listed = listGitRepos(fsx, workspaceRoot);
  if (!listed.ok) return fail(`workspace unreadable (${listed.code})`);
  if (baselineInsideWorkspace(baselinePath, listed.rootReal)) return fail('baseline path is inside the watched workspace');
  let id = opts.machineId !== undefined ? String(opts.machineId) : null;
  if (id === null) {
    const read = readMachineId(fsx, opts.machineIdPath ?? DEFAULT_MACHINE_ID);
    if (!read.ok) return fail(`machine-id unreadable (${read.code})`);
    id = read.id;
  }
  const hostname = opts.hostname ?? os.hostname();
  const recorded = opts.recorded ?? stamp(opts.now ?? new Date());
  if ([id, hostname, recorded].some((v) => v.includes('\n') || v.includes('\r'))) return fail('identity values must be single-line');
  const body = formatBaseline({ machineId: id, hostname, recorded, paths: listed.repos });
  try { writeBaselineFile(fsx, baselinePath, body); }
  catch (e) { return fail(`baseline not written (${e.code || e.message || 'ERR'})`); }
  return {
    exitCode: 0,
    stdout: body,
    stderr: `WRITE: refreshing baseline at ${baselinePath}; explicit user request only; not the instance probe\n`,
  };
}

export function main(argv = process.argv.slice(2), deps = {}) {
  if (argv.length !== 1 || argv[0] !== '--refresh') return fail('pass --refresh only; the pre-check never runs this command');
  return refreshBaseline({ ...deps, refresh: true });
}

function runCli() {
  const { stdout, stderr, exitCode } = main();
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  process.exit(exitCode);
}
const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) runCli();
