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

test('delegation necessity triage only narrows (CAND-20261026-001 v7)', () => {
  const r = read('references/任务拆分并行与整合.md');
  assert.match(r, /必要性判定（CAND-20261026-001 v7，0\.1\.46；只收窄不放宽）/);
  for (const k of ['纯确定性档', '宿主行为档', '灰区', '四类默认档', '成本原则只能缩小委派范围', '外部宿主行为验证准入']) assert.ok(r.includes(k), k);
  assert.match(r, /不放宽也不覆盖第 1 条默认关闭、永不委派项与已批计划逐 WI 点名/);
  assert.match(r, /各在仓库外任务记录留实测记录（记录路径、日期、结论）/);
});

test('pending decisions prefer option controls, presentation only (CAND-20261026-003 v5)', () => {
  const r = read('references/确认授权与变更.md');
  assert.match(r, /待决事项优先用选项控件呈现\*\*（CAND-20261026-003 v5，0\.1\.47；只管呈现，不改变批准语义）/);
  for (const k of ['逐题点选', '每回合一题', '短回复码带决定身份', '推荐项排第一并标“（推荐）”', '全部按推荐', '自由文本入口']) assert.ok(r.includes(k), k);
  assert.match(r, /一律按 §6\.5、§6\.3\.1 与第 4、5 条及 SKILL\.md §0 第 2 条执行/);
});
