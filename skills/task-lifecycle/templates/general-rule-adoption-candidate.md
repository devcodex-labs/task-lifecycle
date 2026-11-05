# general-rule-adoption-candidate — mandatory template

> **Mandatory resource**: select the candidate store by `ruleDomain` under `../references/rule-evolution.md` "Rule domains and storage"; write only its `pending/`, never an installed Skill.
> Candidates are never automatically active or effective through Auto/model self-review. Create one only with generalizable evidence; project-specific data/personal privacy may not be included.
> Small rules abbreviate content to 7 fields per item 5 of that reference; exact domain/root/version/hash/applicability and decision purpose still require verification.

| Field | Content |
|---|---|
| Candidate ID / Rule ID / Version / Proposed status | `{new candidate or upgrade of an existing rule; unique real identity; candidate}` |
| ruleDomain / ownerRoot / contentHash | `{workspace-extension or plugin-maintenance; verified physical root; cite the external frozen-body hash record, never a self-hash}` |
| Applicable projects / trigger / exclusions | `{selected Project IDs and task/phase bounds; shared storage does not imply global applicability}` |
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
| Verification Strategy / evidence kind / E4 scope | `{static, isolated-trial, actual-use; D/A/I/H and actual run evidence; unrun remains unverified; a trial is not production E4}` |
| Trial proposal / trialApprovalRef | `{optional isolated target, allowed actions, termination boundary and actual user source; pending unless authorized; no adoption implied}` |
| Rollback/Retirement Plan | `{active/INDEX/history consistency, actual user permissions and consumers}` |
| Required Human Approval / adoptionApprovalRef | `{pending exact identity, version/hash, applicability and action; trial/edit/report approval is not adoption; never confirmed by default}` |
| Current Status / Next Action | `candidate/not-eligible/blocked, with reasons` |

## File-level self-review (filled in for real)

Workspace-extension bodies use verified external `.task-lifecycle/candidates/`; plugin-maintenance bodies use the source checkout's `candidates/`. Both use pending/archived/rejected and lists,
never an installed plugin. Workspace adoption closes against its real adoption event and active/history read-back, not a plugin commit or tag. Review/freeze/approval/verification records remain
in the external producing task directory, cited by "task ID + record filename + sha256" and never moved with candidates. Trial loading is permitted only by its exact bounded authorization;
ordinary workflows consume only legally adopted active rules. Re-check checkpoint, cost, positive/negative acceptance, identity and rollback per `../references/rule-evolution.md`.

`{applicable professional perspectives, complete sources and counterexamples, actual diff, unverified items and convergence judgment}`
