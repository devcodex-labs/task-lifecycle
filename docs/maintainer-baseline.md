# 维护者基线（不随 Skill 运行加载）

本文件保存 Task Lifecycle 插件自身开发的基线与历史数字，供维护者参考；不是使用本插件的一般项目必须套用的规则。

## 包版本与批准基线（原 README）

- 历史源码基线：`0.1.43`，沿用正式批准的开发需求 V0.18-R2、Usage Contract V0.5-R2、技术方案 R9-R2、实施方案 V0.1-R2基线，在既有共同协议引用和示例基础上，修订上下文语言继承、计划与实际动作的对应以及实质性受管回复的下一步指引；该基线（含按意图触发调整）已推送到 Git 远程仓库，推送本身不等于已保存到账户、
  已被宿主安装识别或完成目标宿主 E4 验收。当前包版本以 `plugin.json` 为准，纳入 V1.2 维护修订，仍保留 [已知缺口](已知缺口.md) 中的未证状态。各历史“候选”的批准身份以用户独立记录为准。

## 维护检查（原 README）

源码检查与分发包检查分开：本仓库的根 `plugin.json` 为插件内容清单，`.cursor-plugin/plugin.json` 为 Cursor 清单（0.1.68 起，D4=A t720s4044），`.agents/plugins/marketplace.json` 为 Codex 市场入口；
`scripts/maintenance-regression.test.mjs` T60 只比对列出的共享字段（name/version/description/license/homepage/repository/keywords、author.name/email、developerName、marketplace 名称/displayName/category）、
Cursor 清单键是否在官方文档字段表内及 logo/skills 路径存在；未列字段与宿主实际装载不在其覆盖内。
构建具体分发包时按该宿主包契约核清单数量、允许内容及实际消费路径，不将源码仓库的全部文件照搬入包；过程材料与历史审查证据不进入分发包。
若目标分发格式确实包含兼容插件清单，须逐字段核对其版本及 interface 与根清单对应的展示配置一致；版本或展示字段不一致即拒收该包，不能用源码场景没有兼容清单来豁免。
另核 frontmatter、三份通用规范进化模板、三份接力模板、Reference 消费者/路径、版本与未经批准的功能。任务的 active/INDEX/history 是外置数据，真实验收按原批准 PoC-A～M 单独记录。
不能在此 README 承诺尚无 E4 结果的系统兼容能力。

**行长豁免（G1-F09 历史按文档化豁免关闭，2026-10-25）**：`scripts/check-docs.mjs` 每行限 200 个 Unicode 码点；LF/CRLF 均按逻辑行处理，以下三类不检查：
- 文件开头 YAML frontmatter 整段（首行 `---` 至闭合 `---`）；SKILL.md 的 description 须单行，故可超长。
- 表格行：以可选空白加 `|` 开头的行；Markdown 表格单元格不能折行。
- 三反引号代码块内的行。

维护调用 `node scripts/check-docs.mjs`、`node --test scripts/validate-config.test.mjs scripts/maintenance-regression.test.mjs`；测试传准确文件，避免宿主把目录当入口模块。
文档检查使用脚本真实文件路径，与 cwd 无关，必需目标/主 SKILL 缺失、空入口或零扫描均失败；`--compare` 保持逐字节及文件集合比较。
引用工具保持逐项 stdout，stderr 逐输入汇总 recognized/unchecked/failed；任何输入零识别失败，协调方另做预期清单对账。冻结引用只读取固定提交的文件 blob，不接受提交头/目录。见审查规则 §7.10 三种出口。
配置为 Node ≥20；Windows HOME 缺省可使用可信系统账户 home，显式空/冲突仍关闭。Windows 30 秒包装入口、POSIX 命令与输出结构见配置消费/输出协议；能力缺失测试标 UNVERIFIED，不冒称跨平台通过。

## 本插件开发基线覆盖映射（原 references/验证与证据分流.md §10.5）

**适用范围**：以下两段的566、旧527及新增39等数字，只属于开发Task Lifecycle自身时相应R9/旧版批准来源的身份与历史差异，不是使用本插件的一般项目必须套用的覆盖分母。一般项目按自己的有效批准来源、实际版本与适用子条件建立映射；下述逐源、消费者、正反断言和证据等级方法仍通用。后续维护按真实影响核对来源与可复用证据，不把历史统计当成新候选已通过，也不删除或改写原审查记录。

**本插件开发基线覆盖映射（仅对应 R9 基线）**：按 §18 的当前获批 83 REQ、130 AC、105 PAC、192 SC 和 56 UC 组成 566 项源身份；每项应独立建立 `ID → 适用子条件 → 真实消费者/具体设计 → 正反断言/失败出口 → D/A/I/H 验证路线 → 证据与设计签署状态`。
 历史 79/122/100/180 和 16 U/18 N 仅为旧版本审查范围；不能从正向关系复制反向关系充当专业判断。适用项证据不足标 `needs-evidence`，不能宣称全量通过。

**REV-00 现行覆盖总表 / REV-10 反假性收敛**：技术候选及后续审查对象使用已经批准的 **510 REQ/AC/PAC/SC + 56 UC = 566** 个源身份（`REQ-001～083 / AC-001～130 / PAC-01～105 / SC-01～192`；
 `U-01～17 / N-UC-01～27 / N-DP-01～06 / N-RG-01～06`）。旧 481+46 仅是历史范围；现行 566 项源身份齐全不等于逐子条件已通过。审查底稿允许一项共享设计验证多条要求，但每条的触发、消费者、正反例和判断必须独立。初次创建新候选时，旧 527 项的章节链接只是 `historical-evidence-candidate`，
 其统计中曾出现 `covered+pending` 的记录必须重新审；新增 39 项由当前新上游逐项消费，不能默认“新 R9 写到了就全部通过”。当前技术正式专业审查只有独立批准的新版本计划执行后才可形成真实签署。

## 开发历史与方法论（0.1.68 自 README 移入）

**本插件开发历史的适用性**：[验证规则§10.5](../skills/task-lifecycle/references/验证与证据分流.md#105-真实进度验收追踪和证据等级分离)中的566、旧527及新增39等数字仅追溯开发Task Lifecycle自身的对应批准基线；普通项目使用自己的有效来源集合和适用子条件。
原批准、失败和审查历史保留在维护过程记录中，不作为每个使用者的固定覆盖任务，也不因新包版本自动变成新验证结果。

**集中发现、成批修复、分层回归**：固定版本和有限清单完成本轮问题收集，再按真实根因/依赖修复；每项做最小验证、每批做消费者影响面回归，最后统一完成适用验收。
前置阻断先最小处置并保留版本边界；未受影响的合格证据保留原版本复用，每次重跑说明改动及失效依据。
执行主责见[审查规则§7.9](../skills/task-lifecycle/references/正式专项审查与Finding.md)和[验证规则§10.7](../skills/task-lifecycle/references/验证与证据分流.md)，对应模板和Bugfix示例提供用法；这些规则不承诺一次找齐所有Bug或自动替代真实测试/真人验收。

README 只写安装、使用、配置（D1=A）；`README.md`（英文）与 `README.zh-CN.md`（中文）章节一一对应，每次发版两份同步（D2=B）。

## candidates/ 不进分发与三处安装（D3=B，t720s4040）

`candidates/` 留在 git，但不进分发包与三处 box 安装：
- 打包：仓库根 `.gitattributes` 写 `candidates/ export-ignore`，只对已提交树的 `git archive`/ZIP 生效；克隆安装（Codex/Grok）与放进 `~/.cursor/plugins/local` 的仓库都不受它影响。
  归档只读核对：`git archive HEAD | tar -t | grep -c '^candidates/'` 应为 0；`.gitattributes` 须与本次改动同一提交。
- Cursor 安装：`host-sync.sh` 只 `git archive HEAD skills/task-lifecycle`，本来就不含 `candidates/`。
- Codex / Grok 安装是 git 克隆：`host-sync.sh`（`/home/box/task-lifecycle-records/host-sync.sh`，不在仓库内）末尾对两处安装执行
  `git sparse-checkout set --no-cone '/*' '!/candidates/'`。M-02（t723s4066）起：改前带时间戳备份到 `<ACTDIR>/backups/excl-<ts>-<名>`；目标不是 git 仓库根即报错并非 0 退出；
  成功须同时满足 `candidates/` 不存在、`skills/task-lifecycle/SKILL.md` 存在、文件数与 `git archive` 源一致且 `diff -rq` 无差异（输出 `EXCL ok`）。
  回退：`rm -rf <目标> && cp -a <备份> <目标>`（脚本失败时打印具体命令），或 `git -C <目标> sparse-checkout disable`。真实安装上尚未运行（E3，临时目录模拟见 README 审查 04-修订记录）。
- 候选库只在源仓库：安装后的插件不含 `candidates/`；候选的创建、晋级、下架只在源仓库检出中进行。

