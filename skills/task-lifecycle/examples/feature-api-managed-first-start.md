# Example: legal managed start of an HTTP API Feature (demo, not a real project/E4)

> This is a **fictional interaction illustration**; the example's user decisions, file paths or test results may not be reused in real tasks. It only shows how to apply the approved flow and defines
> no new public API.

**Trusted current user**: "Add a query endpoint to the current project; plan first, don't modify source."

**Legal response at managed entry 00**:

1. First complete a bounded bootstrap of rules/identity/config and print the pre-check, then read the API/Schema relevant to this goal and Git dirty state; without the tool record `unknown`, never
   traversing the project early in the name of bootstrap.
2. Classify as Feature; default Confirm; record that source writes are not yet authorized.
3. The user has not chosen a `workflowDepth`, and the validator has no approved depth execution default (in this example `Config: disabled (config-missing)`); show the four tiers
   `fast/standard/thorough/custom` with a recommendation based on the actual interface risk; **never select standard directly**.
4. Only after the user explicitly chooses `standard` and authorizes writing process documents to a directory outside the repository that passed real safety checks are the current 《任务描述》 and
   《任务工作流方案》 candidates generated, self-reviewed and made effective legally per the confirmation record.
5. A01 settles the public goal → A02 Usage Contract (real API, field domains, defaults/errors/permissions, positive/negative scenarios) → A03 technical design → A04 Work Item planning. Even if a
   better caching scheme is found along the way, first write `suggested-unapproved`, never including it automatically.
6. `.http` defaults to `suggest`: only describe the generatable samples and risks, without writing `.http` directly; create the parameterized file only when the user explicitly chooses `generate`
   and grants the corresponding source write permission.
7. Code verification and actual HTTP requests each need real environment permission; when not executed each is marked `unverified`; even if `.http` was generated successfully, never claim the
   interface test passed.

**Should be rejected**: a README implying Auto is on; letting a depth-dependent formal plan take effect without a legal tier choice; adding an SDK before the API is confirmed; calling a generated
`.http` a real execution; writing internal reports into the project's Git without an explicit directory decision. Ordinary report saving is not subject to the tier-choice gate.

## A different contract example for a CLI usage surface (fictional, not executed)

The following assumes the user's own project already has a file-validation CLI; this is not a new command provided by Task Lifecycle, and no real tool is assumed to have any particular parameter.

1. The trusted user states explicitly: "Add the output-format option we discussed to this existing CLI; plan first, don't change source." First read the real command entry, help/argument parsing,
   exit codes, stdout/stderr, existing consumers and tests and Git dirty state; when inaccessible, record unverified truthfully.
2. Classify the entry as Feature, default Confirm; without a legal tier choice show the four tiers. After the user explicitly chooses standard and authorizes a verified safe process directory
   outside the repository, generate and self-review 《任务描述》 and 《任务工作流方案》, obtaining confirmation for the exact objects.
3. A01/A02 first check compatibility of the original text output, acceptable inputs, the real parameter form/default of the format option, missing and illegal values, success/failure exit codes,
   output streams and script consumers; never guess existing parameter names or add public promises directly. Form the usage contract candidate and specialist plan/report, entering
   technical/implementation planning only after confirmation per mode.
4. Currently only planning, no source write authorized. Only after exact implementation authorization does A05 change the command consumers and necessary tests; verify applicable conditions such as
   old calls preserved, the approved new format, illegal format/missing file, pipe consumption and error streams. Without an HTTP surface `.http` is `N/A+reason`; create no request file.
5. Must be rejected: claiming behavior compatibility from `--help` text alone, changing exit codes for convenience, deleting old output assertions, taking the example's standard mode as a real user
   tier choice, and using a code batch confirmation to commit/push. When required CLI live tests are not done keep `unverified`; never call it a first success.

## Actual evidence format for API / CLI / Bugfix (none run here)

| Scenario | Positive/negative conditions and actual consumers | Real evidence to record | Current example status |
|---|---|---|---|
| API | Approved normal requests, auth/boundaries and real callers; `.http` generation separate from requests | Task/Claim, UC/WI, source/package version, environment, authorization, actual request/command, expected/actual, raw results and uncovered risks | `unverified`, no real request |
| CLI | Old-call compatibility, new format and illegal input, exit/output streams and script consumers | As above plus actual argv, stdin/file conditions, stdout/stderr, exit code; for unknown CLI parameters check the version's help first, never equating help with testing | `unverified`, no real CLI execution |
| Bugfix | Original A, B introduced this time and shared-consumer behavior preservation | Pre/post-fix versions and causal evidence, failure history, actual diff, A+B+applicable regression and re-review; consumes the original-task ownership of `bugfix-a-reveals-b-same-owner-regression.md` | `unverified`, no real fix |

This table only explains evidence fields. Freeze criteria and obtain the corresponding environment/operation permission before real execution; real results may be filled only after running; model
samples and textual role reasoning cannot count as E4.

## A05–A09 closing of the same Feature (fictional conditional path, not executed)

**Later conditions**: only when the real task's A01–A04 have taken effect under the current legal mode and the user separately grants exact source write and applicable verification permission may
the table below be entered; the initial "plan first, don't modify source" request itself does not authorize implementation. The table describes how closing should go and does not mean this example
was approved, changed or passed tests.

| Phase | Input and actions | Exit, failure and untested boundaries |
|---|---|---|
| A05 Implementation/code review | Re-read valid REQ/UC/WI and current source/dirty; implement within the allowed write set, discover together/fix by root cause, check the real diff and consumers | Deliver the exact source/candidate identity and review evidence; on unauthorized writes or unresolved necessary Findings stop the related chain; HTTP generation/requests still each follow permissions |
| A06 Verification | Per frozen normal/rejection criteria record actual commands or actions, expected/actual, version, environment, raw evidence and exit codes | Record planned, run and passed, failed, untested and justified N/A separately. This example has no real results; status stays unverified; missing evidence for necessary tests cannot approve delivery depending on their passing |
| A07 Delivery review | After required verification is met, give the complete candidate entry, file set, real diff/SHA, notes and uncovered scope; check the files actually consumed | The current package must correspond to the reviewed/tested version. Producing a ZIP does not prove installation; after changing the candidate invalidate only related evidence and re-check, never relabeling historical results |
| A08 Conditional publish | If the real task has no publish intent, record N/A with reason; on a new request first verify the exact target and independent permission | Never commit/push, update accounts, install or publish because of Auto, delivery confirmation or an existing ZIP; on unknown publish results observe first, never blindly replay |
| A09 Completion/feedback | Hand off the final version, actually completed and untested items, residual risks, rollback entry and next action; record whether real user final acceptance exists | Record technical readiness and real-person acceptance separately; without a real-person event keep it awaiting acceptance. A10 may be inserted at any phase on substantive change and is not a mandatory last step |

### Reusable case structure and a short rubric

When using this structure for a real task, fill in the actual input, current REQ/UC/WI, candidate version/computable SHA, authorization and environment; freeze expectations and rejections first,
then fill actual results/raw evidence entries or reasons for not testing. All such actual execution fields in this example are not executed; no fictional Hash or approval is provided.

| Criterion | Positive and rejection conditions | Evidence status in this example |
|---|---|---|
| Candidate and input consistent | Actual consumers, source/package and valid upstream versions agree; old results cannot pose as the new candidate passing | unverified, demo only |
| Verification facts traceable | Each expectation maps to actual commands/output/exit codes and evidence; plans alone, file existence or model self-evaluation do not count as passing | unverified, no real commands |
| Fixes and reuse grounded | Original failures kept, per-item re-verification after same-root fixes; unchanged consumers reused with basis, no blind full-flow reruns | unverified, nothing actually fixed |
| Delivery, publish and final acceptance separate | The current candidate is readable; no publishing without permission, no human-confirmed without a real user decision | No real publish or final acceptance happened |

Actual D/A/I/H, isolation and evidence freshness follow [verification-and-evidence-routing](../references/verification-and-evidence-routing.md);
- for regression responsibility see the [existing Bugfix example](bugfix-a-reveals-b-same-owner-regression.md), for doc/site split the [existing Docs example](docs-readme-vs-existing-site-split.md).
- Reusing historical behavior evidence must keep the original candidate/environment, applicable conditions and uncovered risks, without copying private logs into the package or adding model runs by
  default. This example and rubric do not replace real E4 and are not a new evaluation framework.
