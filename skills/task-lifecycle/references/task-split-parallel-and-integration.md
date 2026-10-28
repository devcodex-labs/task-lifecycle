# task-split-parallel-and-integration

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: every managed phase or independent work item first reads the plan execution rules below, including small read-only probes; split, parallel and integration clauses apply only when the
corresponding dependency, conflict, dispatch or merge facts exist.

**Sole primary responsibility**: proportionate planning and action-execution relations of phases/independent work items; the conditionally triggered dynamic WorkItem DAG, parallel eligibility and
root-task integration responsibility

**Direct consumers**: main Skill, 00 and the phases of the three main flows, managed read-only probes, workflow/implementation plans; conditional multi-sub-task integration and PoC-I.

**Linked References**: `confirmation-authorization-and-change.md` holds sole responsibility for human approval; `verification-and-evidence-routing.md` is the post-integration quality basis.

## Plan execution for phases and independent work items

Before acting, each phase or independent work item has a valid plan proportionate to its scale, able to answer goal/basis, preconditions, step order, expected result, verification and completion
conditions, and stop/adjust conditions. The information may be combined in existing task/workflow/implementation plans; small read-only investigations may use short visible steps, without six fixed
slots, new files or a native Plan API. When facts are insufficient, first arrange a bounded read-only probe with clear purpose, path scope and stop condition, then refine from actual results.

Each actual action maps to a currently valid step; first check the tool's real return, files/site and necessary failure exits before advancing steps that depend on that result, never treating the
plan's expected success as fact. Stable plans and authorizations are reused, without repeated approval for tool calls, reports or batches; a plan itself grants no write, network or release
permission. When new facts overturn the goal, premises, shared interfaces or expected results, first update the affected basis, steps and verification scope and handle per the existing
change/confirmation protocol; pause actions depending on that change while other independent legal work may continue.

**Short example (fictional, not executed)**: first verify read-only whether two configs point to the same shared interface, then decide on later call verification; when the second config is
unreadable the result is unknown, never claiming the interface is consistent or making calls that depend on that conclusion. If the interface really changed, adjust the related steps first;
independent doc checks may continue.

## Execute item by item when applicable

1. First use the approved task/implementation plan to define the minimal dependency DAG, each item's input/output, reads/writes and side effects, shared consumers, quality/permissions and real
   independence; simple tasks do not generate fake sub-Agents for parallelism.
2. For each item/pair actually decide one of four states `parallel-eligible / parallel-analysis-only / serial-required / blocked`, considering dependencies, shared schema, dirty state, real
   support/isolation, benefit and coordination cost;
   - when only the benefit is insufficient or coordination cost not worthwhile, record it as the **reason** for `serial-required`; never invent a `parallel-not-beneficial` state.
   - read-only investigation may choose `parallel-analysis-only` when it fits authorization and actual capability; parallel write permission cannot be derived from it.
**Default ban on branches for personal projects (AC-077 / PAC-67 / SC-105)**: without the real user's explicit authorization for this project and target operation, **never automatically create
feature branches, switch the current branch or automatically create worktrees for a personal project**;
- nor clean, reset or overwrite the user's dirty/staged/untracked/ignored files.
- When parallel isolation is needed, first verify the actual Git/worktree, shared read/write sets and the host's available capabilities: if new branches/worktrees are not allowed, `serial-required`
  may be chosen only when the original task is still legal and without shared conflict;
- if there is no safe executable path at all choose `blocked` and explain the block; never force-create branches in pursuit of parallelism.
- **Rejected counterexample**: the user only authorized analysis or a source fix, and the model "for efficiency" runs `git switch -c feature/...`, `git worktree add`, `git reset --hard` or cleans
  uncommitted content on its own;
- **Positive example**: keep the original branch and dirty state, choose legal read-only analysis or serial work, and request authorization separately when isolated writes are truly needed.

3. `parallel-eligible` is only eligibility; when the actual host has no authorized spawn/wait/cancel and independent results, `executionEvidence=parallel-not-verified`; a legal serial fallback must
   leave a real record, and `blocked` does not mean automatically serializable.
4. The main task alone is responsible for the current version of formal process files, real user approval and overall delivery; sub-tasks only submit candidate diffs/local evidence within their
   authorized scope, do not approve root-task objects themselves, and cannot inherit unlimited Auto permission.
5. Before accepting sub-task results, re-read the current requirement/source, check late cancellation/version invalidation, shared write conflicts, the real diff and consumers; after legal
   integration run the necessary overall regression; local green does not mean global completion.
**Execution exits for pause/cancel/late results (REQ-063)**: when the root task scope, upstream contract or a user pause changes substantively, immediately freeze the affected dependency chain and
its candidates;
- for still-running sub-tasks, attempt `cancel` where **the current host actually provides it and current permissions allow it**, recording the request and actual return (failure/unknown result also
  recorded truthfully), and check whether files, processes or external side effects were produced. Cancel does not undo side effects, still less can late results be assumed safe;
- duplicate results, results returned after cancel or with invalidated versions are isolated and re-checked by the root task; unknown external actions are never blindly retried.
- other sub-tasks not depending on that decision and still legally authorized may continue; a local pause cannot be escalated into global cancellation or automatic approval.
6. Cost comparisons may only cite truly comparable time/cost/failure records; without objective samples mark not-comparable, never advertising "parallel is faster".

## Cross-repo sub-tasks and joint push (CAND-20261026-015)

Applies when the managed main task hands a sub-task to an assistant (executor) resident in another repository who commits in that repository; same-session sub-Agents and `[TL-DISPATCHED` sessions do
not apply.
1. The executor may commit in its repo within the authorized scope, keeping the commit IDs, and create and update a sub-task record (under the process root
   `<executor repo dir name>/<main task ID>-<suffix>/子任务记录.md`, first line the main task ID and path, plus a `Status:` line; not a Task, takes no Task ID); this is the sole exception to item 4 of the
   previous section; it does not approve main-task objects or inherit unlimited Auto.
2. The hand-off message attaches the original text of the branch, commit, push, directory and language entries in the target repo's 《项目约定.md》, or "none" if absent.
3. Joint push is done by the main task; the executor does not push; before pushing the main task lists each repo's commit set, push authorization source, verifier and forbidden zones, and who to
   notify; after pushing it backfills each repo's before/after commit IDs and informs each executor; only after the executor updates `Status:` to pushed may the main task record that repo as complete.
   This section grants no push permission.
Reject: violating items 1–3 of this section.

## Capacity-adaptive batching for long tasks (also for ordered serial work, parallelism not required)

**Trigger**: the current approved task's object count, compound sub-conditions, external dependencies, remaining context or measured quality make completing it reliably in one go clearly risk
omissions/lost evidence; no need to wait for the user to ask for "batching". Simple tasks directly record `no split + reason`, without manufacturing batches. Batching creates no new flow, workflow
depth tier or extra product capability, and does not by default require parallel agents.

1. The root task first freezes `TaskID / approved scope / source version SHA / target consumers / mode and permissions / definition of done / unauthorized operations`, dynamically estimating each
   item's complexity and available context/tool budget.
   - Divide finite batches along **stable source and dependency boundaries**
     (`BatchID/source ID set/sub-conditions/prerequisites/actual input SHA/expected evidence/acceptance threshold/block exit`), without a fixed "50 per batch"; rebatching is allowed with an explicit
     reason, but the complete, non-duplicated, non-missing source set and traceability must be kept.
2. Within a valid same user authorization/approved plan, automatically process safe batches in succession: each batch really reads the current rules and sources, judges positive/negative
   cases/failure exits per condition and produces traceable rulings; defects to fix may be grouped by root cause and not-yet-effective candidates revised within the approved scope, then re-reviewed.
   Automatic evidence retrieval, path hits, batch summaries or the same model saying "done" may never be marked `covered-by-design` or E4 `passed`. Harder batches should be made finer or have
   explicit gaps listed separately, never forced to converge by lowering quality requirements.
3. **Batch checkpoint (persisted only with real legal write permission)**: in a safe process record outside the repository update `BatchID` / `sourceSetHash` / `targetSHA` /
   `completed source+sub-condition IDs` / `per-item E3 ruling and evidence path+Hash` / `unruled+actual reason` / `open Findings` / `E4 status` / `nextBatch` /
   `execution time and trusted approval source`.
   - Originals and signed evidence stay read-only; re-read after each batch write; when rules or candidates change, affected evidence must be invalidated and re-checked.
   - On interruption or compaction, never continue any side-effecting action based only on an old summary, progress percentage or "Auto started".
4. **Completion gate**: the root task checks that the approved full set of source identities and sub-conditions satisfies `planned = adjudicated + explicitly-blocked` (no omission, no duplication);
   each ruling needs current-version actual rule consumers, positive/negative cases, failure exits, evidence level and exact uncovered conditions;
   - `needs-evidence` / `partially-covered` are explicitly unconverged items and cannot count as design acceptance.
   - E3 convergence may be claimed only after every Finding needing a fix is revised within the approved scope, with affected re-review and corresponding verification; E4 real execution and
     release/install/account updates go through their own permission gates.
5. **Minimal approvals and capacity limits**: completing a batch, producing temporary records or finding ordinary Findings is not itself a new human approval object; continue to the next batch
   within the same valid plan, without asking per batch. If a new product trade-off, invalidation of the current valid plan, new source/environment side effects or high-risk external behavior
   appear, pause only the related dependencies and ask the user at once about the exact protected decision. When the host ends this call or hits hard context/time/tool limits, save the real progress
   and say clearly it cannot continue, never pretending to run in the background or resume on its own.

**Positive/negative examples**: the same approved 1,440-item E3 task, unreliable in one pass, is automatically split into 20 mutually traceable batches, continuously completing per-sub-condition
rulings and finally summarizing valid evidence: compliant. If each batch only produces a ledger to review and the next round again asks the user to "confirm continue", or after 10 batches the
remaining 10 are claimed to pass automatically, both must be rejected. If a batch involves an unauthorized real Codex install, pause that action; other approved purely static batches may continue.

## Delegation config: JSON and validator (consumption protocol)

Delegation config (external executor delegation, `workflowDepth` execution default, read-only reviewer host pool `review`) recognizes only JSON and the validator; soft preferences and task state
still use Markdown (`workspace-versioning-and-recovery.md` §9.1.1).
- Location: global `<account home>/.config/task-lifecycle/config.json` (required when using any delegation setting); project layer `<workspace>/.task-lifecycle/<Project ID>/config.json` (optional,
  only narrows).
- Fields are in the plugin's `assets/config.schema.json` (for humans; the script is authoritative); `assets/config.example.json` never takes effect. Writes go only through "Delegation config writes"
  in `workspace-versioning-and-recovery.md` §9.1.1.
- POSIX call: `timeout 30 node <plugin root>/scripts/validate-config.mjs [--workspace <parent dir of the bound project root> --project-id <bound Project ID>]`; the validator is read-only, offline,
  and starts no git or any child process.
- Windows PowerShell uses the existing Node (≥20) with a 30-second wrapper call; do not treat Windows `timeout.exe` as POSIX `timeout`. Replace the example's path and two arguments with verified
  actual values; the wrapper only starts and time-limits this validation child process:

```powershell
node -e "const r=require('node:child_process').spawnSync(process.execPath,process.argv.slice(1),{encoding:'utf8',timeout:30000,killSignal:'SIGKILL'});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(r.error)process.stderr.write(r.error.code+'\n');process.exit(r.error?1:(r.status??1));" '<plugin root>/scripts/validate-config.mjs' --workspace '<parent dir of the bound project root>' --project-id '<bound Project ID>'
```

- The account home comes from a system account lookup and cannot be inferred from config. Only on Windows may an unset `HOME` continue using the verified account home; explicit empty values or
  conflicts are still rejected. On POSIX unset, empty or conflicting values are rejected; account lookup failure is rejected on every platform.
- `approvalSource.record` uses an absolute `.md` path of the current platform (e.g. POSIX `/.../record.md`, Windows `C:/.../record.md`); the human-readable schema does not replace real path, Git
  boundary, file binding and raw-byte SHA checks.

1. **Run fresh before each use**: re-run separately for pre-check item 6's intended config use, before each config-based dispatch and before each config-based tier selection; never reuse earlier
   results (including in the same turn). A tier the current user explicitly picks does not depend on the config default and is not revoked by config invalidity.
2. **Identity parameters**: managed project tasks must pass both parameters, `--workspace` equal to the parent dir of the bound project root and `--project-id` equal to the bound Project ID;
   on mismatch or a task not bound to a unique project → do not call, record `project-identity-missing` and treat as off. A result without parameters may only be used for read-only viewing not bound
   to a project, never for project-task delegation or tier selection.
3. **Output check**: first check stdout's required fields and types (`status`, `schemaVersion`, `validator`, `env`, `reasons`, `layers`, `approvalSources`, `effective`, `legacy`).
   Check field types and conditional fields one by one per [validator-output-protocol.md](validator-output-protocol.md) (including the full shapes of `validator` / `env`/layer objects/effective
   subtree); key points: `layers.global` is always present, and `layers.project` must be present when any project parameter is given; when valid `effective` is an object containing
   `delegation` / `review` / `workflowDepth`, with one `approvalSources` entry per existing layer; when disabled `effective` is `null` and `approvalSources` is `[]`; each `reasons` item contains
   `code` / `detail` / `layer` / `path` / `stage`.
   Additive (FEAT-20261028-001): a valid `effective` also contains `parallel`; its consumers read the last section "Host-native parallel config (parallel)".
   No node, node < 20 or missing script → `validator-unavailable`; crash, 30 s timeout, empty/truncated/non-conforming stdout → `validator-failed`; exit codes 0/2/1 are only auxiliary.
4. **Accept only this run's `status:"valid"`**: otherwise treat as off; pre-check item 6 writes `Config: disabled (<code>)`, and the depth execution default is invalidated too.
   Structural failures (e.g. duplicate key `duplicate-key`, `config-parse-error`) report only that code and do not proceed to item 5's sha verification.
5. **Approval verification** (each existing layer): re-read `approvalSource.record` (the script only checks it exists; the consumer reads its content); all must hold:
   ① the `messageId` original words match `quote`; ② there is a user approval event for that layer's config whose bound sha256 equals this run's `layers.<layer>.sha256`; ③ that event's scope covers
   the layer's actual settings.
   - Unreadable → `approval-record-unreadable`; ① fails → `approval-quote-mismatch`; ② or ③ fails → `approval-scope-mismatch`; all are off.
   - A registered config later modified (sha does not match the approval event) → `approval-scope-mismatch` off, **no automatic backup restore**, keep the current file as evidence,
     pre-check item 6 shows "config changed after approval"; restoring the backup or adopting the new content both must go through the write flow again with user confirmation.
6. **Tier selection priority**: the current user's choice this time → `effective.workflowDepth.executionDefault.value` (non-null) → show the four tiers (`task-recognition-and-routing.md` §4.4).
7. **legacy**: a `delegation-section` / `depth-execution-default` hit → pre-check item 6 shows `legacy-markdown-ignored` with the file line numbers;
   when the user asks to migrate, show the `suggestedJson` diff and go through the write flow; `legacy-check-skipped` → only show "legacy convention not checked (<detail>)", without changing config
   status.
8. **Traces** (task record outside the repository): `status`, `reasons`, each layer's `sha256`, approval verification result; dispatch and review calls are additionally traced per item 10.
9. **Reviewer hosts (`review`)**: only when valid this run, approval verification passes and `effective.review.enabled.value === true` may `effective.review.hosts` serve as
   the "convention that takes effect with user confirmation and specifically lists the reviewer pool" of `formal-review-and-findings.md` §7.10 item 0, replacing this time's naming of that CLI;
   otherwise external review is still called only on the real user's naming this time.
   - Identity before admission: when the session carries a dispatch marker (SKILL.md §0 item 1 receiver gate), neither this config nor naming in a dispatch prompt takes effect, and no CLI is called.
   - Read-only tier: config cannot replace per-call naming of a sandbox tier that restricts only writes, not reads (e.g. codex `-s read-only`); not named this time and the host cannot restrict reads
     → record `review-sandbox-tier-unnamed`; that host is not used this time; degrade per §7.10 item 6.
   - Seats: with two or more available hosts take the first two in `hosts` order for seats A and B; the rest are written "not selected/standby" in the review plan; when one becomes unavailable
     midway, fill in order and record from which round.
   - Config grants no: coding delegation, phase expansion, any write permission, live-test authorization or review conclusion; review sessions still only produce opinions.
10. **Argument passing and log checks** (same rule for reviewer hosts and coding executors `effective.delegation.executors.<id>`):
    append the model argument when `model` has a value and the reasoning-effort argument when `reasoningEffort` has a value; omitted means not appended; for codex `-m <model>`,
    `-c model_reasoning_effort="<value>"` (command-line override not live-tested, recorded unverified).
    - After running, check the log header, comparing only fields **explicitly written** in config: mismatch → `config-mismatch`;
      when the line for an explicitly written field is missing from the log header, truncated or unreadable → never treat as matching; record `config-mismatch` (detail `log-unverifiable`) and keep
      the raw log header.
      The same explicit field appearing in the log header with two or more different values → treat as unreadable, likewise `config-mismatch` (detail `log-unverifiable`), applying only to this
      host's call;
      repeated identical values are not a conflict, but the value must still be compared with config, and a mismatch is recorded `config-mismatch` as usual.
    - Omitted fields (effective `null`) are not compared and record no code, only the actual value and source "host default"; when that log header line is missing, truncated or unreadable record the
      actual value as "not obtained".
    - A non-codex host configured with `model` / `reasoningEffort` whose support the capability probe has not proven → `executor-unavailable`, never silently ignored.
    - These three codes and `review-sandbox-tier-unnamed` apply only to this host's call, do not turn off the config and do not affect other hosts or categories;
      reviewer hosts degrade per §7.10 item 6 or fill in `hosts` order; coding executors degrade to main-session execution per item 3 of the next section, without reassigning to another executor
      (one executor per WI).
    - Traces: the actual command, config values, `model` and `reasoning effort` in the log header and their source (config / host default / not obtained).

## External coding executor delegation (off by default, config narrows)

**Trigger**: an A04/B03/DOC04 approved plan intends to hand a work item to an external coding executor outside the host (a command-line coding agent such as `grok`), or the pre-check finds
delegation config or this section's form in a legacy convention.
Do not judge by host name: several hosts on the same machine may see the same executor; "the command exists" neither means "the current host is a certain product" nor that it is enabled.

1. **Off by default**: it may be enabled only when the previous section's consumption protocol gets `status:"valid"` this run, approval verification passes,
   `effective.delegation.enabled.value === true` and that category's effective value is not `none`; when the current session itself carries a dispatch marker it is always off (SKILL.md §0 item 1
   receiver gate), and naming in a dispatch prompt grants no admission;
   - script not valid or approval verification failed → config off (pre-check item 6 writes `Config: disabled (<code>)`), the main session does it itself;
   - config valid but `effective.delegation.enabled.value === false` or the category is `none` → only this category is not delegated (not a config rejection, no code); other valid config settings
     apply as usual; the legacy Markdown "外部执行器委派" section is only a legacy hint.
   - the current user's instruction this time can only narrow further (e.g. "no delegation this time"), never loosen config; config is set per category only, with no per-phase override.
2. **Categories and ceilings**: `categories` maps four kinds of work to an executor id or `none`; unlisted means `none`; the table below is the ceiling, config can only narrow:

| Category | Phases and sub-steps that may be handed over (ceiling) |
|---|---|
| `implementation` | A05 implement code and tests of approved WIs; B04 implement the approved minimal fix and add failure→fix tests; DOC05 write per the approved content contract and change list |
| `readonly-investigation` | A01 existing behavior facts; A02 actual call surface inventory; A03 dependency version and source structure check; A10/B10/DOC10 affected surface collection; B01 environment/logs/consumers; DOC02 fact inventory |
| `test-run` | A06 run per the frozen verification plan and return raw output; B02 write and run the repro script; B06 original Bug and regression tests; DOC07 no sub-step may be handed over (static scripts and the phase's other sub-steps are all outside the ceiling) |
| `drafting` | A07 draft usage docs and examples per the effective contract; B07 draft doc and contract sync text per the decided fix |

   - **Never delegate**: all content of 00, A04, A08, A09, B03, B05, B08, B09, DOC01, DOC03, DOC04, DOC06, DOC08, DOC09;
     plus any phase's SelfReview/FormalReview/Approval, Finding closure, E1–E4 judgment and evidence sign-off, root-cause and regression verdicts, integration, push/release/delete, final acceptance.
   - An external CLI as a read-only review session collecting opinions is not delegation under this section; it is admitted separately per `formal-review-and-findings.md` §7.10 item 0; this
     section's config cannot enable it, nor does it loosen this section.
     The `review` section of config is one form of the "convention in effect" of item 0 (previous section item 9), read only once §7.10 applies.
   - A `categories` key that is a phase or sub-step name → script `forbidden-mapping`, the whole config disabled (no longer just ignoring that entry); one executor per WI.
   - Config enabling a category does not approve any WI: the A04/B03/DOC04 approved plan must still state per WI "which executor it is delegated to".
     When early A01–A03/B01–B02/DOC02 runs first without that plan, the main session first does bounded investigation/reproduction, not delegating early because the category table lists it. On later
     legal re-entry into these phases, delegate per this run's valid config only when a still-valid or controlled-revised plan states the category's WIs, scope and executor.
     Judgment order: current legal plan and phase → concrete WI → freshly run config and category ceiling → actual host capability; the category table is a ceiling, does not generate plans
     automatically, and does not bypass never-delegate items or review responsibility.
   - **Necessity judgment (CAND-20261026-001 v7, 0.1.46; only narrows, never loosens)**: before the judgment order above, first assign the change one unique tier by the sufficiency of verification
     means;
     this judgment neither loosens nor overrides item 1's default-off, the never-delegate items and per-WI naming in the approved plan; if any prerequisite fails the main session still executes or
     records `blocked`.
     First ask "does it change host-observable behavior" (execution paths, approval flows, delegation chains, interaction in headless mode); ①–④ are mutually exclusive and jointly exhaustive, ⑤ is
     only the fallback:
     ① does not change host-observable behavior, and the closed change set contains only rule text, config, validator scripts and test assertions → **deterministic tier**;
     ② changes host-observable behavior, and contains no change other than those carrying that behavior change → **host-behavior tier**;
     ③ contains host behavior changes plus any other changes (including the four kinds above, product code and docs) → **gray zone**;
     ④ does not change host-observable behavior, but the closed set contains changes beyond the four kinds (e.g. ordinary product code) → deterministic tier if local tests and static gates close the
     loop, otherwise gray zone;
     ⑤ none of ①–④ hits or unsure → gray zone, never downgraded to the deterministic tier.
     - Deterministic tier: local gates (`node --check`, `sha256sum`, `validate-config.mjs`, check-docs, check-citations, `node --test` of all `scripts/*.test.mjs`, consistent with CI and the
       maintenance baseline) close it in one go, zero delegation.
     - Host-behavior tier: behavior verification is mandatory; when delegation prerequisites are met delegate its execution, stating expected behavior before delegating, and check results by
       structured stop reason plus diff (item 5).
     - Gray zone: run the static part locally first, then dispatch only the affected scenarios (the verification plan states the minimal scenario set and reasons), no full retest; delegation
       prerequisites as for the host-behavior tier.
     - Neither tier delegates Approval, E1–E4 judgment and evidence sign-off or other never-delegate items; when not delegated the main session does equivalent behavior verification or records
       `blocked`, never claiming verified behavior from static tests alone.
   - **Default tiers of the four categories** (narrowing further within the ceiling above): `drafting` defaults to local; `readonly-investigation` defaults to local, dispatchable only when named in
     the approved plan and the scope is large or the object is host behavior facts;
     `test-run` follows the tested change's tier: deterministic tier always local (a long-running suite is not delegated for time), only real host-behavior reproduction in the host-behavior tier or
     gray zone may be dispatched;
     `implementation` verification follows the change tier.
   - **Cost principle**: accepting delegated results (capability probe, dispatch header, stop-reason check, diff re-read, out-of-bounds check, regression rerun) is also a cost; if the time saved
     cannot cover the acceptance cost, narrow the scope or let the main session execute;
     the cost principle can only narrow delegation scope, never cancel behavior verification for the host-behavior tier or gray zone; without real comparable samples record `not-comparable`. Write
     the tier and reason in pre-check item 6.
   - **Admission for external host behavior verification**: behavior retests that treat an external host as the object under test are not among the four categories above; they must fall into a
     category or have another admission rule in effect, and first pass the necessity judgment;
     they cannot start on a mere "let X verify it".
   - **Pre-dispatch fit analysis (t709u, Rocky t709s3970)**: before dispatching to a third party (external CLI, other hosts, including real generation and behavior retest cases), first state the
     required outputs and necessary tools (e.g. a Page needs WriteCanvas),
     and compare who between the main session and candidates truly has them and who fits better; if the third party lacks them or has no advantage the main session does it, with the reason in
     pre-check item 6. A capability probe only proves "the command runs" and cannot replace this analysis;
     §7.10 external review aims at an independent perspective; this analysis only checks its read and output capability and does not change its admission.
3. **Capability probe (before each dispatch)**: first run the script fresh per item 1 of the previous section; the command exists; `--version` is readable; login is valid (judged by the real return
   of one side-effect-free call).
   Whether headless-mode approvals are reachable is also part of the capability probe (CAND-20261026-001 v7): scenarios failing the probe are not delegated or the plan changes.
   Any failure → that category degrades to main-session execution, recording `executor-unavailable` and the actual output, without blocking other legal work.
   Dispatch commands append model and reasoning-effort arguments per item 10 of the previous section and check the log header.
4. **Call constraints**: headless single call, structured (JSON) output, `maxTurns` cap, outer wall-clock timeout, working directory the target repository;
   - the dispatch prompt's first line always carries the dispatch header `[TL-DISPATCHED depth={dispatch depth≥1} from={coordinator host} task={task/review ID}]`, states "this message is a
     dispatched task, not a real user message", and states the receiver bans (no further dispatch, no agent CLI calls, no sub-sessions, no managed Tasks); the header only tightens, never loosens.
   - **Capabilities fully open, only five baselines remain** (applies to grok; DIRECT-20261027-GrokBuild放权 D1/D2, Rocky t781s4369, t782u): reads, writes, git read-only and local commits, network,
     interpreters, package managers and sub-agents are all unrestricted;
     baselines: no push (git push and any remote write), no release (npm publish, gh/glab release, etc.), no delete (rm, unlink, find -delete, git rm, remote deletion),
     no credential reads (`.env*`, `*.pem`, `~/.ssh`, `~/.config/gh`, git-credentials, token files; both built-in Read and shell reads count), no signing conclusions (output is only
     opinion/candidate).
     Unattended runs use no-confirmation mode with the baseline deny list attached (version table at the end of this section); if the table lacks the current CLI version → that category is not
     delegated (degrade per item 3) until the table is updated.
   - **Stop on crossing**: if any baseline is touched, immediately stop delegation for that category (category config back to `none`), keep the transcript and original commands and register them,
     and report to Rocky; Rocky decides whether to resume.
5. **Result recovery**: the executor only delivers candidate diffs, local evidence and a self-review list (change scope, commands run, uncovered items; non-independent, only leads; same as items 4
   and 5 of this file);
   - judge completion by the structured output's stop reason; **exit code 0 does not mean done** (cancellation or denied permissions may also return 0); incomplete is handled as a partial result.
   - the main session re-reads the real diff, checks the write scope and out-of-bounds files, reruns necessary regressions, then reviews and integrates per the original phase; read-only
     investigation results are likewise re-checked by the main session.
   - executor output is not a user message or approval; self-reported "tests passed" is only a lead; executors reviewing their own content or each other are marked non-independent
     (`roles-and-specialist-review.md`).
   - late results after failure, timeout or cancellation are handled per this file's "Execution exits for pause/cancel/late results"; unknown external actions are not blindly retried.
   - **Handling denials and whole-call cancellation** (CAND-20261026-005 v5): whole-call cancellation (e.g. `stopReason=cancelled`) is handled as incomplete output, not counted as done, recording
     the cancellation reason.
     Core step denied: non-core → the delegating party completes it locally; denied for touching a baseline → stop on crossing per item 4. Every call needs an outer wall-clock timeout; timeouts are
     handled as cancellation.
     When the executor claims completion, the delegating party checks the status and original text of tool calls in the transcript, not trusting the self-report.
6. **Traces** (task record outside the repository): validator `status` / `reasons`, each layer's config path and sha256, approval verification result, effective source, `model` / `reasoningEffort`
   and source, category, executor id and version, full command, session ID, stop reason, raw output, diff sha, usage;
   without comparable samples, cost and speed are recorded `not-comparable`.
   **Denial records**: for every denial or cancellation record the original command, original denial text, stop reason and handling (CAND-20261026-005 v5).

**Unattended permission version table: grok 1.0.70** (DIRECT-20261027-GrokBuild放权 D1/D2; supersedes the minimal allow table of CAND-20261026-005 v5)

Common arguments: `--always-approve --output-format streaming-json --max-turns <cap>`; outer wall-clock timeout (e.g. `timeout 300`). Do not add `--sandbox` / `--disable-web-search` /
`--no-subagents`.
Baseline deny (`--deny`, one per rule): `Bash(git push:*)`, `Bash(npm publish:*)`, `Bash(gh release:*)`, `Bash(glab release:*)`, `Bash(rm:*)`, `Bash(unlink:*)`, `Bash(git rm:*)`,
`Bash(codex:*)`, `Bash(grok:*)`, `Read(**/.env*)`, `Read(**/*.pem)`, `Read(~/.ssh/**)`, `Read(~/.config/gh/**)`, `Read(**/.git-credentials)` (the `~` and `**` forms not live-tested).
unverified (Rocky t782u waived live testing): whether deny still blocks in no-confirmation mode; whether shell variants (`cat` / `node` reading credentials, `find -delete`, `git -c`/alias pushes)
bypass deny. Baselines do not rely on deny alone; check the transcript per item 5 at result recovery.

| Task type | Status | Allow |
|---|---|---|
| Read-only review | May be enabled (admission only per `formal-review-and-findings.md` §7.10 item 0; does not change the reviewed object) | All (no confirmation) |
| Drafting | May be enabled | All (no confirmation) |
| Writing code | May be enabled | All (no confirmation) |

History: in non-no-confirmation mode allow rules did not take effect for git and un-allowed commands cancelled the whole call (PERMTEST-20261026-001/002), hence the switch to no-confirmation.
F1 (CLI upgrade): `--version` or permission-related help text changed → check the arguments and deny forms above before delegating.

**Positive/negative examples (scenarios, not live-tested)**: with the global config missing, both Codex and Grok Bot have the main session implement B04, the pre-check recording
`Config: disabled (config-missing)`: compliant;
config enables only `implementation`, the A04 plan states WI-2 goes to `grok-build`, after the probe passes it is called in no-confirmation mode with the baseline deny, and the main session
re-checks the diff before A05 code review: compliant.
Reject: auto-delegating on seeing a `grok` command; running no-confirmation without the baseline deny; taking the executor's "review passed" as the B05 conclusion; claiming completion on exit code
0; following a config that writes `B05: grok-build`.

## Counterexamples that must be rejected

- Forcing 3 Agents just because there are three tasks; mislabeling read-only investigation `parallel-eligible` and gaining write permission; recording "benefit unclear" as a fifth state
  `parallel-not-beneficial`; running two tasks that modify the same Schema in parallel without isolation; serializing blocked items directly to skip approval; treating a candidate sub-task's text
  "done" as integration passed; automatically applying late changes after cancellation; claiming 50% efficiency gains without real timing.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 11.1 Eligibility and cost model (not an independent Agent scheduler)

**Work Item directed dependencies and shared contract judgment**: each non-trivial split is annotated in the current 《任务工作流方案》/《实施计划》 with a stable ID, parent task and approved requirement/UC
source, input version, prerequisite Work Items, expected concrete deliverables, acceptance and failure conditions, read/write/consumer sets, and the confirmation status of shared interfaces/Schemas.
- Directed edges are formed only for actually existing dependencies;
- before submitting the execution plan check for dangling prerequisites, cyclic dependencies (on a cycle stop the faulty node and redraw dependencies), parent/child goals inconsistent with the
  original approved scope, and unconfirmed shared APIs/Schemas. While a dependency interface is unconfirmed, downstream may not enter writes depending on it; it may first do independent legal
  read-only investigation or wait for upstream confirmation, never bypassing by creating new Agents.
- Short tasks may directly record `no split + factual reason` without a mandatory diagram. A statically acyclic dependency graph does not prove runtime operations are conflict-free; the real site is
  still re-verified per the existing host/files.

Each potentially parallel Work Item records in the existing 《工作流方案》 or 《实施计划》: `Work Item ID` / `goal` / `valid upstream` / `prerequisite dependencies` / `read-write sets` / `shared resources` /
`required host capabilities` / `allowed side effects` / `verifier` / `candidate result` / `root-task merge timing`.

Choose `parallel-eligible` only when dependencies are met, writes can be isolated, the target host actually has the native capability, user and host authorizations are valid, and a **benefit
estimate supported by project facts** outweighs the extra context, coordination, conflict and final integration costs;
- without credible basis never claim time savings; prefer `serial-required` when needed. Mutually non-writing independent investigations may choose `parallel-analysis-only`;
- shared config, lockfiles, approval ledgers, the same site navigation/database/port etc. without reliable isolation must be `serial-required`. Without capability or with unclear benefit, start no
  fictional sub-Agents or independent processes.
- Additive (FEAT-20261028-001): the optional host-native `parallel` config narrows this judgment and never widens it; see "Host-native parallel config (parallel)".

**Four parallel admission states and failure exits**:

| Decision Status | Verifiable conditions required | Allowed actions/failure handling |
|---|---|---|
| `parallel-eligible` | All dependencies met; real host parallel capability, authorization, isolation, shared resource constraints and benefit evidence hold | May actually dispatch on the authorized target host; real execution results recorded separately |
| `parallel-analysis-only` | Does not modify shared/formal files; read-only investigations do not interfere and capability/permission allow | Parallel analysis only; results return to the root task for per-item verification; no parallel write permission inferred |
| `serial-required` | Same write surface/shared Schema/lockfile/uncertain benefit or no safe isolation, but serial execution of the original task is still legal | Keep the same Work Item DAG, run safely in series, never pretend to dispatch |
| `blocked` | Key dependency/public contract not approved, or permissions, dangerous shared side effects or project facts insufficient for legal execution | Stop actions depending on it and request evidence/authorization; **never interpret blocked as directly executable in series** |

Each judgment records `Work Item` / `decision basis` / `prerequisite dependencies` / `version` / `reads-writes and side effects` / `consumers` / `allowed or forbidden items` /
`current real host evidence`. Re-judge when facts change substantively, but never substitute "the risk is small" for real host authorization.

---

### 11.2 Sole responsibility of the root task

**Actual comparison and retrospective**: the planning phase records whether truly comparable serial/parallel plans exist, the input baseline, assumed benefits and extra coordination risks;
- the execution phase separately records the host's real spawn/wait/cancel events (`unverified` without the capability), observable execution time and model/tool costs (if any), conflicts and rework
  counts, root-task integration and overall test results.
- Without comparable samples or cost data, mark `not-comparable/unverified`; "ran in parallel" cannot prove it was faster. On quality, first ensure regression of the same contract and real
  consumers, then disclose efficiency conclusions.

- Phase plans, the sole current version of formal artifacts, confirmation records and external completion conclusions are the root task's responsibility; sub-tasks may only deliver candidate
  docs/patches/analysis and real local evidence.
- Before batch integration, re-read the current baseline and check that candidate diffs correspond to approved requirements, shared write conflicts, and the freshness of late or cancelled results;
  "already done" cannot skip real reconciliation.
- After integrating in dependency order, run the necessary integration/regression and form a single traceable delivery in the root task.
- Parallel and serial carry the same quality obligations; in Auto mode sub-Agents cannot directly inherit all of the parent task's operation/approval permissions, nor turn product suggestions into
  new Work Items.

---

### 11.3 Parallel failure and fallback

| Event | Handling |
|---|---|
| Host provides no native sub-Agents/tools | Complete the same Work Item plan serially; actual parallelism marked `unverified` |
| Shared writes or resource contamination found | Stop the conflicting items, switch to safe serial or approved isolation; protect the user's dirty state |
| Sub-task stale/cancelled/returned late | Isolate candidates, re-check requirement and source, never auto-merge |
| Unauthorized new product decision appears in Auto | Pause only the affected chain and ask the user; other legal branches of the original valid Auto continue |
| Regression fails after integration | Return to the related phase/batch by actual root cause; old local success cannot replace overall success |

**Eligibility judgment is orthogonal to the actual execution record**: `parallel-eligible` is a plan admission judgment; `parallel-not-verified` means no real evidence of native dispatch/wait/cancel
and corresponding results was obtained;
- even when eligible, if the host is unavailable or did not execute, also record `executionEvidence=parallel-not-verified` and fall back to serial within the allowed scope or stay blocked.
- `serial-required` only says it should be serial; if actually completed there should be serial execution/overall integration evidence; `blocked` cannot automatically cancel protected upstream gates
  just because parallelism is unavailable.
- Parallel description docs from other devices or an Agent's text self-report cannot replace the target host's real results.

---

## Host-native parallel config (parallel)

Added by FEAT-20261028-001 (Rocky D4, D5, D9, D18–D21, D26, D31, D32; R-2). Additive only: every sentence above, including "Four parallel admission states and failure exits" and
§11.1 "Choose `parallel-eligible` only when", stays verbatim and still governs.

- **Location and shape**: optional top-level key `parallel` in the same global and project `config.json` as `delegation`; `schemaVersion` stays `1`. Fields (all optional):
  `enabled` (boolean, default `false`), `maxConcurrent` (integer 1–4, default `3`), `categories` (object of booleans keyed by the four category keys; defaults
  `readonly-investigation: true`, `implementation: false`, `test-run: false`, `drafting: false`), `sameRepoWrites` (`disjoint-files-only` default,
  `worktree-with-per-time-authorization`, `never`). `"parallel": {}` is valid and means off.
- **Off is 0.2.6**: when `parallel` is omitted or the effective `enabled` is false, behavior is exactly that of 0.2.6; the existing `parallel-analysis-only` and
  `parallel-eligible` judgments are unchanged.
- **On adds only one thing**: for categories whose value is `true`, the main session may actually dispatch host-native sub-agents at the same time, at most `maxConcurrent`
  running at once (counted across all categories, the main session excluded). Every dispatch still meets "Choose `parallel-eligible` only when" and its following bullets.
- **Enabling grants no permission** (D32): `enabled: true` is not a standing authorization; every dispatch still needs that time's authorization. It only adds two limits:
  a category whose value is `false` is never dispatched concurrently, and the `maxConcurrent` cap.
- **Config is never authorization**: `readonly-investigation: true` allows only `parallel-analysis-only` and grants no write permission; a write category set to `true` still needs
  the four-state conditions and current authorization for each dispatch.
- **Not delegation**: `parallel.categories` (boolean: may this category be dispatched concurrently inside the host) and `delegation.categories` (external executor id) share key
  names only; `parallel` enables no external executor and `delegation` enables no concurrency. "External coding executor delegation" does not apply to `parallel`.
- **Same-repo writes** (`sameRepoWrites`):
  - `disjoint-files-only`: write sub-tasks with disjoint write sets that touch none of the shared resources listed in §11.1 may run concurrently; overlapping write sets are
    queued and run serially, automatically.
  - `worktree-with-per-time-authorization`: when isolation is needed, ask the real user each time to authorize a worktree; without that authorization the write runs serially
    and no worktree is created ("Default ban on branches for personal projects" unchanged).
  - `never`: same-repo write sub-tasks always run serially.
  - No value of this field authorizes creating a branch or worktree.
- **Project layer only narrows** (D21, D26, R-2): `enabled` may be `false` or equal to the global value; `maxConcurrent` at most the global value; a category may go
  from `true` to `false` or keep the global value; `sameRepoWrites` may only equal the global value or be `never`. Anything wider is `project-layer-widening` and the whole
  config is disabled. A project layer without `parallel` inherits the global one; omitted sub-keys inherit the global effective value.
- **Validator**: invalid values reuse existing codes (`invalid-type`, `invalid-value`, `unknown-field`, `forbidden-mapping`, `project-layer-widening`); no new code. When valid,
  `effective.parallel` is always present (fields per [validator-output-protocol.md](validator-output-protocol.md)); when the effective `enabled` is false it is the fixed
  default block with every `sourceLayer` `default` (D31). Consumers check `effective.parallel.enabled.value === true` first and otherwise ignore the other fields.
- **Run fresh**: before each dispatch based on `parallel`, rerun the validator per "Delegation config" item 1 and accept only that run's `status:"valid"`; pre-check item 6
  reports it as for any delegation config. A session under a dispatch marker (SKILL.md §0 item 1) never dispatches based on config.
- **No inherited Auto**: sub-agents and dispatched sessions inherit no Auto form (task-level Auto, the end-to-end Auto card, `noStop`; see
  `end-to-end-auto-card.md`); commits are made by the main session; the root task integrates and runs the overall regression (§11.2).
- **Compatibility**: plugins up to 0.2.7 do not know `parallel`, report `unknown-field` and disable the whole config (delegation, review and workflowDepth too). Upgrade the
  plugin before writing `parallel`. Writing or changing `parallel` is a config change and goes through "Delegation config writes".

**Scenario rules** (status words are the four states, except the last row):

| Scenario | Status | Conditions |
|---|---|---|
| Several repos, several tasks | `parallel-eligible` (conditional) | Cross-repo resident assistants follow "Cross-repo sub-tasks and joint push"; same-session sub-agents or dispatched sessions do not use that section and follow the other rows; that section grants no push; push needs the real user's confirmation at that time |
| Read-only investigation | `parallel-analysis-only` | Grants no write permission |
| Running tests per a frozen plan | `parallel-eligible` (conditional) | Shared resources (ports, databases, lockfiles) reliably isolated and §11.1 conditions met; otherwise `serial-required`; external executor test-run rules unchanged |
| Review seats | `serial-required` | §7.10 relay legs run serially (`formal-review-and-findings.md`) |
| Same repo, disjoint files | `parallel-eligible` (conditional) | Touches none of the §11.1 shared resources; §11.1 conditions met; commits by the main task only, with that time's authorization or the end-to-end Auto card's local-commit pre-authorization; a batch confirmation grants no commit |
| Same file or shared interface | `serial-required` | §11.1 shared-resource rule |
| Never-delegate list ("External coding executor delegation") | not dispatched (not one of the four states) | The A03 dependency and source-structure check may still run as a read-only investigation |
