#!/usr/bin/env node
// Compatibility entry; the Skill ships the only runtime implementation.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../skills/task-lifecycle/scripts/check-citations.mjs';
export * from '../skills/task-lifecycle/scripts/check-citations.mjs';
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
