# formal-artifact-record (template, not an executed record)

> Add or remove sections dynamically by the actual task, keeping the required content, real consumers, reviews and permissions actually triggered; `{to fill}` in this template never represents a
> confirmed fact. Fill `N/A + reason` for non-applicable items and `unverified` for unexecuted ones. Compute the real SHA-256 in the external confirmation record after the file content is complete;
> **do not** write the file's own Hash in this file.

## Artifact identity and facts

| Meaning | Current value to fill |
|---|---|
| Task ID / Project ID / Task Type / Phase | `{real task}` / `{real project}` / `{Feature\|Bugfix\|Docs\|restricted read-only}` / `{00 or A/B/DOC phase; read-only Tasks use RO01 prepare/RO02 execute/RO03 deliver}` |
| Artifact ID / Version / Actual Path | `{independent identity}` / `{this candidate version}` / `{actual real path}` |
| Source and validity | `{per item the currently approved source document ID/version/trusted approval source and necessary clauses}` |
| Current Goal / Non-goal | `{current goal}` / `{confirmed non-goals}` |
| Mode / Depth / Selected Source | `{Confirm\|explicit Auto and delegation scope}` / `{valid user choice}` / `{real source}` |
| Authorizations / Prohibitions | `{current legal permissions}` / `{forbidden operations and reasons}` |
| Intended Readers / Actual Consumers | `{readers and real consumers; unobservable writes unknown}` |
| Relevant Files/Versions & Dirty | `{actually checked/unknown, never invented}` |

## Applicable content responsibilities

Saving an ordinary report does not use this template and invents no Task/Phase/formal acceptance. A read-only Task records the requested scope, the evidence its conclusions need, delivery through
the agreed channel and whether required items are complete; when all four are met it may complete per routing §4.3.
If manual acceptance of the report was explicitly agreed, the report is pending-gate and the Task active; open object P1/Findings and unrequested E4 do not automatically block delivery of a
read-only report. Failing to save when saving was required means not delivered; never write all complete.

| Professional duty ID / applicability | Classification Required/Conditional/Optional/N/A+reason | Positive content and real consumers | Failure/rejection counterexamples | Verifier/evidence ceiling |
|---|---|---|---|---|
| `{valid duty}` | `{legal classification}` | `{real requirement and consumers}` | `{what must be rejected}` | `{D/A/I/H and E1-E4}` |

## Body (organized dynamically)

`{generate per this artifact type's real duties; do not copy empty tables}`

## File-level AI self-review (filled in after the current author really executes it)

- At least one separate reverse re-check after generation: `{real method/time`; `historically broken references, missing dimensions, all changed consumers, negative cases overturning conclusions`;
  `the same AI may not write independent Reviewer}`
- Dynamic scenario applicability:
  `{normal/exception/boundary/state/concurrency/isolation/compatibility/migration/performance/security/integration/counterexamples/misoperation/midway change`,
  `each with handling, verification or exclusion reason`; `separate "not in project" from "present but unverified"}`
- Necessity and over-design check: `{approved source/real scenario of each applicable required item; whether redundant or extra product behavior was isolated}`
- Finding classification and per-item handling: `{in-scope ordinary issues fixed and re-checked` / `non-blocking optional suggestions` /
  `local blocks for product conflicts, missing required evidence or unauthorized risks; ID/status/evidence}`
- Self-review method and identity: `{same-context reverse review / actual independent Reviewer / static script, honestly}`
- Valid sources, versions, actual consumers and positive/negative facts checked: `{real list}`
- Actual findings, revision diff, controlFailure/whyMissed: `{actual evidence or none+reason}`
- Unresolved conditions, items/permissions to verify: `{concrete blocks; never fake passed}`
- Convergence judgment: `{candidate self-review meets the bar / blocked+evidence}`; protected human confirmation/specialist review go through separate gates.
- Next legal action: `{real concrete action/permission needed first}`

## Suggestions related to the current candidate version (optional)

`{if any, mark suggested-unapproved, stating reasonableness/necessity/benefit/cost/risk/keeping the status quo`; `never quietly fold them into approved requirements of the body}`
