# feature-flow

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when the task type is confirmed Feature, or Bugfix/Docs is authorized to switch to Feature, and the corresponding A phase is entered/resumed.

**Sole primary responsibility**: all fixed phases A01–A10 and phase exits; implementation plans/code/publishing must follow actual authorization and the approved usage contract

**Direct consumers**: Feature A01–A10, formal review, authorization, verification, hand-off; other References loaded on demand by API/Docs/parallel risks.

**Linked References**: `artifact-content-and-self-review-contract.md`, `confirmation-authorization-and-change.md`, `verification-and-evidence-routing.md`; for high risk see
`formal-review-and-findings.md`.

## Execute item by item when applicable

1. Once 00 is valid, proceed in order through A01 requirements review (proposals isolated from existing behavior), A02 usage contract (how users install/configure/call/errors/boundaries), A03
   technical design (may not change the UC backwards), A04 implementation plan (work item dependencies/quality gates), A05 authorized code and specialist review, A06 real verification, A07
   deliverable docs and affected consumers, A08 conditional publish, A09 real completion/hand-off.
2. A10 is the impact-analysis loop **inserted when goal/contract/source/consumers/permissions change substantively at any phase**, pausing only affected nodes; A10 is not run mechanically after A09.
3. Each A phase first states the actual input facts, the applicability of Required/Conditional/Optional artifacts and professional roles, builds dynamic sub-steps, verifiers, dependencies and
   completion conditions, then implements within legal permissions; formal artifacts need file-level self-review, and specialist reviews need an approved exact plan.
4. External API fields of A02 are checked item by item against the actually existing contract for type/domain/required/default/null/errors/permissions/compatibility/consumers, never inventing
   REST/SDK; A03's technical design may not change user-approved behavior for engineering convenience.
5. Each A05 batch first re-reads the valid requirements/UC, actual Git dirty state and consumers; after execution check both directions diff→requirement and requirement→code plus necessary
   regression. In A06 only really executed tests may be marked passed; insufficient permission keeps the block.
   - **Start-of-work baseline**: before the first A05 write batch, run the project's existing safe checks (actually existing tests/lint/type checks) within authorized scope and record the results as
     the baseline; when they cannot run safely record `unknown` and the reason.
   - New failures in A06 are classified per `bugfix-flow.md` `introduced-regression/pre-existing-exposed/unrelated-pre-existing/environment-or-test/causality-unverified`, never attributed by feel;
     before characterizing a defect or root cause apply that file's "Verify before characterizing"; unverified is marked only "inferred".
   - Existing defects found in A05/A06 are handled per `formal-review-and-findings.md` §7.5; those blocking the current feature go through A10 impact analysis, never silently expanding scope.
6. A07 separates public usage instructions from internal process reports; with an actual site when applicable call the Docs Site Gate; API `.http` is handled under independent off/suggest/generate
   authorization.
7. A08 without publish intent/permission is `N/A+reason`; A09 never pretends real user final acceptance; only delivery whose evidence matches the current version may be declared complete.

## Counterexamples that must be rejected

- A02 inventing "required REST" when no actual API exists; A03 changing public defaults without a user decision; A05 optimizing unapproved performance goals on its own; A06 passed without running;
  A08 automatic Git push; treating A10 as a mandatory last step; fast skipping a triggered specialist review.

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

**P1 Enter**

- P1-1 Verify the identities of current task/upstream real files: re-read the confirmed originals the current action depends on, checking applicable content, version/Hash and real approval source.
  (Basis: workspace-versioning-and-recovery.md "9.4 Minimal re-read set for handoff and recovery")
- P1-2 Verify confirmation/authorization: verify the currently valid delegation; CLI --full-auto, README, sub-Agents, old docs and long-term conventions do not raise permissions. (Basis:
  confirmation-authorization-and-change.md "Execute item by item when applicable")
- P1-3 Verify the site and prerequisites are valid: check the project's Git HEAD/dirty, actual files, tool results and pending external side effects. (Basis: workspace-versioning-and-recovery.md
  "9.4 Minimal re-read set for handoff and recovery")

**P2 Role**

- P2-1 Set the primary perspective, consumers and reverse quality perspective: also state the artifact's final real readers/implementation/maintenance consumers. (Basis:
  roles-and-specialist-review.md "Execute item by item when applicable")
- P2-2 Write what each checks: item by item role/viewpoint→source clause→check question→expected positive/negative→method/evidence→actual status; a role name itself is not a check result. (Basis:
  roles-and-specialist-review.md "Execute item by item when applicable")

**P3 Plan**

- P3-2 Form proportionate dynamic steps, artifacts, verification and rollback: the plan answers goal/basis, preconditions, step order, expected results, verification and completion conditions,
  stop/adjust conditions, proportionate to scale. (Basis: task-split-parallel-and-integration.md "Plan execution for phases and independent work items")
- P3-3 Verify actual results per that protocol before advancing dependents: first check the tool's real return, files/site and necessary failure exits, then advance steps depending on that result,
  never treating the plan's expected success as fact. (Basis: task-split-parallel-and-integration.md "Plan execution for phases and independent work items")

**P4 Generate**

- P4-1 Generate or update formal artifacts per Required/Conditional/Optional: first judge the type's Required, whether the task's Conditional hits and whether Optional has clear value, then organize
  the body dynamically. (Basis: artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation")
- P4-2 State reasons for non-applicable items: truly not applicable writes N/A+reason; present in the project but unverified records unverified, never treating no evidence as not applicable. (Basis:
  artifact-content-and-self-review-contract.md "Complete self-review and suggestion handling (REQ-003/006/007/043)")

**P5 SelfReview**

- P5-1 Run omission/reverse-evidence review: before submitting, at least one reverse re-check separate from generation, checking broken references, missing dimensions, linkage of all consumers and
  negative cases. (Basis: artifact-content-and-self-review-contract.md "Complete self-review and suggestion handling (REQ-003/006/007/043)")
- P5-2 May revise autonomously until convergence: claim convergence only when all applicable required content is complete, necessity is grounded, reverse omissions are handled and no unresolved
  blocks remain. (Basis: artifact-content-and-self-review-contract.md "Complete self-review and suggestion handling (REQ-003/006/007/043)")
- P5-3 Leave a self-review summary in the file: the summary states the self-review method, upstream basis, unverified scope, checked scope, revision diff, unresolved blocks, whether converged and
  the next legal action. (Basis: artifact-content-and-self-review-contract.md "7.2 Self-review trace in every formal process Markdown")

**P6 FormalReviewIfRequired**

- P6-1 First have a plan bound to the current object version, validly accepted per mode: the plan must freeze the reviewed object's real version/external SHA and approved upstream, writing check
  IDs, roles, positive/negative assertions and failure criteria. (Basis: formal-review-and-findings.md "Execute item by item when applicable")
- P6-2 Run the Finding loop per plan: dedupe Findings by root cause and close each with evidence; closed-verified only after verification meets the bar and necessary re-review. (Basis:
  formal-review-and-findings.md "Execute item by item when applicable")

**P7 Approval**

- P7-1 Confirm: real per-item human confirmation: partial confirmation states the exact sections/fields and whole-artifact-effective=no; when the object is not unique, a vague "ok" does not approve
  two items. (Basis: confirmation-authorization-and-change.md "Execute item by item when applicable")
- P7-2 Auto: only intermediate artifacts within authorization and with sufficient evidence are `auto-accepted`: task-level Auto needs the trusted current user's explicit task ID, allowed
  objects/operations, exclusions and scope/end point. (Basis: confirmation-authorization-and-change.md "Execute item by item when applicable")

**P8 Exit/Recovery**

- P8-1 Update phase evidence: record this phase by fields such as phaseId/applicability/roleChecklist/currentFacts/…/evidence/approval/blockers. (Basis: SKILL.md "1. Task and phase identity (fixed
  identities, not a fixed file count)")
- P8-3 Write the next action: state the next legal action in the formal artifact. (Basis: artifact-content-and-self-review-contract.md "Execute item by item when applicable")

---

### 5.2 Feature A01–A10: phase inputs, artifacts and key exits

| Phase | Purpose and input | Required results/applicable specialist review | Exit and return |
|---|---|---|---|
| A01 Requirements review | 00 task legally bound, goal and boundaries valid | Requirements review plan→acceptance per mode→review report→revision per actual Findings→valid 《已确认需求》; suggestions isolated | No unresolved product trade-offs or P0/P1 key blocks; otherwise stop A01 |
| A02 Usage Contract | Requirement baseline, current product call surface | Usage contract design plan, public install/input/output/exceptions/examples, contract review plan and report, final valid contract | User usage paths acceptable; on error return to A01/this phase |
| A03 Technical design | Current valid requirements, usage contract, actual source/dependencies | Full technical design, real key choices, interfaces and failure/recovery, technical review plan and report | The design is implementable with a verification route; hard conflicts return to A02/A01 |
| A04 Implementation plan | Confirmed technical design, project reality/dependencies | Work Items/batches/change scope/roles and risks/verification and `.http` applicability, implementation plan and specialist review | Batches executable and forbidden suggestions filtered; otherwise return upstream |
| A05 Development & code review | Valid batch scope and authorized writes | Actual code diff, necessary tests, development record, bidirectional requirement checks before and after implementation and code specialist review | Test/code Findings closed, unapproved diffs isolated; otherwise redo locally |
| A06 Real verification | Current integrated code, frozen verification plan | Applicable D/A/I/H live tests and evidence, conditional `.http`, failure regression; verification report | Required claims have passing evidence; untestable ones keep the block, never covering gaps with "all green" |
| A07 Delivery review (user acceptance eligibility) | Live-tested code consistent with the contract version | Public usage docs/examples, conditional Docs Site Quality Gate, delivery review and human final acceptance conditions | Technical readiness separated from real user final acceptance |
| A08 Publish only if authorized (when applicable) | The user really wants a release and the current host allows it | Version/package/publish/rollback records, confirming the real publish result | Not applicable writes `N/A + reason`; stop actual publishing when scope is missing or the host refuses; on failure/partial success per `confirmation-authorization-and-change.md` §5.5 read the site first, no blind retry; rollback first checks existing scope, and only truly new trade-offs go to the user |
| A09 Completion & feedback | Evidence of all required phases, product goal and actual consumers | Completion report, real delivery, unverified risks, suggestions/evolution candidate eligibility and hand-off | Never impersonate human final acceptance; ends task-level Auto |
| A10 Any-phase inserted change | Upstream, scope, code site or user goal changes at any time | Impact analysis, re-review of affected plans/contracts/verification, new valid approval | Resume only legal nodes, never silently reusing old versions |

The **design plan→formal specialist review plan→formal report→final object confirmation** responsibilities of A01/A02/A03 are independent; in simple tasks non-required auxiliary files may merge, but
the formal usage contract or full technical design may not be skipped. Optional `.http` files and doc site behavior still follow the user's established policy in `http-assisted-verification.md`
§12.3 and `docs-audience-and-site-quality.md` §12.2.

### 5.2.1 Step-by-step detail (for reading, re-read as needed)

**A01 Requirements review**

- A01-1 Write the requirements review plan: per the requirement-type Required, state external goals/interfaces, parameters, results/errors/boundaries and acceptable behavior; write only consumption
  surfaces that actually exist. (Basis: artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation")
- A01-2 Accept per mode: default Confirm, with a real person confirming the exact object item by item; auto-accepted may be recorded only within a valid task-level Auto delegation, never filling
  human-confirmed. (Basis: confirmation-authorization-and-change.md "Execute item by item when applicable")
- A01-3 Produce the review report: the report states the reviewed object and version, roles, dynamic checks, evidence, Findings and conclusion; acknowledging a report's facts does not mean the
  object passed. (Basis: artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation")
- A01-4 Revise per actual Findings: dedupe Findings by real root cause, revise within authorized not-yet-effective candidates and record the diff; closed-verified only after actual verification
  meets the original pass bar, necessary re-review and legal confirmation. (Basis: formal-review-and-findings.md "Execute item by item when applicable")
- A01-5 Form a valid 《已确认需求》: on taking effect record precisely TaskID/ArtifactID/Version/actual path/final SHA/approval source; the SHA is recorded only in the confirmation record outside the file.
  (Basis: confirmation-authorization-and-change.md "Execute item by item when applicable")
- A01-6 Isolate suggestions from existing behavior: optional improvements not affecting the original goal are marked suggested-unapproved/rejected/deferred and do not enter WIs, code or acceptance
  criteria. (Basis: artifact-content-and-self-review-contract.md "Complete self-review and suggestion handling (REQ-003/006/007/043)")

**A02 Usage Contract**

- A02-1 Write the usage contract design plan: the plan states how users install/configure/call, errors and boundaries, covering only actually existing API/CLI/UI/file consumption surfaces. (Basis:
  feature-flow.md "Execute item by item when applicable"; artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation")
- A02-2 Write public install/input/output/exceptions/examples: for each actual fieldPath check type/domain, required/conditional, default/absent/null/empty, cross-field constraints, success and
  errors, compatibility and consumers; without fields never invent REST. (Basis: artifact-content-and-self-review-contract.md "Execute item by item when applicable")
- A02-3 Contract review plan and report: first freeze the contract's current version/SHA, approved upstream and real consumers, then set a version-specific review plan (check IDs, roles,
  positive/negative assertions, failure criteria) and report per plan. (Basis: formal-review-and-findings.md "Execute item by item when applicable")
- A02-4 Form the final valid contract: on taking effect record precisely TaskID/ArtifactID/Version/actual path/final SHA/approval source; the SHA is recorded only in the confirmation record outside
  the file. (Basis: confirmation-authorization-and-change.md "Execute item by item when applicable")

**A03 Technical design**

- A03-1 Write the full technical design: external contract mapping, architecture, files/responsibilities, key implementation, exceptions and verification; add topics when
  database/concurrency/migration/security are really involved. (Basis: artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation")
- A03-2 Write real key choices: when key dependencies truly need adding/upgrading or the framework changes, check existing solutions, actual versions and first-party official docs, recording the
  choice/real version/basis/unverified items; not applicable records N/A+reason. (Basis: artifact-content-and-self-review-contract.md "Execute item by item when applicable")
- A03-3 Write interfaces and failure/recovery: scan by task facts each class of normal, exception, boundary, state, concurrency, compatibility, migration, security etc., writing for each its
  applicability and handling/verification responsibility or exclusion reason. (Basis: artifact-content-and-self-review-contract.md "Complete self-review and suggestion handling (REQ-003/006/007/043)")
- A03-4 Technical review plan and report: first freeze the technical design's current version/SHA, approved upstream and real consumers, then set a version-specific review plan (check IDs, roles,
  positive/negative assertions, failure criteria) and report per plan. (Basis: formal-review-and-findings.md "Execute item by item when applicable")

**A04 Implementation plan**

- A04-1 Set Work Items/batches/change scope: use the minimal dependency DAG to set each Work Item's input/output, reads/writes and side effects and shared consumers; batches state boundaries,
  dependencies, verification and rollback. (Basis: task-split-parallel-and-integration.md "Execute item by item when applicable"; artifact-content-and-self-review-contract.md "7.1 Artifact
  categories and Required/Conditional/Optional allocation")
- A04-2 Set roles and risks: state each batch's primary responsible perspective, reverse-risk perspective and final consumers. (Basis: roles-and-specialist-review.md "Execute item by item when
  applicable")
- A04-4 Write the implementation plan and specialist review: the plan answers goal/basis, preconditions, step order, expected results, verification and completion conditions, stop/adjust conditions,
  and gets an implementation plan specialist review. (Basis: task-split-parallel-and-integration.md "Plan execution for phases and independent work items")

**A05 Development & code review**

- A05-3 Write the actual code diff, necessary tests, development record: the development record states batch boundaries, the real diff, dependencies, verification and rollback. (Basis:
  artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation")
- A05-5 Code specialist review: per the frozen review plan re-read the source text per sub-condition, the corresponding behavior and consumers, positive/negative checks and actual evidence,
  reworking per Finding. (Basis: formal-review-and-findings.md "Execute item by item when applicable")

**A06 Real verification**

- A06-2 Conditional `.http`: `.http` generation, static parsing, actual requests and request assertions passed are recorded as four separate levels; actual requests are limited to environments the
  current task and host allow. (Basis: verification-and-evidence-routing.md "Execute item by item when applicable")
- A06-3 Failure regression: failures keep history, run parameters, rerun scope and stability conclusion, never erasing earlier real failures because of the last green. (Basis:
  verification-and-evidence-routing.md "Execute item by item when applicable")
- A06-5 Write the verification report: the report states actually run/not run, environment, expected and results, current consumers and limits. (Basis: artifact-content-and-self-review-contract.md
  "7.1 Artifact categories and Required/Conditional/Optional allocation")

**A07 Delivery review (user acceptance eligibility)**

- A07-3 Delivery review and human final acceptance conditions: when forming the delivery set, verify read-only working/staged/untracked/generated/ignored and check includedInDeliverable file by
  file; items needing real-person final acceptance are listed separately. (Basis: verification-and-evidence-routing.md "Execute item by item when applicable")

**A08 Publish only if authorized (when applicable)**

- A08-1 Write version/package/publish/rollback records: within authorized scope check read-only the file set of commit/package/publish candidates, recording version, package and rollback method.
  (Basis: workspace-versioning-and-recovery.md "Execute item by item when applicable")
- A08-2 Confirm the real publish result: after publishing query the current state of the target service/repository/artifact to confirm; when the response is unknown check the state first, never
  replaying the publish. (Basis: workspace-versioning-and-recovery.md "9.5 Preventing repeated operations and partial failure")

**A09 Completion & feedback**

- A09-2 Real delivery: the user can open and read the real delivered body; when the host cannot open files, give readable content and the real path in the conversation. (Basis:
  artifact-content-and-self-review-contract.md "Execute item by item when applicable")
- A09-3 Write unverified risks: checks not actually executed are marked unverified item by item, never written as N/A or passed. (Basis: verification-and-evidence-routing.md "Execute item by item
  when applicable")
- A09-4 Suggestions/evolution candidate eligibility and hand-off: the hand-off states version identity, decisions/diffs/blocks, trusted sources and next step; evolution candidates are registered
  only when the user has explicitly enabled the evolution mechanism. (Basis: artifact-content-and-self-review-contract.md "7.1 Artifact categories and Required/Conditional/Optional allocation";
  rule-evolution.md "Read conditions and responsibility")

**X1 Substantive change found**

- X1-2 Insert the A10 impact-analysis loop: record the change source, before/after versions and consumers, and which plans/proofs/approvals are invalidated. (Basis:
  confirmation-authorization-and-change.md "Execute item by item when applicable")

**X3 Impact analysis and re-review**

- X3-1 Do impact analysis: follow the direct/indirect dependency chain (formal artifacts→Work Items→source→consumers→tests/Docs/.http→delivery/publish) to find affected items, judging which
  reviews/approvals/tests remain valid and which must be invalidated. (Basis: confirmation-authorization-and-change.md "5.5 Phase errors, stopping and recovery")
- X3-2 Re-review affected plans/contracts/verification: do necessary re-review of plans/proofs/approvals judged invalid; unaffected existing evidence is reused with a stated reason. (Basis:
  confirmation-authorization-and-change.md "Execute item by item when applicable")

**X4 New valid approval**

- X4-1 Obtain new valid approval: re-request the exact object only for new formal objects, body SHA changes, needed human product trade-offs or substantive plan scope changes. (Basis:
  confirmation-authorization-and-change.md "Execute item by item when applicable")

**X5 Resume only legal nodes**

- X5-1 Resume only legal nodes: resume affected writes/formal acceptance only with legal conditions, otherwise read-only and gather evidence. (Basis: workspace-versioning-and-recovery.md "9.4
  Minimal re-read set for handoff and recovery")
- X5-2 Never silently reuse old versions: unaffected existing evidence may be reused with a stated reason, without globally indiscriminate re-approval. (Basis:
  confirmation-authorization-and-change.md "Execute item by item when applicable")

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

**R3 Execute per the Owner**

- R3-2 Route rejected final acceptance and follow-up issues on terminated tasks per that section: on receiving a rejection or a same-version new failure after a terminal state was recorded, first
  re-read the original valid requirements, then route per that section. (Basis: confirmation-authorization-and-change.md "5.5 Phase errors, stopping and recovery")

---

### 5.6 Depth projection of the three main flows and non-trimmable quality duties

Flow depth **defines no fourth main flow**; it acts only on the dynamic sub-steps, auxiliary records and review depth of `00` and each applicable A/B/DOC phase.
- The workflow plan must record: `phaseId` / `status(required|conditional|N/A+reason)` / `depth` / `roles` / `requiredArtifacts` / `optionalArtifacts` / `mandatoryGates` / `verifiers` / `evidence` /
  `nextAction`,
  which may be carried by existing Markdown tables without new machine state files (delegation config JSON and the validator are the exception, carrying only delegation settings, see
  `task-split-parallel-and-integration.md`; task state still has no machine state file).

| Task | Tier effect | Non-omittable items/counterexamples |
|---|---|---|
| Revising several README install instructions (Docs fast) | May organize goal/plan/revision/live-test records concisely, without empty API/database designs | Real install commands/links or corresponding navigation verification, self-review, applicable confirmation; no new site without one |
| A small non-public Bug (Bugfix fast) | May trim auxiliary design unrelated to the fix; re-check validity when reusing an existing plan | Pre-fix failure/hypothesis, minimal code diff, code review and necessary regression; never fake "reproduced" |
| Changing a payment API default (Feature fast) | Keep the user choice briefly shown, but risk gates rise to mandatory | Per-field public contract, consumers, errors/compatibility, funds/permission risk and real tests; cannot pass if it fails |
| Complex Docs site restructuring (Docs thorough) | Facts trigger information architecture, real user tasks and accessibility/site verification expansion | No automatic deploy/new site; simulated reader roles cannot pose as a real browser or user experiment |

**The approval contract is unaffected by depth**: triggered independent decision responsibilities such as the original A01/A02/A03, Bugfix root cause/verification, Docs readers/site and each formal
specialist review still need applicable approval; the number of files may shrink only when truly not applicable or when existing confirmed originals remain legally reusable. A10/B10/DOC10 are change
routes inserted at any phase and cannot be disabled by fast.

**Extra re-review performer (A01–A04)**: before the review plan or, without one, the artifact of A01–A04 is confirmed, ask who performs the extra independent re-review per
`re-review-performer-choice.md`.
