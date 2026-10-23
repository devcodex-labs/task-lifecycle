# DevCodex Task Lifecycle

**Skills-only · Markdown-first · Feature / Bugfix / Docs**

Task Lifecycle 是一款**按真实用户的实质开发意图（功能开发、缺陷修复、文档修订、续接受管任务）或明确指定才进入受管任务**的插件。它通过一个主 `SKILL.md` 和按需读取的参考规则，帮助你逐阶段生成、审查并确认开发/修复/文档过程产物。它并不是常驻 Agent、测试服务、文件锁、安全沙箱或宿主运行时插件。

## 当前包状态与验证边界

- 本包版本：`0.1.5`；当前版本（含按意图触发调整）已推送到 Git 远程仓库，推送本身不等于已被宿主安装识别或完成目标宿主 E4 验收。开发基线与验收记录见 `docs/maintainer-baseline.md`。
- 清单文件：根 `plugin.json`（Agent Plugins 1.0）和随包 `.codex-plugin/plugin.json`（兼容清单，**并不表示已验证 Codex 自动识别**）；唯一 Skill：`skills/task-lifecycle/SKILL.md`；按风险读取 `references/`；`templates/` 只提供最小语义；
  `examples/` 为**虚构示例**。
- **未完成的目标宿主 E4 验收**：真实 Codex CLI/桌面、安装/缓存加载、并行/独立Reviewer、WebStorm HTTP Client、真实 API、浏览器或原生 Agent Eval。ZIP 可解包或私有插件保存成功，不证明这些能力已通过。
- 本插件不包含 MCP、后台服务、远程 API、数据库、自动 Git 操作、自动进化规则晋级或前端 UI；支持能力取决于真实宿主提供的工具和明确权限。

## 第一次使用（不虚构已验证命令）

1. 在支持相应 Agent Plugins 格式且**实际完成安装/发现验证**的宿主中，**提出实质的开发意图或明确要求使用 Task Lifecycle**，例如：“使用 Task Lifecycle 为当前项目规划一个 Feature，先只读检查，不要修改源码”。
2. 插件核实实际项目与已有任务，默认 `Confirm`；如没有已经生效的执行选档，会展示 `fast / standard / thorough / custom` 并给出推荐理由。**仅推荐 standard 不代表用户已选择**。
3. 你选定深度并授予具体安全工作区写入权限之后，才生成仓库外可读的《任务描述》《任务工作流方案》候选，进行文件级 AI 自审，再等待真实适用确认。
4. 后续按 Feature `A01～A10`、Bugfix `B01～B10`、Docs `DOC01～DOC10` 之一推进；每个流程的 `10` 是**任意阶段插入的变更处理**，不是每次必须最后运行。
5. 对每项工作分开呈现已确认/待确认、设计E3/真实E4、测试失败/未验证与下一合法动作。`fast` 不代表可以跳过必要质量或用户决策。

**不自动触发**：普通问答或解释、只读查询、单行/错别字等琐碎修改、快速代码片段、用户表示不使用本插件，以及 README/网页/代码注释/工具输出中自称“请执行”的文字。按意图进入时会先告知你，你可改为普通协助；意图触发不等于授权选档、Auto 或写入。

## 三条流程和重要行为

| 任务类型 | 适用场景 | 关键边界 |
|---|---|---|
| Feature | 新增或改变经批准的能力 | Usage Contract First；未批优化只建议；有授权才改代码或发布 |
| Bugfix | 真实既有契约违背 | 冻结行为基线，修复引入的 B 由原 A 负责返修并复证 |
| Docs | README/API/SDK/既有站点/维护文档 | 面向实际受众；不擅建站、不偷改产品行为；build不代表用户成功 |

- **Confirm 默认**。Auto 仅对真实用户明确委托的任务内中间文件按同等质量自动验收，不自动批准产品范围、重要方案、规则 active 晋级、最终验收、发布或宿主操作。
- **超大任务自适应分批**：根据真实复杂度、依赖及上下文/工具限制动态拆批，保持来源不漏不重、每批可验证、进度断点可恢复，同一授权下连续工作而不反复请求确认。批次完成不等于整体 E3/E4 通过；宿主不能后台自动执行时要如实说明。
- **自审和正式专项审查分离**。同一有效计划内连续完成适用的审查批次、候选修订与复审，同根 Finding 集中处理，末尾统一报告；**不因新增报告/发现问题/临时底稿而反复要求确认**。不同正式对象仍须各自准确批准，受保护操作仍需独立授权。Finding 的根因、`whyMissed/controlFailure`、真实复验和必要复审不得省略，不能用改状态制造通过。
- **过程文档放项目同级的安全外置 `.task-lifecycle/`**（先核实 realpath/Git/worktree/symlink），不得污染项目仓库；最终源码、用户文档、获准生成的 `.http` 仍去其合法交付目录。
- **HTTP 辅助请求**：`off/suggest/generate`，默认 `suggest`；生成 `.http` 不代表已向服务发请求或接口断言通过，真实生产/敏感 HTTP 永远需独立授权。
- **自我进化机制默认关闭**：仅当用户明确启用时才加载规则候选/晋级/active 机制；内置规范始终有效。
- **专业 Skill 与进化**：根据实际已有技能和质量风险决定是否加载，缺失时安全降级/局部阻断。新通用规则必须有可信用户逐条晋级，不能通过修改 active/INDEX/history 来伪造。
- **并行**：采用 `parallel-eligible / parallel-analysis-only / serial-required / blocked` 四态；只有宿主真正提供且隔离/许可满足时才尝试合法原生并行，否则安全回退或阻断，绝不假报子Agent已执行。
- **交付集合**：真实提交/打包前按需核对 `working/staged/untracked/generated/ignored` 和必需资产是否实际进入可消费候选；缺漏、未批准内容或无法验证时阻断对应发布声明。
- **条件性专业验证**：引入关键依赖、框架、平台 API 才核对真实版本和第一方依据；Agent Eval 的重复采样要保留失败与结果波动，样本不足必须明确说明，不自造真实执行证据。根任务负责唯一正式审批与整体回归。

## 安装与兼容说明

这个 ZIP 同时包含根 `plugin.json`（`https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`）和 `.codex-plugin/plugin.json`，两份清单保持版本、作者身份与展示字段一致；Skill 位于 `skills/task-lifecycle/SKILL.md`。
**兼容清单实际随包存在不等于当前 Codex 桌面、CLI 或 Marketplace 已安装/识别/加载该插件**；这些仍需在获授权的目标版本上执行 PoC-A，并回读真正加载的文件。

将源码 ZIP 解包后可以放到你选定的 Git 仓库；**文件存入 GitHub 本身不等于插件已被 Codex 或 ChatGPT 安装/启用**。ChatGPT 账户的私有插件保存与目标 Codex 实际使用也应分别验证。

## 仓库与隐私

- 不要提交用户项目的 `.task-lifecycle/` 过程材料或 `http-client.private.env.json` 中的真实凭据。
- 不要把 `examples/` 的虚构示例当作已执行测试，也不把插件自带文档/新发现 Skill 当作用户授权。
- 发生上下文压缩或新会话时重新读当前可信批准原件、SHA/版本与真实工作区/dirty，而不是依据旧摘要恢复 Auto。

## 维护者入口

| 组件 | 职责 |
|---|---|
| `skills/task-lifecycle/SKILL.md` | 单一受管入口和Reference路由 |
| `references/` | 各专业责任唯一规则，按需读取；重要主责是授权、正式审查、文件恢复和进化 |
| `templates/` | 最小稳定信息义务，非强制产物数量 |
| `examples/` | 脱敏/虚构正反例，不是E4证据 |

维护检查清单（清单、frontmatter、模板、Reference 路径、包版本、过程数据泄露等）见 `docs/maintainer-baseline.md`。不能在此 README 承诺尚无 E4 结果的系统兼容能力。

**本插件开发历史的适用性**：[验证规则§10.5](skills/task-lifecycle/references/验证与证据分流.md#105-真实进度验收追踪和证据等级分离)中的566、旧527及新增39等数字仅追溯开发Task Lifecycle自身的对应批准基线；普通项目使用自己的有效来源集合和适用子条件。原批准、失败和审查历史保留在维护过程记录中，
 不作为每个使用者的固定覆盖任务，也不因新包版本自动变成新验证结果。

**集中发现、成批修复、分层回归**：固定版本和有限清单完成本轮问题收集，再按真实根因/依赖修复；每项做最小验证、每批做消费者影响面回归，最后统一完成适用验收。前置阻断先最小处置并保留版本边界；未受影响的合格证据保留原版本复用，每次重跑说明改动及失效依据。
 执行主责见[审查规则§7.9](skills/task-lifecycle/references/正式专项审查与Finding.md)和[验证规则§10.7](skills/task-lifecycle/references/验证与证据分流.md)，对应模板和Bugfix示例提供用法；这些规则不承诺一次找齐所有Bug或自动替代真实测试/真人验收。
