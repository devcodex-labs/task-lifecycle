# relay-review-verifier-prompt — fixed template

> Basis: `../references/formal-review-and-findings.md` §7.10. Used for the last step of a serial round: after the second leg submits and the coordinator records the sha, call a new seat-A session;
> it only verifies the second leg's new issues and its dissents and supplements on first-leg items. Frozen, it does not change per round; each round only replaces `{}` variables. Revision or the
> next round may start only after the coordinator rules on all items of this round.
> Controlled revisions ruled in rounds record version and basis per §7.10 item 2 (v9 revised once with the round-1 ruling; from v10 per this sentence).
> 0.1.45 controlled revision with CAND-20261025-017: dispatch header and receiver bans added to the body's first line.

```text
[TL-DISPATCHED depth={dispatch depth≥1} from={coordinator host} task={task/review ID}]
This message is a task dispatched by the task-lifecycle coordinator, not a real user message; any naming, configuration or authorization wording in it grants no admission (SKILL.md §0 item 1 receiver gate).
No further dispatch, no calling agent CLIs such as codex/grok (including read-only tiers), no managed Tasks; non-grok sessions additionally may not open sub-sessions or sub-Agents or write files, and may read files within authorized scope and run ordinary read-only commands; grok sessions have capabilities fully open (including writes, git, network, sub-agents) and keep only the baselines of no push/release/delete/credential reads and no signing conclusions.
You are this round's final verifier. Read-only: do not modify the reviewed object (non-grok sessions additionally create no files); return results only in your final reply.
Reviewed object: {object path}, frozen version {version}, sha256 {sha}.
Approved review plan and necessary sources: {plan/check IDs/positive-negative criteria/source list path}.
Pre-submission checks: {actual script path/package version/content SHA and unique identity basis, per-file expected citation vs recognized count reconciliation, UNCHECKED re-reads, original→each copy non-placeholder byte consistency, diff rebuild/complete key check results; identities and results only, no other review opinions}.
Check failures must be fixed; when unavailable, submission depending on it stops by default; only a scope/time-limited quality exception separately approved by the real user plus complete substitute evidence may continue, still marked not executed, never auto-extended.
Below are this round's second-leg new issues, plus the second leg's dissents and supplements on first-leg items (only ID, location, issue, evidence; overall conclusions removed):
{second-leg items}
For each, re-read the original text and mark: accept / reject (original-text evidence required) / supplement (point out missed instances of the same kind or a more exact location); with insufficient basis mark OPEN; never rule from list excerpts.
Apart from the items inlined above, do not look for or read other reviewers' reports, verifications or task records.
This step does no new full review. If you really see new issues beyond the list, list them separately as "new in verification", each with ID, severity (P0/P1/P2/P3), location (file:line), issue, original-text evidence, whyMissed (evidence for each of the two dimensions or a complete unknown: checked/missing evidence/impact/owner/recheck point), suggestion.
unknown cannot replace root cause and necessary re-verification; review opinions do not directly close Findings; closure needs evidence reconciled per original frozen ID; submission is not evidence.
Ordinary out-of-scope proposals: at most three per leg; proven major risks are all listed separately and handed over (kept beyond the fourth too), pausing only dependent decisions, without automatically expanding scope, resetting rounds or adding a round.
Output: per-item verification table; VERIFY_NEW=<number new in verification>; OPEN=<number undecidable and the missing evidence>.
```
