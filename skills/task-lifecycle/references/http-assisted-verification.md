# http-assisted-verification

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when Feature/Bugfix/Docs really involve an HTTP API, the user asks about reusable request files, or a change affects API docs or regression.

**Sole primary responsibility**: the off/suggest/generate policy for WebStorm/JetBrains `.http`, contract sync and verification of real request scope; operation permissions are still decided by the
host, with no second approval system added

**Direct consumers**: applicable A04–07, B03/06/07, DOC professional examples and PoC F/H/M.

**Linked References**: `verification-and-evidence-routing.md` defines E4 evidence; `workspace-versioning-and-recovery.md` defines write and version safety.

## Execute item by item when applicable

1. First check the user's explicit preference this time/approved project or workspace policy; only `off / suggest / generate` are allowed; default `suggest`. `off` neither generates nor prompts
   proactively; `suggest` only explains the generatable interfaces/samples/benefits/location and risks, changing project files only after confirmation; `generate` requires a legal valid instruction
   or applicable execution preference.
2. From the real current API/fields/auth/errors/versions/consumers, build reusable success/boundary/error/permission samples; unknown endpoints or return types are marked as needing evidence, never
   fabricating interfaces.
3. Generate `.http` at a legal location in the user's project, parameterizing baseUrl/Token etc.; never package real credentials; without the user's permission never silently modify
   `.gitignore`/private config. Keep environments separate and remind that sensitive requests need real-environment approval.
4. Strict four states: `generated` (file exists only), `statically-checked` (actual format/variable checks), `requested` (real request/response with redacted records), `passed` (pre-frozen
   assertions really executed and met). No earlier state may substitute for a later one.
5. GET/POST/PUT/PATCH/DELETE executability cannot be decided from the abstract HTTP verb alone; look at the target address, data/side effects, permissions and reversibility; never send requests to
   production or personal accounts without real permission.
6. After API requirements/implementation change, re-check the contract version of affected `.http`/public docs/examples, syncing or marking them stale; generating a file alone does not verify the
   interface succeeds.

## Counterexamples that must be rejected

- Writing to the user's repository directly under default suggest; plaintext real Tokens in debug files; reporting "interface test passed" on successful generation; sending a real POST transaction
  without permission; changing the backend contract while fixing examples in Docs-only work.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 12.3 HTTP assisted request policy and artifact protocol

| Valid task/project preference | Technical handling | Verification limit |
|---|---|---|
| `off` | Do not proactively suggest or generate `.http` | An explicit user request this time is handled per this time's authorization first |
| `suggest` (default) | When an HTTP API applies, propose generatable interfaces/negative cases, location, maintenance value and risks in planning, awaiting legal confirmation | Debug files in the project are not changed before approval |
| `generate` | After the current task explicitly asks or a real valid project preference approves, **create or update** a usable `.http` in an allowed location | Created ≠ syntax checked ≠ really requested ≠ request result passed |

From the real API/contract, arrange representative success/error/auth/boundary requests and applicable response assertions.
- Environment addresses, Tokens etc. use variables and private environment files; **never hard-code real credentials**.
- `POST`/`PUT`/`PATCH`/`DELETE` with dangerous side effects cannot be uniformly rejected by method name; judge by the actual environment, data and allowed operations; generating a file does not
  approve the actual request, which must be checked against existing task/host permission, without re-requesting decisions already in effect.
- Never create sensitive `http-client.private.env.json` example real values on your own or commit private files to Git;
- suggest excluding private environment files in legal rules such as the project's `.gitignore`; modifying ignore rules still needs to be within scope/permission.

| Evidence level | What may be claimed |
|---|---|
| Generated | File actually exists, cites a real approved API source, not live-tested |
| Statically checked | File syntax/variable references etc. actually checked and passed (within available tool scope) |
| Requested | Real environment, request/response, status, assertions, time and redacted evidence recorded |
| Passed | Pre-frozen actual request assertions have E4 evidence without violating authorization; does not replace full unit/integration coverage |

Reference the official JetBrains HTTP Client (including public and private environment files, response scripts, CLI and reports): https://www.jetbrains.com/help/idea/http-client-variables.html ,
https://www.jetbrains.com/help/idea/http-client-cli.html .
- Concrete features/commands are verified against the target WebStorm and the really installed HTTP Client/CLI version; never mistake a third-party IDE's `.http` syntax for a general HTTP
  specification.

---

### 12.4 Change propagation for complete docs and HTTP

When a Feature changes a public API, judge whether README/Reference/examples/`.http` need syncing; when a Bugfix fixes error codes/behavior, re-check the actual external contract and repro scripts;
when Docs change examples while the source API is unchanged, never quietly change the business implementation. Every request file and page binds the actual implementation version and consumer
evidence before delivery; after a version change re-verify the affected parts.
