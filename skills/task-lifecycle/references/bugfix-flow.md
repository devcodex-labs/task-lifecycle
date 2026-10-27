# bugfix-flow

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when explicitly handling a violation of current approved behavior, a real fix of an existing Finding, or resuming phases B01–B10.

**Sole primary responsibility**: the original issue, failure baseline, causality and new-regression closure of B01–B10; when Bug A causes B, responsibility cannot be offloaded to a new task

**Direct consumers**: Bugfix B01–B10, Findings and regression, actual code consumers, delivery.

**Linked References**: `formal-review-and-findings.md`, `artifact-content-and-self-review-contract.md`, `verification-and-evidence-routing.md`, `confirmation-authorization-and-change.md`,
 `workspace-versioning-and-recovery.md`.

## Execute item by item when applicable

1. B01 establishes approved/real existing behavior and the actual difference, never taking "the customer says it's a Bug" directly as the root cause; B02 collects, in an authorized environment,
   reproduced/not reproduced, original correct behavior, actual change surface, direct/indirect consumers and environmental factors.
1a. **Verify before characterizing** (B02/B03 hard gate): before characterizing a behavior as a Bug or proposing a root-cause fix, verify two points in the code:
   (1) whether it is intentional design: check callers, related test assertions, commit history/comments; (2) trace the actual failure path completely, confirming the root cause really lies there.
   Causes not fully verified may only be marked "inferred"; read-only diagnostic hypotheses, evidence-gathering steps and conditional fix directions may be proposed, never written as a proven
   Bug/root cause or a directly executable formal fix plan. The verification basis is written into B02.
2. The formal executable plan of B03 builds on the proven root cause, proposing the minimal fix, code maintenance quality, regression invariants and safe rollback; unproven hypotheses stay in
   diagnosis, and a formal plan forms after evidence is gathered. Changing a public contract needs a real user decision; unnecessary refactoring is only a suggestion.
   Before recommending, list each key premise the plan depends on and mark it "tested (command/output)" or "inferred (reason)"; testing stays within authorized scope after judging side effects
   first. Option comparison follows the minimal suggestion information of `artifact-content-and-self-review-contract.md`.
3. Before writing, B04 re-reads current source/tests/dirty/permission and limits the actual change; never swallow exceptions, loosen assertions or delete existing tests for a green light. B05 does a
   specialist review against the real diff/shared consumers/side effects/complexity/maintainability and reworks per Finding.
4. B06 runs applicable regression for the original Bug A, a new Bug B really found and proven to be introduced by it, existing normal behavior and shared consumers. If B also introduces C,
   re-evaluate the root cause/plan rather than patching endlessly.
5. Classify new anomalies `introduced-regression/pre-existing-exposed/unrelated-pre-existing/environment-or-test/causality-unverified`; without causal evidence never assert the fix introduced it. If
   B is confirmed introduced, it **belongs to the fix-quality responsibility of the original Bug A**: stop delivery, link the Finding, rework and re-verify A+B+shared consumers.
6. B07 syncs affected contracts/Docs/`.http` delivery; B08 publishes only with independent publish permission; B09 completes only with live tests and legal user confirmation. B10 is inserted only
   when any affected phase changes substantively.
7. Same-version issues newly reported after a terminal state was recorded: keep the old terminal history and verify whether the original goal is unfinished / a regression introduced this time / an
   independent pre-existing Bug / a new Feature; rework under original responsibility keeps the linked reopening; an independent Bug only gets a suggestion to open a separate authorized task, never
   a silent expansion.
8. For cases that cannot be safely reproduced or involve real production data/dependencies, give exact evidence limits and permission needs; never access production on your own because "it must be
   reproduced".

## Counterexamples that must be rejected

- After fixing the original A a proven-introduced B appears, and completion is declared because A alone is green; creating an unauthorized ticket for B and closing A; manufacturing green with
  Mocks/deleted tests/loose assertions; asserting attribution while causality is unknown; skipping applicable shared consumers with fast; killing old services without permission.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 5.1 Unified phase protocol

Every fixed main phase must be able to answer the eight questions below; concrete execution sub-steps are decided by project facts:

1. **Enter**: are the current task/upstream real file identities, confirmation/authorization, site and prerequisites valid?
2. **Role**: what are the primary perspective, consumers and reverse quality perspective? What does each check?
3. **Plan**: read the full "Plan execution for phases and independent work items" section of `task-split-parallel-and-integration.md` to form proportionate dynamic steps, artifacts, verification and
   rollback; verify actual results per that protocol before advancing dependents, never executing from this line's summary alone.
4. **Generate**: generate or update formal artifacts per Required/Conditional/Optional; non-applicable items state reasons.
5. **SelfReview**: read the valid upstream and real project facts, run omission/reverse-evidence review; may revise autonomously until convergence, leaving a self-review summary in the file.
6. **FormalReviewIfRequired**: a specialist review first needs a plan bound to the current object version and validly accepted per mode, then runs the Finding loop per plan; ordinary self-review
   does not recursively create specialist plans.
7. **Approval**: Confirm needs real per-item human confirmation; Auto only marks intermediate artifacts within authorization and with sufficient evidence `auto-accepted`; acknowledging a report's
   facts does not mean the object passed.
8. **Exit/Recovery**: update phase evidence, legal exit and next action; on change enter the inserted A10/B10/DOC10; on failure block locally and rework without harming unrelated work.

This is a **human-readable flow protocol** the Skill should guide, not a system-level unbypassable transactional state machine. When exit conditions are not met the host may still let the user call
tools directly; the plugin may not claim it can block that globally.

---

### 5.3 Bugfix B01–B10: phase inputs, artifacts and key exits

| Phase | Purpose and input | Required results/applicable review | Exit and return |
|---|---|---|---|
| B01 Defect analysis | User symptoms, current public behavior and project facts | Defect diagnosis plan, environment/affected consumers and initial hypotheses | Never disguise a new feature as a defect |
| B02 Repro/root cause | Current source, logs, environment, existing tests | Repro evidence/non-repro limits, expected vs actual difference, root cause/unproven hypotheses, verification basis for intentional design and the complete failure path; direct/indirect consumers and existing behavior baseline | Without evidence never claim a definite root cause or assume all consumers unaffected; without verifying "intentional design" and the complete failure path, mark only "inferred" |
| B03 Fix design | Root cause and original usage contract | Minimal necessary fix, conditional `.http`, behavior preservation/positive-negative tests listed by actual shared consumers, risks and rollback | Substantive public behavior changes need a human decision; optional refactoring may not be mixed into fix scope; untested premises may not be written as definite conclusions |
| B04 Implement fix | Legal plan, old failing/normal behavior and current dirty baseline | Minimal necessary code/config changes, real diff/fix record, original behavior protection, necessary failure→fix evidence | On out-of-bounds/side effects/improper assertion changes stop the affected items first |
| B05 Formal code review | Real diff, call entries and behavior preservation matrix | Specialist review plan/report, shared consumers, project consistency, minimal necessary complexity, readability/duplicate logic/side effects/testability, filtering of unapproved changes | Required maintenance quality and impact surface acceptable; style suggestions do not block unconditionally |
| B06 Regression verification | Fixed code and original failure, legal behavior baseline to preserve | Real positive/negative/integration verification of original Bug A, an actually existing new regression B (if any) and affected consumers, actual results of applicable HTTP requests, distinguishing introduced/historical/environment/unknown causality | When required regression fails or causality is unverified, never falsely mark complete |
| B07 Related delivery | Impact list of changed code/docs/contracts | Fix report, public doc sync, Docs site quality gate when needed | No stale product docs/verification and delivery version matches |
| B08 Legal publish only (when applicable) | Real publish need and legal permission | Publish/rollback evidence | Never commit/push/deploy on your own; on publish failure/partial success per `confirmation-authorization-and-change.md` §5.5 first read the real site, no blind retry; rollback needs separate authorization; otherwise block and let the user decide (retry/rollback/return to an earlier phase/terminate) |
| B09 Completion | The user's original failure goal/current actual results | Closure evidence for the original Bug and fix-introduced regressions, legal behavior preserved, maintenance quality, whyMissed, evolution candidate eligibility (only when evolution is enabled) and hand-off | A new regression split into an unauthorized new task cannot support claiming the original task complete |
| B10 Any-phase change (inserted) | New root cause, requirement, project/environment change | Update affected root cause/fix plan/verification/approval | Resume from the valid post-change state |

**Real diagnostic sources**: failing-test before/after samples, logs, database/production data are all handled per the user's actual authorization and accessibility; never copy private data, run
dangerous requests or expand permissions because "diagnosis needs it".

---

### 5.3.1 Conditional regression impact control and new Bug attribution (P0, no new state machine)

In B02/B03 identify from the real project: `changeSurface` (actual change points), `directConsumers` (direct callers), `indirectConsumers` (callers indirectly affected via shared
Schema/config/events/state), `behaviorInvariants` (correct behavior to preserve),
`newBehavior` (wrong behavior allowed to be corrected) and `validationCases` (applicable D/A/I/H).
- These are **readable information dimensions in the existing fix plan/verification plan**, not new JSON files that must be generated or a one-time deep read of the whole repo; unrelated consumers
  are explicitly N/A, doubts are written `unverified`.

When a new anomaly is found after the fix, first compare against frozen source/data/environment/test criteria and classify: `introduced-regression` / `pre-existing-exposed` /
`unrelated-pre-existing` / `environment-or-test` / `causality-unverified`;
- if an approved **public contract** needs to change, additionally mark `contract-change` and trigger the existing human product decision (this is a handling route, not a causal conclusion that the
  fix introduced a Bug). Only with supporting causal evidence is new Bug B judged a regression of A;
- if introduced, link the original Finding and rework within the original task, with B06 re-verifying at least A+B+applicable consumers; an unapproved independent new task cannot substitute for A's
  completion. When B leads to C, re-evaluate root cause and strategy to avoid unbounded patching;
- chained rework likewise applies the retry cap of "Substantive progress vs futile loop" in [formal-review-and-findings](formal-review-and-findings.md); beyond the cap, block openly and let the user
  decide.

**Exit conditions**: real execution evidence should correspond to the same code/test/consumer version, distinguishing `passed`, `failed`, `unverified`, `N/A+reason`. Without an applicable
environment or with important consumers unverified, block affected items per the predetermined quality criteria; `fast` only compresses unnecessary document form and cannot waive necessary
compatibility/security/data regression. Publish/rollback still needs real host authorization.

**Routing of follow-up issues on terminated tasks**: the sole Owner is [confirmation-authorization-and-change §5.5 "Routing after rejected final acceptance and follow-up issues on terminated
tasks"](confirmation-authorization-and-change.md#55-phase-errors-stopping-and-recovery); re-read its full body before execution.

---

### 5.5 Phase errors, stopping and recovery

Before propagating changes, stopping or recovering, re-read the **full body** of [confirmation-authorization-and-change §5.5 "Phase errors, stopping and
recovery"](confirmation-authorization-and-change.md#55-phase-errors-stopping-and-recovery). That file is the sole Owner of the shared protocol;
this flow directly consumes all of its change-record, evidence invalidation/reuse, local stop and legal recovery duties,
while each phase's specific entry/exit conditions remain this file's responsibility. Rejected final acceptance and follow-up issues on terminated tasks likewise follow that section's "Routing after
rejected final acceptance and follow-up issues on terminated tasks".

When the Owner cannot be read, its version does not apply, or only its heading can be located, stop change/recovery operations depending on that protocol and identify the current legal original
before continuing; never fabricate the protocol or let things through from this section's summary. Unaffected task chains with grounded validity are judged per the Owner, without a full restart or
expanding Auto authorization.
