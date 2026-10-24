# 已吸纳候选归档（candidates/archived/）

本目录存放**已吸纳**（已经真人批准晋级为生效规则）的候选正文及其审查记录，只作历史查阅，不再参与审查或晋级。

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
| 审查记录 CAND-20261024-001 | 审查记录-CAND-20261024-001 | `candidates/审查记录-CAND-20261024-001.md` | `candidates/archived/审查记录-CAND-20261024-001.md` | 状态行“approved → active/RULE-20261024-001”；history 0857（v1） |
| 审查记录 CAND-20261024-002-v2 | 审查记录-CAND-20261024-002-v2提案 | `candidates/审查记录-CAND-20261024-002-v2提案.md` | `candidates/archived/审查记录-CAND-20261024-002-v2提案.md` | sha 1b924731 与 history 1328 批准 SHA 一致 |
| 审查记录 CAND-20261024-002 | 审查记录-CAND-20261024-002 | `candidates/审查记录-CAND-20261024-002.md` | `candidates/archived/审查记录-CAND-20261024-002.md` | 状态行“approved → active/RULE-20261024-002”；history 0857 |
| 审查记录 CAND-20261024-003 | 审查记录-CAND-20261024-003 | `candidates/审查记录-CAND-20261024-003.md` | `candidates/archived/审查记录-CAND-20261024-003.md` | 状态行“approved → active/RULE-20261024-003”；history 0857 |
| 审查记录 CAND-20261024-004 | 审查记录-CAND-20261024-004 | `candidates/审查记录-CAND-20261024-004.md` | `candidates/archived/审查记录-CAND-20261024-004.md` | 状态行“approved → active/RULE-20261024-004”；history 0857 |
| 审查记录 CAND-20261024-006 | 审查记录-CAND-20261024-006 | `candidates/审查记录-CAND-20261024-006.md` | `candidates/archived/审查记录-CAND-20261024-006.md` | 状态行“approved → active/RULE-20261024-006”；history 0857 |
| 审查记录 CAND-20261024-007 | 审查记录-CAND-20261024-007 | `candidates/审查记录-CAND-20261024-007.md` | `candidates/archived/审查记录-CAND-20261024-007.md` | 状态行“approved → active/RULE-20261024-007”；history 0857 |
| 审查记录 CAND-20261024-008 | 审查记录-CAND-20261024-008 | `candidates/审查记录-CAND-20261024-008.md` | `candidates/archived/审查记录-CAND-20261024-008.md` | 状态行“active”；history 0905-晋级-008 |
| 审查记录 CAND-20261024-009 | 审查记录-CAND-20261024-009 | `candidates/审查记录-CAND-20261024-009.md` | `candidates/archived/审查记录-CAND-20261024-009.md` | history 1412（新建 RULE-20261024-009，v4 ae86ad8d…） |
| 审查记录 CAND-20261024-010 | 审查记录-CAND-20261024-010 | `candidates/审查记录-CAND-20261024-010.md` | `candidates/archived/审查记录-CAND-20261024-010.md` | 状态行“approved → active/RULE-20261024-010”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-011 | 审查记录-CAND-20261024-011 | `candidates/审查记录-CAND-20261024-011.md` | `candidates/archived/审查记录-CAND-20261024-011.md` | 状态行“approved → active/RULE-20261024-011”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-012 | 审查记录-CAND-20261024-012 | `candidates/审查记录-CAND-20261024-012.md` | `candidates/archived/审查记录-CAND-20261024-012.md` | 状态行“approved → active/RULE-20261024-012”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-013 | 审查记录-CAND-20261024-013 | `candidates/审查记录-CAND-20261024-013.md` | `candidates/archived/审查记录-CAND-20261024-013.md` | 状态行“approved → active/RULE-20261024-013”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-014 | 审查记录-CAND-20261024-014 | `candidates/审查记录-CAND-20261024-014.md` | `candidates/archived/审查记录-CAND-20261024-014.md` | 状态行“approved → active/RULE-20261024-014”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-015 | 审查记录-CAND-20261024-015 | `candidates/审查记录-CAND-20261024-015.md` | `candidates/archived/审查记录-CAND-20261024-015.md` | 状态行“approved → active/RULE-20261024-015”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-016 | 审查记录-CAND-20261024-016 | `candidates/审查记录-CAND-20261024-016.md` | `candidates/archived/审查记录-CAND-20261024-016.md` | 状态行“approved → active/RULE-20261024-016”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-017 | 审查记录-CAND-20261024-017 | `candidates/审查记录-CAND-20261024-017.md` | `candidates/archived/审查记录-CAND-20261024-017.md` | 状态行“approved → active/RULE-20261024-017”；history 1227-晋级-010至017 |
| 审查记录 CAND-20261024-018 | 审查记录-CAND-20261024-018 | `candidates/审查记录-CAND-20261024-018.md` | `candidates/archived/审查记录-CAND-20261024-018.md` | sha f355abf3 与 history 1328 重冻结批准 SHA 一致 |
| 审查记录 CAND-20261024-019 | 审查记录-CAND-20261024-019 | `candidates/审查记录-CAND-20261024-019.md` | `candidates/archived/审查记录-CAND-20261024-019.md` | sha f0b32a2e 与 history 1328 批准 SHA 一致 |
| 审查记录 CAND-20261024-020-v3 | 审查记录-CAND-20261024-020-v3提案 | `candidates/审查记录-CAND-20261024-020-v3提案.md` | `candidates/archived/审查记录-CAND-20261024-020-v3提案.md` | history 1412（020 v3 提案并入 RULE-020） |
| 审查记录 CAND-20261024-020 | 审查记录-CAND-20261024-020 | `candidates/审查记录-CAND-20261024-020.md` | `candidates/archived/审查记录-CAND-20261024-020.md` | history 1412（新建 RULE-20261024-020，含 v1+v2+v3 提案） |

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
| 审查记录 021/022/023 | 审查记录-CAND-20261024-021、-022、-023 | `candidates/pending/…` | `candidates/archived/审查记录-CAND-20261024-02{1,2,3}.md` | 随候选移入 |


## 追加归档（2026-10-24 Asia/Shanghai，任务 ACTIVATE-20261024-002，共 1 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-024 v1 | CAND-20261024-024-预检查与入口告知的先后 | `candidates/pending/…` | `candidates/archived/CAND-20261024-024-预检查与入口告知的先后.md` | active；sha e5474152…80d4，Rocky t218u“采纳建议”批准；补丁写入 SKILL.md §4 与入口速查「7a 预检查」（v0.1.20）；正文状态行未改 |

## 追加归档（2026-10-24 Asia/Shanghai，任务 ACTIVATE-20261024-003，共 4 个文件）

| 编号 | 文件 | 原路径 | 归档路径 | 已吸纳依据 |
|---|---|---|---|---|
| CAND-20261024-025 v1 | CAND-20261024-025-入口速查须实际读取并留痕 | `candidates/pending/…` | `candidates/archived/CAND-20261024-025-入口速查须实际读取并留痕.md` | active；sha 47039681…，补丁 b4af38c6…，Rocky t225u“全批”批准（v0.1.21）；正文状态行未改 |
| CAND-20261024-014 v4 | CAND-20261024-014-v4提案-真实验证须加载后新会话实测 | `candidates/pending/…` | `candidates/archived/CAND-20261024-014-v4提案-真实验证须加载后新会话实测.md` | active（RULE-014 修订）；sha 61c990c6…，补丁 7de9ce0e…，Rocky t225u“全批”批准（v0.1.21）；正文状态行未改 |
| 审查记录 014 v4 | 审查记录-CAND-20261024-014-v4提案 | `candidates/pending/…` | `candidates/archived/审查记录-CAND-20261024-014-v4提案.md` | sha f94c0ce8…，随 014 v4 移入 |
| CAND-20261024-014 v3 | CAND-20261024-014-v3提案-真实验证须加载后新会话实测 | `candidates/pending/…` | `candidates/archived/CAND-20261024-014-v3提案-真实验证须加载后新会话实测.md` | 被 014 v4 取代；未冻结，t225u |
| CAND-20261024-026 v1 | CAND-20261024-026-真实用户每条消息均加载并输出预检查 | `candidates/pending/…` | `candidates/archived/CAND-20261024-026-真实用户每条消息均加载并输出预检查.md` | active；sha c577831f…，补丁 3659a8d8…，Rocky t232u“批准”（v0.1.22）；正文状态行未改 |
