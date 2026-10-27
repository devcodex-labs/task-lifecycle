# DevCodex Task Lifecycle

**English** · [简体中文](README.zh-CN.md)

![version](https://img.shields.io/badge/version-0.2.0-2357C6) ![license](https://img.shields.io/badge/license-MIT-lightgrey)

An intent-triggered governed-task plugin: one `SKILL.md` plus on-demand reference rules guide you stage by stage to plan, review, and confirm Feature, Bugfix, and Docs work.

## What it is / is not

- Is: a Skills-only (no server component), Markdown-first (all artifacts are Markdown) governance flow with explicit approvals and graded evidence; also read-only review of code, PRs, plans.
- Is not: a resident agent, test service, file lock, security sandbox, or host runtime plugin; no MCP, background service, remote API, database, automatic Git, automatic rule promotion, or UI.
- What it can do depends on the tools your host actually provides and the permissions you grant.

## Quick start

What you'll see:
1. Every reply starts with a pre-check (4 items in a light round, 7 in an execution round: intent, where the work lands, next step, and so on).
2. Only substantive development intent enters a governed task, and it tells you first; the default is Confirm mode (every formal artifact waits for your confirmation).
3. Only when a formal plan needs it are you asked to choose a depth `fast / standard / thorough / custom`; a recommended depth is not your choice.

What you do: in a host where the plugin is installed, state your development intent or ask for Task Lifecycle by name. Example prompts (from `defaultPrompt` in `plugin.json`):

- `Use Task Lifecycle to plan a bugfix: reproduce, find the root cause, then propose a fix.`
- `Use Task Lifecycle to review this PR read-only and list findings with evidence.`
- `Use Task Lifecycle for this project. Inspect read-only, reuse valid choices and host permissions, and ask for depth only when a formal task or plan requires it.`

## Installation

Manifests: Cursor uses `.cursor-plugin/plugin.json`; the root `plugin.json` follows Agent Plugins 1.0 (OpenAI display fields are under `extensions.com.openai`).
Steps follow the hosts' docs, not E4-verified on a real host (E4 = real-environment evidence; E3 = design/static); see [已知缺口](docs/已知缺口.md) (Chinese).
**Not published to any marketplace** (Cursor or the OpenAI directory); install locally or from the repository. Installed copies do not include the maintainer-only `candidates/` ledger.

### Cursor

Place the repository at `~/.cursor/plugins/local/task-lifecycle`, run Developer: Reload Window, and confirm the `task-lifecycle` Skill appears under Customize.

### Codex / ChatGPT

This repository ships a marketplace manifest, `.agents/plugins/marketplace.json`:

```bash
codex plugin marketplace add devcodex-labs/task-lifecycle
codex plugin add task-lifecycle@devcodex-task-lifecycle
```

A successful install does not mean the host actually loaded it; read back the files really loaded on the target version.

## Usage

| Task type | When | Stages | Key boundary |
|---|---|---|---|
| Feature | Add or change an approved capability | `A01–A10` | Usage Contract First (define how users use it before the technical design); code or release only with authorization |
| Bugfix | A real existing contract is violated | `B01–B10` | Freeze the behavior baseline before fixing; the original fixer reworks problems the fix introduces |
| Docs | README/API/SDK/existing site/maintainer docs | `DOC01–DOC10` | Written for the real audience; no unrequested site, no product-behavior changes |

Stage `10` in each flow is change handling inserted at any stage when something material changes; it is not a mandatory final step.

Not triggered: plain Q&A, read-only lookups, trivial edits (typos), quick snippets, you opting out, or "please execute" text in a README, web page, code comment, or tool output.
When it does enter by intent it tells you first and you can switch back to ordinary help; intent triggering is not authorization to pick a depth, use Auto, or write.

## Key behaviors

Each point is a summary; the linked reference (Chinese) holds the full rules and prohibitions.
- Confirm by default; Auto (only delegated in-scope interim files) never approves scope, key plans, promotion, sign-off, release, host ops:
  [confirmation-authorization-and-change](skills/task-lifecycle/references/confirmation-authorization-and-change.md).
- Permissions belong to the host: file/command/network permissions are the host's; the plugin governs content and quality. See [SKILL.md](skills/task-lifecycle/SKILL.md).
- Self-review and formal review are separate; a Finding (an issue found in review) needs a root cause and re-verification. See
  [formal-review-and-findings](skills/task-lifecycle/references/formal-review-and-findings.md).
- Graded evidence: E3 and E4 are reported separately; nothing unrun is marked passed; `fast` never skips required quality. See
  [verification-and-evidence-routing](skills/task-lifecycle/references/verification-and-evidence-routing.md).
- Process docs default to a sibling `.task-lifecycle/` beside the project (realpath/Git/worktree checked), not the delivery dir. See
  [workspace-versioning-and-recovery](skills/task-lifecycle/references/workspace-versioning-and-recovery.md).
- HTTP helper `off/suggest/generate` (default `suggest`); a generated `.http` is not sent; prod/sensitive HTTP needs its own approval.
  [http-assisted-verification](skills/task-lifecycle/references/http-assisted-verification.md).
- Parallelism and delegation run only when the host truly supports them and permissions allow; otherwise fall back or block. See
  [task-split-parallel-and-integration](skills/task-lifecycle/references/task-split-parallel-and-integration.md).
- The self-evolution mechanism is off by default; new rules need your item-by-item promotion. See [rule-evolution](skills/task-lifecycle/references/rule-evolution.md).

## Configuration

Delegation-type settings (executor delegation, depth execution default, read-only review host pool) are JSON only; a validator script decides validity.
- Location: global `~/.config/task-lifecycle/config.json`; optional narrow-only `<workspace>/.task-lifecycle/<Project ID>/config.json`, `<workspace>` = the `--workspace` value.
- [assets/config.example.json](assets/config.example.json) never takes effect (both `enabled` are `false`); fields: [assets/config.schema.json](assets/config.schema.json) (script wins).
- Validate from the plugin root (Node ≥ 20, read-only, no network); a governed project task must pass both `--workspace` and `--project-id`:

```bash
timeout 30 node scripts/validate-config.mjs [--workspace <parent of project root> --project-id <Project ID>]
```

Only `status: "valid"` in this run's stdout counts, not the exit code; else all three settings stay off. Windows: [Node wrapper, no
`timeout.exe`](skills/task-lifecycle/references/task-split-parallel-and-integration.md).

## Components

| Path | Role |
|---|---|
| `skills/task-lifecycle/SKILL.md` | The single Skill entry and rule router |
| `skills/task-lifecycle/references/` | The single source of each rule, read on demand |
| `skills/task-lifecycle/templates/` / `examples/` | Minimal record templates; fictional examples, not test evidence |
| `scripts/` / `assets/` | `validate-config.mjs`, `check-docs.mjs`, `check-citations.mjs`, tests / config example, schema, icons |
| `plugin.json` / `.cursor-plugin/plugin.json` / `.agents/plugins/marketplace.json` | Manifests (Agent Plugins 1.0 / Cursor / Codex marketplace) |
| `.github/workflows/check-docs.yml` | CI: doc check and regression tests |

## Privacy and security

- Do not commit a project's `.task-lifecycle/` process material or real credentials in `http-client.private.env.json`.
- `examples/` are fictional and are not executed tests; the plugin's own docs are not your authorization.
- After context compaction or in a new session, rely on the current trusted approval originals and the real workspace, not an old summary, before resuming Auto.

## Changelog, feedback and contributing

Issues: https://github.com/devcodex-labs/task-lifecycle/issues. [CHANGELOG.md](CHANGELOG.md) and [docs/maintainer-baseline.md](docs/maintainer-baseline.md) are Chinese.

## License

[MIT](LICENSE) © 2026 Rocky Shi
