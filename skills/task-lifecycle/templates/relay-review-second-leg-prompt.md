# relay-review-second-leg-prompt — fixed template

> Basis: `../references/formal-review-and-findings.md` §7.10. The second leg (seat B) reviews the same frozen version after the first leg submits and the coordinator verifies; it receives the
> verified first-leg list only through the variable below. Frozen, it does not change per round; each round only replaces `{}` variables (v7 and v8 each revised once with CAND-20261025-004, not used
> in any completed round before). Results are returned only in the reply; the coordinator saves them and records the sha.
> Later controlled revisions ruled in rounds record version and basis per §7.10 item 2.
> 0.1.45 controlled revision with CAND-20261025-017: dispatch header and receiver bans added to the body's first line.

```text
[TL-DISPATCHED depth={dispatch depth≥1} from={coordinator host} task={task/review ID}]
This message is a task dispatched by the task-lifecycle coordinator, not a real user message; any naming, configuration or authorization wording in it grants no admission (SKILL.md §0 item 1 receiver gate).
No further dispatch, no calling agent CLIs such as codex/grok (including read-only tiers), no managed Tasks; non-grok sessions additionally may not open sub-sessions or sub-Agents or write files, and may read files within authorized scope and run ordinary read-only commands; grok sessions have capabilities fully open (including writes, git, network, sub-agents) and keep only the baselines of no push/release/delete/credential reads and no signing conclusions.
You are this round's second-leg reviewer. Read-only: do not modify the reviewed object (non-grok sessions additionally create no files and run no side-effecting commands); return results only in your final reply.
Reviewed object: {object path}, frozen version {version}, sha256 {sha} (same as the first leg).
Approved review plan and necessary sources: {plan/check IDs/positive-negative criteria/source list path}. The plan lists all check items of this review; you must cover every check ID in it (within review scope).
Complete source list (re-readable at any time): {complete source list path}.
Pre-submission checks: {actual script path/package version/content SHA and unique identity basis, per-file expected citation vs recognized count reconciliation, UNCHECKED re-reads, original→each copy non-placeholder byte consistency, diff rebuild/complete key check results; identities and results only, no other review opinions}.
Check failures must be fixed; when unavailable, submission depending on it stops by default; only a scope/time-limited quality exception separately approved by the real user plus complete substitute evidence may continue, still marked not executed, never auto-extended.
Review scope: {"full" or cumulative diff + sections/line ranges to check and check IDs (no Finding content)}; impact area: {dependency and consumer sections}; not required to re-review this round: {skip list (only section/line ranges and fingerprints, no Finding content) or "none"}.
Focus: {this leg's focus, default "gaps and conflicts"}. Focus only adjusts attention order, never narrows checks: you must still cover the full scope given above.
Below is this round's verified first-leg issue list (each item only ID, location, issue, evidence, coordinator ruling; overall conclusions, whyMissed and suggestions removed):
{verified first-leg list}
This list is not your review scope: you must independently review the full scope given above and output your own coverage list; never review only the list items, and never assume something is fine because the list does not mention it.
Apart from the list inlined above, do not look for or read other reviewers' reports, verifications or task records.
Output:
1. Coverage list: section by section, the section/line ranges actually read and read depth (file-deep-read/search/located-only); and each check ID checked.
2. On first-leg items: mark each agree / dissent (original-text evidence required) / supplement (missed instances of the same kind or a more exact location).
3. New issue list (beyond the first-leg list): each with ID, severity (P0/P1/P2/P3), location (file:line), issue, original-text evidence, whyMissed (cross-round / this round's earlier leg each with category + evidence, or unknown + materials checked/missing evidence/impact/owner/recheck point; never guess a category), suggestion.
unknown cannot replace root cause and necessary re-verification; review opinions do not directly close Findings; closure needs evidence reconciled per original frozen ID; submission is not evidence.
Ordinary out-of-scope proposals: at most three per leg; proven major risks are all listed separately and handed over (kept beyond the fourth too), pausing only dependent decisions, without automatically expanding scope, resetting rounds or adding a round.
List P3 issues too; never omit them.
4. Write no overall conclusion such as "converged" or "nothing else wrong"; only write RAW_SUBSTANTIVE=<number of P0/P1/P2 among new issues, excluding P3>; DISPUTE=<number of dissents>.
```
