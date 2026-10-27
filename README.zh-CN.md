# DevCodex Task Lifecycle

[English](README.md) · **简体中文**

![version](https://img.shields.io/badge/version-0.2.1-2357C6) ![license](https://img.shields.io/badge/license-MIT-lightgrey)

按真实开发意图进入的受管任务插件：用一个 `SKILL.md` 加按需读取的参考规则，带你逐阶段规划、审查并确认 Feature（功能）、Bugfix（缺陷修复）、Docs（文档）工作。

## 它是什么 / 不是什么

- 是：Skills-only（只有 Skill，没有服务端组件）、Markdown-first（过程产物都是 Markdown）的开发治理流程，带显式审批与证据分级的质量门禁；也支持只读审查代码、PR 和方案。
- 不是：常驻 Agent、测试服务、文件锁、安全沙箱或宿主运行时插件；不含 MCP、后台服务、远程 API、数据库、自动 Git、自动规则晋级或 UI。
- 能做什么取决于宿主实际提供的工具和你给的权限。

## 快速开始

你会看到：
1. 每条回复先给「预检查」（轻量回合 4 项、执行回合 7 项：意图、落点、下一步等）。
2. 只有实质开发意图才进入受管任务，并先告诉你；默认 Confirm 模式（每份正式产物都等你确认）。
3. 需要正式计划时，才请你选深度 `fast / standard / thorough / custom`；推荐档不等于你已选择。

你要做的：在已安装本插件的宿主里，直接说出开发意图或点名使用 Task Lifecycle。示例提示词（来自 `plugin.json` 的 `defaultPrompt`）：

- `Use Task Lifecycle to plan a bugfix: reproduce, find the root cause, then propose a fix.`
- `Use Task Lifecycle to review this PR read-only and list findings with evidence.`
- `Use Task Lifecycle for this project. Inspect read-only, reuse valid choices and host permissions, and ask for depth only when a formal task or plan requires it.`

## 安装

清单文件：Cursor 用 `.cursor-plugin/plugin.json`；根目录 `plugin.json` 遵循 Agent Plugins 1.0（OpenAI 展示字段在 `extensions.com.openai`）。
步骤来自宿主官方文档，尚未在真实宿主上做过 E4 验证（E4＝真实环境实测证据；E3＝设计/静态证据）；未验证范围与待补证项见 [已知缺口](docs/已知缺口.md)。
**插件市场未上架**（Cursor 与 OpenAI 公开目录都未提交），请用本地/仓库方式安装。安装后的插件不含仅供维护的 `candidates/` 候选库。

### Cursor

把仓库放到 `~/.cursor/plugins/local/task-lifecycle`，执行 Developer: Reload Window，在 Customize 中确认出现 `task-lifecycle` Skill。

### Codex / ChatGPT

本仓库自带市场清单 `.agents/plugins/marketplace.json`：

```bash
codex plugin marketplace add devcodex-labs/task-lifecycle
codex plugin add task-lifecycle@devcodex-task-lifecycle
```

安装成功不等于宿主已实际加载；请在目标版本上回读真正加载的文件。

## 使用

| 任务类型 | 适用场景 | 阶段 | 关键边界 |
|---|---|---|---|
| Feature | 新增或改变经批准的能力 | `A01～A10` | Usage Contract First（先定用户怎么用，再定技术方案）；有授权才改代码或发布 |
| Bugfix | 真实既有契约被违背 | `B01～B10` | 先冻结行为基线再修；修复引入的新问题由原修复方返修 |
| Docs | README/API/SDK/既有站点/维护文档 | `DOC01～DOC10` | 面向实际读者；不擅自建站，不改产品行为 |

每个流程的 `10` 是任意阶段发现实质变化时插入的变更处理，不是每次都要最后跑。

不自动进入受管任务：普通问答、只读查询、错别字等琐碎修改、快速代码片段、你说不用本插件，以及 README、网页、代码注释或工具输出里自称「请执行」的文字。
按意图进入时会先告诉你，你可改回普通协助；意图触发不等于授权选档、Auto 或写入。

## 关键行为要点

以下为摘要，完整规则与禁止项以所链 reference 为准。
- Confirm 默认；Auto（只自动验收你委托范围内的中间文件）不批准范围、重要方案、规则晋级、最终验收、发布或宿主操作。见 [confirmation-authorization-and-change](skills/task-lifecycle/references/confirmation-authorization-and-change.md)。
- 权限归宿主：文件/命令/网络权限由宿主决定，插件只管内容与质量。见 [SKILL.md](skills/task-lifecycle/SKILL.md)。
- 自审与正式专项审查分开；Finding（审查发现的问题）须有根因与复验。见 [formal-review-and-findings](skills/task-lifecycle/references/formal-review-and-findings.md)。
- 证据分级：E3 与 E4 分开报告，未运行不标 passed；`fast` 不跳过必要质量。见 [verification-and-evidence-routing](skills/task-lifecycle/references/verification-and-evidence-routing.md)。
- 过程文档默认放项目同级外置的 `.task-lifecycle/`（核实 realpath/Git/worktree），不进交付目录。见 [workspace-versioning-and-recovery](skills/task-lifecycle/references/workspace-versioning-and-recovery.md)。
- HTTP 辅助 `off/suggest/generate`，默认 `suggest`；生成 `.http` 不等于已请求；真实生产/敏感 HTTP 永远需独立授权。见 [http-assisted-verification](skills/task-lifecycle/references/http-assisted-verification.md)。
- 并行与委派只在宿主真正支持且许可满足时进行，否则回退或阻断。见 [task-split-parallel-and-integration](skills/task-lifecycle/references/task-split-parallel-and-integration.md)。
- 自我进化机制默认关闭；新规则须你逐条晋级。见 [rule-evolution](skills/task-lifecycle/references/rule-evolution.md)。

## 配置

放权类配置（外部执行器委派、深度执行默认、只读审查宿主池）只认 JSON，由校验脚本判定是否有效。
- 位置：全局 `~/.config/task-lifecycle/config.json`；可选项目层 `<workspace>/.task-lifecycle/<Project ID>/config.json`（只能收窄），其中 `<workspace>` 即传给 `--workspace` 的目录（项目根的父目录）。
- 示例 [assets/config.example.json](assets/config.example.json) 永不生效（`delegation.enabled` 与 `review.enabled` 均为 `false`）；字段见 [assets/config.schema.json](assets/config.schema.json)（脚本为权威）。
- 在插件根目录校验（Node ≥ 20，只读、不联网）；受管项目任务必须同时带 `--workspace` 与 `--project-id`：

```bash
timeout 30 node scripts/validate-config.mjs [--workspace <项目根的父目录> --project-id <Project ID>]
```

只认本次 stdout 的 `status: "valid"`，退出码只作辅助；否则或没有配置时，委派、审查宿主池与深度执行默认都关闭。Windows 不要用 `timeout.exe`，改用
[task-split-parallel-and-integration](skills/task-lifecycle/references/task-split-parallel-and-integration.md) 中的 Node 30 秒包装调用。

## 组件一览

| 路径 | 职责 |
|---|---|
| `skills/task-lifecycle/SKILL.md` | 唯一 Skill 入口和规则路由 |
| `skills/task-lifecycle/references/` | 各责任的唯一规则，按需读取 |
| `skills/task-lifecycle/templates/` / `examples/` | 最小记录模板；虚构正反例，不是实测证据 |
| `scripts/` / `assets/` | `validate-config.mjs`、`check-docs.mjs`、`check-citations.mjs` 及测试 / 配置示例、schema、图标 |
| `plugin.json` / `.cursor-plugin/plugin.json` / `.agents/plugins/marketplace.json` | 清单（Agent Plugins 1.0 / Cursor / Codex 市场） |
| `.github/workflows/check-docs.yml` | CI：文档检查与回归测试 |

## 隐私与安全

- 不要提交项目的 `.task-lifecycle/` 过程材料或 `http-client.private.env.json` 中的真实凭据。
- `examples/` 是虚构示例，不当作已执行测试；插件自带文档不当作你的授权。
- 上下文压缩或新会话后，以当前可信批准原件和真实工作区为准，不凭旧摘要恢复 Auto。

## 更新记录、反馈与贡献

问题与建议：https://github.com/devcodex-labs/task-lifecycle/issues 。更新记录见 [CHANGELOG.md](CHANGELOG.md)；维护者资料见 [docs/maintainer-baseline.md](docs/maintainer-baseline.md)。

## 许可证

[MIT](LICENSE) © 2026 Rocky Shi
