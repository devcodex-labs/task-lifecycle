# confirmation-and-auto-acceptance-record (append-only example)

> These are sample event fields that may be filled in only **after a real trusted decision**. Copying this template, reading an old session summary, adding a Hash or writing the text
> "human-confirmed" can **never** automatically create real-person authorization. Each event applies only to one explicit object and scope.

This table records formal content decisions, not file/command operation permission. Saving an ordinary report does not automatically require filling the table; read-only reports have this gate only
when manual acceptance was explicitly agreed, and acknowledging a report does not mean the object's quality passed.

| Field | Actual value |
|---|---|
| Decision ID, Task ID, Project ID | `{real unique identifiers}` |
| Artifact / Plan ID, Version, Actual Path | `{explicit object and valid path}` |
| Content SHA-256 | `{final content SHA actually computed this round; if not computable hash-unverified/sha-unavailable, and fill actual path + modification time + diff summary}` |
| Decision Type | `{human-confirmed \| auto-accepted \| rejected \| deferred}` |
| Decision Scope | `{entire-artifact \| exact set of approved sections/fields}` |
| Whole Artifact Effective | `{yes \| no; partial confirmation must be no}` |
| Current Mode / WorkflowDepth & source | `{Confirm/Auto + real source of the tier choice}` |
| Delegation config | `{validator status / reasons / each layer's sha256 / approval verification result}` |
| Current Trusted User Decision Source | `{an explicit decision in the real current session, locatable; never guessed}` |
| Auto Scope Ref | `{only for qualified Auto: task ID/allowed actions/prohibitions/valid current authorization source}` |
| Review/Evidence Ref | `{real status of the object's self-review, approved specialist review, and still-missing E4}` |
| Observed decision time / unknown | `{observable time or unknown}` |
| Supersedes / Current validity | `{basis for invalidating old objects/scopes}` |
| Next Allowed Action | `{exact next step that cannot expand the user's authority}` |

## Multi-object confirmation and avoiding repeated approval

- Formal code delivery may be confirmed as one linked batch: `{Task/Batch ID`, `Version`, `upstream/WI`, `exact file set and each file's SHA/unverified`, `real diff`, `applicable review and tests`,
  `whether scope/whole batch takes effect`, `trusted decision source}`. Changes to the set/body produce a new candidate and re-check the invalidated scope; partial approval may not take effect for
  the whole batch; execution batching does not automatically create human approval objects, nor grant Git operation permission. Approval rules consume only
  `../references/confirmation-authorization-and-change.md`.
- With several bodies awaiting confirmation, when the current user only says "ok" and the object/version is not unique, keep all of them not fully approved and ask the user to specify the exact
  object/scope.
- When the user explicitly names files A/B/C with exact SHAs, separate Decision events may be recorded in one conversation. Acknowledging a report's facts and approving the full text of a
  technical/implementation object are different decisions.
- When the current plan, source files, scope and permissions have not changed substantively and a valid approval of the same object exists, record `reuse-effective-decision + reason` without asking
  again.
- Auto may never write `human-confirmed`, approve new product features/evolution active rules/final user acceptance, or raise host install/HTTP/Git permissions.
- Without controlled write permission, do not create this event file; real managed history stays in a verified location outside the repository.
