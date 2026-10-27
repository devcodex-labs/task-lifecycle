# docs-flow

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when the user's real intent makes README/SDK/API docs/an existing doc site/an internal maintenance manual the managed main goal.

**Sole primary responsibility**: the complete independent Docs workflow DOC01–DOC10; docs consistent with the actual API/user experience

**Direct consumers**: Docs DOC01–DOC10, Docs Site Gate, formal review, actual examples and audiences.

**Linked References**: `docs-audience-and-site-quality.md`, `artifact-content-and-self-review-contract.md`, `verification-and-evidence-routing.md`.

## Execute item by item when applicable

1. DOC01 identifies exact readers (first-time users, SDK integration, maintainers, internal)/public level/expected tasks; a pure read-only review enables only safe assistance, not automatic file
   changes.
2. DOC02 compares read-only against the actual source, packages, CLI/API, current README/docs/site/nav/links, forming a checkable inventory; unreadable objects are marked unverified separately.
3. DOC03 first defines the reader's first successful task, information architecture, navigation and Required/Conditional; never add nonexistent product capability in order to write docs.
4. DOC04 states the docs/navigation/examples/site really allowed to change, dependencies and verification permissions; DOC05 writes delivery docs only within the authorized scope, keeping internal
   approval logs outside the repository.
5. After the DOC06 plan is approved, professionally check real readers and facts, producing checkable Findings; DOC07 runs real browser/links/examples/necessary builds and reader-task evidence;
   `build passed` does not mean the task is done.
6. DOC08 publishes/migrates only when truly needed and permitted; DOC09 records the current delivery, each audience's verification scope and maintenance hand-off; DOC10 inserts changes at any phase,
   re-judging consumers/old evidence/approval invalidation.
7. For README-only tasks without a site, G-DOC site-specific steps are `N/A+reason`; **never create a website automatically**. When Docs work finds a product Bug/new API, form a separate managed
   candidate; never change business implementation without approval.
8. Usage instructions in docs promise only proven install/interfaces/compatibility; examples, historical pages or model guesses cannot replace real consumers.

## Counterexamples that must be rejected

- Internal Task/review logs entering the public Quick Start; a pure README revision automatically generating a site; claiming "user succeeded" without a browser; quietly changing source to make doc
  examples correct; treating a successful build as normal SDK calls.

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

### 5.4 Docs DOC01–DOC10: phase inputs, artifacts and key exits

| Phase | Purpose and input | Required results/applicable review | Exit and return |
|---|---|---|---|
| DOC01 Readers/goals | Real docs the user needs to edit/maintain and the public boundary | Doc target reader/type matrix, authorized scope, Docs task description | Review without editing switches to read-only assistance |
| DOC02 Fact inventory | Current README, docs, source/packages/site | Doc inventory, actual API/consumers/existing navigation, coverage evidence level | Without a deep read never claim full-text verification |
| DOC03 Content contract/information architecture | Valid readers and facts from DOC01/02 | Doc content contract, public/maintenance/internal boundary, navigation, reader tasks and success criteria | Never invent product APIs to improve docs |
| DOC04 Revision plan | Confirmed current paths and versions of the site/docs | Change list, source→page impact, necessary tests, permissions and rollback | Without an explicit write scope never change the site framework |
| DOC05 Revision | Legal implementation plan, project permissions | Delivery docs suited to users/maintainers/internal each; internal self-review logs stay in the external workspace | Never publish internal process docs to the user site |
| DOC06 Formal review | Real revised page/doc candidates | Check authenticity, information architecture, content and leaks per readers/maintainers/API consumers; review plan and Findings | Report accuracy and page object quality are two independent conclusions |
| DOC07 Real reader/site verification | Current pages, API examples and site preview | docs build, real browser navigation/links/user tasks/applicable auxiliary verifiers | `build passed` ≠ `user can complete the task`; when necessary E4 cannot be tested, block the corresponding delivery |
| DOC08 Conditional publish | Verified delivery and separate publish permission | Target site/migration/rollback/publish facts | N/A without a publish requirement; never deploy on your own; on publish failure/partial success per `confirmation-authorization-and-change.md` §5.5 first read the real site, no blind retry; rollback needs separate authorization; otherwise block and let the user decide (retry/rollback/return to an earlier phase/terminate) |
| DOC09 Handoff | Reader paths, final docs consistent with source version | Docs completion report, user/maintainer hand-off, residual risks, whyMissed and evolution candidate eligibility (only when evolution is enabled) | Real reader/user final acceptance may not be impersonated by AI |
| DOC10 Any-phase change (inserted) | Changes to readers, site structure, public scope, source | Affected re-review of doc content/plan/examples/browser verification | Return safely to a legal node without reviving old authorization |

DOC03/06/07/09 jointly consume the Docs Site Quality Gate of `docs-audience-and-site-quality.md` §12.2. With only a README and no site requirement, site-related items are `N/A + reason` by real
conditions; this contract does not build a new site by default. Product behavior changes must enter an approved Feature/Bugfix scope; Docs itself never gains new product write permission.

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
