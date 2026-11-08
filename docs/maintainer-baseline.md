# Maintainer baseline (not loaded when the Skill runs)

This file keeps the baselines and historical numbers of developing the Task Lifecycle plugin itself, for maintainers; it is not a set of rules that ordinary projects
using the plugin must apply.

**Codes used in this file** (defined once here): **E3** = design or static evidence (reading files, static scripts); **E4** = real-environment evidence (a fresh
session on a real host). **REQ/AC/PAC/SC/UC** = requirement, acceptance criterion, process acceptance criterion, scenario and use-case IDs of the plugin's own
approved development baseline. **D/A/I/H** = verification routes (demonstration, analysis, inspection, human). **D1=A, D3=B, M-02 …** and **tNNNu/tNNNsNNNN** =
decision and review IDs and the owner's message/card IDs in the maintainer's history, kept as approval sources. **CAND-*** = a rule candidate in `candidates/`.

## Repository maintenance policy

These conventions apply only when maintaining the task-lifecycle source repository under the owner's verified project policy and current authorization.
Reading this file, a relayed message or an installed Skill creates no commit, push, publication or host-install permission. A narrower current instruction wins.
Ordinary consumer projects use their own identity, branching and release policies; this file is not loaded by their normal lifecycle.

- **This repository's main-branch preference (owner, 2026-11-08)**: later work on the task-lifecycle source repository prefers `main`.
  This is a preference for this repository only. It does not apply to other projects and it does not change consumer branching rules.
  Host branch protection, a required pull request and the current host's existing branch workflow still win.
  Do not cite this preference to bypass those, to force-push, or to push without a current authorization.
  The coding-agent model-selection rule does not authorize a push.
  If the host forbids direct work on `main`, report that limit and do not claim this preference is in effect.

- **Owner-only commit identity**: the original maintainer workflow used the owner's identity from facts/user.md or conventions and the repository's existing email
  for both Author and Committer, without bot Co-authored-by trailers. Apply that convention only to work actually authored for the owner under that policy;
  preserve other contributors' true identities and attribution. Report mismatches by commit ID; do not rewrite pushed history without the user's authorization.
- **Default merge method for integration -> release branches (CAND-20261029-003)**: when this owner convention is selected, squash the integration branch into
  the release branch, then merge the release branch back with a merge commit that changes no file and only records the merge base. Branch names come from the project.
  Reuse the valid method choice without another card. Pushing either branch still needs the real user's own authorization.
  Before squashing, verify the release branch has no content absent from integration; if it does, or merge-back would drop/change a file, stop that merge and present
  plain merge, compatible squash or selective cherry-pick with their costs. Never discard release-branch content silently. Cherry-picked dependencies and the
  resulting combined tree need verification. Record the squash commit and the merge-back commit IDs in the task record.
  First adoption with a stale merge base used a no-file-change merge-back before squashing, subject to the same checks and authorized push scope.
- **Intent-based immediate absorption**: under the maintainer's explicit standing authorization, a rule the owner sets or corrects is verified against the actual
  source transcript and applied by intent, then written, self-checked, committed and pushed the same day within that authorization. A verifiable original message
  and its identifier are required; a bot relay is only a lead. This convention does not itself authorize forwarding a message to another party.
  Reuse a valid in-scope decision with no confirmation card; clarify an unresolved conflict with prior rules, whether a request is one-off or standing, or an
  out-of-scope repository/action. Agent suggestions the owner did not state are not rules. Existing candidates keep their current flow.
  Version bumps, tags, releases and host sync retain their own actual authorization requirements; host memory grants none of them. If no standing authorization
  can be verified, do only the current request's authorized work and leave any additional external action pending.
- **Historical migration checks**: T103's zero-deletion comparison and T110's frozen original wording described the FEAT-20261028-001 migration from ecedaba.
  They are historical evidence, not permanent bans on approved edits. Current regression checks protect authorization, review scope, provenance and consumers;
  an intentional rule revision updates those checks with the approved semantic change, preserving the historical commit and review records.

## Package version and approval baseline (formerly in README)

- Historical source baseline: `0.1.43`, continuing the formally approved development requirements V0.18-R2, Usage Contract V0.5-R2, technical design R9-R2 and
  implementation plan V0.1-R2 baselines; on top of the existing shared-protocol references and examples it revised context-language inheritance, the mapping between
  plan and actual actions, and next-step guidance in substantive managed replies. That baseline (including intent-triggering changes) was pushed to the Git remote;
  a push alone does not mean it was saved to an account, recognized by a host install, or passed target-host E4 acceptance. The current package version is whatever
  `plugin.json` says; it includes the V1.2 maintenance revision and keeps the unproven states in [known gaps](known-gaps.md). The approval identity of each historical
  "candidate" follows the user's independent records.

## Maintenance checks (formerly in README)

Source checks and distribution-package checks are separate: the root `plugin.json` is the plugin content manifest, `.cursor-plugin/plugin.json` the Cursor manifest
(since 0.1.68, D4=A), and `.agents/plugins/marketplace.json` the Codex marketplace entry.
`scripts/maintenance-regression.test.mjs` T60 only compares the listed shared fields (name/version/description/license/homepage/repository/keywords,
author.name/email, developerName, marketplace name/displayName/category), whether Cursor manifest keys are in the official docs field table, and that logo/skills
paths exist; unlisted fields and actual host loading are outside its coverage.
When building a concrete distribution package, check manifest count, allowed content and actual consumption paths against that host's package contract; do not copy
every source file into the package; process materials and historical review evidence do not go into packages.
If the target format really includes a compatibility manifest, check field by field that its version and interface match the root manifest's display config; a
mismatch rejects the package, and "the source has no compatibility manifest" is no exemption.
Also check frontmatter, the three general-rule evolution templates, the three relay templates, reference consumers/paths, versions and unapproved features. A task's
active/INDEX/history are external data; real acceptance is recorded separately per the originally approved PoC-A–M.
This README must not promise system compatibility that has no E4 result.

**Line-length exemptions (G1-F09 closed by documented exemption, 2026-10-25)**: `scripts/check-docs.mjs` limits each line to 200 Unicode code points; LF/CRLF are
handled as logical lines; three kinds are not checked:
- The whole YAML frontmatter at the file start (from the first `---` to the closing `---`); SKILL.md's description must be one line, so it may be long.
- Table rows: lines starting with optional whitespace and `|`; Markdown table cells cannot wrap.
- Lines inside triple-backtick code blocks.

Maintenance runs `node scripts/check-docs.mjs` and the exact test files below (same as CI; no directory entry or shell-dependent glob):

```sh
node --test scripts/validate-config.test.mjs scripts/maintenance-regression.test.mjs scripts/dispatch-guard.test.mjs scripts/check-citations.test.mjs scripts/runtime-packaging.test.mjs scripts/instance-probe.test.mjs
```

The canonical runtime tools live in `skills/task-lifecycle/scripts/`; root scripts are compatibility wrappers. Keep a single implementation and verify both complete-plugin and Skill-only copies.
Skill `VERSION` remains the package-version authority when no plugin manifest ships; with a manifest, versions must agree. Config schema/examples in root `assets/` are reference material only.
CI targets Node 20 on Ubuntu and Windows. Local Node 24 Windows evidence does not count as a CI run or live model/Canvas verification.
The doc check uses the script's real file path, independent of cwd; missing required targets/main SKILL, an empty entry or zero scanned files all fail; `--compare`
keeps byte-for-byte and file-set comparison.
The citation tool keeps per-item stdout and per-input recognized/unchecked/failed summaries on stderr; any input with zero recognized fails, and the coordinator
reconciles against an expected list. Frozen citations read only file blobs of a fixed commit, never commit headers/directories. See review rules §7.10, three exits.
Config needs Node ≥20; on Windows a missing HOME may use the trusted system account home, while an explicit empty/conflicting value still closes. For the Windows
30-second wrapper entry, POSIX commands and output structure see the config consumption/output protocols; tests for missing capabilities are marked UNVERIFIED and
do not claim cross-platform passes.

**No-CJK gate (since 0.2.0; docs/ added in 0.2.2)**: `scripts/check-docs.mjs` gate (g) rejects CJK characters in `skills/task-lifecycle/**`, `CHANGELOG.md` and
`docs/**` except exact literals listed in `scripts/cjk-allowlist.json` (each scoped to its files, with a bucket and reason; stale entries fail). In docs/, allowed
literals are verbatim evidence: quotes of the owner's words, Chinese record paths and IDs, and the old file names in `old-path-map.md`.

## Plugin development baseline coverage mapping (formerly references/verification-and-evidence-routing.md §10.5)

**Scope**: the numbers below (566, the former 527, the 39 added, etc.) belong only to the identities and historical differences of the R9/older approval sources used
when developing Task Lifecycle itself; they are not a coverage denominator that ordinary projects must apply. An ordinary project builds its mapping from its own
valid approval sources, actual version and applicable sub-conditions; the per-source, consumer, positive/negative assertion and evidence-level method still applies.
Later maintenance checks sources and reusable evidence by real impact, does not treat historical statistics as a new candidate's pass, and does not delete or
rewrite the original review records.

**Plugin development baseline coverage mapping (R9 baseline only)**: per §18, the currently approved 83 REQ, 130 AC, 105 PAC, 192 SC and 56 UC form 566 source
identities; each needs its own `ID → applicable sub-condition → real consumer/concrete design → positive/negative assertion/failure exit → D/A/I/H verification route
→ evidence and design sign-off state`.
 The historical 79/122/100/180 and 16 U/18 N are only older review scopes; reverse relations must not be copied from forward ones as professional judgment.
Applicable items with insufficient evidence are marked `needs-evidence`; a full pass must not be claimed.

**REV-00 current coverage table / REV-10 anti-false-convergence**: technical candidates and later review objects use the approved **510 REQ/AC/PAC/SC + 56 UC = 566**
source identities (`REQ-001–083 / AC-001–130 / PAC-01–105 / SC-01–192`; `U-01–17 / N-UC-01–27 / N-DP-01–06 / N-RG-01–06`). The former 481+46 is only historical
scope; having all 566 current identities does not mean every sub-condition passed. A review worksheet may verify several requirements with one shared design, but
each one's trigger, consumer, positive/negative cases and judgment must be independent. When a new candidate is first created, section links of the former 527
items are only `historical-evidence-candidate`, and records that once showed `covered+pending` must be re-reviewed; the 39 added items are consumed one by one by the
new upstream, with no default "the new R9 says it, so everything passes". A real sign-off of the current technical formal review only comes from executing a new,
independently approved plan.

## Development history and method (moved from README in 0.1.68)

**Applicability of this plugin's development history**: the 566, former 527 and 39 added in
[verification rules §10.5](../skills/task-lifecycle/references/verification-and-evidence-routing.md#105-separating-real-progress-acceptance-tracking-and-evidence-levels)
only trace the matching approval baselines of developing Task Lifecycle itself; ordinary projects use their own valid source sets and applicable sub-conditions.
Original approvals, failures and review history stay in the maintenance process records; they are not a fixed coverage task for every user and do not become new
verification results with a new package version.

**Collect findings together, fix in batches, regress in layers**: a fixed version and a bounded list complete this round's issue collection; then fix by real root
cause/dependency; each item gets minimal verification, each batch a consumer-impact regression, and finally applicable acceptance is done together.
Blocking prerequisites get a minimal fix first while keeping version boundaries; unaffected qualified evidence is reused at its original version, and every rerun
states what changed and why the old evidence is invalid.
Ownership is in [review rules §7.9](../skills/task-lifecycle/references/formal-review-and-findings.md) and
[verification rules §10.7](../skills/task-lifecycle/references/verification-and-evidence-routing.md); the matching templates and the Bugfix example show usage;
these rules do not promise finding every bug at once or replacing real tests/human acceptance.

The README covers installation, usage and configuration (D1=A); `README.md` (English) and `README.zh-CN.md` (Chinese) correspond section by section and are synced at
every release (D2=B).
Before a release, check this push's CI result on both ubuntu and windows; if red, state the cause in the release record and relay, and the owner decides whether to
release anyway. No separate gate process; a run URL is not a hard release condition.

## candidates/ excluded from distribution and the three installs (D3=B)

`candidates/` is local-only after 0.2.2: untracked with `git rm --cached` and listed in `.gitignore`; older commits still contain it in history.
The exclusions below stay as a second line of defence, so it never goes into distribution packages or the three installs on the box:
- Packaging: the root `.gitattributes` has `candidates/ export-ignore`, which only affects `git archive`/ZIP of committed trees; clone installs (Codex/Grok) and a repo
  placed in `~/.cursor/plugins/local` are not affected.
  Read-only archive check: `git archive HEAD | tar -t | grep -c '^candidates/'` must be 0; `.gitattributes` must be in the same commit as the change.
- Cursor install: `host-sync.sh` only runs `git archive HEAD skills/task-lifecycle`, which never contains `candidates/`.
- Sync targets: new versions sync only to the bot hosts on the box (Cursor, Codex, Grok installs there), never
  to the user's own computers.
- Version alignment: after a host sync the user approved in their own words, the Cursor, Grok and Codex installs on the box carry the same
  version as the plugin `VERSION`; a mismatch is reported and fixed by the next approved sync.
- Full reviews of this plugin are run by the maintainer bot itself, not delegated to other hosts.
- Codex / Grok installs are git clones: `host-sync.sh` (`/home/box/task-lifecycle-records/host-sync.sh`, outside the repo) ends by running
  `git sparse-checkout set --no-cone '/*' '!/candidates/'` on both. Since M-02: back up first with a timestamp to `<ACTDIR>/backups/excl-<ts>-<name>`; a
  target that is not a git repo root is an error with non-zero exit; success requires `candidates/` absent, `skills/task-lifecycle/SKILL.md` present, the file count
  equal to the `git archive` source and `diff -rq` clean (prints `EXCL ok`).
  Rollback: `rm -rf <target> && cp -a <backup> <target>` (the script prints the exact command on failure), or `git -C <target> sparse-checkout disable`. Ran on the
  real Codex and Grok installs from 0.2.0 on (HOSTSYNC-20261027-0200/0201, `EXCL ok`); earlier it was only simulated in a temp directory.
- The `plugin-maintenance` candidate pool lives only in the source repo: installed plugins contain no `candidates/`. Consumer `workspace-extension` candidates live in their verified external
  workspace and are not part of this maintainer pool or its commit/tag checks; see `../skills/task-lifecycle/references/rule-evolution.md` "Rule domains and storage".

### Maintainer candidate status closure on promotion and release

Only for `plugin-maintenance`: the turn that commits an incorporated candidate moves its body from `pending/` to `archived/`, updates its `candidates/INDEX.md` row (status, commit, path),
and reconciles known copies of that same source candidate. A release turn sets each shipped candidate to its released version. Before tagging, check that no pending body or INDEX row
names a commit or version already released; a hit is fixed before the tag. Identity is scoped to the selected source root; independent workspace IDs are not renumbered.
Before tagging, the release also checks that `candidates/pending/README.md`, `candidates/archived/README.md` and `candidates/rejected/README.md` list exactly the
candidate files in their directories, with status consistent with `candidates/INDEX.md`; a mismatch is fixed before the tag (CAND-20261102-005, additive).
Within this source candidate store, resolve any real ID collision without overwriting history, retaining old-reference mapping. Historical cross-store references keep their original provenance.
