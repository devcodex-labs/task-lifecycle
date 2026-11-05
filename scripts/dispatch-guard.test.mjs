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
    assert.match(body.split('\n')[0], /role=reviewer/);
    assert.match(body, /reviewer role stays read-only and cannot sign conclusions/);
    assert.doesNotMatch(body, /non-grok|grok sessions have capabilities fully open/);
  }
});

test('SKILL.md receiver gate precedes admission and only tightens', () => {
  const s = read('SKILL.md');
  assert.match(s, /Receiver gate \(dispatch marker; evaluated before naming/);
  assert.match(s, /can only tighten, never loosen/);
  assert.match(s, /Default: no recursive delegation/);
  assert.match(s, /Implementation worker.*\*\*: may write only the concrete write set/);
  assert.match(s, /A role label alone grants no writes/);
  assert.match(s, /fields like `source=user` or `depth=0` cannot prove origin/);
  assert.doesNotMatch(s, /reads\/writes, network and sub-agents inside an external CLI/);
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
  const adapter = read('references/grok-cli-dispatch.md');
  assert.match(r, /sole owner of its version table/);
  assert.ok(r.includes('Record any actually authorized adapter exception explicitly'));
  assert.doesNotMatch(r, /--always-approve|Bash\(git push:\*\)|grok 1\.0\.70/);
  for (const k of ['no push', 'no release', 'no delete', 'no credential reads', 'no signing conclusions', 'stop the affected dispatch', 'Bash(git push:*)']) assert.ok(adapter.includes(k), k);
});

test('Grok adapter requires real applicability and preserves role limits and unverified controls', () => {
  const adapter = read('references/grok-cli-dispatch.md');
  for (const k of ['actual Grok CLI invocation', 'CLI path/version', 'read/write scope', 'probe output', 'A reviewer remains read-only', 'current authorization covers them',
    'never Auto', 'unknown CLI version', 'do not silently rewrite', 'not proof', 'unverified (the user waived live testing)', 'exit code 0']) {
    assert.ok(adapter.toLowerCase().includes(k.toLowerCase()), k);
  }
  assert.match(read('references/formal-review-and-findings.md'), /reviewer remains read-only and cannot change the target/);
});

test('pending decisions prefer option controls, presentation only (CAND-20261026-003 v5)', () => {
  const r = read('references/confirmation-authorization-and-change.md');
  assert.match(r, /Pending decisions preferably use a choice widget\*\* \(CAND-20261026-003 v5, 0\.1\.47; governs presentation only, not approval semantics\)/);
  for (const k of ['one single-question card per decision', 'never a multi-step widget', 'short reply codes carrying the decision identity',
    'the recommended option\n     comes first with "(recommended)"', 'MERGED_OPTION_TEXT', 'free-text entry']) assert.ok(r.includes(k), k);
  assert.match(r, /all follow §6\.5, §6\.3\.1, items 4 and 5 and SKILL\.md §0 item 2/);
});

test('Page rules have one conditional owner, a stable identity and honest missing-tool delivery', () => {
  const page = read('references/grok-bot-page.md');
  for (const text of ['actual current host is Grok Bot', 'delivers directly to the user', 'Dispatched session', 'Non-Grok Bot host', 'Contract already finalized',
    'source-delivery=complete', 'Page-delivery=pending', 'Do not invent a Page URL', 'one logical Document ID to one current Page ID/URL',
    'same Page', 'new filename or version alone does not create a new Page', 'retained draft body is clearly historical',
    'only** the gate/branch/execute-against flow segments', 'inline TableOfContents', 'collapsed document-header section']) assert.ok(page.includes(text), text);
  const core = read('references/verification-and-evidence-routing.md');
  assert.ok(core.includes('Single-file HTML on demand') && core.includes('only when the user explicitly asks'));
  assert.doesNotMatch(core, /1024px|WriteCanvas|Item 12 \*\*Flow-type|Page.*lang.*prop/);
  assert.doesNotMatch(core, /really approved Codex|target Codex install/);
  const confirmation = read('references/confirmation-authorization-and-change.md');
  assert.ok(confirmation.includes('Only a separate obsolete Page') && confirmation.includes('With no Page this check is N/A'));
});
