# 正式专项审查计划与 Finding（两个独立正式对象的最小模板）

> **先批准真实的计划，再执行专业正式审查。** 计划与报告可放在不同实际文件；这里合并的是字段示例，不是合并审批对象。模型文件级自审不需要每次建立新的专项计划。未经合法授权不填“正式审查通过”。

## A. 待批准审查计划（独立 Artifact ID）

- Task / Plan ID / Plan Version / Actual Path: `{待核实}`
- 唯一被审对象及当前**外部 SHA**、现行有效源: `{待核实}`
- 实际项目/消费者事实、范围与排除项：`{真实调查}`
- 角色/检查方法：`{每个角色对应具体判断，不罗列空头衔}`
- 宿主权限、D/A/I/H 适用性、冻结通过阈值与真实失败条件：`{当前事实}`
- 计划自身自审、待有效真人 Confirm/任务内合法 Auto 结果：`{不得预填批准}`

| Check ID | 批准源 ID / 完整义务及子条件 | 触发前提与消费者 | 实际正/反断言 | 方法+权限+预计证据级别 | 冻结通过/失败出口 |
|---|---|---|---|---|---|
| `{唯一ID}` | `{非机械章节匹配}` | `{具体}` | `{应通过 / 必须拒绝}` | `{D/A/I/H/E3/E4}` | `{清晰标准}` |

## B. 已批准计划实际执行后的报告（另一个独立 Artifact ID）

- 计划准确版本、有效批准来源/范围：`{真实}`
- 被审对象准确当前版本/实际SHA、是否仍适用：`{真实}`
- 已执行检查集合/实际读取深度：`{inventory/search/file-deep-read/runtime-consumer}`
- 未执行项目/环境/权限：`{unverified及影响}`
- 逐复合子条件实际证据与结论：`{covered-by-design/partially-covered/gap/needs-evidence/N/A+reason}`
- E4 真实执行状态：`{passed/failed/unverified/N/A+reason}`，与 E3 独立。
- 检查各项 `covered-by-design` 的理由不得同时包含关键内容 pending；否则降为 partial/needs-evidence。
- **事实确认与被审对象批准分开**，不要用报告事实认可直接关闭对象。

## C. Finding 逐项记录（可多个共享一个修复批次，但独立关闭）

| 语义字段 | 必须写的实际证据 |
|---|---|
| Finding ID / Group ID / Root cause | `{每个独立ID、共享原因只有证据充分才能分组}` |
| Source/Check/Artifact IDs & Versions | `{准确源和被审对象}` |
| Facts / Expected / Actual / Severity | `{已观察事实、冻结期望、证据、P0/P1/P2}` |
| `defectRootCause` | `{缺陷自身为何发生}` |
| `controlFailure / whyMissed` | `{先前为何漏检，不能都写审查不严}` |
| Impact, consumers, new regression | `{直接/间接、是否Bug A引入B及因果}` |
| Actual changed files, new version, diff | `{真实修改或 resolved-in-candidate，未修改不得冒充}` |
| Independent verification and re-review | `{适用真实结果，不能从父Finding复制}` |
| State / remaining risk / next action | `open/investigating/repair-planned/repairing/verification-pending/re-review-pending/closed-verified/blocked/rejected-with-evidence/deferred-approved + 证据` |

## D. 无效循环检查

| Review Round | newEvidence | newAffectedConditions | newCodeOrContractDiff | newVerifiedClaims | closedWithEvidence | remaining gaps |
|---|---|---|---|---|---|---|
| `{一次实际轮次}` | `{真实变化或none}` | ... | ... | ... | ... | ... |

连续同方法没有实质进展时，停止重复并具体提出变更审查方法、缺真实环境、产品选择或阻断；不能重命名报告提高“收敛率”。
