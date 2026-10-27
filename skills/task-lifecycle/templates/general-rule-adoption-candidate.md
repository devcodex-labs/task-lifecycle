# general-rule-adoption-candidate — mandatory template

> **Mandatory resource**: candidates are saved by default as Markdown only in the candidate library `candidates/pending/` (under `candidates/` at the plugin source repository root, not in the skill
> directory), never automatically active, never effective through Auto/model self-review. Create one only with generalizable evidence; project-specific data/personal privacy may not be included.
> Small rules fill only 7 fields per item 5 of `../references/rule-evolution.md`.

| Field | Content |
|---|---|
| Candidate ID / Rule ID / Version / Proposed status | `{new candidate or upgrade of an existing rule; unique real identity; candidate}` |
| Review/Freeze Record Ref | `{task ID + external record filename + sha256; pending if not yet reviewed}` |
| Actual Finding IDs / Source Evidence | `{actual task/version/real source; or the trigger source (user correction/better plan/rejected acceptance/post-delivery defect/self-retraction/repeated change/stalled re-review) original text and verified root cause}` |
| `defectRootCause` / `whyMissed` / `controlFailure` | `{defect causes must be grounded; unknown miss causes are recorded as a complete unknown per the Finding owner, never passing unknown off as a proven general rule gap}` |
| Cross-task Generalization Qualification | `{why reusable across projects/tasks; real evidence separated from assumptions}` |
| Applicable Example A (distinct) | `{executable trigger, check and expectation; state it if hypothetical}` |
| Applicable Example B (distinct) | `{a reasonable situation different from A}` |
| Non-applicable Counterexample | `{which situation should not apply it, avoiding over-generalization}` |
| Entry/Match Conditions | `{task phase/project/risk/trigger, without user-private identifiers}` |
| Concrete Review Action / Failure Rule | `{steps later tasks can really check and the rejection result}` |
| Earlier Checkpoint / Introduction & Maintenance Cost | `{before which phase/action to move it forward, introduction/execution/maintenance cost and estimate basis; unknown if unobservable}` |
| Existing Rule/Reference Comparison | `{duplication/conflict/merge/replacement analysis}` |
| Scope & Privacy Exclusion | `{project-specific/credentials/sensitive output must be excluded}` |
| Verification Strategy & E4 | `{D/A/I/H method and whether really run; default unverified}` |
| Rollback/Retirement Plan | `{active/INDEX/history consistency, actual user permissions and consumers}` |
| Required Human Approval | `{pending per-item decision by the real user; never write confirmed by default}` |
| Current Status / Next Action | `candidate/not-eligible/blocked, with reasons` |

## File-level self-review (filled in for real)

Candidate bodies are kept in the candidate library `candidates/` (to absorb in `candidates/pending/`, absorbed in `candidates/archived/`, retired in `candidates/rejected/`; no candidates in the
`candidates/` root;
the installed plugin does not contain `candidates/`, candidates are maintained only in source repository checkouts); review, freeze, approval and verification records go to the external process
directory (the `<task-id>` directory), not the repository,
cited here by "task ID + record filename + sha256",
and are not read as workflow execution rules before real manual promotion. Re-check the forward checkpoint, cost, repeatable positive/negative acceptance and rollback per
`../references/rule-evolution.md`; if it cannot converge, it is not promoted.

`{applicable professional perspectives, complete sources and counterexamples, actual diff, unverified items and convergence judgment}`
