# 候选清单（candidates/）

本目录保存通用规范吸纳候选正文（审查、冻结、批准、验证记录写外置任务目录，不进仓库，见 CAND-20261024-029），位于插件源仓库根目录，**不在** `skills/` 内，不随技能加载，不是执行规则。
候选只有经真人逐条批准（规则 ID + 冻结 SHA）后才生效；生效规则与 INDEX 存放在用户工作区外置 `.task-lifecycle/active-rules/`，不在本仓库。

历史说明：候选正文按“内容不变”原样迁入，正文中出现的 `evolution/…` 路径是 2026-10-24 迁移前的历史位置，现已不存在；对应关系为 `evolution/candidates/` → 本目录，`evolution/INDEX.md`、`evolution/active/` → 外置 `.task-lifecycle/active-rules/`，`evolution/history/`、`reviews/`、`feedback/` → 外置 `.task-lifecycle/reports/`（只读存档）。

## 目录结构（2026-10-24 起）

| 子目录 | 含义 | 说明 |
|---|---|---|
| `pending/` | 待吸纳 | 新候选正文写在这里；见 `pending/README.md` |
| `archived/` | 已吸纳 | 真人批准晋级后移入；见 `archived/README.md`（ARCHIVE-20261024-001） |
| `rejected/` | 已下架 | 撤回、被取代或不再吸纳后移入；见 `rejected/README.md`（原仓库根目录 `archived/`） |

**规则**：`candidates/` 根目录不放候选文件，只放 README 与 INDEX；状态变化用 `git mv`（未跟踪文件用 `mv`）在子目录间移动，文件名与正文不变，并同步各子目录 README 清单。
