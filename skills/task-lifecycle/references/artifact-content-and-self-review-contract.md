# artifact-content-and-self-review-contract

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, an actual run record or an extra API. Its root basis is the user-approved development requirements V0.18-R2,
> Usage Contract V0.5-R2 and technical design R9-R2.
> It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: whenever any formal document candidate is generated/changed/reviewed/delivered, a version is confirmed, or an external consumer needs a readable artifact.

**Sole responsibility**: dynamic Required/Conditional/Optional, file-level self-review of formal Markdown and the content contract; classification of temporary evidence

**Direct consumers**: all formal Markdown, phase/artifact consumers, confirmation records, public delivery.

**Linked references**: `formal-review-and-findings.md` manages formal plans/reports, `confirmation-authorization-and-change.md` owns approvals, `../templates/formal-artifact-record.md` (**resolved
from this reference's directory**) is a format example only.

## Execute item by item when applicable

1. Confirm artifact type, user readers, task goal, currently valid upstream, applicable professional quality/approvals and final consumers; distinguish Required/Conditional/Optional/N/A+reason.
   Principle: **required content complete, layout decided dynamically per task**.
2. Formal Markdown minimally states Task/Artifact ID, independent version, fact/approval sources, scope, professional consumers, body, actual self-review method and issues/revisions,
   unverified/blocked items, next legal action; it may not lack a triggered independent approval object or usage contract.
3. After actually writing, run role/consumer/positive-and-negative checks on the current **full body**, autonomously fix factual errors in an authorized candidate recording the diff and whyMissed,
   then self-review to convergence backed by substantive evidence or a public block; do not generate reports endlessly.
4. The in-file self-review summary must point to the current version and state who reviewed (same AI/truly independent/static script), what it covers, the evidence ceiling and open items; formal
   review has its own real review target and approved plan and cannot be replaced by self-review.
5. When computable, compute the SHA of the **final file bytes** (when not computable, use path + mtime + diff summary as identity per item 6 of "Execute item by item when applicable" in
   `confirmation-authorization-and-change.md`) and put it only in an out-of-file version/confirmation record, never writing its own SHA back into the body.
   Each legal revision produces a new candidate version with a computed diff, never overwriting a signed original.
6. Raw logs, investigation drafts, temporary scripts and tool output are temporary evidence by default and do not become formal pending items by being converted to Markdown/cited by a report; only
   when the user or an approved plan explicitly requires an independent formal artifact, generate a candidate and perform review/confirmation.
7. Public README/API contains only practical user content, never internal approval records or task process; the user can open/read the real candidate body; if the host cannot open files, give
   readable content and the real path in chat, inventing no UI.
   For a Grok Bot host, the reading view is in the file-delivery sub-item of `verification-and-evidence-routing.md` §10.5 "Separating real progress, acceptance tracking and evidence levels".
8. When a field contract applies, check each actual fieldPath for type/domain, required/conditional, default/absent/null/empty, cross-field constraints, success and error,
   security/compatibility/consumers; with no fields, do not fabricate a database/REST.
9. **ABS-08/AC-107 conditional fact check of technology choices**: when this batch truly needs to add/upgrade a key dependency, change framework, or introduce an important SDK/platform API/host
   capability, first record from the current real project the existing solution, lockfile/installed version/runtime version, real consumers and necessity,
   then verify through permitted available channels the **first-party official docs, API usage, support matrix and lifecycle/side effects for the actual version**;
   - compare existing capability without the dependency, compatibility risk and rollback route.
   - Record `choice/real version/first-party basis and check date/current install and actually callable evidence/existing alternatives/affected compatibility/decision source/still unverified items`.
   - Without legal network/source or unable to prove official support, record `unverified` and pause writes/delivery depending on that claim; never claim availability from a library name, model
     knowledge, mocks or third-party articles.
     **Not every task must go online, nor does this permit installing or changing technology choices the user did not approve**; when not applicable record `N/A+reason`; better but unapproved
     options stay in the suggestion area.

## Counterexamples that must be rejected

- Self-assessing no gaps after checking only headings and template fields; treating "confirmed" attached in a draft as human approval; asking human approval for each of 30 temporary logs; keeping
  the old SHA after changes; public docs containing internal model review logs;
  same-model self-review called an independent expert; approving a key SDK choice from a library name, mocks, an outdated blog or an unknown local version.



## Complete self-review and suggestion handling (REQ-003/006/007/043)

Before submitting a formal candidate, perform at least one **reverse re-check separate from the generation step**; with an authorized independent Reviewer use its real evidence, otherwise the same
AI re-reads the full candidate after writing, explicitly labeled as same-context reverse review.
Check one by one: residual historical versions/stale references, missed applicable professional dimensions, whether all consumers of this change were updated, whether negative cases that could
overturn the conclusion hold. Record actual method, scope, findings, diffs and unverified items; role switching or recomputing a hash is not independent review.

Scan by task facts: normal, abnormal, boundary, state, concurrency, isolation, compatibility, migration, performance, security, integration, counterexamples, misoperation and mid-course change. For
each, write applicability and handling/check/verification responsibility or a concrete exclusion reason;
similar duties may be merged in one short table; never invent scenarios for nonexistent usage surfaces. When the project truly does not exist and the item depends on it, `N/A+reason`; when it exists
but is inaccessible or not yet verified, record `unverified` with impact and whether it blocks; absence of evidence is not inapplicability.

Self-review also judges whether content is necessary for the approved goal, over-designed, or fits real usage. Only when all applicable required content and triggered conditions are complete,
necessity is grounded, reverse omissions are handled, no blocks are pending, and status and evidence are consistent may the candidate self-review be called converged;
optional suggestions need not all be adopted. Each finding records ID, original fact/version, category, handling/status and evidence:

| Category | Legal handling and exit |
|---|---|
| Ordinary engineering/factual issues within approved scope that can be fixed autonomously | Revise the not-yet-effective candidate within existing write permission, record the diff and re-check; an effective original gets a new version. Real closure still consumes formal Finding and verification gates |
| Optional improvements not affecting the original goal | Isolate as `suggested-unapproved/rejected/deferred`; they enter no WI, code or acceptance criteria and block no unrelated legal work |
| Product/upstream conflict, missing required evidence, major risk or unauthorized operation | State the affected gate and the minimal pending question, pause only the dependent part, hand to the real user to decide or add evidence; Auto may not approve on their behalf |

Minimum recommendation information: the real problem and evidence, necessity/reasonableness, basis for required vs optional, recommended option and alternatives (including keep as is), each one's
benefits/drawbacks/risks, time and adoption/maintenance cost, upstream/downstream/consumer impact,
consequence of not adopting and the exact pending decision, plus priority (High/Medium/Low) with reason.
- Bugs/suggestions listed item by item in a report must also state verification status (E4 tested/E3 static/unverified, with evidence) and compare at least two feasible options with rejection
  reasons; if truly only one reasonable option exists, state why.
- Conversational answers (light and managed turns alike, not depending on the trigger sentence under this file's "Read conditions and responsibility"): when the user this turn asks which option to
  choose or whether to do something (an intent, in any language),
  about delegation (whether to dispatch, to whom), verification practice (means of verification, whether to test for real), task routing (which flow or `workflowDepth`), the §7.10 item 7
  small-rule/major-change split, or permission practices such as approval/allow/sandbox (the parentheses only delimit the object,
  they are not trigger words), the answer body after the pre-check gives two feasible practices (one being keep as is when a current practice exists), one sentence of trade-off each, plus a
  recommendation and one sentence of reason;
  when hard rules leave only one legal practice or only one reasonable practice truly exists, write that practice and the single-practice reason, without a second trade-off. This item constrains
  only the answer body: the pre-check, progress card and `workflowDepth` display themselves need not give two practices,
  and it does not change hit detection. Not applicable when the user already named the practice and asks only for steps, or the original text asks only for the conclusion; when SKILL.md §3
  "Disambiguate first" asks only the referent and nothing can be ranked, the exception in the
  "Pending decisions must carry a recommendation" item of `confirmation-authorization-and-change.md` applies; with ranking, that exception does not apply; report Bugs/suggestions follow the previous
  item.
  The full minimum recommendation fields of this section and the previous item's verification status and rejection reasons are not required; a recommendation is not approval and this item adds no
  stop point; when the reply must anyway ask the user to decide, this two-practice format yields and the pending decision still follows the full
  "Pending decisions must carry a recommendation" item of `confirmation-authorization-and-change.md`. Rejection: fewer than two feasible practices without falling under "hard rules leave only one
  legal practice or only one reasonable practice truly exists";
  falling under that exception without a single-practice reason; two practices written but missing any trade-off, the recommendation or its reason.
- Unobservable cost is marked `unknown` with the estimation basis, inventing no number; until a suggestion is legally adopted, do not widen the original scope. Use the suggestion area of
  `../templates/verification-and-suggestion-isolation-record.md`; for substantive change first update upstream per `confirmation-authorization-and-change.md`.
- **List same-kind libraries and test them before adding a runtime dependency** (CAND-20261026-017): before adding a dependency loaded by the production program or bundled into a runtime artifact,
  first search the package manifest and lockfile and list installed libraries of the same format family or protocol (if empty, attach the search command and result);
  if non-empty, test each library with this requirement's real input and attach output; only citing docs or marking an inference does not count; without execution permission mark unverified and hold
  off writing the dependency. Write the result into the design, adding no stop point.
  Rejection: missing list, missing test, or writing the dependency while unverified.

## Specific constraints of the approved technical baseline (re-read as needed)

The following are excerpts of **normative design constraints** from the approved technical design; old version labels in headings do not mean this project passed real tests. Consume them per the
current real task, authorization and triggers; if they disagree with this file's summary, the approved technical baseline prevails, without automatically widening scope.

### 7.1 Artifact categories and Required/Conditional/Optional allocation

| Type | Required (minimum professional answer) | Conditionally triggered additions | Must not be required mechanically |
|---|---|---|---|
| Task description/workflow | Real goal, type/scope, phases/dependencies, applicable gates, legal next step | Work Items/parallel dependencies for complex tasks | Fixing every sub-step; meaningless all-scenario sections |
| Requirements/Usage Contract | External goal/interface, parameters, results/errors/boundaries, acceptable behavior | Actual API/CLI/UI/file consumption surfaces | Forcing REST when there is none |
| Full technical design | External contract mapping, architecture, files/responsibilities, key implementation, exceptions and verification | Topics for database/concurrency/migration/security when really involved | Inventing an independent runtime or service |
| Implementation plan/dev record | Batches and clear boundaries, real diff, dependencies, verification and rollback | Parallel isolation, migration, .http helper assets | Approving each function separately |
| Review plan/report | Object and version, roles, dynamic checks, evidence, Findings and conclusion | Specialist domains/high risk/testing needs | Fixed 100 tests from one template |
| Verification/delivery report | Actually run/not run, environment, expected and result, current consumers and limits | Docs site/.http/Agent Eval | "Execution failed but imagined to pass" |
| Docs content contract/maintenance docs | Readers, purpose, fact sources, navigation/usage tasks, maintenance update triggers | Real browser paths of an existing site, internal interface consumers | Building a site uninvited for a pure README task |
| Confirmation, revision and handoff records | Version identity, decisions/diffs/blocks, trusted source and next step | Partial confirmation, cross-session/old evidence invalidation | Forging human decisions via editable records |

Each time first judge the type's Required, whether the task's Conditional hits, whether Optional has clear value, then organize the body dynamically; non-required auxiliary results may be merged
into existing formal files, but a usage contract or review-approval duty with independent legal/product effect may not be merged away.

**Flowchart sub-step detail**: every .md artifact that contains a flowchart (docs, plans/proposals, specs, implementation plans) gives each flow node numbered sub-steps, and each sub-step has a
detailed description stating what is done, inputs, outputs, and when it stops or branches, with Basis when one exists; format follows feature-flow.md §5.2.1:
"<node>-<n> <action>: <detail> (Basis: …)". This applies only to newly written or modified content; existing .md files are not retrofitted unless the user names one.
Reason: Pages can only show the step detail the .md states, and retrofitting every old file is not requested.
Clarification of the "Task description/workflow" row (meaning unchanged): "Fixing every sub-step" there concerns planning task-workflow sub-steps, which stay dynamic per project facts; the
flowchart sub-step rule above only requires each sub-step that is written to carry a description. Reason: the two rules govern different objects.

**Classification exit for temporary materials vs formal artifacts**: raw test logs, one-off investigation drafts, tool output and staged analysis files are by default citable **temporary materials
or evidence**, which may record the real source, generation time/actual version and citation location;
- ordinary read-only reports and their saving also do not automatically become a formal Task/plan or independent approval object; first judge tracking, saving and explicit report acceptance
  requirements per routing §4.3. A failed required file delivery must still be stated; ordinary/formal classification may not hide missing items.
- Merely producing Markdown, placing it in `临时/` or being cited by a formal report **does not automatically make it a formal artifact needing separate AI formal self-review and Confirm human
  approval/Auto automatic acceptance**.
- Only when an approved task plan or a real user decision requires organizing it into an independent formal report/conclusion, generate a new candidate per the actual artifact type and run the
  applicable self-review and approval; original sources stay reviewable, and renaming, moving directories or copying summaries may not pass it off as approved.
  Counterexample: listing 30 test logs and temporary drafts each as an independent pending file must be rejected; but a body already identified as a formal review report must still pass its original
  quality and confirmation gates.

---

### 7.2 Self-review trace in every formal process Markdown

Self-review must be readable in the file itself and match the current version. Minimum: self-review method (independent/same-context reverse check/script/real tool), valid upstream basis, actual
project facts and unverified scope, applicable roles/check scope, summary of issues found/revision diffs, unresolved blocks,
optional suggestions awaiting decision, whether converged/why not, next legal action. Full itemized history may cite `审查/`/`修订/`; public README/API docs should not carry internal self-review logs;
public artifacts have their review evidence carried by external process records.
**Flowchart sub-step check**: in self-review and formal review of a .md with a flowchart, any sub-step lacking a detailed description is a Finding; it must be filled in the .md before a Page is
generated, and the Page never invents the missing content. Reason: missing detail is fixed at the source of truth, not on the reading copy.

**Evidence layering**: a model playing tester ≠ a real user experiment; an independent Reviewer needs real host support and an independent record; symmetric static numbering/matrix relations ≠
verified professional semantics and real consumers. Every artifact must let a reviewer state that "not applicable" differs from "unverified".

---

### 7.7 Conditional field-level contract review protocol (adopted quality refinement)

The sole Owner of this section's body is [formal-review-and-findings §7.7](formal-review-and-findings.md#77-conditional-field-level-contract-review-protocol-adopted-quality-refinement); re-read its
**full body** before execution; never fabricate or
loosen from this section's title.

---

### 7.8 Review coverage and evidence strength statement

The sole Owner of this section's body is [formal-review-and-findings §7.8](formal-review-and-findings.md#78-review-coverage-and-evidence-strength-statement); re-read its **full body** before
execution; never fabricate or loosen from
this section's title.
