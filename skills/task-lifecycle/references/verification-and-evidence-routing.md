# verification-and-evidence-routing

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: whenever code/tasks/docs/rules need to be claimed verified, a safe tester is chosen, CI/HTTP/Agent Eval is run, or a real commit, packaging, distribution/release candidate is prepared.

**Sole primary responsibility**: D/A/I/H quality claims and real tests, CI/flaky, Agent Eval contamination isolation, historical failures and reverse conformance of implementation, reverse
verification of delivery sets and real consumers

**Direct consumers**: A06/B06/DOC07, Finding closure, PoC, project acceptance and delivery.

**Linked References**: `http-assisted-verification.md` gives the four .http states; `docs-audience-and-site-quality.md` gives reader tasks; `formal-review-and-findings.md` decides closure gates.

## Execute item by item when applicable

1. For each **applicable quality claim** of the current approved requirement, state the correctness oracle, normal/counter cases, target source/consumer version, D (deterministic)/A (Agent
   behavior)/I (integration)/H (real user decision) check responsibility and actual authorization; a tool being available does not mean it should run.
2. Project facts first: verify read-only the real existing test scripts, languages, CI config and Git dirty state; first reuse safely executable paths the project already has. Without seeing the
   source never invent `npm test`, browser or full compatibility passes.
3. `D/A/I/H` each record `expected / actual / environment / version / commandOrAction / time / evidence / permission / status`. Without actual execution `unverified`; truly not applicable needs
   N/A+reason; blocked/failed/unknown are never mixed with passed.
4. `CI queued/running/cancelled/unknown` does not equal passed; flaky investigation keeps failure history and run parameters, rerun scope and stability conclusion, never erasing earlier real
   failures because of the last green.
5. Agent Eval needs a frozen rubric, positive/negative samples, really supported CLI/model permissions, an isolated workspace/dirty snapshot, resource scope and an exit/cleanup plan; the same AI
   grading itself cannot count as independent Agent Eval. Without permission/tools/isolation do not run, and state E4 unverified.
6. Bugfix real regression covers the original Bug A, a proven B introduced this time, shared consumers/behavior invariants and the affected code version, never only one local function. Docs need
   actual reader navigation/usage tasks and real pages/interfaces; build is only D evidence.
7. HTTP `.http` generation, static parsing, actual requests and request assertions passed are recorded as four separate levels; actual requests must stay within the exact environment/data scope the
   current task and host allow. Releases, dependency downloads, starting services etc. likewise check real side effects and existing scope; this rule adds no per-operation approval and does not
   override host refusals.
8. Finally verify on the same actual code/artifact/environment version after root-task integration, distinguishing design E3, real E4, raw CI status and human approval facts.
9. **ABS-07/AC-106**: only when a real commit, packaging or release candidate needs a delivery set, first verify read-only the workspace and approved delivery scope, listing
   `working / staged / untracked / generated / ignored` source files, files referenced by formal artifacts and the actual package/commit target;
   - check `includedInDeliverable` file by file in reverse from approved sources and real consumers.
   - Missing required generated files, untracked files, ignored resources that must ship, executable script dependencies, or mixed-in unapproved/sensitive files all block the candidate; never claim
     distribution/commit is complete after one ordinary `git diff` or only seeing static filenames. Only authorized real packaging/commit checks may leave actual commands, exit values and real
     consumer results;
   - without authorization first record `unverified/blocked` and the action awaiting permission; never automatically `git add -f` or release. See the concrete inventory record in
     `workspace-versioning-and-recovery.md`.
10. **Untruncated status evidence** (CAND-20261028-001): before stating a count or an only/all/none conclusion (dirty files, failing tests, search hits) from command output, check whether
    that output was cut by `head`/`tail`/`sed -n` or display truncation; if so, rerun a full or counting command and state the total, otherwise the conclusion is `unverified` and is not sent.
11. **Control request before blaming upstream** (CAND-20261028-003): before stating why a network, download or install step failed, send at least one same-protocol request to an unrelated
    address, within the network scope item 7 and the host allow, and record its status code and key response headers (e.g. `Server`); a cause stated without this control is written as an
    assumption, never as a finding.

## Counterexamples that must be rejected

- Saying tested because tests/ exists; CI running marked passed; one green flaky rerun overriding the failure history; Agent Eval writing into the user's dirty worktree then "restoring" with a hard
  reset; HTTP file generation taken as a successful request; simulated browser reading taken as real user acceptance; claiming the actual package contains required ignored/untracked assets from
  `git diff` alone; claiming real multi-turn Agent Eval variance from static model output alone.

## Data boundary of Eval and sub-task evidence (SC-110)

When planning Agent Eval, sub-task inputs, event/tool logs and evidence hand-off, first verify the specific data scope the user/project allows to read, store and share; provide only the file
fragments and minimal inputs necessary to verify this claim, excluding unrelated private source, credentials, sensitive production data and personal privacy. Samples and logs are redacted per actual
project policy or use approved test data; record the redaction impact and evidence that cannot be provided, never treating substitute samples as real production verification. Legal local reads do
not automatically authorize sending raw material to external models/services or public logs.

Raw evidence is stored in the process location approved for the current task, with explicit real version, access/sharing scope and required retention;
- externally deliver only necessary evidence approved for sharing.
- When a tool would read out-of-scope directories, auto-upload sensitive logs or cannot meet necessary isolation, do not run that Eval; pause only the dependent conclusion and record
  `unverified/blocked` with the exact evidence/authorization path.
- After evaluation clean up by authorized resource ownership; never rewrite real failure history or delete the user's existing materials in the name of redaction/cleanup.
- Concrete suggestion content consumes `artifact-content-and-self-review-contract.md`; any real run still needs the existing E4 and host permission gates.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 10.1 Set an evidence contract before each quality claim

Each claim needing verification records: `Claim ID` / `source REQ or UC` / `real artifact version under test` / `prerequisite environment and authorization` / `recommended verifier` /
`expected and failure conditions` / `actual command or steps` / `raw result and evidence path` / `conclusion status` / `invalidation trigger`.

- **D (deterministic)**: path/file structure, parsing, numbering and references, diffs, Schema, unit/integration tests, package validity; keep the real command and exit result.
- **A (Agent behavior evaluation)**: explicit/intent triggering, false triggering, task intent, role perspective quality, Skill selection and review/Auto semantics; run in a really approved Codex
  CLI environment, freezing samples, scoring rubric and counterexamples beforehand. The model's subjective self-report can only be graded input, never the judge.
- **I (real integration)**: target Codex install, file system, permissions, real requests/IDE, Web doc sites, real downstream consumers/package export; without the environment `unverified`; D cannot
  pose as I.
- **H (human)**: product scope trade-offs, new public behavior, protected external operations, general convention taking effect, required real-person final acceptance; scripts and Agents cannot
  substitute.

The same Claim may require both D and I (e.g. `.http` syntax generated + actual HTTP executed), or A and H (e.g. Auto behavior explanation + the user's real decision); report each by applicability,
never taking the successful one to replace all.

**ABS-07 real candidate list (only for commit/packaging/release)**: generate the `sourceInventory` of existing project files and the `requiredDeliverableSet` derived from approved
requirements/consumers,
recording file by file
`realpath/path + version/hash + owner/sourceClause + working/staged/untracked/generated/ignored + requiredBy + includedInDeliverable(true|false|unknown) + packageOrCommitDestination +
actualConsumer + actualLoadedOrPackagedEvidence`.
- For projects without Git, each Git status is `N/A+reason`; still verify the real candidate directories and file consumption surface.
- `ignored` and `generated` should not automatically include all files: include only content truly within approved delivery obligations; exclude sensitive/out-of-authority/process evidence.
- Reviewers must compare "required delivery set ⊆ actually authorized candidate set ⊆ actually consumable package/commit result", and whether the candidate has out-of-authority or unapproved files;
- without permission to build a real package record only the planned check `unverified`; never let a compressed preview pose as host-loaded.
- If required files are missing, accidentally excluded, diffs unclear or the candidate changed without regression, pause the dependent delivery; fix within the existing scope and re-compare real
  artifacts; request a specific decision only for truly new scope; only then may the corresponding D/I be claimed complete.

**Real tool selection**: before settling on available tools, the verification plan first checks scripts and test assets actually present in the current repository (read config, test directories,
command risk, side effects and existing CI rules), preferring to reuse existing tests authorized to run.
- Plan minimal additional tests only when real coverage is insufficient and evidence is truly needed within this approved scope; never install new dependencies out of fondness for a framework.
  Passing in one target environment only supports claiming that check passed for that version in that environment;
- other OS/IDE/CLI/browser/HTTP situations stay `unverified`. All numbers used as review evidence must have a real source and version and support per-item tracing, preventing count-driven conclusions.

---

### 10.2 Quality states and blocking matrix

| Result | Conditions of use | Not allowed |
|---|---|---|
| `passed` | Executed against the corresponding frozen criteria and supported by real results | Only because files exist, the model says it passed, or historical logs passed |
| `failed` | Executed and not as expected | Deleting failing samples, changing assertions/scoring criteria to make it pass |
| `unverified` | Should be verified but not yet executed or evidence insufficient | Writing N/A/passed |
| `N/A + reason` | Sufficient facts show the requirement does not apply to the current project | Passing off "no tools" or "short on time" as not applicable |
| `blocked` | Required verification cannot be completed, a major Finding, or missing permission | Passing off a human-confirmed report's accuracy as the object's quality passing |

E4 is produced only by actually authorized real host/browser/HTTP interaction. Code, README and the final plugin package must be consistent on **the valid version tested**; if the generated
package/dependencies/docs change, the applicable test and review evidence is judged invalid.

**Real verification (E4) must happen in the environment where the skill is actually loaded**: first land the patch under test on the actual load path per authorization and refresh/reload the skill,
then test in a new session with a real intent prompt that triggers the skill;
- the session under test must first prove it loaded the skill version containing the patch (load path + actual file sha256, file evidence primary, session self-report secondary); if it cannot, that
  round is invalid.
- Results from feeding rule text to the test session, sending on someone's behalf or saying "this is a test" may only be recorded as "disturbed evidence", never called "real verification" or E4; a
  candidate not in effect is outside any session's load scope, so before it takes effect only disturbed evidence can be obtained.

**Rejection semantics for async/Flaky**: verification records must distinguish the **execution lifecycle** `not-started / running / completed-success / completed-failed / cancelled / unknown` from
the **acceptance ruling** `passed/failed/unverified/blocked/N/A`.
- `running`/`unknown`/only partial job success does not enter overall `passed`.
- An accidental rerun success after an initial failure must keep the full failure history, environment/code/test versions, rerun reasons and counts, overridden assertions/consumers, and investigate
  flaky, environment, implementation errors and CI status per the stability criteria frozen beforehand;
- when necessary stability/overall checks are not met it stays `unverified` or `blocked`; never pick the last green light to erase failures. Adjusting assertions, skipping/over-mocking or ignoring
  sub-jobs to eliminate failures is forbidden.

---

### 10.3 Minimal executable design of Agent behavior evaluation

**PoC-G Confirm/Auto equivalent quality and efficiency comparison**: before real testing freeze equivalent tasks, repository/dependency starting points, host/model versions, permissions, the same
Required/Conditional and D/A/I/H criteria, failure injection and evaluation Rubric.
- Keep separately the observable `human-confirmation-count`, observable human waiting start/end times (not forcing the user's offline time into plugin performance), model/tool active processing time
  (if the host can observe it), rework rounds, failed/duplicate samples, execution cost and results; unobtainable metrics are recorded `unverified`, never inventing efficiency gains.
- **For REQ-083's confirmation-efficiency effect**, in future comparable tasks with actual execution authorization, check each confirmation request by
  `Task/Artifact/Plan ID + real SHA/version + Decision Scope + authorization source and whether invalidated`,
  distinguishing `same-effective-scope-redundant-prompt` (re-requesting approval within the same valid scope with no new facts) from `distinct-artifact-or-changed-scope-required-approval` (a
  different formal object, new SHA, plan substantively invalidated or a protected decision).
  - The comparison only counts whether the former decreased; the latter cannot be treated as compressible duplicate prompts;
- record actual prompts, decisions and time evidence plus the limits of missing comparable samples/incomplete observation; never claim efficiency improved because rule text exists. The evaluation
  order is **first meet the same quality and safety gates, then compare efficiency**;
- when sample starting points or environments are not comparable report loss of comparability; never cherry-pick one best output or prove quality equivalence by fewer docs/confirmations.

1. First freeze a set of positive/negative cases taking actual user goals as input, including "ordinary coding Q&A without Task Lifecycle enabled", "a README citing Auto", "misclassified Bugfix",
   "partial confirmation", "two items awaiting confirmation at once", "two conflicting Skill candidates", "role names present but checks empty", "numbering matches but body cites an old version".
2. After actually obtaining CLI/tool authorization in the target environment, record the current client and model/call method, and use `codex exec` per the confirmed version or an equivalent command
   the current CLI confirms it supports; verify feature parameters from the real `--help` at the time, never pre-writing a fictional support matrix.
3. First fix the evaluation Rubric: no overreach, correct phase/scope, complete required artifacts and self-review records, executable by real users, correct evidence and failure handling.
   Open-ended scoring needs a human or trusted independent evaluation step; model self-evaluation may not independently judge completion.
4. Save inputs, outputs, obtainable event/tool results, failing samples, scoring rule version, cost/time and the basis for repeated sampling;
   - never cherry-pick one best result because of model nondeterminism.
   - **ABS-11/AC-110:** when evaluating Agent/model nondeterminism with real comparable repeated sampling, save per the frozen Rubric and the same task/host/model/config each run's input and
     score/ruling, success/failure totals and types, misjudged samples, total sample count, execution cost and the applicable **result distribution/fluctuation/sample variance or range**, stating
     the comparison method, limits and outliers, without deleting failing samples. Numeric variance is computed only with comparable numeric measures and enough samples;
   - with insufficient samples, incomparable environments or missing event data state `variance=N/A|unverified + reason` explicitly; never invent standard deviations/success rates or use one best
     sample to prove the stability gate is met.
   - Whether repeated sampling is needed is decided by approved risk, cost and scoring criteria; **ordinary deterministic unit tests are not forced to run multiple times**.
5. After changing Skill text, References or the test environment, re-verify which samples are invalidated; untested host features are explicitly `unverified`.

**Agent Eval safety isolation**: before first using a real CLI/sub-Agent Eval in the implementation phase, verify per actual tool permissions and task scope whether a controlled sandbox/isolated
directory or legal worktree exists, and record the original user worktree HEAD/dirty/untracked, expected read/write surfaces, dependency startup scripts and temporary processes/ports, external
network/services, side effects and expected cleanup.
- Within a permitted scope without dangerous side effects, an independent temporary project copy, controlled test environment or read-only Eval may be chosen;
- when safe isolation is impossible and the test may rewrite/clean the user worktree, production data or shared resources, **do not execute**; keep E4 `unverified` with the evidence/authorization
  path. After evaluation re-check files/Git/temporary resources and the version of the object under test;
- on contamination, unknown side effects or writes beyond authorization record the real `failed/blocked`, stop affected later checks, and restore only after confirming ownership and specific
  permission; **never run `git reset --hard`, delete the user's uncommitted files or kill unknown processes on your own**. E3 protocol text in this file does not mean Eval has run on a real host.

---

### 10.3.1 Strict separation of Codex CLI execution permissions and Task Lifecycle Auto

`codex exec --full-auto` (used only when the current real CLI version supports the parameter) is **an execution/approval policy option of the Codex host** and cannot serve as evidence that Task
Lifecycle has obtained `Mode: Auto`;
- the same holds for other hosts' auto-execution/no-confirmation modes.
- Conversely, task-level Auto cannot choose broader CLI permissions on its own or directly perform sensitive file/network operations. Agent Eval samples should record each dimension's real source
  and applicable scope;
- when either the CLI command, host permission or legal task Auto is unclear, the other cannot be inferred as authorized.

---

### 10.4 Reviewer independence and insufficient capability

When reviewing, prefer an independent Review context with the same frozen criteria per real host capability; when unavailable, separate generation/review in the same context, do a reverse omission
scan and real evidence check, and label the review method. When required independent evidence is missing keep the block; role-play does not prove independence. Lacking a specialist Skill does not
automatically block; judge the actual specialist capability needed and reliable substitute verification, and if still insufficient pause locally and register a real Gap.

---

### 10.5 Separating real progress, acceptance tracking and evidence levels

**Evidence levels (primary definition)**: E1 = approved source text traceable, E2 = related current conventions, E3 = current real files/static checks, E4 = current real host/HTTP/browser/Agent
Eval/human action.

**Review and verification methods**: review records, review reports, verification conclusions, closing reports and promotion reports state the method per item: static review (read-only text
reasoning, stating files or snapshots read),
automated checks (stating gates/tests run and results), real runs (stating host/session, cases and counts). When only static review or automated checks were done, write "not actually run", never
"behavior verified" or "passed live testing"; a conclusion missing its method is incomplete.

**Every substantive managed reply** (ending with the 4-line progress card of SKILL.md §4): first state the currently provable conclusion, then give the next step matching the actual state.
- With valid authorization and able to continue, state the next action and proceed directly; when the user must decide, list the exact items, recommended choice and impact; when blocked give the
  missing evidence/permission and recovery path; when complete, deliver the result and remaining limits and end naturally. Applies to clarifications, plan explanations, execution progress, failures
  and delivery; simple polite acknowledgements skip the mechanical tail.
- When delivering or citing files the user needs to read, send them in a form directly openable in the host chat (attachments preferred, or directly openable file links), optionally with the path;
  exclude credentials and other content unfit to send; when the host cannot open them directly, explain why and give the path.
  - **Report-type artifacts and the Grok Bot reading-version Page** (review reports, plans, contract drafts; .md is the source of truth, plus a Page when the host is Grok Bot):
    - **Report-type artifacts (scope definition)**: three kinds: review reports, plans (including proposals), contract documents; other artifacts are not report-type, regardless of length.
    - **Definition of plan**: technical plans, implementation plans, fix plans, review plans and candidate proposal bodies handed to the user for review or approval; option notes given casually in
      conversation and single decision cards are not plans.
    - **Definition of contract document**: only contract drafts awaiting approval, i.e. drafts of usage contracts, interfaces, parameters, config formats and output protocols; contracts already
      finalized in the repository get no Page.
    - Item 1 **Source of truth**: report-type artifacts produce only .md by default; .md is always the source of truth, and committing, diffs, review (including Codex review) and approval recognize
      only the .md and its SHA.
    - Item 2 **Grok Bot host**: when the current host is Grok Bot and this session delivers directly to the user, make a Page (Canvas) for reading in addition to the .md; the Page is not the
      approval object, and on conflict the .md prevails. Dispatched sessions (no user-visible channel, including sessions under the SKILL.md §0 "receiver gate") make no Page, only return the .md to
      the dispatcher, and are not considered incomplete for lacking a Page;
      the user-facing session is responsible for the Page.
    - Item 3 **Host neutral**: hosts without Page capability such as Codex and Cursor give only the .md (sent per the "delivering or citing files the user needs to read" sentence under this file's
      "Every substantive managed reply"), never inventing a Page, and not considered incomplete for lacking one.
    - Item 4 **Page source line and reuse**: the Page's top line states the source .md path and sha256 (page order: source line → top table of contents → body, the body's first section per 10a);
      when the .md updates, modify the same Page and update the sha256, never create a new one.
      When a chapter is moved for reading (e.g. a flow chapter moved after the architecture chapter), the move is made in the .md itself: chapters are renumbered in sequence and cross-references
      in the .md are updated; the Page follows the .md order and numbering, never shows an out-of-sequence chapter number, and its source line needs no reorder note. Reason: items 1–2 govern
      content and the approval object, not chapter order; keeping one order in both avoids confusing numbers.
      Report-type Pages are never deleted unless the user names the Page; deleting a Page (which removes it for everyone it was shared with) counts as an irreversible action needing their
      explicit confirmation; this also holds for same-page reuse under CAND-20261026-009. Reason: a reused Page is the one reading copy others rely on.
    - Item 4a **Page language, source line placement and conclusion order (Grok Bot host only)**:
      (S1) A Page whose content is Chinese, Japanese or Korean sets the Page `lang` prop (`zh-Hans`, `zh-Hant`, `ja` or `ko`) as the canvas kit declares it; the
      deprecated Page `sources` prop is not used, because it renders nothing.
      (S2) The source line (source .md path, sha256 and line count) is the first line inside the collapsed document-header section, not the Page's top line.
      Precedence: on the position of the source line only, S2 takes precedence over item 4's "the Page's top line states the source .md path and sha256 (page order:
      source line → top table of contents → body …)" and over 10a's "after the source line and top contents"; the page order becomes top table of contents → body,
      with the source line in the document-header section; item 4's other text (content of the source line, sha256 update, same-page reuse, chapter order, no
      deletion) is unchanged.
      (S3) In the conclusion section, Metrics come first, then the Callouts; a Callout lead states the conclusion directly and never repeats the section heading;
      Metrics, leads and Callouts use only facts already in the content.
      Reason: preview Page 7e0ddf45 with these changes was approved by the user.
    - Item 5 **Page scope**: report-type artifacts (review reports, plans, contract documents) always get a Page regardless of length; non-report artifacts (CHANGELOG, config notes and other
      artifacts) only get .md; length does not change classification (same as the scope definition).
    - Item 6 **Single-file HTML on demand**: when cross-host or local reading is needed, generate a self-contained single-file HTML on demand, not by default; generate only when the user explicitly
      asks, the same on every host; not produced unless asked.
    - Item 7 **Page table of contents (Grok Bot host only)**: every report-type Page always shows a table of contents at the top, regardless of length (written with section anchors, mandatory); do
      not put a "↑ Contents" link beside each section heading. Acceptance looks at reading effect: the contents are always reachable, do not scroll away with the body, may stay beside the
      body in wide windows, and do not crowd the body in narrow windows.
      **Component/host defaults suffice; do not hand-write fixed/observers/pixel calculations**: when the host or component provides a sidebar, drawer or current-section highlight use it directly;
      when not provided keep only the top contents, which is not non-compliant. Reference measured values (not an implementation duty): at window ≥ 968px the sidebar top 96px, left 24px, width
      200px, body yields 248px.
    - Item 8 **Page body width (Grok Bot host only)**: acceptance looks at reading effect: the body is neither too narrow nor too wide, centered in the available space, tables and flowcharts as wide
      as the body; full width when available width is insufficient. Component/host defaults suffice; do not hand-write fixed/observers/pixel calculations; pick the kit width option (column, wide,
      full) closest to that effect. Reference measured value (not an implementation duty): body max about 960px.
      **Width floor override**: takes precedence over item 8's "closest to that effect" and its ~960px reference: set every Page width to "wide"
      or "full", never "column"; on desktop the body must not be narrower than 1024px. Phones stay single-column, as expected.
      Exception (platform limit, not a choice): public pages.grok.bot links are capped at 960px by the platform (item 9 measurement), so they are exempt from the
      1024px floor. Sidebar contents threshold, both measurements kept with their sources: window >= 968px (item 7 measurement) and >= 1100px (the user's 2026-10-28
      test). Phones always use the inline top contents per items 7 and 10b.
    - Item 9 **Known limits and fallback (public links)**: pages.grok.bot public links embed the Page in an iframe as tall as the content, scrolled by the outer page, so fixed, sticky and
      IntersectionObserver following do not work;
      therefore public links show no floating contents elements (left contents, buttons and drawers all hidden), only the always-visible top contents. The outer page does not limit width; at
      viewport ≥ 960px the container measures exactly 960px, below 960px it fills per item 8; public links add no sidebar and no padding.
      Body font (15px, no letter spacing, Chinese fonts led by Microsoft YaHei and PingFang) was only trialed in the v0.15 Page and is not part of this rule.
    - Item 10 **Pages generated by content (Grok Bot host only)**: Pages do not use a fixed template; choose the presentation best for human reading by content. Details (each with a reason):
      - 10a The body's first section is conclusions and pending items (after the source line and top contents), long details collapsed by default. Reason: first answer "what do you need me to do",
        details expand on demand.
      - 10b The top contents are always kept (item 7); no "↑ Contents" in each section; contents do not grow or shrink with length or section count; in-app sidebars or drawers are left to
        component/host defaults per item 7. Reason: contents always usable; floating forms are not hand-written by the Agent.
      - 10c Processes use flowcharts whose nodes carry the number + a summary of about 20 characters (over 22 truncated to 20 plus …), immediately followed by a "number—description" table; number-only
        nodes are forbidden. Reason: long node text squeezes and distorts, bare numbers are unreadable; the summary keeps the diagram readable and the table keeps it checkable.
        Clarification (no change in meaning): item 12 already specializes 10c for flow segments; in a flow segment the Steps titles plus the step table are the 10c "number—description" table, so
        no extra node table is inserted between the diagram and Steps. Reason: reading 10c and item 12 separately produced a duplicate node table.
        Order below every flowchart follows item 12 (diagram, then the step flow, then a table, nothing in between). Reason: one fixed reading order.
      - 10f Page labels (Segmented tab labels and segment names on any Page) are readable names; a number prefix is allowed (e.g. "F1 Intake and validation"), number-only labels (e.g. "F0"–"F7")
        are forbidden. Reason: readers must tell tabs apart without opening each one or looking up a table.
      - 10d Comparisons use tables; risks and blocks are marked with color plus a text label. Reason: tables ease side-by-side comparison; color plus text does not rely on color vision.
      - 10e Table cell letter spacing 0; tables and flowcharts as wide as the body. Reason: better readability in v0.15 practice; an implementation detail.
      - 10g Layout plan before generating: before generating a Page, first produce a layout plan, then generate. (1) First decide per chapter which confirmed rules apply (items 1–14,
        especially 10a–10f and item 12). (2) Within what the rules allow, choose the layout best for human reading given the .md content; only where the rules are silent consult the canvas
        skill's defaults; on conflict the rules win. (3) The plan states per chapter which block is used and which rule it rests on, in a few lines in the delivery note, listing each place where
        the Page structure differs from the .md. This adds no new confirmation stop point (cf. withdrawn item 13); the plan may not override existing constraints (no omitted content, no invented
        names). Reason: layout decided while writing let rule conflicts surface only at generation time.
      - Criterion: if the same content contains process/comparison/pending items, the Page shows them as 10c/10d/10a respectively (labels per 10f); do not force them in when there is no such content.
    - Item 11 **Delivery self-check (Grok Bot user-facing only)**: when this session delivers a report-type artifact directly to the user, the Page must be written before claiming "delivered", and
      the user-visible reply contains an openable Page link (or the WriteCanvas success url); a hit that requires a Page but has no link/no Page → reject that delivery claim, make it first, then
      deliver.
      Exceptions still follow items 2–5 (dispatched, non-Grok Bot, non-report-type, finalized contracts get no Page).
    - Item 12 **Flow-type Page layout (Grok Bot host only)**: given a Page is to be made per items 1–5 and 11, use this layout if readers want to "walk the gates and look up the next hop and basis";
      if readers want to "see conclusions, find issues, approve a draft", do not.
      This item governs layout and does not change items 1–5 "whether to make a Page" (layered with CAND-20261026-009). Item 4's source line and reuse (source line, sha256, same-page updates) still
      apply.
      - **Applies to**: flow gates, many branches, content to execute against: dispatch/review/re-review main paths, Feature/Bugfix/Docs phase gate overviews, relay or delegation "trigger → steps →
        stop points", WI diagrams in implementation plans with many dependencies and branches; in mixed plans **only** the gate/branch/execute-against flow segments use this item, other chapters
        keep their original layout.
      - **Does not apply to**: review/re-review/verification reports (conclusions first + Finding table); decision records, promotion records, ACTIVATE (short fact timelines); contract drafts
        awaiting approval (by contract chapters); verification reports and spot-test results (evidence and case tables); candidate bodies, diffs, meeting notes, one-sentence progress replies (.md or
        chat suffices).
      - **Layout**: phase overview diagram + numbered Steps (write materials/stop points if the source has them, otherwise omit) + step table (step/action/detailed
        description/implementation/flow/basis, one row per numbered sub-step, row order same as Steps);
        with an overview and phases (or appendices) you must use one set of segmented tabs (overview / each phase / appendix), never stacking several independent Sections instead; appendices use
        second-level tabs; phase tabs and appendix second-level tabs have the same structure (that segment's sub-diagram + Steps + step table); the overview tab holds only the overview diagram,
        Steps and a phase table (one row per phase: phase name, nodes it contains, corresponding tab), no full-path step table, no extra node diagram between the overview diagram and
        Steps, and no materials / ordering notes / long Callouts.
        Navigation and contents: besides the 10b top contents, never build an extra full-chapter index table like "chapter overview" (never invent one when the source has no such
        chapter); directly above each flow segment's Segmented at most one short navigation line; never put materials / ordering notes / long Callouts above the control or in the overview tab (such
        content goes in the Steps materials line of the corresponding phase tab); never write "phase-level overview / step tables in each phase" synonymous with the navigation above inside the
        overview;
        tab labels follow 10f and stay short (a readable name, optionally number-prefixed), with the full name in the tab's first sentence;
        flow chapter headings and top contents items carry only the chapter name (e.g. "3. Flow"),
        without listing tab/node names in parentheses; multiple flow segments may not mechanically copy the same navigation boilerplate (at most one sentence each; the "back to overview"
        catchphrase may be omitted).
        The whole page has only one set of first-level segmented tabs (aligned with Feature Page 5c9e0cb3): "overview + main-flow phases (+ appendix)"; tab labels = main-flow
        node/phase names (e.g. overview / prepare / select / gate / result), never invented names like "flow one / two / three"; subordinate flow segments in the source merge into the main-flow
        phase tab they attach to, without separate flow-level tabs or stacking several sets per flow;
        if that phase has subordinate flows, the phase tab contains a second-level Segmented (one option for the main nodes / one per subordinate flow, aligned with the Feature Page 5c9e0cb3
        appendix second-level lane): each option has its own connected sub-diagram + Steps + step table; never draw main nodes and subordinate flows as islands in the same diagram; phases without
        subordinate flows get no second-level tab; non-flow chapters remain independent sections per item 10;
        phase tabs group several real nodes by phase and draw that segment's sub-diagram (only this segment's nodes and the exit/exception nodes it triggers), not one tab per node (exit/exception
        nodes merge into the sub-diagram and step table of the phase that triggers them, never separate phase or appendix tabs; if an appendix would hold only merged exits, set no appendix tab);
        never draw nodes or edges the source lacks, nor mix other phases' main-path nodes into this segment's sub-diagram;
        appendix second-level tabs first give a short sentence of explanation, then diagram + Steps + table.
        Each Steps step maps to one diagram node (title = number + summary), with numbered sub-steps 1. 2. 3. beneath and one light-colored "Materials: …" line; add a "Stop point: …" line only when
        sub-steps do not cover it; numbered sub-steps must each render line by line as independent elements (aligned with Feature Page 5c9e0cb3 StepBody), never joined with "\n" into one string
        stuffed into detail (the component ignores line breaks and squeezes them into one line); never split fields like materials, results or stop points into steps.
        Order: wherever a flowchart exists (overview tab, phase tabs, sub-flow second-level tabs, appendix), directly below it comes the step flow, then a table; nothing in between,
        and the order is not swapped. Reason: readers always find the steps and the table in the same place under each diagram.
        The step flow uses the canvas kit Steps component; it may not be replaced by a plain NumberedList/BulletList; each node is one step titled number + summary, numbered sub-steps
        render line by line as separate elements, and the "Materials: …" line stands on its own line. Reason: plain lists lose the node-to-step mapping.
        The overview phase table has one row per phase with the phase name, the nodes it contains and the corresponding tab. Reason: the overview shows where each phase lives.
        The flow column must list the exception backflows the source already has (written as "Exception: …"), never inventing new edges; implementation or basis not stated in the source or rules is
        marked "not stated", never invented.
        The step table's detailed description takes only what the source states step by step; when the action already says it all mark "action complete"; when the source does not say mark "—", never
        invent; materials go on the node's first row, stop points on its last row; implementation/flow/basis at node level go on the first row with later rows "same as above".
        Clarification: the detailed description column is taken from the sub-step descriptions required by `artifact-content-and-self-review-contract.md` §7.1 "Flowchart sub-step detail";
        "action complete" is used only when the action itself says it all. Reason: one source for step detail.
        WI diagrams without numbered sub-steps may use a four-column table with localized headers WI / how / downstream / acceptance basis, the skeleton still diagram + Steps + table. Flow-type
        diagram nodes carry the number + a summary of about 20 characters (over 22 truncated to 20 plus …), overview diagram nodes carry descriptive phase names (e.g. "Large change: material
        package + static"); node text follows 10c.
        Labels written into Pages ("Materials: …", "Stop point: …", "Exception: …", "not stated", "action complete", "same as above") follow the Page cells and Page step lines rows of the `LABELS`
        table in `entry-quickref.md`.
      - **Relation to item 10**: this item specializes how **flow segments** arrange 10c; non-flow chapters in mixed content (including the body's first-section conclusions/pending
        items) still follow item 10 (10a/10b/10d/10e/10f); for purely flow-type content with no pending items, do not invent
        a conclusion section because of item 4's parenthetical "the body's first section per 10a".
        10b contents and item 7, 10d comparison tables and 10e letter spacing still apply; phase tabs may not replace the top contents.
    - Item 13 (withdrawn, CAND-20261027-013: Pages are generated only by Grok Bot and accepted by the user; this item added a stop point without new evidence; hitting the three classes follows
      the original clause of §7.10 item 7).
    - Item 14 **Pages generated by Grok Bot itself**: Pages and real Page-generation cases are generated and delivered by the Grok Bot host itself with the Page tool (WriteCanvas),
      never dispatched to third-party CLI sessions such as grok or Codex to generate on its behalf;
      third-party session output is not a Page, nor real Page-generation evidence. Real Page generation mentioned in §7.10 item 7 follows this item.
      Before generating, load the canvas skill by name with the Skill tool (it is not a disk file) and follow its component rules: blocks are written directly inside Page or Section, and kit
      blocks are not wrapped in custom components rendered as tags; if it cannot be loaded, say so in the delivery note. Reason: the canvas skill was not read before generation.
- The next step does not mean imposing optimization suggestions every round, repeatedly asking whether to continue, treating suggestions as authorization, or manufacturing new tasks for the tail; it
  only constrains enabled managed tasks.

**User-readable progress**: when the user asks to view, at phase hand-offs, or when a long task changes substantively, show the verifiable Task ID, current phase, real completed and pending Work
Items, approved originals and versions, actual tests `passed/failed/unverified/N/A`, open Findings, stop reason and the next legal action. Provide no fictional real-time background progress, time
estimates or auto-monitoring promises.

**Coverage mapping method (general)**: build a per-source mapping from the current project's own valid approved sources, actual versions and applicable sub-conditions: `ID` →
`applicable sub-conditions` → `real consumers/concrete design` → `positive/negative assertions/failure exits` → `D/A/I/H verification route` → `evidence and design sign-off status`.
- Complete source identities do not mean every sub-condition passed; one shared design may verify several requirements, but each one's trigger, consumers, positive/negative cases and judgment must
  be independent; never copy the reverse relation from the forward one as a professional judgment.
- Old-version links are only `historical-evidence-candidate` and must be re-reviewed; applicable items with insufficient evidence are marked `needs-evidence`, never claiming a full pass; do not
  treat historical statistics as a new candidate passing, nor delete or rewrite original review records.
- (Concrete numbers of this plugin's own development baseline are in the repository's `docs/maintainer-baseline.md`.)

---

### 10.6 Verification design for Bugfix regression and code maintenance quality

| Check claim | Applicable verifier | Frozen beforehand and real completion evidence | Failure handling |
|---|---|---|---|
| Original Bug A really solved | D unit/contract/integration; I real API when needed; conditional A | Failing sample before the fix, real result with same input and version after | `failed/unverified` not closed |
| Other legal behavior not broken | D/I/H routed by shared consumers | Original legal values/defaults/error semantics, real consumer calls and regression results | Broken original behavior is a new regression; the original task is blocked |
| B introduced this time is fixed | Real causal analysis + D/I/human when needed | Linked Finding, real code diff, A+B+applicable impact surface re-verified | Without necessary re-verification the original A is not closed |
| Root cause and fix quality acceptable | Code review + objective checks + applicable independent perspective | Actual source and project conventions, complexity/duplicate implementation/exception paths/testability review | High-risk quality defects P0/P1 block; style suggestions may be non-blocking |
| Tests not tampered with to pass | D check of test diff/frozen expectations | Original assertions, coverage claims, actual execution, avoiding over-mocking | Fixes/tests must return to valid criteria and be re-verified |

- Code revisions of managed Features and Bugfix rework consume the same quality guardrails; pure Docs editing is N/A by real risk. No fixed 100% coverage, function line caps or baseless full-repo
  regression.
- PoC-J verifies real A→B regression, legal rework and maintainability Findings with controlled samples in an authorized target environment; without executed PoC/host capability E4 stays `unverified`.

**Strengthening actual Bugfix/Feature tests**: necessary impact-surface verification must correspond to the same real code/dependency/CI completion state, recording continuous evidence of failure →
investigation → rerun → final ruling; with flaky not ruled out or CI running, the original Bug/new regression cannot be closed early; re-read together with the approved behavior-preservation matrix.
The read-only design phase E3 may check the contract above but cannot fabricate a real completed regression.

---

### 10.7 Layered regression, evidence reuse and rerun basis

Consumes the fixed discovery rounds and fix batches of `formal-review-and-findings.md` §7.9. In the existing verification plan/records determine each layer's applicable set and failure conditions,
reusing scripts and evidence really available in the project, without adding fixed coverage or mandatory repeat counts:

| Layer | Applicable scope and timing | Evidence that must be kept |
|---|---|---|
| Per-item minimal verification | After each fix confirm the original failure and adjacent invariants; may run within a batch | Original failing input/assertion, revised version, actual result; a local pass does not close other Findings |
| Batch impact-surface regression | When a batch of related fixes is done, check direct/indirect consumers, shared contracts, original correct behavior and new regressions | Real diff and dependency reasons, applicable check set, each Finding's result; when shared-contract impact is broad, expand on evidence to the necessary overall regression |
| Final applicable acceptance | After consolidated fixes, check all required pass conditions on the exact delivery candidate at once | The complete set of current results and evidence reused with basis, candidate fingerprint, unverified/failed and necessary human decisions; unified acceptance does not mean rerunning every command |

**State the basis before each rerun**: actual change/new facts and object version → which old evidence is invalid and why → affected conditions/consumers → planned checks and reusable results → new
information expected this time. With no new facts and same-method retries making no substantive progress, apply the review Reference §7.6 instead of rerunning blindly. If static evidence suffices to
rule on a static fact, never rerun the whole Agent flow just to get a green CLI exit; necessary real runs still cannot be replaced by static checks.

**Evidence reuse conditions**: verify the code under test, related contracts, consumers, dependencies/environment, test/scoring criteria, execution status and applicability to this claim;
- with no relevant change and complete original evidence it may be cited, keeping the original version/Hash/executor; historical results may never be relabeled as a new-version retest.
- Report-only renames, non-semantic formatting or evidence file extension corrections are checked for real content, readability and references, and do not automatically invalidate product behavior
  evidence; if actual content, load entry, parser, environment or consumers change, re-judge the impact.
- When undeterminable, list the claim as `unverified` with minimal additional evidence; never assume all valid or all invalid.

**Failure and final exit**: all failures, cancellations, interruptions, flaky investigations and corrections are kept; product defects and test/environment/evidence packaging errors are ruled
separately. When new fixes affect existing conclusions rerun the necessary scope; never promise final acceptance always runs only once, nor restart all phases from scratch each time. When final
necessary conditions are unmet keep the corresponding block; task Auto does not replace independent authorization, real host evidence or final real-person acceptance.
