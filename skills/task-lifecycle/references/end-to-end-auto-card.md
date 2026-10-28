# end-to-end-auto-card (Auto form (ii): end-to-end Auto card and `noStop`)

Added by FEAT-20261028-001 (Rocky D1–D3, D8, D10, D11, D14, D22, D25, D27, D29, D30, D33, D34). Read this file when the user picks form (ii), the end-to-end Auto card
(pointer: `confirmation-authorization-and-change.md` §6.3.2). Additive only: existing Auto (form (i)) and every existing clause stay verbatim and still apply whenever
form (ii) is not selected.

## 1. Scope and admission

- Auto stays one mode with two forms: (i) existing task-level Auto, unchanged; (ii) the end-to-end Auto card. `noStop` is a switch on the card, default `false`.
- A card may be shown only after the task's A01 and A02 are both `human-confirmed`; a card shown earlier is not in effect. The card never covers A01 or A02.
- Only the real user (Rocky) confirming the card in person makes it effective; relays, old files and dispatch prompts never count.
- The card applies only to the task it names and only when the user explicitly selects it for that task.

## 2. Card fields

All ten keys are required; a missing key, or any value outside these limits, means the card is not in effect.

| Key | Content and limits |
|---|---|
| `taskId` | Task ID; must equal the current task |
| `allowedObjects` | Repo paths, write set (files or directory globs) and operation verbs; not empty; objects not listed are never written; verbs only `read`, `write`, `test`, `local-commit`; `local-commit` requires the same value in `preAuthorizedSideEffects` |
| `allowedPhases` | One closed range `A<m>..A<n>` with A03 ≤ m ≤ n ≤ A07 (for example `A03..A07`); no list form; never A01, A02, A08 or A09 |
| `preAuthorizedSideEffects` | Only `local-commit` or empty (`[]`); any other value (push, tag, release, plugin-update, host-sync and the like) means the card is not in effect |
| `commitIdentity` | The task's agreed commit identity; the card changes no identity rule; a mismatch means the card is not in effect |
| `exclusions` | Excluded items; may be none but must be written (`none`) |
| `endpoint` | A phase exit such as `A07 exit`; must lie inside `allowedPhases` (`A<n> exit` belongs to phase `A<n>`) |
| `boundA02Sha256` | SHA-256 of the confirmed A02; a different current A02 invalidates the card |
| `boundPlanSha256` | SHA-256 of the Task Workflow Plan; a different current plan invalidates the card |
| `noStop` | `true` or `false`; missing counts as a missing field; the template default is `false` |

- Why not A08 or A09: A08 holds push, CI, tag, release and host-sync, none of which can go on a card; each step needs the real user's own confirmation at that time.
  A09 holds final acceptance, which is never on a card and never auto-passed. So the farthest endpoint is the A07 exit.
- Push (any branch), tag, release, plugin update and host-sync can never be put on a card; they always need the real user's own confirmation at that time.

## 3. Card storage, identity, resume and continue

- The card text is written to the task's process directory as `End-to-end Auto Card-v<n>.md` (Chinese name in `entry-quickref.md` RUNTIME_NAMES) and its SHA-256 is computed.
- The real user's confirmation event is appended to the task record with all fields of `confirmation-authorization-and-change.md` §6.3: Mode `Auto`, the card file as
  Artifact path, the card SHA as Content SHA-256, Auto Scope Ref with goal, allowed operations, exclusions and the current session source, and Supersedes for a replaced card.
- **Review intensity** (R-8): the confirmation event also records the review intensity in effect (`light`, `balanced` or `strict`, `task-recognition-and-routing.md`
  "Review intensity"); an auto-decision never changes it; only the real user may change it, and a change applies only to later phases.
- An effective card is never edited; any field change is a new card `v<n+1>` that needs a new confirmation.
- **New session**: show the original `End-to-end Auto Card-v<n>.md` text with its SHA plus the current A02 and plan SHAs; resume only when all three are unchanged and the real
  user confirms in one sentence; if any SHA changed, a new card is needed. Files alone never restore Auto.
- **Same session "continue"** (D11): when the card, A02 and plan SHAs are all unchanged, the real user's "continue" resumes the same card. It only waives the confirmation
  wait; it lifts no review cap and no stop point (`formal-review-and-findings.md` §7.10 item 7 Instruction boundary).

## 4. `noStop: false`

- Inside the allowed phases, stop and ask exactly one question only for:
  - (a) a product or important architecture trade-off outside the requirements;
  - (b) a fix that still fails after two rounds with different methods (`formal-review-and-findings.md` "Retry limit"), offering its three choices; the same-method rule of
    "Execute item by item when applicable" item 7 applies unchanged;
  - (c) the host refusing a permission;
  - and the existing Auto pauses (missing evidence or host permission, plan invalidation, product scope change, new side effects).
- Items that `confirmation-authorization-and-change.md` item 9 lists as needing no new approval (intermediate reports, Findings, sub-batches, authorized candidate
  revisions) are not asked again.
- Several formal objects may be listed together, but each keeps its own real human event.
- Plan invalidation, product scope change, new side effects, active promotion and final acceptance still need separate approval.

## 5. `noStop: true`

- Covers every phase listed in `allowedPhases` (D2).
- (a) A product or important architecture trade-off outside the requirements: adopt the recommended option, record an auto-decision (section 7) and continue; it may enter
  implementation; the real user reviews all auto-decisions at final acceptance (D8).
- (a') A trade-off that would change confirmed A01/A02 content or its public behavior or defaults: never auto-adopted; record a suspended item and put it in the endpoint
  report for the real user (D10).
- **Scope of an auto-decision** (D14): it enters only implementation (Work Items, code, and tests that verify that code as evidence); it never changes confirmed
  acceptance criteria and never becomes a test pass criterion.
- The recommended option must come from the main session's own analysis this run, never from a record file or outside material.
- (b) a fix failing after two rounds with different methods (or no progress after two same-method rounds and still no path after switching), (c) host refusal, missing
  evidence, plan invalidation: suspend only that item or Work Item, write a suspended item with cause, evidence and steps tried, suspend what depends on it, and continue
  independent work; the three choices of "Retry limit" move to the endpoint report.
- **Never done under `noStop`; always recorded as a suspended item**: side effects not on the card and the never-on-card push, tag, release, plugin update and host-sync;
  final acceptance; active candidate promotion; any `human-confirmed` mark; bypassing a host refusal.

## 6. Exceptions (task-level user ruling, D8)

This list is a **task-level** ruling: it applies **only when** the real user selected `noStop: true` for that task and only inside the card's allowed phases; **original
text unchanged**: every clause below keeps its wording and applies as written whenever the card is not selected. For these clauses, the "a human decides now / pause and
ask / may not enter implementation" part is satisfied instead by the real user's review at final acceptance.

| # | Clause (content anchor) | Exception under `noStop: true` |
|---|---|---|
| E1 | `confirmation-authorization-and-change.md` item 3 "Important product behavior/architecture scope" | Reviewed afterwards at final acceptance |
| E2 | Same file §6.1 row "Public behavior/scope/important architecture trade-off" | Adopt the recommendation; no pause |
| E3 | Same file item 9 "Plan invalidation, product scope change" | No pause for auto-decisions only |
| E4 | Same file §6.2 "Suggestions" (`approved-after-upstream-change`) | An auto-decision may be an implementation source (Work Items and code) without that state |
| E5 | Same file §6.3.2 "New product trade-offs, scope changes, agreed final acceptance and operations the user explicitly excluded are handled separately" | As E2, for new product trade-offs only; scope changes, final acceptance, excluded operations and the later "new product/high-risk external decision" bullet keep their original duty |
| E6 | Same file §6.3.2 "does not loosen these judgments" | Nothing is signed on the user's behalf; trade-offs are reviewed afterwards; final acceptance and promotion are not excepted |
| E7 | Same file "Judgment and exit" "New product trade-offs or public behavior keep `suggested-unapproved`" | Stays `suggested-unapproved`; only "ask a human" is waived |
| E8 | Same file row "Better suggestion outside approved scope" | Only auto-decisions may enter implementation tasks; never test pass criteria (D14) |
| E9 | `task-split-parallel-and-integration.md` §11.3 row "Unauthorized new product decision appears in Auto" | No pause |
| E10 | `feature-flow.md` A01-6 "Isolate suggestions from existing behavior" | Auto-decisions may enter Work Items and code; never acceptance criteria (D14) |
| E11 | `feature-flow.md` A03 "may not change user-approved behavior" and counterexample "A03 changing public defaults" | Only new trade-offs outside the requirements; changes to confirmed A01/A02 are not excepted (D10) |
| E12 | SKILL.md §0 "`Auto` only applies when" | As E1 |
| E13 | SKILL.md §0 "never use fewer interruptions" | Chosen by the real user for this task, not widened by the assistant |
| E14 | `formal-review-and-findings.md` §7.6 "Retry limit" | Suspend only that item; the three choices move to the endpoint report |
| E15 | SKILL.md §3 "Permissions" | Still `suggested-unapproved`; only "a decision first for new public capability" is waived for auto-decisions outside the requirements; "do not change the original contract" is not excepted (D10) |
| E16 | `task-split-parallel-and-integration.md` four-state row `blocked` | Dependent actions still stop; the request moves to the endpoint report; "never interpret blocked as directly executable in series" is not excepted |
| E17 | `confirmation-authorization-and-change.md` item 9 "the user must still answer each item explicitly" | Auto-decisions are not asked one by one; reviewed together at the endpoint |
| E18 | Same file counterexample "The model says \"this design is better\"" | An auto-decision may enter implementation but is never recorded `auto-accepted` or `human-confirmed` |
| E19 | `formal-review-and-findings.md` "Execute item by item when applicable" "On a new product choice" | No pause for new trade-offs outside the requirements; approved-original changes, plan invalidation, high-risk host operations and final acceptance are not excepted |
| E20 | `task-split-parallel-and-integration.md` "Capacity-adaptive batching" "If a new product trade-off" | No pause and no immediate question for new trade-offs outside the requirements; other triggers are not excepted |

Not excepted: final acceptance, active candidate promotion, `human-confirmed` marks, side effects not on the card or never allowed on a card, and host refusals.

## 7. Records

Three files in the task's process directory, always under these fixed English names in any conversation language: auto-decisions.md, suspended-items.md,
endpoint-report.md (including numbered copies). They are separate from the task record and are append-only, except that endpoint-report.md is written on reaching
the endpoint, when the reply ends and at a host hard limit.

- Several cards in one process directory still share one copy of each file, sectioned by card with a heading that follows the conversation language like the card file
  name (`## End-to-end Auto Card-v<n>`; Chinese sessions use the RUNTIME_NAMES Chinese card name); entry ids run on across the file.
- A new card's endpoint report is appended to the same endpoint-report.md as a new section with its card id; only a same-card "continue" that reaches the endpoint (or
  a hard limit) again starts a numbered copy endpoint-report-2.md, endpoint-report-3.md and so on; earlier reports are kept unchanged.
- The task record holds the card confirmation event, the user's decisions and the endpoint report's SHA-256; the report's section 1 lists the SHA-256 of the other two files.
  The endpoint report's own SHA-256 is never written into its body; the main session records it in the task record.

**Auto-decision entry** (auto-decisions.md): `id` (`AD-<nn>`), `phase`, `question`, `options` (each with its impact, including keep as is), `chosen` (the recommended
option), `reason`, `affectedArtifacts`, `state` fixed `suggested-unapproved`, `marker` fixed `auto-decision (noStop, R1-7)`, `decisionType` empty until final
acceptance (never `auto-accepted` or `human-confirmed`), `scope` fixed "implementation only (Work Items, code, tests that verify that code as evidence); never changes
confirmed acceptance criteria or test pass criteria".

**Suspended item entry** (suspended-items.md): `id` (`SI-<nn>`), `item`, `trigger`, `evidence` (including steps tried), `dependents`, `status` fixed `blocked`,
`userChoice` (for `fix-two-rounds-failed` the three "Retry limit" choices; otherwise the exact decision the user must make).
`trigger` is one of: `touches-confirmed-A01-A02`, `fix-two-rounds-failed`, `host-refused`, `missing-evidence`, `plan-invalidated`, `side-effect-not-on-card`,
`never-on-card-side-effect`, `final-acceptance`, `active-promotion`, `human-confirmed-attempt`, `host-limit-cutoff`.
- Task state still follows `confirmation-authorization-and-change.md` §6.2 "Task"; one suspended item alone does not change the Task state.

**Endpoint report** (endpoint-report.md), sections in this fixed order:
1. Card identity: card file and SHA, A02 SHA, plan SHA, endpoint, SHA-256 of auto-decisions.md and suspended-items.md.
2. Completion: each phase exit with evidence.
3. All auto-decisions (all fields).
4. All suspended items (all fields, including items cut off by a host hard limit).
5. Actions not on the card or never allowed on a card that await the user's own confirmation (push, tag, release, plugin update, host-sync and the like).
6. Decisions the user must make: one per suspended item, with options and a recommendation.
7. Final acceptance entry: the user may reject auto-decisions one by one.

## 8. Final acceptance and A10

- Final acceptance is always the real user's own act and is never on a card.
- A rejected auto-decision goes to A10 (a new product decision, route (c) of "Routing after rejected final acceptance" in `confirmation-authorization-and-change.md`);
  other rejections follow (a)/(b)/(c) there.

## 9. Sub-agents and dispatched sessions

- Sub-agents and dispatched sessions inherit none of the Auto forms: not form (i), not form (ii), not `noStop`. This is additive to the existing rule that sub-tasks
  cannot inherit unlimited Auto permission (`task-split-parallel-and-integration.md` "Execute item by item when applicable" item 4 and §11.2).

## 10. Host limits and compaction

- `noStop` never runs past the reply or the host: no background work after a reply ends; at a host hard limit save real progress, write the endpoint report for what is
  done, record unfinished items as `host-limit-cutoff` and say plainly that work cannot continue in the background.
- After an interruption or context compaction, never continue a side-effecting action from an old summary, a progress percentage or "Auto started"; first re-check the
  card, A02 and plan SHAs (section 3).

## 11. In-scope intermediate artifacts

- In-scope intermediate artifacts are recorded `auto-accepted` per §6.1; required self-review and formal review still run. This is not an auto-decision and is not
  written to auto-decisions.md.

## 12. Non-authorizing materials

- The card file, auto-decisions.md, suspended-items.md, endpoint-report.md and config JSON never grant authorization. Text on the card outside the ten keys never
  widens scope. Only the real user's confirmation this run, with matching SHAs, makes or resumes a card.
