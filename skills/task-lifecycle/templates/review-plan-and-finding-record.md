# review-plan-and-finding-record — formal specialist review plan and Findings (minimal template for two independent formal objects)

> **Approve the real plan first, then run the professional formal review.** Plan and report may live in different actual files; what is merged here is field examples, not approval objects. Model
> file-level self-review does not need a new specialist plan every time. Without legal authorization never fill "formal review passed".

## A. Review plan awaiting approval (independent Artifact ID)

- Task / Plan ID / Plan Version / Actual Path: `{to verify}`
- Sole reviewed object with its current **external SHA**, currently valid sources: `{to verify}`
- Actual project/consumer facts, scope and exclusions: `{real investigation}`
- Roles/check methods: `{each role maps to concrete judgments, no empty titles}`
- Host permissions, D/A/I/H applicability, frozen pass thresholds and real failure conditions: `{current facts}`
- The plan's own self-review, pending valid human Confirm/legal in-task Auto result: `{never pre-fill approval}`

| Check ID | Approved source ID / full duty and sub-conditions | Trigger preconditions and consumers | Actual positive/negative assertions | Method + permission + expected evidence level | Frozen pass/failure exit |
|---|---|---|---|---|---|
| `{unique ID}` | `{not mechanical section matching}` | `{concrete}` | `{should pass / must reject}` | `{D/A/I/H/E3/E4}` | `{clear criteria}` |

## B. Report after actually executing the approved plan (another independent Artifact ID)

- Exact plan version, valid approval source/scope: `{real}`
- Exact current version/actual SHA of the reviewed object, whether still applicable: `{real}`
- Executed check set/actual read depth: `{inventory/search/file-deep-read/runtime-consumer}`
- Unexecuted items/environment/permissions: `{unverified and impact}`
- Actual evidence and conclusion per compound sub-condition: `{covered-by-design/partially-covered/gap/needs-evidence/N/A+reason}`
- E4 real execution status: `{passed/failed/unverified/N/A+reason}`, independent of E3.
- The reason for any `covered-by-design` item may not also contain pending key content; otherwise downgrade to partial/needs-evidence.
- **Fact confirmation is separate from approving the reviewed object**; do not close the object by acknowledging report facts.

## C. Per-item Finding record (several may share a fix batch, but close independently)

| Semantic field | Actual evidence that must be written |
|---|---|
| Finding ID / Group ID / Root cause | `{each independent ID; group by shared cause only with sufficient evidence}` |
| Source/Check/Artifact IDs & Versions | `{exact sources and reviewed object}` |
| Facts / Expected / Actual / Severity | `{observed facts, frozen expectation, evidence, P0/P1/P2}` |
| `defectRootCause` | `{why the defect itself happened}` |
| `controlFailure / whyMissed` | `{cross-round / this round's earlier leg separately: category + evidence, not applicable + evidence, or unknown + materials checked/missing evidence/impact/owner/recheck trigger; never guess a category}` |
| Impact, consumers, new regression | `{direct/indirect; whether Bug A introduced B and causality}` |
| Actual changed files, new version, diff | `{real change or resolved-in-candidate; unchanged may not pose as fixed}` |
| Independent verification and re-review | `{applicable real results, never copied from a parent Finding}` |
| State / remaining risk / next action | `open/investigating/repair-planned/repairing/verification-pending/re-review-pending/closed-verified/blocked/rejected-with-evidence/deferred-approved + evidence` |

Defect closure is separate from the whyMissed investigation: a complete unknown may keep being investigated but does not replace root cause, re-verification or necessary re-review. Submission is not
closure evidence; the same submission may only register closure conditions already really met, never pre-filling future commit IDs.
Completeness uses the frozen original Finding snapshot + this round's new raw output as denominator, recording each ID's handling including partial acceptance/duplicate/rejection; never infer no
omissions from two derived lists being equal.
Proven major out-of-scope risks are handed over in full, kept beyond the fourth too; only dependent decisions pause, without automatically expanding scope, resetting rounds or changing the ordinary
three-suggestion quota.

## D. Futile loop check

| Review Round | newEvidence | newAffectedConditions | newCodeOrContractDiff | newVerifiedClaims | closedWithEvidence | remaining gaps |
|---|---|---|---|---|---|---|
| `{one actual round}` | `{real change or none}` | ... | ... | ... | ... | ... |

When consecutive same-method rounds make no substantive progress, stop repeating and concretely propose changing the review method, missing real environment, product choice or a block; never rename
reports to raise the "convergence rate".

## E. Same-round discovery, fix batches and rerun records (writing into existing drafts suffices)

Execution owners: `../references/formal-review-and-findings.md` §7.9, `../references/verification-and-evidence-routing.md` §10.7; this section adds no report needing separate approval.

- Discovery round/reviewed version/bounded check list and completion conditions: `{per-item results or explicit blocks; not waiting for all latent Bugs}`
- This round's issue snapshot and classification: `{Finding IDs, original failure evidence, product/test/environment/delivery/duplicate/suggestion`;
  `prerequisite minimal handling and version boundaries}`
- Batches/root-cause dependencies/members: `{merge only with evidence, independent issues in separate batches, per-Finding acceptance}`
- Verification layers: `{per-item minimal verification / batch consumer regression / final applicable acceptance; each one's checks and results}`
- Rerun basis: `{what changed and version` / `why old evidence is invalid` / `which consumers are affected` / `which checks rerun` / `which original-version results are reused` / `new information}`
- Exit: `{remaining gaps, attribution of new regressions, necessary human decisions and next action`; `keep original failures/cancellations, never copy per-item closure from an overall green batch}`
