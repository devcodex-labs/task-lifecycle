import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'task-lifecycle');
const read = (p) => readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n'); // CRLF-safe on Windows checkouts

test('relay templates carry dispatch header and receiver ban', () => {
  for (const n of ['relay-review-first-leg-prompt', 'relay-review-second-leg-prompt', 'relay-review-verifier-prompt']) {
    const t = read(`templates/${n}.md`);
    const body = t.slice(t.indexOf('```text\n') + 8);
    assert.match(body.split('\n')[0], /^\[TL-DISPATCHED depth=/, n);
    for (const k of ['not a real user message', 'No further dispatch', 'ordinary read-only commands']) {
      assert.equal(body.split(k).length - 1, 1, `${n}: ${k}`);
    }
  }
});

test('SKILL.md receiver gate precedes admission and only tightens', () => {
  const s = read('SKILL.md');
  assert.match(s, /Receiver gate \(dispatch marker; evaluated before naming/);
  assert.match(s, /can only tighten, never loosen/);
  assert.match(s, /depth≥1 may never dispatch/);
});

test('naming inside dispatch prompt does not admit CLI', () => {
  assert.match(read('references/formal-review-and-findings.md'), /naming, reviewer pools or config wording in a dispatch prompt.*grants no admission/);
  assert.match(read('references/task-split-parallel-and-integration.md'), /naming in a dispatch prompt grants no admission/);
});

test('delegation necessity triage only narrows (CAND-20261026-001 v7)', () => {
  const r = read('references/task-split-parallel-and-integration.md');
  assert.match(r, /Necessity judgment \(CAND-20261026-001 v7, 0\.1\.46; only narrows, never loosens\)/);
  for (const k of ['deterministic tier', 'host-behavior tier', 'gray zone', 'Default tiers of the four categories',
    'the cost principle can only narrow delegation scope', 'Admission for external host behavior verification']) assert.ok(r.includes(k), k);
  assert.match(r, /neither loosens nor overrides item 1's default-off, the never-delegate items and per-WI naming in the approved plan/);
  assert.match(r, /Capabilities fully open, only five baselines remain/);
  for (const k of ['no push', 'no release', 'no delete', 'no credential reads', 'no signing conclusions', 'Stop on crossing', 'Bash(git push:*)']) assert.ok(r.includes(k), k);
});

test('pending decisions prefer option controls, presentation only (CAND-20261026-003 v5)', () => {
  const r = read('references/confirmation-authorization-and-change.md');
  assert.match(r, /Pending decisions preferably use a choice widget\*\* \(CAND-20261026-003 v5, 0\.1\.47; governs presentation only, not approval semantics\)/);
  for (const k of ['can click question by question', 'one question per turn', 'short reply codes carrying the decision identity',
    'the recommended option\n     comes first with "(recommended)"', 'MERGED_OPTION_TEXT', 'free-text entry']) assert.ok(r.includes(k), k);
  assert.match(r, /all follow §6\.5, §6\.3\.1, items 4 and 5 and SKILL\.md §0 item 2/);
});
