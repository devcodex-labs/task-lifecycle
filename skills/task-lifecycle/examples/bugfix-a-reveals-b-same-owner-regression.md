# Example: fixing Bug A introduces new regression B (demo, not real fix evidence)

> A/B below are fictional labels involving no real production data or real test passes.

The user has explicitly enabled a managed Bugfix, mode Confirm, a legal depth chosen, project and path safely bound.

1. B01/B02: raise Bug A based on really approved expected behavior and reproducible facts; also record the shared consumer `consumer-X`, legal normal-behavior invariants, and whether the actual
   environment can execute.
2. B03: the minimal fix plan must cover positive recovery of the original A and preservation of consumer-X's original correct behavior; if public behavior or fields would change, request a product
   decision separately.
3. B04/B05: change source only after current write permission and a safe Git dirty check; keep the real diff/original failure history/specialist review Findings.
4. B06: if an actual new anomaly B **is proven by evidence to be introduced by this fix**, classify it `introduced-regression`, create a Finding linked to A, block B07/B09, and **rework within the
   same original fix-quality loop**.
5. After fixing B, re-verify A+B+consumer-X on the same current version; check that nothing was faked by swallowing errors, deleting tests or loosening original assertions.
6. If B already existed but was exposed this time, or causality is unclear, write `pre-existing-exposed/causality-unverified` and evidence steps respectively; never assert the fix introduced it
   because it happened at the same time.
7. The final B09 report shows the original Bug, the real cause, the change diff, regression/untested items and what awaits user confirmation; never claim completion from the self-review report alone.

**Counterexample**: B is split off into a new ticket nobody authorized, and the original task A is declared closed because its unit test is green: **must be rejected**.

## Consolidated discovery and layered regression in the same scenario (still a fictional example)

Suppose the approved bounded list includes A's boundary inputs, consumer-X, an independent doc link and a candidate list check. First freeze V1, run these safe checks and keep all results, then
merge issues; do not modify V1 right after the first assertion fails, which would mix V2 into the remaining checks. If a start-up fault makes the consumer-X check impossible, first keep the failure,
make the approved minimal prerequisite fix, then record the new version and continue the remaining checks, re-verifying only affected items.

- A's two boundary inputs join one batch only after they are shown to share the same implementation root cause; both failing samples must be verified.
- The missing independent doc link goes in a separate batch per actual dependency. An image with correct bytes but a wrong extension is an evidence delivery issue: check image readability and
  references, without rerunning product tests that passed and are unaffected.
- After fixing A, first do minimal verification of the original failing input, then re-verify consumer-X once the batch is done. If B is confirmed introduced, the original task reworks and
  re-verifies A+B+shared consumers; unrelated qualifying results whose version/environment/criteria are unchanged may keep their original-version citations.
- Finally check the applicable acceptance conditions on the exact candidate at once; expand reruns only when changes to related code, shared contracts, environment or criteria invalidate old
  evidence. New regressions must be handled, and final real-person confirmation is still done by a real person.

Real execution should state in existing drafts "change/version → invalidated evidence → consumers → rerun checks/reused results", consuming `../references/formal-review-and-findings.md` §7.9 and
`../references/verification-and-evidence-routing.md` §10.7. This example does not prove any fix happened or tests passed.
