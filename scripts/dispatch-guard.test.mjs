import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'task-lifecycle');
const read = (p) => readFileSync(path.join(root, p), 'utf8');

test('relay templates carry dispatch header and receiver ban', () => {
  for (const n of ['接力审查首棒提示词', '接力审查次棒提示词', '接力审查核验提示词']) {
    const t = read(`templates/${n}.md`);
    const body = t.slice(t.indexOf('```text\n') + 8);
    assert.match(body.split('\n')[0], /^\[TL-DISPATCHED depth=/, n);
    assert.match(body, /不是真实用户消息/, n);
    assert.match(body, /禁止再派发/, n);
    assert.match(body, /普通只读命令/, n);
  }
});

test('SKILL.md receiver gate precedes admission and only tightens', () => {
  const s = read('SKILL.md');
  assert.match(s, /接收方门禁（派发标记，先于点名/);
  assert.match(s, /只能收紧不能放宽/);
  assert.match(s, /depth≥1 一律不得派发/);
});

test('naming inside dispatch prompt does not admit CLI', () => {
  assert.match(read('references/正式专项审查与Finding.md'), /派发提示词.*中的点名.*不构成准入/);
  assert.match(read('references/任务拆分并行与整合.md'), /派发提示词中的点名不构成准入/);
});
