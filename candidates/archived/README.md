# 已吸纳候选归档（candidates/archived/）

本目录存放**已吸纳**（已经真人批准晋级为生效规则）的候选正文，只作历史查阅（审查、冻结、批准、验证记录自 CAND-20261024-029 起外置，不进仓库），不再参与审查或晋级。

**与同级 `../rejected/` 的区别**：`candidates/rejected/`（原仓库根目录 `archived/`，2026-10-24 移入改名）存放**已下架**（撤回、被取代、不再吸纳）的候选；本目录存放**已吸纳**的候选。两者语义不同，不得混放。

## 归档规则
1. 归档依据：候选状态行为 `approved → active/…` 或 `active`，或只读 history 记录了该版本晋级；无法证明已吸纳的不归档。
2. 用 `git mv` 从 `candidates/` 移入本目录，文件名、正文不变，记录移动前后 sha256。
3. 从 `../pending/` 移入；在下表追加一行，并从 `../pending/README.md` 清单删除对应行。
4. 正文中的 `evolution/…`、`candidates/…` 路径是历史位置，按原样保留。

## 状态说明
生效规则 INDEX（外置 `.task-lifecycle/active-rules/INDEX.md`）已于 2026-10-24 14:33（Asia/Shanghai）清理时被删除，目前不存在；本表暂作归档状态登记，**不是** INDEX 的替代。INDEX 是否恢复待 Rocky 决定。

## 归档清单（2026-10-24 归档，任务 ARCHIVE-20261024-001，共 45 个文件）

| 编号 | 文件标题 | 原路径（历史，当时 candidates/ 根目录尚可放候选） | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-001-v2 | CAND-20261024-001-v2提案-RULE-001修订 | `candidates/CAND-20261024-001-v2提案-RULE-001修订.md` | `candidates/archived/CAND-20261024-001-v2提案-RULE-001修订.md` | sha bc14b7dd 与 history 1328 重冻结批准 SHA 一致 |
| CAND-20261024-001-v3 | CAND-20261024-001-v3提案-覆盖台账须列全部范围与读深依据 | `candidates/CAND-20261024-001-v3提案-覆盖台账须列全部范围与读深依据.md` | `candidates/archived/CAND-20261024-001-v3提案-覆盖台账须列全部范围与读深依据.md` | history 1412-晋级-009v4-020-001v3（RULE-001 追加 v3） |
| CAND-20261024-001 | CAND-20261024-001-未指定范围须确认 | `candidates/CAND-20261024-001-未指定范围须确认.md` | `candidates/archived/CAND-20261024-001-未指定范围须确认.md` | 状态行“approved → active/RULE-20261024-001”；history 0857（v1） |
| CAND-20261024-002-v2 | CAND-20261024-002-v2提案-RULE-002修订 | `candidates/CAND-20261024-002-v2提案-RULE-002修订.md` | `candidates/archived/CAND-20261024-002-v2提案-RULE-002修订.md` | sha 1b924731 与 history 1328 批准 SHA 一致 |
| CAND-20261024-002 | CAND-20261024-002-修复方案前提须先实测 | `candidates/CAND-20261024-002-修复方案前提须先实测.md` | `candidates/archived/CAND-20261024-002-修复方案前提须先实测.md` | 状态行“approved → active/RULE-20261024-002”；history 0857 |
| CAND-20261024-003 | CAND-20261024-003-普通协助中途演变须重判入口 | `candidates/CAND-20261024-003-普通协助中途演变须重判入口.md` | `candidates/archived/CAND-20261024-003-普通协助中途演变须重判入口.md` | 状态行“approved → active/RULE-20261024-003”；history 0857 |
| CAND-20261024-004 | CAND-20261024-004-候选登记须当轮提示用户 | `candidates/CAND-20261024-004-候选登记须当轮提示用户.md` | `candidates/archived/CAND-20261024-004-候选登记须当轮提示用户.md` | 状态行“approved → active/RULE-20261024-004”；history 0857 |
| CAND-20261024-006 | CAND-20261024-006-报告每项须列验证合理性收益与最优性 | `candidates/CAND-20261024-006-报告每项须列验证合理性收益与最优性.md` | `candidates/archived/CAND-20261024-006-报告每项须列验证合理性收益与最优性.md` | 状态行“approved → active/RULE-20261024-006”；history 0857 |
| CAND-20261024-007 | CAND-20261024-007-候选捕获入口补全 | `candidates/CAND-20261024-007-候选捕获入口补全.md` | `candidates/archived/CAND-20261024-007-候选捕获入口补全.md` | 状态行“approved → active/RULE-20261024-007”；history 0857 |
| CAND-20261024-008 | CAND-20261024-008-进化候选审查须走受管只读审查路线 | `candidates/CAND-20261024-008-进化候选审查须走受管只读审查路线.md` | `candidates/archived/CAND-20261024-008-进化候选审查须走受管只读审查路线.md` | 状态行“active”；history 0905-晋级-008 |
| CAND-20261024-009 | CAND-20261024-009-高风险入口设薄入口skill | `candidates/CAND-20261024-009-高风险入口设薄入口skill.md` | `candidates/archived/CAND-20261024-009-高风险入口设薄入口skill.md` | history 1412（新建 RULE-20261024-009，v4 ae86ad8d…） |
| CAND-20261024-010 | CAND-20261024-010-修改后联动残留与缺席检查 | `candidates/CAND-20261024-010-修改后联动残留与缺席检查.md` | `candidates/archived/CAND-20261024-010-修改后联动残留与缺席检查.md` | 状态行“approved → active/RULE-20261024-010”；history 1227-晋级-010至017 |
| CAND-20261024-011 | CAND-20261024-011-外部意见逐条核验 | `candidates/CAND-20261024-011-外部意见逐条核验.md` | `candidates/archived/CAND-20261024-011-外部意见逐条核验.md` | 状态行“approved → active/RULE-20261024-011”；history 1227-晋级-010至017 |
| CAND-20261024-012 | CAND-20261024-012-积压与吸纳前先复核并留检索证据 | `candidates/CAND-20261024-012-积压与吸纳前先复核并留检索证据.md` | `candidates/archived/CAND-20261024-012-积压与吸纳前先复核并留检索证据.md` | 状态行“approved → active/RULE-20261024-012”；history 1227-晋级-010至017 |
| CAND-20261024-013 | CAND-20261024-013-完成回复最低可核验字段 | `candidates/CAND-20261024-013-完成回复最低可核验字段.md` | `candidates/archived/CAND-20261024-013-完成回复最低可核验字段.md` | 状态行“approved → active/RULE-20261024-013”；history 1227-晋级-010至017 |
| CAND-20261024-014 | CAND-20261024-014-宿主实测证据绑定加载版本与时效 | `candidates/CAND-20261024-014-宿主实测证据绑定加载版本与时效.md` | `candidates/archived/CAND-20261024-014-宿主实测证据绑定加载版本与时效.md` | 状态行“approved → active/RULE-20261024-014”；history 1227-晋级-010至017 |
| CAND-20261024-015 | CAND-20261024-015-状态权威来源与过期状态行 | `candidates/CAND-20261024-015-状态权威来源与过期状态行.md` | `candidates/archived/CAND-20261024-015-状态权威来源与过期状态行.md` | 状态行“approved → active/RULE-20261024-015”；history 1227-晋级-010至017 |
| CAND-20261024-016 | CAND-20261024-016-删除覆盖须清单与归属并登记备份 | `candidates/CAND-20261024-016-删除覆盖须清单与归属并登记备份.md` | `candidates/archived/CAND-20261024-016-删除覆盖须清单与归属并登记备份.md` | 状态行“approved → active/RULE-20261024-016”；history 1227-晋级-010至017 |
| CAND-20261024-017 | CAND-20261024-017-提出计划的消息不能当确认 | `candidates/CAND-20261024-017-提出计划的消息不能当确认.md` | `candidates/archived/CAND-20261024-017-提出计划的消息不能当确认.md` | 状态行“approved → active/RULE-20261024-017”；history 1227-晋级-010至017 |
| CAND-20261024-018 | CAND-20261024-018-仍有必做动作时不得称完成 | `candidates/CAND-20261024-018-仍有必做动作时不得称完成.md` | `candidates/archived/CAND-20261024-018-仍有必做动作时不得称完成.md` | sha f355abf3 与 history 1328 重冻结批准 SHA 一致 |
| CAND-20261024-019 | CAND-20261024-019-正式记录含占位文本不得冻结或称完成 | `candidates/CAND-20261024-019-正式记录含占位文本不得冻结或称完成.md` | `candidates/archived/CAND-20261024-019-正式记录含占位文本不得冻结或称完成.md` | sha f0b32a2e 与 history 1328 批准 SHA 一致 |
| CAND-20261024-020-v2 | CAND-20261024-020-v2提案-补只读评价判别标准 | `candidates/CAND-20261024-020-v2提案-补只读评价判别标准.md` | `candidates/archived/CAND-20261024-020-v2提案-补只读评价判别标准.md` | history 1412（020 v2 提案并入 RULE-020） |
| CAND-20261024-020-v3 | CAND-20261024-020-v3提案-合并落点与009v4协调 | `candidates/CAND-20261024-020-v3提案-合并落点与009v4协调.md` | `candidates/archived/CAND-20261024-020-v3提案-合并落点与009v4协调.md` | history 1412（020 v3 提案并入 RULE-020） |
| CAND-20261024-020 | CAND-20261024-020-只读审查也须建受管任务留记录 | `candidates/CAND-20261024-020-只读审查也须建受管任务留记录.md` | `candidates/archived/CAND-20261024-020-只读审查也须建受管任务留记录.md` | history 1412（新建 RULE-20261024-020，含 v1+v2+v3 提案） |

## 追加归档（2026-10-24 Asia/Shanghai，任务 ACTIVATE-20261024-001，共 9 个文件）

021 v2（合并 022）与 023 v2 经 Rocky 本人 t215u（14:57）批准 SHA 生效，补丁已写入 `skills/task-lifecycle/`（v0.1.19）。按归档规则正文不变（状态行未改，以本表与批准记录为准）；v1 三文件依 t215u 改正“下架移入 archived/”旧写法并重冻结。

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-021 v1 | CAND-20261024-021-回答前结合上下文与意图判定所问对象 | `candidates/pending/…` | `candidates/archived/CAND-20261024-021-回答前结合上下文与意图判定所问对象.md` | 被 021 v2 取代；重冻结 sha fa9d726d…（原 5d31bbcf…），t215u |
| CAND-20261024-021 v2 | CAND-20261024-021-v2提案-回答首行声明所指对象与跨消息要求入清单 | `candidates/pending/…` | `candidates/archived/CAND-20261024-021-v2提案-回答首行声明所指对象与跨消息要求入清单.md` | active；sha 9ba2f9cf…42ce，t215u 批准 |
| CAND-20261024-022 v1 | CAND-20261024-022-意图消歧规则写入入口触发条件 | `candidates/pending/…` | `candidates/archived/CAND-20261024-022-意图消歧规则写入入口触发条件.md` | 并入 021 v2；重冻结 sha 6fa67843…（原 e4e47eed…），t215u |
| CAND-20261024-022 合并说明 | CAND-20261024-022-合并说明 | `candidates/pending/…` | `candidates/archived/CAND-20261024-022-合并说明.md` | sha 6f2bf47c…04b2，随 021 v2 生效，t215u |
| CAND-20261024-023 v1 | CAND-20261024-023-执行前预检查输出 | `candidates/pending/…` | `candidates/archived/CAND-20261024-023-执行前预检查输出.md` | 被 023 v2 取代；重冻结 sha 5045a4d0…（原 4cb0c7c4…），t215u |
| CAND-20261024-023 v2 | CAND-20261024-023-v2提案-执行前预检查固定4项 | `candidates/pending/…` | `candidates/archived/CAND-20261024-023-v2提案-执行前预检查固定4项.md` | active；sha e87063da…697d，t215u 批准（DevCodex 来源，Rocky 已亲审） |


## 追加归档（2026-10-24 Asia/Shanghai，任务 ACTIVATE-20261024-002，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-024 v1 | CAND-20261024-024-预检查与入口告知的先后 | `candidates/pending/…` | `candidates/archived/CAND-20261024-024-预检查与入口告知的先后.md` | active；sha e5474152…80d4，Rocky t218u“采纳建议”批准；补丁写入 SKILL.md §4 与入口速查「7a 预检查」（v0.1.20）；正文状态行未改 |

## 追加归档（2026-10-24 Asia/Shanghai，任务 ACTIVATE-20261024-003，共 4 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-025 v1 | CAND-20261024-025-入口速查须实际读取并留痕 | `candidates/pending/…` | `candidates/archived/CAND-20261024-025-入口速查须实际读取并留痕.md` | active；sha 47039681…，补丁 b4af38c6…，Rocky t225u“全批”批准（v0.1.21）；正文状态行未改 |
| CAND-20261024-014 v4 | CAND-20261024-014-v4提案-真实验证须加载后新会话实测 | `candidates/pending/…` | `candidates/archived/CAND-20261024-014-v4提案-真实验证须加载后新会话实测.md` | active（RULE-014 修订）；sha 61c990c6…，补丁 7de9ce0e…，Rocky t225u“全批”批准（v0.1.21）；正文状态行未改 |
| CAND-20261024-014 v3 | CAND-20261024-014-v3提案-真实验证须加载后新会话实测 | `candidates/pending/…` | `candidates/archived/CAND-20261024-014-v3提案-真实验证须加载后新会话实测.md` | 被 014 v4 取代；未冻结，t225u |
| CAND-20261024-026 v1 | CAND-20261024-026-真实用户每条消息均加载并输出预检查 | `candidates/pending/…` | `candidates/archived/CAND-20261024-026-真实用户每条消息均加载并输出预检查.md` | active；sha c577831f…，补丁 3659a8d8…，Rocky t232u“批准”（v0.1.22）；正文状态行未改 |

## 追加归档（2026-10-24 Asia/Shanghai，任务 ACTIVATE-20261024-005，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-029 v1 | CAND-20261024-029-审查记录等过程产物外置不进仓库 | `candidates/pending/…` | `candidates/archived/CAND-20261024-029-审查记录等过程产物外置不进仓库.md` | active；sha 2804085f…7127，补丁 717b8f74…523d，Rocky t252u“采纳推荐”（以 t247u 本人指令为批准）（v0.1.24）；正文状态行未改 |
| CAND-20261024-027 v1 | CAND-20261024-027-执行回合固定7项预检查表 | `candidates/pending/…` | `candidates/archived/CAND-20261024-027-执行回合固定7项预检查表.md` | superseded by v2（未生效）；sha 64546cb1…b0df；正文未改 |
| CAND-20261024-027 v2 | CAND-20261024-027-v2提案-执行回合固定7项预检查表 | `candidates/pending/…` | `candidates/archived/CAND-20261024-027-v2提案-执行回合固定7项预检查表.md` | active；sha ce312225…e992，补丁 0a897661…9192，Rocky t254u（以 t243u/t245u 本人指令为批准）（v0.1.25）；正文状态行未改 |
| CAND-20261024-028 v1 | CAND-20261024-028-外部编码执行器委派默认关闭约定收窄 | `candidates/pending/…` | `candidates/archived/CAND-20261024-028-外部编码执行器委派默认关闭约定收窄.md` | active；sha 5b75441e…6664，补丁 4f145d8a…7027，Rocky t238u/t248u/t254u 指令批准（t252u 常设约定）（v0.1.26）；正文状态行未改 |

## 追加归档（2026-10-25 Asia/Shanghai，任务 ACTIVATE-20261025-001，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261025-004 v16 | CAND-20261025-004-串行接力审查 | `candidates/pending/…` | `candidates/archived/CAND-20261025-004-串行接力审查.md` | Rocky 2026-10-25 10:57 批准 v16（sha256 bb80387567fbb6f5c3ea9bca3d1ddbeeb593dda246b6eecb1c424f553c1064e6，移动前后一致）；按 Rocky t349u 正文不纳入 Git，故以普通 mv 移动（无法 git mv），正文未改；已知缺口 A10-01（P2）、A10-02（P3）待后续修订 |

## 审查记录外置对照（MAINT-20261024-002 / ACTIVATE-20261024-005，共 25 份）

以下审查记录已按 CAND-20261024-029 迁出仓库（`git rm`），迁移前后 sha256 逐份一致。旧引用按下表查找。

| 原路径 | 外置路径 | sha256 |
|---|---|---|
| `candidates/archived/审查记录-CAND-20261024-001.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-001.md` | `5fcfed4cb571e46d4854f0a93113827faa22982b183e537be1b1724dd6bee448` |
| `candidates/archived/审查记录-CAND-20261024-002-v2提案.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-002-v2提案.md` | `96cb54cff353efa35d0b410f1fae4f117dfd45d0e574a35a34519807cf24c2f0` |
| `candidates/archived/审查记录-CAND-20261024-002.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-002.md` | `890b6c4d9b8e5fe4ee7daec35f0548ea8b5c22e7a02e2569ff6ca57af690ac6d` |
| `candidates/archived/审查记录-CAND-20261024-003.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-003.md` | `0093e23c13162da234556832b747236841f41749ad283df66c4d9846d89cb82d` |
| `candidates/archived/审查记录-CAND-20261024-004.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-004.md` | `9c4af9c5d2573c3d75820e008a4eaa7e64283703c46e3f634a406eb5d4eaa8e0` |
| `candidates/archived/审查记录-CAND-20261024-006.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-006.md` | `84eef4045e8e131f49de25b15f46bc6b17a130d17dbbd08cf6221574076bdea9` |
| `candidates/archived/审查记录-CAND-20261024-007.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-007.md` | `3129ecba9b2cbfdba646f84a14a5543473cfcef384a085c2c46d28aa7470b1f9` |
| `candidates/archived/审查记录-CAND-20261024-008.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-008.md` | `589a88f1e6cfab1fd87046956556f0c8c87a356001625855ff063c74db091f84` |
| `candidates/archived/审查记录-CAND-20261024-009.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-009.md` | `812b4da5db40a201435578211f17988db6070cff4927ee2d769b0c45270bccb8` |
| `candidates/archived/审查记录-CAND-20261024-010.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-010.md` | `0277f1552677593b949a7bb06c48a3bc028661ffc7f72e737451708174d979f6` |
| `candidates/archived/审查记录-CAND-20261024-011.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-011.md` | `3a577988c06a93b191d602b3daf9571fa76aed7d9b46c4c1fb60c0a398185d5a` |
| `candidates/archived/审查记录-CAND-20261024-012.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-012.md` | `b598dc9064e2013a27262cb86868d447650caef4340fcbe422582c60527b4cf5` |
| `candidates/archived/审查记录-CAND-20261024-013.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-013.md` | `4037dca175fd7c2b39d057758cc59091cc57b71bf424820e88389c0e9b7566f6` |
| `candidates/archived/审查记录-CAND-20261024-014-v4提案.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-014-v4提案.md` | `f94c0ce8a0211aba214f627d58ce477bd80a47d23bed4fb43ddc840c1787b65a` |
| `candidates/archived/审查记录-CAND-20261024-014.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-014.md` | `20e12955a12800e7c752180b98648b14995edec794925f0194e02e8e0981544d` |
| `candidates/archived/审查记录-CAND-20261024-015.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-015.md` | `ab947b9c2664d65bdc9c134fa17c7afc1fd72430bfaac8c32812d13680e18df6` |
| `candidates/archived/审查记录-CAND-20261024-016.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-016.md` | `b5fbac200a636bc8d1e997b2152ff39b2175718610eaa3819f9b6289040e9896` |
| `candidates/archived/审查记录-CAND-20261024-017.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-017.md` | `4bda19af931fb6b43b3ed2f5cf01f96ae8af2e0a4e341ad5a1668ccf4b30f639` |
| `candidates/archived/审查记录-CAND-20261024-018.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-018.md` | `ab5ec31c7bd6b6e9000c86250f49119a833d9e424d507eb7f5a5f1c28cd0f63f` |
| `candidates/archived/审查记录-CAND-20261024-019.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-019.md` | `c217da1c323d6c6da778705f970cbc3c2f003ab1108d130c72a535fa78c37eaf` |
| `candidates/archived/审查记录-CAND-20261024-020-v3提案.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-020-v3提案.md` | `7ab616fdb49c3d7aad5164e1cee55059b70514205d4310d432cb430fd0526cc4` |
| `candidates/archived/审查记录-CAND-20261024-020.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-020.md` | `fe1465a98b5ff96df11a330f9531f4220ce9b57ac343b6418b1690303cdbb5b5` |
| `candidates/archived/审查记录-CAND-20261024-021.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-021.md` | `5f19d8e9a4435c896b27fbb95e8af4ba3c923a8fc9facf2a3c52ada5ef9c858c` |
| `candidates/archived/审查记录-CAND-20261024-022.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-022.md` | `989244c2911545edacbb9e6df7b17c9eacc5214c99f3a07946b70f9a912edcb3` |
| `candidates/archived/审查记录-CAND-20261024-023.md` | `/home/box/task-lifecycle-records/MAINT-20261024-002/migrated-review-records/审查记录-CAND-20261024-023.md` | `36f3c57ed8ee787ae02435b6b823a59b7f2378bacd35d6b9019aff6ef5d46797` |
## 追加归档（2026-10-25 Asia/Shanghai，任务 ACTIVATE-20261025-002，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261025-005 v4 | CAND-20261025-005-审查按风险分级收敛 | `candidates/pending/…` | `candidates/archived/CAND-20261025-005-审查按风险分级收敛.md` | Rocky 2026-10-25 11:26 批准 v4（sha256 f1c7c317918fbae911c4358c7b81da567294d791764ce3b61925736b673b68c0），正文按 t349u 不进 Git |
## 追加归档（2026-10-25 Asia/Shanghai，任务 ACTIVATE-20261025-003，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261025-007 v1 | CAND-20261025-007-文件以可点开附件交付 | `candidates/pending/…` | `candidates/archived/CAND-20261025-007-文件以可点开附件交付.md` | Rocky 2026-10-25 11:39 批准按推荐写法晋级（sha256 66b477d2a2ed801bb24249cab7c51b26ac33fc501fcc6dc3f9ca847c89560322），正文按 t349u 不进 Git |

## 追加归档（2026-10-25 Asia/Shanghai，任务 ACTIVATE-20261025-004，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261025-006 v4 | CAND-20261025-006-用例驱动收敛V2 | `candidates/pending/…` | `candidates/archived/CAND-20261025-006-用例驱动收敛V2.md` | Rocky 2026-10-25 11:50 批准按 v4 晋级（sha256 f97cf0851a94ffb5948b336701aee03ba787d0bddfd8a9b7b8acdf22d7863033） |
## 追加归档（2026-10-25 Asia/Shanghai，任务 ACTIVATE-20261025-005，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261025-002 v6 | CAND-20261025-002-用户可见文本禁用裸阶段代号 | `candidates/pending/…` | `candidates/archived/CAND-20261025-002-用户可见文本禁用裸阶段代号.md` | Rocky 2026-10-25 12:02 批准按收口写法晋级（sha256 c5c966dd0e477006229589f9b9171acedb6255bcf7fe15810c2b33a4c69bc3b6），正文按 t349u 不进 Git |
