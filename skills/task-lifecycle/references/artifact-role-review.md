# artifact-role-review

## Scope and entry

When presenting a key artifact for content confirmation, include **Review by role, then return for my confirmation** (localized through `entry-quickref.md` LABELS).
The other actions are confirm the current version, when eligible, and request changes. Apply the existing single-question, recommendation and decision-identity rules.

Key artifacts include both kickoff files (Task Description and Task Workflow Plan) in every managed flow; requirements, Usage Contract, technical/fix designs,
implementation/revision plans, content contracts/information architecture, and user-facing delivery documentation awaiting content confirmation.
Routine logs, confirmation records and review reports do not acquire this action or a new acceptance gate merely because they are files.
Required self-review and formal review still precede content acceptance; this optional action never makes a required check optional.

Show the artifact's actual path/version, review coverage already available, proposed perspectives/checks and actual execution method with the action.
Recommend it when meaningful gaps or risks need checking; with sufficient valid coverage, recommend confirming an eligible version and explain the existing evidence.
Do not ask a separate question just to advertise the action. Multiple pending artifacts retain separate content decisions; an explicitly selected set may share a review.

## Selection and execution

1. Bind the trusted selection to the exact artifact IDs, paths, versions/fingerprints and displayed review scope. Record it as a **review request**, not a content decision.
   Leave each pending artifact `pending-gate` and `whole-artifact-effective=no`. Selecting the action, passing review or acknowledging its report never records
   `human-confirmed` or `auto-accepted`, and never advances the dependent phase. The explicit request to return for confirmation also holds the selected objects under Auto,
   including `noStop`; it narrows those objects' scope without changing the task-wide mode. Other valid, unaffected decisions remain effective.
2. Choose perspectives by real consumers and risks, using `roles-and-specialist-review.md`. Usually two or three suffice; add security, migration or other checks only when
   triggered. State check IDs, source clauses, positive/negative criteria and evidence. Reuse an applicable approved review plan. The selection authorizes the displayed
   bounded role check; it does not approve an undisclosed formal plan. When a required formal plan has no valid approval, resolve that existing gate first.
   An ordinary same-context role check, including at kickoff, does not itself create another formal review-plan approval gate.
3. Roles select questions; executors select who performs them. Reuse the applicable valid performer choice and current host authorization. Without a selected executor or
   an independently required reviewer, use the current assistant and label **same-context role review; no independent reviewer**. Do not invent people or sessions.
   Selecting this action alone never enables external delegation, creates a session per role, raises review intensity or starts the relay.
   Keep any independently required reviewer and its admission rules. The extra-review performer card remains scoped by `re-review-performer-choice.md`;
   this action covers kickoff without extending that card's mandatory scope. Human-only performer choices stay human-only unless the user changes them.
4. Before running any check or dispatch, inspect existing evidence by the reuse rules below. Run only the missing or invalidated checks within authorized scope.
   Verify Findings and consolidate duplicate causes. Fix a candidate only within existing write authorization, show the resulting diff and re-check affected conditions.
   A request to review alone does not grant target-edit permission. New product choices remain proposals for the user.
5. Deliver one consolidated result for the selected scope, with per-role coverage, evidence, Findings/impact/recommendations, reused and new checks, execution method and
   unverified items. In a managed task, persist new review results in its resolved external review directory under `.task-lifecycle/<project>/<task>/`,
   link the result and current candidate files, and record the request/outcome in existing task records. A pure reuse result may link the existing report without rewriting it.
   If required saving fails, state the missing delivery; a chat summary is not a saved report. Do not create one report per role or demand report approval by default.
6. Return to the same artifact-confirmation point with the exact current versions and remaining issues. Keep confirmation separate for every selected file.
   At kickoff, both files must take effect before requirements review (A01), defect analysis (B01), or readers/goals (DOC01) begins.
   A role check of the kickoff files is not the later requirements-review phase. Usage Contract (A02) work still waits for valid confirmed requirements and allowed scope.
   Before recording a later content confirmation, re-read the candidate and verify that the decision still matches its current bytes and reviewed scope.

## Reuse before execution

- Compare Task/Artifact identity, actual path (or a verified relocation), version/fingerprint, upstream/source versions, relevant project/consumer facts,
  covered check IDs/criteria, review method/independence and readable evidence. A report title, role name or a previous pass alone is insufficient.
- When those premises are unchanged and the requested checks are covered to the required evidence level, reuse the result: **zero new review runs** and no reviewer dispatch.
  Preserve open Findings and limitations. A repeated selection asks for the same review service; it does not explicitly request another full round.
- For a changed artifact, upstream, consumer fact or requested perspective, identify the affected checks and direct consumers. Reuse the unaffected evidence with reasons;
  run a delta check for the changed scope and only supplement uncovered checks. Record old/new fingerprints outside artifact bodies, the invalidation reason and actual work.
  A changed body never inherits whole-artifact approval or a blanket pass from the old report. Missing/unreadable evidence is an uncovered check, not a successful reuse.
- Count an applicable role check toward the existing review obligation when scope, method and evidence meet it, rather than scheduling it again under another name.
  Same-context evidence cannot satisfy an independent-review requirement. Keep `formal-review-and-findings.md` review caps, required verification and §7.12 delta rules;
  only an explicit request for a fresh full review invokes its full-round exception. Report reuse and supplemental checks still leave the artifact awaiting confirmation.

## Perspective examples

| Artifact | Useful perspectives | Concrete concerns |
|---|---|---|
| Task Description | Product, actual user, tester | Source fidelity, goal, scope and observable acceptance |
| Task Workflow Plan | Process owner, implementer, tester | Dependencies, phase order, confirmation stops, verification and delivery paths |
| Requirements / Usage Contract | Product, consumer, tester | Behavior, boundaries, errors and acceptance consistency |
| Technical / fix design | Architect, implementer, tester | Implementability, compatibility, failure recovery and regression |
| Implementation / revision plan | Developer, tester, maintainer | Dependencies, omissions, executable work and delivery checks |
| Content contract / user documentation | New reader, actual consumer, maintainer | Information structure, factual accuracy and completing real user tasks |

These are starting points, not fixed staffing or a mandatory number of roles. Reuse matching check IDs across perspectives instead of repeating the same work.
