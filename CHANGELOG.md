## 0.2.14 — Options before free text, real progress, Auto local commit, quota delegation, sync targets (2026-11-01)

- Rocky t286u (card t284s1651), bot-skills absorption: "Options before free text" and "Report real progress proactively" (confirmation
  `Pending decisions`); "Auto defaults to local commit in every repo" (end-to-end-auto-card.md); "No delegation when quota is tight" (task-split delegation);
  host-sync targets only bot hosts on the box (maintainer-baseline.md). Page labels 10f unchanged. Test T117.

## 0.2.13 — Intent-based immediate rule absorption (2026-10-31)

- `formal-review-and-findings.md` §7.10 item 7: new "Intent-based immediate absorption" (Rocky t250u, t251u, t252u): rules Rocky sets or corrects are written,
  committed and pushed the same day with no confirmation card; one question only for conflict, one-off vs standing, or Yingnuo repos/tags/releases/host installs;
  releases still need his words. `rule-evolution.md` relayed-correction bullet: transcript verification by message id counts as confirmation. Test T116.

## 0.2.12 — Page width floor, default merge method (2026-10-31)

- `verification-and-evidence-routing.md` report-type Page list, item 8: new "Width floor override (Rocky t242u)": Page width "wide" or "full", never "column";
  desktop body not narrower than 1024px; public pages.grok.bot links exempt (960px platform cap); sidebar contents thresholds 968px and 1100px both kept. Test T115.
- `confirmation-authorization-and-change.md` §6.6: new paragraph "Default merge method for integration -> release branches": default (c) squash then
  no-file-change merge-back, no per-merge card; precondition check with a card fallback (former options and a recommendation), release-branch content never
  silently discarded; squash and merge-back commit IDs recorded; first adoption resets the base with push authorization. CAND-20261029-003 (Rocky t193s1228);
  approval card t202s1271 (commit and push only, no version bump). Regression test T114.

## 0.2.11 — Self-write reconciliation after compaction (2026-10-31)

- `workspace-versioning-and-recovery.md` §9.4: new trigger-chain step "self-write reconciliation" and paragraph "Self-write reconciliation and reply order after
  compaction": list own writes and side effects since the last trusted point from mtimes, git status/diff, the task record and tool log; recovery completes only
  when each is matched or marked unknown with evidence (read-only until then); an unexplained write in scope is first checked as possibly one's own; with a waiting
  user the reply/pre-check still comes first. Candidate CAND-20261031-002 (Rocky t185u).
- `task-split-parallel-and-integration.md` "Execute item by item" item 5: sub-task return reports list written files (path + SHA-256) and side effects; the main
  session spot-checks consumed files against real mtime/SHA before accepting. Regression test T113.
- Release approval card t187s1164.

## 0.2.10 — Mode card at fixed points, skill VERSION file (2026-10-31)

- `confirmation-authorization-and-change.md` §6.3.2: new "Mode card at fixed points": a task still in Confirm gets one mode card (Confirm, task-level Auto,
  end-to-end card `noStop: false`, end-to-end card `noStop: true`, with a recommendation) after A02 is `human-confirmed` and whenever the user says "auto" or similar;
  for such wording this takes precedence over "never re-asking because of wording"; only the card choice is an Auto source. `entry-quickref.md` row "2 Mode card".
  Candidate CAND-20261031-001 (Rocky t179s1106).
- New `skills/task-lifecycle/VERSION` so installed copies show their version; `check-docs.mjs` check (h) keeps it equal to both plugin.json files. Regression test T112.
- Release approval card t181s1118.

## 0.2.9 — Verified recommendations, narrow restore and re-clone after instance change, merge-method card (2026-10-31)

- `confirmation-authorization-and-change.md` "Pending decisions must carry a recommendation": new paragraph "Verify premises and reasonableness before recommending;
  no blind picks": options and a recommendation are always given; premises (timing, frequency, scale, phase progress) are verified and reasonableness checked first; the
  reason states reasonableness, necessity, benefit and the verified premises; an unverifiable premise is settled first, with no new exception. Rocky t167u, t170u, t171u;
  release approval card t172s994.
- `workspace-versioning-and-recovery.md` §9.8: "Pre-authorized narrow restore" (commit a6810a3) and "Broken empty-remote clone" (commit d754b0f).
- `confirmation-authorization-and-change.md` §6.6 "Merge method before an integration-to-release merge" (commit 8ab203e).

## 0.2.8 — End-to-end Auto card, host-native parallel config, review intensity (2026-10-28)

- New reference `end-to-end-auto-card.md` (pointer `confirmation-authorization-and-change.md` §6.3.2): Auto form (ii), an end-to-end Auto card with ten required keys,
  shown only after A01 and A02 are human-confirmed, phases `A03..A07` at most, only `local-commit` pre-authorizable; `noStop: true` adopts recommendations as
  auto-decisions (implementation only, never acceptance or test pass criteria) and suspends everything else into one endpoint report; exceptions E1–E20 are task-level,
  only when selected, original text unchanged. Existing Auto is unchanged. Regression tests T96–T101.
- `task-split-parallel-and-integration.md`: new last section "Host-native parallel config (parallel)" plus two additive pointer sentences; optional `parallel` key
  (`enabled`, `maxConcurrent` 1–4, boolean `categories`, `sameRepoWrites`); omitted or off is identical to 0.2.6; enabling grants no permission; project layer only
  narrows. Regression test T102.
- `scripts/validate-config.mjs`, `assets/config.schema.json`, `assets/config.example.json`, `validator-output-protocol.md`: `parallel` checks with existing reason codes
  only, `effective.parallel` always present when valid (fixed default block when off); `schemaVersion` stays 1. Tests T104–T107.
- Compatibility: upgrade the plugin before writing `parallel`; versions up to 0.2.7 report `unknown-field` and disable the whole config. Test T108.
- `task-recognition-and-routing.md`: new "Review intensity" after the Kickoff card: `light / balanced / strict`, default by depth, a separate second Kickoff question,
  not in config; no tier skips a required gate and every tier stays under the §7.10 item 7 General review cap. Tests T109–T111.
- `entry-quickref.md`: LABELS rows, a RUNTIME_NAMES row with the fixed-English-name exception for the three record files, and an action-map line; `cjk-allowlist.json`
  entries. Test T103 guards zero deletions and SKILL.md unchanged (≤600 lines).
- Task FEAT-20261028-001 (Rocky D1–D48); acceptance card t949s5392, release approval t950u.

## 0.2.7 — Untruncated status evidence, control request before blaming upstream, user-chosen re-review performer (2026-10-28)

- `verification-and-evidence-routing.md`: new item 10: before stating a count or an only/all/none conclusion from command output, check whether the output was cut by
  `head`/`tail`/`sed -n` or display truncation; if so, rerun a full or counting command and state the total, otherwise the conclusion is `unverified` and is not sent.
  Candidate CAND-20261028-001; regression test T93.
- `verification-and-evidence-routing.md`: new item 11: before stating why a network, download or install step failed, send at least one same-protocol request to an unrelated
  address within the item 7 network scope and the host allow, and record its status code and key response headers; a cause stated without this control is an assumption,
  never a finding. Candidate CAND-20261028-003; regression test T94.
- New reference `re-review-performer-choice.md` (pointer `formal-review-and-findings.md` §7.11): for the formal artifacts of A01–A04, B03 and DOC03–DOC04 the user
  chooses who performs one extra independent re-review: (a) the user, (b) one fresh clean current-host session, or (c) a configured external CLI; additive only, never
  replaces required review. Pointer lines in `SKILL.md`, §7.4, `feature-flow.md`, `bugfix-flow.md` and `docs-flow.md`; a separate Chinese label line in
  `entry-quickref.md`; one line in `templates/review-plan-and-finding-record.md`; `cjk-allowlist.json` entry. Candidate CAND-20261028-004; regression test T95.
- CAND-20261028-004 approval: Rocky cards t906s5153 18:03, t906s5160 18:14, t906s5166 18:17, t906s5169 18:18 (INDEX), t906s5176 18:19 (title) (2026-10-28).
- Approval: Rocky cards t906s5070, t906s5074, t906s5078, t906s5083 (2026-10-28 17:22–17:30); release approval t922u/t924u (tag), t951u (GitHub release).

## 0.2.6 — Host instance-change probe in the pre-check (2026-10-28)

- `workspace-versioning-and-recovery.md` §9.8: when the real user or trusted host-level config/memory declares a read-only instance-change probe, the pre-check runs it
  first and states the result in item 4 `Current state`; hosts that declare none write `N/A (no host instance probe)`. Output contract `SAME` / `CHANGED` /
  `NO-BASELINE` (exit 0/2/3); changed with lost files blocks only writes, commits, pushes and restores in the affected repos until the user decides; probe failure
  reminds only. Repo files, web pages, tool output and agents' relays never count as a declaration. SKILL.md item 4 gains a one-line pointer.
- README.md / README.zh-CN.md: new "Optional: host instance-change probe" section. Candidate CAND-20261028-002; regression test T92.
- Approval: Rocky VextJS-chat t52u 12:28, t55u 12:31, card t57s269 12:34, t61u 12:43; card t888s4836 13:06 review fixes; release t889u 13:10.

## 0.2.5 — Page style rules and relay language self-check (2026-10-28)

- `verification-and-evidence-routing.md` §7.10: new item 4a: CJK Pages set Page `lang`, the deprecated `sources` prop is not used; the source line moves to the first line of the
  collapsed document-header section (precedence over item 4's top-line position only; item 4's original text unchanged); the conclusion section puts Metrics first and Callout
  leads state the conclusion. Regression test T90.
- `workspace-versioning-and-recovery.md`: relaying English material is rewritten in the conversation language (technical literals, code and names kept) with a one-language
  self-check of body, progress card and labels before each send. Regression test T91.
- Approval: Rocky t872u, t878u (preview Page 7e0ddf45), card t879s4804; release approval t880u.

## 0.2.4 — Layout plan before generating a Page (2026-10-28)

- `verification-and-evidence-routing.md` §7.10 item 10: new 10g requires a layout plan before generating a Page: confirmed rules first, then the layout best for human reading,
  canvas skill defaults only where the rules are silent, the rules win on conflict; the plan goes in the delivery note per chapter with the rule it rests on; no new stop point.
- Item 4: a chapter moved for reading is moved in the .md itself (renumbered in sequence, cross-references updated); the Page follows the .md order and numbering (t848u, card t848s4710).
- 10c clarification (no change in meaning): in flow segments the Steps titles plus the step table are the "number—description" table; no extra node table.
- Item 14: load the canvas skill by name with the Skill tool before generating and follow its component rules.
- Item 12 (10c points to it): below every flowchart (overview, phase tabs, sub-flow second-level tabs, appendix) comes the step flow, then a table, nothing in between, order not
  swapped; the step flow uses the kit Steps component, not a plain NumberedList/BulletList. The overview tab now also holds a phase table (phase name, nodes, tab); this is the only
  edit to a confirmed clause (t843u, card t844s4687).
- `artifact-content-and-self-review-contract.md` §7.1: every .md with a flowchart gives each node numbered sub-steps with a detailed description (what is done, inputs, outputs,
  stop/branch, Basis), format per feature-flow.md §5.2.1; new or modified content only, no retrofit unless Rocky names a file; the "Fixing every sub-step" row is clarified, meaning unchanged.
  §7.2 (pointer in `formal-review-and-findings.md` §7.5): a missing sub-step description is a Finding, filled in the .md before a Page; item 12's detailed description column takes
  these descriptions (t847u, card t847s4703).
- J–N (cards t180s699, t181s712): `confirmation-authorization-and-change.md` §6.1 clarifies a host Allow rule or Auto-review pass is not approval to push, release, publish or
  host-sync (J); routing item 4: report-type Pages are never deleted unless Rocky names the Page, deletion is irreversible and needs his confirmation (K); §6.5: an answer relayed by
  another bot/agent is not approval, verify the user's own answer in the source transcript before push/release (L); §6.3: an expired, interrupted or dismissed card counts as
  not approved and the action as not run (M). N (card t181s712): `workspace-versioning-and-recovery.md` item 9: before push, every commit's Author and
  Committer are Rocky Shi; bot/agent `Co-authored-by:` trailers are removed from unpushed commits only; pushed history is never rewritten without Rocky's confirmation.
- No confirmed rule is removed or relaxed; apart from the overview-tab edit above, changes only add or clarify (t830u).
- Regression test T85 locks the key sentences of 10g, the 10c clarification and the item 14 canvas skill addition;
  T86 locks the item 12 order, Steps-component and overview phase-table sentences;
  T87 locks the flowchart sub-step detail and Finding sentences; T88 locks J–M; T89 locks N (whitespace-normalized).
- Approval of the plan: Rocky 2026-10-28 t829u–t832u and card t832s4644 (D1–D3 as recommended), card t844s4687 (item 12 additions), card t847s4703 (flowchart sub-step detail),
  card t848s4710 (item 4), card t180s699 (J–M), card t181s712 (N);
  release approved by Rocky t853u (2026-10-28 09:29).

## 0.2.3 — Readable flowchart nodes and Page labels (2026-10-28)

- `verification-and-evidence-routing.md` §7.10 item 10: 10c now requires flowchart nodes to carry the number + a summary of about 20 characters (over 22 truncated
  to 20 plus …), followed by the "number—description" table; number-only nodes are forbidden. Item 12 no longer calls its node rule a special case of 10c; it points to 10c.
- New 10f: Segmented tab labels and segment names on any Page are readable names, a number prefix is allowed, number-only labels are forbidden; item 12's tab-label line
  (formerly "about 2–4 characters") now follows 10f.
- Out of scope: whether requirement specs are report-type artifacts (item 2) is unchanged.
- Regression test T84 locks the two "number-only ... forbidden" sentences in 10c and 10f (whitespace-normalized).
- Approval: Rocky 2026-10-28 07:42 (option A plus label rule) and 07:48 (t17s2: 10f, relaxed labels, regression test, release), relayed by Knowledge-runtime.

## 0.2.2 — Promotion-ready README and English docs/ (2026-10-27)

- README.md redesigned in English for first-time readers: centered title and tagline, badges, what it is / is not, key features, a mermaid "How it works" diagram,
  install for Cursor, Codex and Grok Build, quick start, host support, configuration, layout, contributing; internal evidence codes removed. README.zh-CN.md mirrors it.
- Host support: Cursor, Codex and Grok Build listed as tested (Cursor per owner decision D12, same behavior as Grok Build); the Grok install command
  `grok plugin install devcodex-labs/task-lifecycle --trust` was run in an isolated home and installed the plugin.
- `docs/` is now English: `docs/known-gaps.md` replaces the Chinese-named known-gaps file (mapping in `docs/old-path-map.md`); `maintainer-baseline.md` and
  `old-path-map.md` translated; references in `formal-review-and-findings.md` updated.
- `scripts/check-docs.mjs`: the no-CJK gate now also covers `docs/**`, with exact-text allowlist entries in `scripts/cjk-allowlist.json` for old file names,
  verbatim evidence quotes and record paths; T79 and T62 in `scripts/maintenance-regression.test.mjs` updated.
- Approval: Rocky t793u, t794u (D12), t797u (D13), t800u, t803s4525 (D14).

## 0.2.1 — Light-turn heading and CRLF-safe citations (2026-10-27)

- D11 (Rocky t791u): a light 4-item turn carries no heading, only the 4 labelled lines; the `Pre-check name` label is restricted to execution turns (SKILL.md top map,
  §4 light turn, and `LABELS` in `references/entry-quickref.md`, kept equal by T82). Evidence: on the live Grok Build install of 0.2.0 the light turn was headed with the
  Chinese pre-check name in 3/3 runs (isolated b, live b and b2).
- `scripts/check-citations.mjs` normalises CRLF when reading cited and target files; test T83 runs the English and legacy citation forms on CRLF files.
- Approval: Rocky t791u (D11).

## 0.2.0 — English as the single source of truth (2026-10-27)

- D1 (Rocky t784s4403): `skills/task-lifecycle/` and this CHANGELOG (full history) are now written in English as the single source of truth; `docs/` stays Chinese for now.
  Migration started from ebadf64 (0.1.73) under a rule freeze: meaning-preserving translation, IDs, codes, paths, § and item numbering kept.
- Renames: all references, templates and examples use English file names (D2 short names, e.g. `workspace-versioning-and-recovery.md`, `rule-evolution.md`, templates end in
  `-record`); every old → new path is listed in `docs/old-path-map.md`.
- D5 (Rocky t788u): rules triggered by what the user says (question cues, continue cues, vague approval, self-described dispatch, intent phrases) are now intent descriptions in
  any language, with no Chinese word lists; the legacy Chinese config detection (literal rules L13/L14) keeps its Chinese literals.
- D2 (Rocky t784s4410): rules that check text we write (relay qualifiers, sentence breaks, empty shorthands, quote pairs, labels) use fixed bilingual constants in
  `references/entry-quickref.md`; a half-width "." inside numbers, paths or code does not break a sentence; glossary terms fixed (delegation config, baselines, source of
  truth, deterministic tier, first-leg/second-leg/verifier).
- User-visible labels are defined in English and rendered in the conversation language via the `LABELS` and `PHASE_NAMES` tables; D6: runtime file and directory names in
  user workspaces stay Chinese and are listed in the `RUNTIME_NAMES` table.
- Limits: D4 (Rocky t785s4419, t787u) SKILL.md cap 180 → 300 lines and an English-only SKILL.md description; D7 (Rocky t789s4437) references cap 300 → 500 lines; line length ≤200
  unchanged.
- New gates in `scripts/check-docs.mjs`: no CJK in `skills/task-lifecycle/**` and CHANGELOG.md except exact literals in `scripts/cjk-allowlist.json` (scoped per file, with
  bucket and reason; stale entries fail); the SKILL.md frontmatter description must be a single line. Tests T79/T80 cover both.
- D2 L18: `scripts/check-citations.mjs` accepts the English citation form `` `path` line N `` / `` `path` lines N-M `` (preferred for new citations, defined in
  `formal-review-and-findings.md` §7.10 item 9) alongside the legacy Chinese line form, with the same file and range checks; tests T81.
- Scripts and tests: assertions, the `CATEGORY_STAGE_LIMIT_TEXT` / `NEVER_DELEGATE_TEXT` constants, comments, test names and script messages are in English; runtime-compatibility
  literals stay verbatim. T62 frozen-mode tests build an unreferenced snapshot commit when HEAD lacks the current files.
- D8 (Rocky t789s4449): SKILL.md carries an inline label map right after the title (entry notice, pre-check name, 7 execution items, light 4 items, three
  statuses, progress card), copied verbatim from `LABELS` (still the source of truth; test T82 enforces equality); the conversation language decides the labels, never
  self-translated; later label mentions in SKILL.md point to the map. Fixes Codex rendering English labels in Chinese conversations (its tool output truncation hid §4).
- Approval: Rocky t784s4403 (D1), t784s4410 (D2), t785u (D3: Auto, standard), t785s4419 and t787u (D4), t788u (D5), D6 (maintainer decision, no card),
  t789s4437 (D7), t789s4449 (D8), t789s4458 (D9: release).
- Known gaps: Cursor not yet live-tested in a fresh session; a light-turn heading slip ("pre-check" heading on a 4-item turn) seen once on Grok.

## 0.1.73 — CI recovery and nine-item list (2026-10-27)

- docs/已知缺口.md: overlong lines L18/L71/L73 only wrapped at clause boundaries; added a "current open index" at the top (including pending-confirmation items); FEAT-20261026-001 closed with 0.1.72;
  the record Page clause is not split for now.
- `scripts/validate-config.test.mjs`: FIFO probe adds `lstatSync().isFIFO()`; a fake FIFO on Windows is marked UNVERIFIED and skipped (Linux behavior unchanged).
- `.github/workflows/check-docs.yml`: `fail-fast: false`; test step `if: always()`; explicitly runs the three test files including `dispatch-guard.test.mjs`.
- `scripts/dispatch-guard.test.mjs`: normalizes CRLF when reading files, avoiding failures on Windows checkouts.
- `docs/maintainer-baseline.md` and `task-split-parallel-and-integration.md` L156: test commands match CI; before release, check CI on both platforms live; if red, state it and let Rocky decide.
- Out-of-repo `host-sync.sh`: after a successful sync, writes a "load acceptance" placeholder table (Cursor/Codex/Grok).
- Approval: Rocky t783s4386 ("fix all 9 items"), t783s4393 ("commit, push and release 0.1.73").

## 0.1.72 — Grok Build unattended capabilities fully opened, only five baselines kept (2026-10-27)

- `task-split-parallel-and-integration.md` external coding executor delegation items 2–5 and the grok 1.0.70 version table rewritten: grok reading, writing, git, network, interpreters, package
  management and sub-agents are all unrestricted;
  only five baselines remain: no push, no publish, no delete, no credential reading, no signing conclusions. Unattended runs use the no-confirmation mode plus baseline deny rules; drafting and
  code writing become enableable; commit removed from the never-delegate list.
  Removed the read sandbox, network cutoff, write ban, minimal allow list, two hard thresholds, "loosening requires F1 retest" and "at most 2 reruns". Deny interception and shell-variant bypass
  under no-confirmation were not tested live (Rocky waived); recorded truthfully as unverified.
- `formal-review-and-findings.md` §7.10 item 0: grok review sessions are invoked per the previous entry and do not modify the reviewed object; other external CLIs (e.g. codex) keep their original
  constraints.
- `SKILL.md` receiver-gate allowed items synced with the three relay review templates; anti-recursion (no further dispatch, no agent CLI calls, no managed Task creation) kept.
- `NEVER_DELEGATE_TEXT` in `scripts/validate-config.mjs` synced with the `scripts/dispatch-guard.test.mjs` assertions.
- Approval: Rocky t781s4369 ("open all capabilities, keep only the push, publish, delete, credential and conclusion-signing baselines"), t782u (live-test waiver), t783u ("after the changes,
  commit and push first, then release and update the plugin").
- Known: 3 overlong lines in docs/已知缺口.md (brought in by a0cd520) still keep check-docs and CI red; out of scope for this version.

## 0.1.71 — Flow Page main-flow tabs, second-level sub-flow tabs and line-by-line Steps (2026-10-27)

- `verification-and-evidence-routing.md` items 7, 10b and 12 layout edited in place (small rule: +12/-7 vs 0.1.70, net +5 lines and revertible; includes splitting two overlong lines at clause
  boundaries to pass check-docs line length, wording unchanged):
  removed the per-section "↑ Contents", keeping only the top contents (t762u); one set of first-level segmented tabs per page, labels = main-flow phase names, "Flow 1/2/3" forbidden, subordinate
  flows merged into the phase they attach to (t758u/t762u);
  a phase tab carrying subordinate flows gets a second-level Segmented control, each option with its own connected subgraph + Steps + step table, same-graph islands forbidden (t765u); numbered
  sub-steps each rendered on their own line, "\n" joining forbidden (t765u);
  the overview tab holds no materials/ordering notes/long Callouts, exits merged into the triggering phase (t752u); no fabricated chapter overview tables, no short tab labels, flow chapter titles
  contain only the chapter name (t750u/t772u).
- Real generation verification: the Skill-runtime requirements overview Page fe1c9c33 reading version confirmed by Rocky (Skill-runtime session t16u "this version confirmed").
- Approval: Rocky t775u ("commit, push, release and update").

## 0.1.70 — Flow Pages must use segmented tabs (2026-10-27)

- `verification-and-evidence-routing.md` item 12 layout tightened (small rule: +2/-2, net 0 lines and revertible):
  when there is an overview and phases (or appendices) they must be one segmented tab group; stacking multiple independent Sections is forbidden;
  the overview tab holds only the overview graph and Steps, not the full-path step table, and no node graph is inserted between the overview graph and Steps;
  in mixed documents each flow segment gets its own tab set (t743u).
- Approval: Rocky t743u asked to add the rule first and then have Skill-runtime redo it per the new clause;
  t743s4191 authorized releasing 0.1.70 (commit by filename, push, sync three places).

## 0.1.69 — Feature flow step-by-step detailed descriptions and flow Page step tables (2026-10-27)

- `feature-flow.md` adds 53 step-by-step detailed descriptions (large change: +121/-0 vs HEAD, fails §7.10 item 7 "net ≤5 lines and revertible"):
  additions only, no existing content changed, every basis taken from existing rule text; the A09-1 "write completion report" rule sets no minimum content, so nothing was added without basis (marked
  "— (rule does not specify)");
  9 steps already have complete actions, marked "action complete" and not rewritten.
- `verification-and-evidence-routing.md` item 12 (small rule: +4/-3, net +1 line and revertible):
  the layout table changed from the "node/implementation/flow/basis four-column table" to a step table (step/action/detailed description/implementation/flow/basis, one row per numbered sub-step,
  rows in Steps order); detailed descriptions taken only from the canonical text, "action complete" when the action says it all, "—" when the canonical text is silent, no inventing; materials on the
  node's first row, stop points on its last row; node-level content on later rows written "same as above" (t733u, t738s4158).
  WI graphs without numbered sub-steps may use the four-column table (headers localized to WI/How/Downstream/Acceptance basis).
- Approval: Rocky confirmed the plan and the item 12 change text step by step in t731u–t738s4158, t739u Auto to proceed; real generation verification is the v3 Page (5c9e0cb3) generated by Grok Bot
  itself, accepted by Rocky on card t739s4170, who authorized commit and push.

## 0.1.68 — Page contents and width changed to reading effect + host defaults (2026-10-27)

- Fixes BUG-20261027-Page像素条款卡死生成 (large change): `verification-and-evidence-routing.md` items 7 and 8 change from implementation duties of a hand-written sidebar/fixed/IntersectionObserver/pixel
  formulas to reading-effect acceptance + "component/host defaults suffice; no hand-written fixed/observers/pixel calculations"; 968/248/960 demoted to reference measured values (not implementation
  duties);
  10b drops the 968px criterion. The top contents and "↑ Contents" remain mandatory.
- Item 12 last sentence corrected (t714s3996): flow graph node = number + ~20-character summary (over 22 characters truncated to 20 plus …), the overview graph uses descriptive phase names; a
  special case of 10c, 10c unchanged for other graphs.
- Item 13 (CAND-20261027-013, Page rule changes raise a card asking whether to generate for real) withdrawn (t719u), not released; a placeholder line is kept so item 14 keeps its number.
- `formal-review-and-findings.md` §7.10 item 7 routing: must quote the small-rule clause and item 5 eligibility verbatim, state the net added lines, and judge only by written conditions; large
  change = fails any small-rule condition (t690u, t690s3898).
- Item 12 gains two lines (t712s3983): overview/phase/appendix tabs in one segmented group, phases grouped by node, appendix second-level tabs open with a short note; Steps one step per node,
  numbered sub-steps, a "Materials:" line, stop points only add what is not covered.
- Item 14: Pages are generated by Grok Bot itself (t706u, t707u): generated with WriteCanvas, not dispatched to third-party CLIs; third-party output does not count as a Page or as its real
  generation evidence.
- `task-split-parallel-and-integration.md` pre-dispatch fit analysis (t709u, t709s3970): before dispatching to a third party, compare output and required tools to see who fits better; the reason
  goes into pre-check item 6.
- README redesign (D1–D5, t720u/t720s4033–4044): README.md in English, README.zh-CN.md in Chinese, covering only install/use/config; version/bug notes go to CHANGELOG, acceptance counts to
  docs/已知缺口.md, development history to `docs/maintainer-baseline.md`; added config and component tables; noted as not listed.
- Added `.cursor-plugin/plugin.json`, root `plugin.json` kept; `maintenance-regression.test.mjs` T60 compares shared fields; marketplace category unified as Developer Tools; author name unified as
  Rocky Shi (plugin.json, LICENSE, README).
- `candidates/` excluded from distribution: `.gitattributes` export-ignore; exclusion from the three install syncs in `docs/maintainer-baseline.md`; `check-docs.mjs` also checks README.zh-CN.md
  (when present); `.gitignore` covers root-level clutter.
- Approval: Rocky card t683s3862 chose A, standard (2026-10-27 13:38 UTC+8). Method: large-change static review + grok-build plan re-review; gates and isolated real-generation regression in the
  process directory.

## 0.1.67 — Flow Page layout (2026-10-27)

- Lands DIRECT-20261027-流程型Page-IA吸纳 (large change): `verification-and-evidence-routing.md` "Report artifacts and the Grok Bot reading-version Page" appends item 12 "Flow Page layout (Grok Bot host
  only)".
  Applicable/not-applicable lists, criteria, layering with CAND-20261026-009, overview tab / exception backflow / unwritten discipline, boundary with item 10 10a/10c; items 1–11 and the 009 scope
  unchanged.
- Approval: Rocky t672u confirmed the plan; t673u Auto + commit, push and update the plugin after verification passes; t675u standard. Method: large-change static review + grok-build plan re-review
  r1→r2 passed; gates and real runs in the process directory.

## 0.1.66 — Report deliveries must self-check that the Page exists (2026-10-27)

- Promotes CAND-20261027-001 (small rule): `verification-and-evidence-routing.md` "Report artifacts and the Grok Bot reading-version Page" appends item 11 "Delivery self-check (Grok Bot user-facing
  only)".
  Before claiming "delivered", the Page must already be written and the reply must contain a clickable link; omission rejects that delivery claim. Items 1–10 and the CAND-009 scope unchanged.
- Approval: Rocky 2026-10-27 (UTC+8) t647u ("promote it"). Method: small-rule self-check + automated checks, no dedicated real case run (t578u).

## 0.1.65 — Verification and ruling in the same pass, shared reasons for the same root (2026-10-27)

- Promotes CAND-20261027-002 (small rule): `formal-review-and-findings.md` §7.10 item 1 adds "verification and ruling may be in the same pass" and "same root shares a reason, status still per item".
  Still forbids batch disposal and revising/opening the next round before all rulings are done; the majority-vote ban and the coordinator not acting as any leg/final verifier are unchanged.
- Approval: Rocky 2026-10-27 (UTC+8) card t642s3668 chose A (t644u). Method: small-rule self-check + automated checks, no dedicated real case run (t578u).

# Changelog

This file records only changes to packaged content; workflow rules are defined by `skills/task-lifecycle/`.

## 0.1.64 — F09/F12/F13 closed, F10 dropped (2026-10-27)

- F09: named absolute line numbers changed to content anchors (Finding "execute item by item when applicable", artifact disposition table, confirmation-authorization §0 item 2, verification routing
  receiver gate and delivery send sentence, artifact "pending items must carry a recommendation").
- F12: the three real case classes run only the classes hit this time; large-change final verification also states which of ①②③ were hit.
- F13: FormalReview "stop after two rounds with the same method and no progress" and relay "at most 3 times" target different things; whichever comes first stops, neither replaces the other.
- F10: Rocky t615u dropped relay-detail compression (original proposal: summary into Finding, details into templates); no longer scheduled; relay detail text unchanged.
- Approval: Rocky 2026-10-27 (UTC+8) t613u, t615u. Method: small change, automated gate.

## 0.1.63 — S7 known-gap closed markers and length check (2026-10-27)

- docs/已知缺口.md: 6 second-level headings marked "Closed: handled in 0.1.53/0.1.56" (S7); open entries in the body kept as a history ledger; F11 registered as closed at the end.
- scripts/check-docs.mjs: adds a length limit check, SKILL.md ≤180, references/*.md ≤300 (consistent with §7.10 item 7, F11); maintenance-regression adds T53.
- Approval: Rocky 2026-10-27 (UTC+8) card t607s3510 chose B. Method: small change, automated checks passing suffice.

## 0.1.62 — Definition of "changed part" for re-review (2026-10-27)

- F §7.10 item 7 "general re-review": clarifies that "this round's changed part" in later rounds includes its direct consumers and impact area, consistent with items 5 and 8, removing two standards
  (source: Rocky t601s3480).
- Items 5 and 8 text unchanged; V8 only corrects the case expectation (pre-check item 6 states the level and reason), rules untouched.
- Approval: Rocky 2026-10-27 (UTC+8) card t601s3480 chose A. Method: static review; reran V1, V3, V8.

## 0.1.61 — Re-review and delegation flow (2026-10-27)

- F §7.10 item 7 adds "general re-review": material pack (requirement original + plan or change draft + previous party's self-review report, plus the real diff in implementation), two-step method
  (give an independent opinion first, then compare with the self-review), dimensions derived from requirements with a fixed "requirement drift" baseline;
  on failure the original author revises, the re-reviewer does not edit files; default 1 round, at most 3, later rounds review increments only; pass = no P1 and P2 fixed or registered as known gaps;
  disputes go to Rocky without consuming rounds; each round's opinions and changes are saved to disk.
- Large change: with valid `review.hosts`, the first host in the pool does one read-only plan re-review before implementation; implementation is delegated only when conditions are met; post-landing
  final verification doubles as post-implementation re-review.
- Task split § "External coding executor delegation" item 5: the executor hands back a self-review checklist; not independent, used only as leads.
- Re-review and relay drop the 1-hour cap, keeping only default 1 round/1 time, at most 3 rounds; a stuck single round stops at the session's own limit (`--max-turns`) and is reported to Rocky.
- Approval: Rocky 2026-10-27 (UTC+8) t594u–t601s3472 (t600u adopted the suggestion, t601s3463 removed the 1 hour, t601s3472 confirmed landing). Method: static review plus scripts; final verification
  10 real cases.

## 0.1.60 — Full-dimension self-review revision (2026-10-27)

- Lands S1–S6, S8 plus relay rule adjustments: Auto items on the start card must state all five elements (S1); artifact contract old terms changed to small-rule/large-change routing (S2); §7.10 item
  7 not limited by triggers (S3);
  §13.2 small rule 1 positive 1 negative (S4); candidate template notes the 7 small-rule fields (S5); maintainer baseline version points to plugin.json (S6); known gaps register that the global
  plugin cannot isolate real runs (S8); F §7.10 item 7 large change becomes static review plus scripts, with final verification in an independent session after landing (t593s3410).
- Approval: Rocky 2026-10-27 (UTC+8) t595u adopted the recommendation (S7 not adopted), t593s3410 chose A. Method: static review plus scripts; final verification pending.

## 0.1.59 — Simple rules land formally in lightweight form (2026-10-27)

- Simple rules land formally in lightweight form, i.e. 1 positive 1 negative, a trimmed 7 fields, self-review appended at the end; removes the contradiction between 0.1.56 and the adoption flow
  (`references/rule-evolution.md` items 1 and 5, line count unchanged).
- Approval: Rocky 2026-10-27 (UTC+8) card t589s3382 chose A; one-shot whole-package approval not adopted. Method: static review + automated checks, no real run.

## 0.1.58 — Start card must not recommend Auto (2026-10-27)

- `task-recognition-and-routing.md` §4.4 "Start card" rewritten in place: the recommended option may only be a Confirm level; Auto may not be marked recommended or be the default, and stop points
  such as commit and push are not lifted by Auto; the original "otherwise recommend Auto" removed, a verbal Auto is only written into the description. Line count unchanged.
- Approval: Rocky 2026-10-27 07:46 (UTC+8) card t581s3342 chose A. Method: static review + automated checks, no real run.

## 0.1.57 — Relay count and time cap (2026-10-27)

- `formal-review-and-findings.md` §7.10 item 7 "large change or change to the review rules themselves" rewrites 1 line in place: relay defaults to 1 time (first leg→second leg→final verification),
  at most 3 times, plus a 1-hour limit, whichever comes first; state the reason before the 2nd time; at the cap, unresolved issues go to Rocky in one batch.
- Approval: Rocky 2026-10-27 07:45 (UTC+8) card t580s3334 chose A. Method: static review + automated checks, no real run.

## 0.1.56 — Evidence-based landing and all candidates adopted (2026-10-27)

- `references/formal-review-and-findings.md` §7.10: "risk-graded convergence", "Case-Driven Convergence" and "review intensity levels" replaced by item 7 "evidence-based landing":
  registration needs a real incident, P1 needs a failure scenario, small-rule trial, 1-hour cap for large changes, instruction boundary [formerly CAND-20261026-001], multiple candidates in one
  session [formerly 005], regression scenario library,
  length caps SKILL.md ≤180 lines/reference ≤300 lines, content-anchor references; simple rules land formally directly after Rocky's approval, only stop point/permission/security, prior failure, and
  multi-file interaction classes run real cases [t578u]); matching pointers in SKILL.md and `rule-evolution.md` synced.
- CAND-20261026-014 made formal (0.1.55 trial marker removed).
- Added: `task-recognition-and-routing.md` §4.4 "Start card" (013+019 merged); `artifact-content-and-self-review-contract.md` "before adding a runtime dependency, list similar libraries and test
  them" (017); `task-split-parallel-and-integration.md` "cross-repo sub-tasks and joint push" (015),
  pointers added to `entry-quickref.md`.
- 022 core and 002 already included in item 7; 003, 004 recorded in docs/已知缺口.md; 018, 021, 023, 006 withdrawn.
- Approval: Rocky 2026-10-27 07:41 (UTC+8) t576u ("adopt all directly, don't run test cases"). Method: static review + automated checks, no real run.

## 0.1.55 — Per-option descriptions and suggested level (trial, 2026-10-27)

- Trial landing of the CAND-20261026-014 v10 trimmed text: `references/confirmation-authorization-and-change.md` line 32 (per-option suggestion sentence in the "pending items must carry a
  recommendation" paragraph) replaced in place by 1 line, line count unchanged; text landed verbatim from `/workspace/attach/四候选-直接吸纳分析.md`, with a trial marker at the end of the sentence. The
  plugin had no prior "trial" marker convention,
  so the minimal form (inline parenthetical) is used.
- Approval: Rocky 2026-10-27 07:38 (UTC+8) card t574s3305 chose A (new flow t571u: small-rule self-check + trial after approval, after 3 real cases decide formal or revert). Method: static review +
  automated checks; real run results in record DIRECT-20261027-CAND014-试行.

## 0.1.54 — Review and verification method (2026-10-27)

- `references/verification-and-evidence-routing.md` adds 2 lines "review and verification method" after line 143 (main definition of evidence levels): review records, review reports, verification
  conclusions, closing reports and promotion reports state static review, automated checks or real run and their scope; those with only static review or automated checks state "no real run"; a
  conclusion missing the method is incomplete. The file's self-reference `:147` shifts to `:150`;
  `SKILL.md:159` gets a pointer in place.
- Approval: Rocky 2026-10-27 07:21 (UTC+8) t565u asked to write it into the rules directly; at 07:24 card t566s3272 chose A, explicitly waiving the candidate flow (no candidate registration, no
  §7.10 review), landed per draft `/workspace/attach/审查验证方式规则-草稿.md`. Unverified: E4 host live test (method: static review + automated checks, no real run).

## 0.1.53 — Relaying sub-agent conclusions keeps original qualifiers (2026-10-27)

- Promotes CAND-20261026-016 v10 (sha256 8725907b…9186, review copy): `skills/task-lifecycle/SKILL.md` §4 inserts 4 lines "relaying keeps original qualifiers" after line 131 (the "which to choose"
  item); rule text landed per v10, unchanged.
- Approval: Rocky 2026-10-27 06:14 (UTC+8) card t561s3242 chose A (continued review r10 relay level first leg, second leg, final verification zero P0/P1). Remaining P2×8, P3×1 recorded in
  docs/已知缺口.md KG-016-01–09. Unverified: E4 host live test.

## 0.1.52 — Report artifact .md is canonical, Grok Bot additionally makes a reading-version Page (2026-10-26)

- Promotes CAND-20261026-009 v8r1 (sha256 e88b0c0e…dc1d2): `verification-and-evidence-routing.md` appends sub-items after the line 147 file delivery item (scope definition and items 1–10),
  `artifact-content-and-self-review-contract.md` line 23 gets a pointer at the end of the sentence; only the rule text landed (decision-source parentheticals removed), overlong lines split with soft
  wraps. Approval object and SHA convention unchanged.
- Approval: Rocky 2026-10-26 17:10 ("CAND-009 choose A: approve promotion of v8r1") (round 3 relay level first leg, second leg, final verification zero P0/P1). Unverified: E4 host live test; small
  fixes after v8r1 convergence not re-reviewed.

## 0.1.51 — test-run cap narrowed (2026-10-26)

- Promotes CAND-20261026-004 v6 (sha256 a49d8d97…f711): `task-split-parallel-and-integration.md` cap table `test-run` cell and line 171,
  two constants in `validate-config.mjs`, five assertion lines in `validate-config.test.mjs`, docs/已知缺口.md line 16 and a new 0.1.51 retained section; four files, seven places, original text only.
- Narrows only, never loosens: A05 start baseline and DOC07 static scripts are now run locally by the main session. Approval: Rocky t492s2745 (REVIEW-20261026-006 r4 relay zero P0/P1).
- Same batch adds the CAND-20261026-005 (0.1.48) retained section to docs/已知缺口.md. Unverified: E4 new-session live test; small fixes after v6 convergence not re-reviewed.

## 0.1.50 — Single question when controls lack display evidence; numbered options when feedback is not shown (2026-10-26)

- Promotes CAND-20261026-007 v5 (sha256 532d95b1…9121): `confirmation-authorization-and-change.md` pending-item presentation paragraph, sentences (1) (2) appended after the level sentence,
  and one "additional rejection" sentence after the rejection paragraph; original text only, overlong lines split with soft wraps. Approval and record-keeping semantics unchanged.
- This entry is a minimal stopgap subset of CAND-20261026-006; when 006 is promoted it overrides or absorbs this one. Approval: Rocky t490s2713 (REVIEW-20261026-007 r4 relay zero P0/P1).
- Unverified: E4 new-session live test; three P2 small fixes after v5 convergence not re-reviewed.

## 0.1.49 — Answers enumerate related scenarios and compare options by default (2026-10-26)

- Promotes CAND-20261026-002 v6.1 (sha256 43afa6b5…1718):
  `artifact-content-and-self-review-contract.md` adds a "conversation answer" line after the "Bugs/suggestions listed item by item in reports" item: when the user's question this turn contains
  "which to choose", "should or not" or "whether to" and the object is delegation, verification approach, task routing, §7.10 item 7 risk/review intensity levels, or approval/release/sandbox
  permission approach,
  the answer body gives two viable approaches (including keeping the status quo), one-sentence trade-offs each, and a recommendation with reason; when hard rules leave only one approach, give the
  reason for the single approach; exceptions and rejections attached.
- SKILL.md adds a one-line pointer where conclusions and next steps are agreed; the criterion is only that contract item, it does not enter managed mode or change §0 routing. Approval: Rocky
  t490s2690 (REVIEW-20261026-005 r5 serial relay zero P0/P1 converged; v6.1 is a post-convergence P3 small fix, not independently re-reviewed; E4 unverified).

## 0.1.48 — Unattended delegation sets allow and deny lists by task type (2026-10-26)

- Promotes CAND-20261026-005 v5 (sha256 848c6dd2…31cd): `task-split-parallel-and-integration.md` external coding executor delegation item 4 adds "unattended permissions" and "stop on overstep", item
  5 adds "handling refusals and whole-run cancellation", item 6 adds "refusal records", and the section end adds a grok 1.0.70 version table (read-only review enableable; drafting and code writing
  not enabled; git not allowed).
- §7.10 item 0 adds an invocation permission pointer; SKILL.md §0 allow examples and the three relay templates drop git and instead read diff/log files pre-generated by the delegator. Approval:
  Rocky t487s2649 (high-risk level REVIEW-20261026-003 r2 converged; v5 only adds the P-1 clause, not re-reviewed per the established rule).

## 0.1.47 — Pending items prefer option controls for presentation (2026-10-26)

- Promotes CAND-20261026-003 v5 (sha256 79f03dd3…acce): `confirmation-authorization-and-change.md` item 9 "pending items must carry a recommendation" adds presentation rules: three host capability
  levels (multi-step controls / one question per round / numbered + identity-bearing short reply codes), recommended option first marked "(recommended)", suggestions stay in the body, an "other"
  entry, progress card wording and rejection items.
  Presentation only; approval and record-keeping reference §6.5, §6.3.1, items 4 and 5 and SKILL.md lines 34–35, approval semantics unchanged.
- One-sentence guidance in entry-quickref; `scripts/dispatch-guard.test.mjs` adds text assertions. Approval: Rocky t468s2461 (re-review REVIEW-20261026-002 r1–r4).

## 0.1.46 — Delegation scenarios routed by sufficiency of verification means (2026-10-26)

- Promotes CAND-20261026-001 v7 (sha256 be65f24a…c290): `task-split-parallel-and-integration.md` external coding executor delegation item 2 adds the necessity judgment (three levels ①–⑤ mutually
  exclusive and exhaustive), four default levels, cost-principle limits, and admission for external host behavior verification;
  item 3 adds a reachability probe for UI-less approval; item 4 requires live-test records for the two hard thresholds. Narrows only, never loosens; default-off, never-delegate and WI naming
  unchanged; category cap table and scripts unchanged.
- One-sentence guidance in entry-quickref; `scripts/dispatch-guard.test.mjs` adds text assertions. Approval: Rocky t466s2425 (re-review REVIEW-20261026-001 r1–r3).

## 0.1.45 — Loop risk fix (2026-10-26)

- Lands CAND-20261025-017 v2: SKILL.md §0 item 1 adds the receiver gate (the dispatch marker takes precedence over naming/`review.hosts`/zero-host degradation; no further dispatch, no agent CLI
  including read-only levels, no sub-sessions, no Task creation, no writes; allowed: read-only file reads and ordinary read-only commands); the dispatch header `[TL-DISPATCHED depth=…]` only
  tightens, never loosens.
- The three relay templates, §7.10 item 0 and external executor delegation item 4 add the dispatch header; §7.10 items 0/6, task split item 9 and delegation item 1 state that naming inside a
  dispatch prompt does not constitute admission; entry-quickref synced.
- Added `scripts/dispatch-guard.test.mjs` documentation regression. Approval: Rocky t438u/t440u/t444u (auto).

## 0.1.44 — V1.2 maintenance revision (2026-10-25)

- Per the two confirmed batches of scope, revised read-only completion, Task/plain save/level selection separation, reuse of existing plan mode, rule bootstrapping, diagnosis and legitimate
  re-entrant delegation.
- Fixed doc-check Windows paths, false success on missing targets and CRLF; reference check rejects zero recognition per file and freezes Git blobs; config Windows HOME/path containment, consuming
  enabled.value and 30-second entry sync.
- Findings closed with per-item evidence; whyMissed supports a full unknown; major out-of-scope risks fully handed over; current and all baseline copies keep non-placeholder byte-identical proof.
  Mechanical check success/failure/unavailable handled separately.
- After independent re-review, fixed frozen references' absolute/parent path fallback misbinding and Windows PowerShell entry quoting; regression keeps valid references and actually passes through
  PowerShell argument passing.
- Kept the existing three review levels, escalation, coverage and three-round cap; historical A02/G1/E4 missing evidence not back-signed. Per the user's explicit instruction, committed and pushed
  existing results and updated the private plugin; 57 acceptance items passed, 25 not fully verified and 8 issues pending verification kept for follow-up, see docs/已知缺口.md. This update does not
  represent full model behavior acceptance or host install success.

## 0.1.43
- Fixes CAND-20261025-016 (v4, sha256 `373afeb4…01d3`): §7.10 item 7 "self-review level" changed to waive only the first-leg/second-leg/final-verification relay; coverage list and P0–P2 whyMissed as
  before (independent check U1-001 P1: v3 violated frozen INV-01).
- Approval: Rocky 2026-10-25 15:15 auto-advance authorization; candidate text not in the repo per t349u.

## 0.1.42
- Promotes CAND-20261025-015 v2 (sha256 `b68b5e83…54c0`): `formal-review-and-findings.md` §7.10 item 9 adds "diff consistency check" and "list completeness check" (applied item by item, failure
  blocks that round); mechanical reference check and its exits unchanged.
- Promotes CAND-20261025-016 v3 (sha256 `4527148e…22b0`): §7.10 item 7 adds "review intensity levels" (relay level / self-review level / single-session level, judged in order, take the higher when
  unsure, only escalate never de-escalate, single-session convergence conditions; A04 class defaults to single-session level).
- Known gaps: adds the CAND-20261025-014 contract lead gap (A02 to be merged next version), see docs/已知缺口.md.
- Approval: Rocky raised it in t413u–t416u, approved drafting at 17:16 t416u; promotion per Rocky 2026-10-25 15:15 (ACTIVATE-20261025-015, 016); candidate text not in the repo per t349u.

## 0.1.41
- FEAT-20261024-001 A05 batch 2 round 3 (cap) converged: `references/validator-output-protocol.md` completes all reason codes and the three fixed `fallback` keys (new anti-drift test, 77 items).
- Promotes CAND-20261025-014 v2 (sha256 `f3f98580…cdd6`): `task-split-parallel-and-integration.md` log checking adds two lines — multiple conflicting values for the same field count as
  unrecognizable (`log-unverifiable`); repeated identical values must still be compared with config.
- Known gaps: expanded the root cause of T7-T8 "Codex host sandbox limits"; added two entries, FEAT-20261024-001 E4 untested items and Cursor installing only skills, see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 15:15, 15:26 t405u, 17:02 (chose A); ACTIVATE-20261025-014; candidate text not in the repo per t349u.

## 0.1.40
- FEAT-20261024-001 execution (A05) batches 1+2: added `scripts/validate-config.mjs` (zero-dependency Node≥20 read-only validation of delegation config JSON, phases
  env/locate/parse/version/structure/merge,
  O_NOFOLLOW+O_NONBLOCK+whole-path-bound reads, legacy detection), `scripts/validate-config.test.mjs` (76 items), `assets/config.schema.json` (generated from constants), `assets/config.example.json`;
  CI adds a `node --test scripts/` step; rule text landed in the consumption protocol (`task-split-parallel-and-integration.md`), write flow (`workspace-versioning-and-recovery.md` §9.1.1),
  level selection (`task-recognition-and-routing.md`), entry-quickref, SKILL, templates, examples, README; added `references/validator-output-protocol.md`.
- Review: batch 1 converged in three rounds (cap), zero P0/P1; batch 2 two rounds, P2 fixed, round 3 confirmation separately. CAND-20261025-013 merged into the A02 v13 archive; CAND-20261025-014
  draft registered.
- Approval: Rocky 2026-10-25 15:15 ("open everything, promotion also automatic per recommendation"), 15:26 t405u auto-advance with commit and push.

## 0.1.39
- Promotes CAND-20261025-012 v2 (sha256 at promotion `6ea45745…9828`): `formal-review-and-findings.md` §7.10 item 9 line 246 becomes 4 lines,
  `scripts/check-citations.mjs` located by plugin root (not the reviewed project directory); without `scripts/` use the source repo checkout; if neither is found record "script unreachable";
  invocation uses existing `--root`/`--rev`. Fixes E4 T15.
- Known gaps: 8 (P2×6, P3×2) + 1 T7/T8 host limit, see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 15:15 ("open everything, promotion also automatic per recommendation") (ACTIVATE-20261025-012); candidate text not in the repo per t349u.

## 0.1.38
- Promotes CAND-20261025-011 v2 (sha256 at promotion `89400026…d978`): `formal-review-and-findings.md` §7.10 rejection paragraph adds line 274,
  landing verbatim the line 14 rejection sentence of CAND-20261025-001 v11 (missed in 0.1.35).
- Known gaps: 2 (P3×2), see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 14:59 (ACTIVATE-20261025-011); candidate text not in the repo per t349u.

## 0.1.37
- Promotes CAND-20261025-010 v4 (sha256 at promotion `1a3e63dc…094b`): added `scripts/check-citations.mjs` (mechanical reference check, verifying `path:N` references against the quoted snippets);
  `formal-review-and-findings.md` §7.10 item 9 lines 246–247 now point to that script; UNCHECKED does not count as passing, reading back is still required.
- Known gaps: 3 (P3×2, process×1), see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 14:25 (ACTIVATE-20261025-010); candidate text not in the repo per t349u.

## 0.1.36
- Promotes CAND-20261025-009 v4 (sha256 at promotion `9f5e3cc6…8cee`): `confirmation-authorization-and-change.md` pending items must carry a recommendation (former lines 30–31 → lines 30–34) —
  with two or more options, each option carries a suggestion and the recommended option and reason are output; in control scenarios per-option suggestions go in the same reply body; §3 "disambiguate
  first" exception.
- Known gaps: 4 (P3×4), see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 14:14 (ACTIVATE-20261025-009); candidate text not in the repo per t349u.

## 0.1.35
- Promotes CAND-20261025-001 v11 (sha256 at promotion `281dfcda…8c09`): `formal-review-and-findings.md` §7.10 item 9 adds "Terminology" after "author self-check",
  defining miss-cause categories, constraint ledger, constraint deletion list, and per-item back-verification of last round's Findings; lines 187 and 236 drop references to non-effective candidates
  and point to that terminology instead.
- Known gaps: 4 (remaining: 2 pending verification, 2 process), see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 13:29 (ACTIVATE-20261025-008); candidate text not in the repo per t349u.

## 0.1.34
- Promotes CAND-20261025-008 v3 (sha256 at promotion `3461353c…dcd`): `formal-review-and-findings.md` §7.10 item 7 line 213 — known gaps are now registered item by item in docs/已知缺口.md in the
  promotion commit,
  INDEX rows and CHANGELOG state only counts and point to that ledger, and fix commits mark the corresponding rows closed; added the ledger, containing 24 items from 002, 004, 007, 008.
- Known gaps: 9 (P2×7, P3×2), see docs/已知缺口.md.
- Approval: Rocky 2026-10-25 13:26 (ACTIVATE-20261025-007); candidate text not in the repo per t349u.

## 0.1.33
- Fixes existing defects (MISS-ANALYSIS-20261025-001 rule review g1/g2): G1-F08 enumeration pipes inside table cells of two templates escaped as `\|` (5 lines);
  G2-F04 `unmanaged-trigger-counterexamples.md` read-only review comparison aligned with `task-recognition-and-routing.md` §4.3 (create a task and leave a record only when the external directory is
  authorized).
- Not fixed: G1-F09 (SKILL.md frontmatter single-line description and table rows over 200 characters), needs restructuring, handed to Rocky to decide.
- Approval: Rocky t327u (06:33) and 2026-10-25 11:35 (ACTIVATE-20261025-006).

## 0.1.32
- Promotes CAND-20261025-002 (sha256 at promotion `c5c966dd…c3b6`): SKILL.md §4 adds "code notation" — in user-visible text, phase codes (00, A/B/DOC) and WI codes must carry a plain-language name
  in the same sentence;
  candidate IDs, Finding IDs and file paths written as-is; pre-check failure criteria, progress card and the WI terminology item now reference that item.
- Known gaps (fixed in later revision commits): F04, F05, F06, N02 (P2); F07, N01 (P3).
- Approval: Rocky 2026-10-25 12:02 (ACTIVATE-20261025-005); candidate text not in the repo per t349u.

## 0.1.31
- Promotes CAND-20261025-006 (sha256 at promotion `f97cf085…3033`): `formal-review-and-findings.md` §7.10 item 7 high-risk level named "Case-Driven Convergence V2" with 8 principles listed;
  adds "invariants" (frozen with cases on Rocky's confirmation, checked item by item each leg, a violation is a valid Finding) and "exploration boundary" (out-of-case opinions at most 3 proposals
  per leg, non-blocking, no new dimensions after round 1); low-risk level OPEN items handed over before promotion must be ruled first; Finding criteria and rejection paragraph expanded accordingly.
- Known gaps: none.
- Approval: Rocky 2026-10-25 11:50 (ACTIVATE-20261025-004); candidate text not in the repo per t349u.

## 0.1.30
- Promotes CAND-20261025-007 (sha256 at promotion `66b477d2…0322`): `verification-and-evidence-routing.md` §10.5 adds an item — when delivering or referencing files the user needs to read, send them
  in a form directly openable in the host chat (attachments preferred, clickable links also fine), paths may be attached; exclude credentials and other content unfit to send; when not openable,
  explain why and give the path.
- Known gaps (fixed in later revision commits): F1 (P2 remaining), F3, F4, N2 (P2); F2, F5, F6 (P3).
- Bundled in the same version: e62be21 `confirmation-authorization-and-change.md` pending items must carry a recommended conclusion (Rocky t345u, R9 confirmed 2026-10-25 11:35).
- Approval: Rocky 2026-10-25 11:39 (ACTIVATE-20261025-003); candidate text not in the repo per t349u.

## 0.1.29
- Promotes CAND-20261025-005 v4 (sha256 `f1c7c317…68c0`): `formal-review-and-findings.md` §7.10 two-stage convergence changed to risk-graded convergence (low risk effective in one round, high risk
  case-driven with at most 3 rounds, fixes add no new mechanisms); item 5 becomes re-review scope; removed the clauses and rejection sentences on full final round, section skipping, minimal review
  pack and the P3 final-round ledger; first-leg/second-leg template line 10 synced.
- Approval: Rocky 2026-10-25 11:26 (ACTIVATE-20261025-002); candidate text not in the repo per t349u.

## 0.1.28
- Promotes CAND-20261025-004 v16 (sha256 `bb803875…64e6`): `formal-review-and-findings.md` adds §7.10 serial relay review; added `templates/relay-review-first-leg-prompt.md`,
  `relay-review-second-leg-prompt.md`,
  `relay-review-verifier-prompt.md`; one row in the SKILL.md load table; one boundary line in the delegation section of `task-split-parallel-and-integration.md`.
- Known gaps (fixed in later revision commits): A10-01 (P2) no body consistency check after original→review copy conversion; A10-02 (P3) version revision notes in the review copies/diffs of the
  three relay templates not replaced by placeholders.
- Approval: Rocky 2026-10-25 10:57 (ACTIVATE-20261025-001); candidate text not in the repo per t349u.

## 0.1.27
- Promotes CAND-20261024-030 (BUGFIX-20261024-008): execution-turn pre-check defaults to a numbered list `N. **Item name** (status): content`, steps use the next numbering level, tables only on wide
  hosts.
- Promotes CAND-20261024-028 v2 (REVIEW-20261024-001 F1–F5): entry-quickref adds delegation guidance; sandbox, network cutoff and write permission wording tightened per grok trial measurements;
  untested items do not enable implementation.
- Patch sha256 `63aa0f50…`; approval: Rocky t255u/t256u/t257u (t252u standing agreement).

## 0.1.26
- Promotion (CAND-20261024-028 v1 `5b75441e…`, patch `4f145d8a…`): adds "external coding executor delegation" — off by default, enabled narrowly by 4 categories only when the out-of-repo agreement
  section has
  `enabled: true` and the user has confirmed it in effect; 31-phase cap table, capability probing and degradation, read-limited sandbox, network cutoff, no-confirmation ban, exit code does not mean
  done, traceability.
- Changes: task-split-parallel-and-integration.md (new section), workspace-versioning-and-recovery.md §9.1.1, one row in the SKILL.md load table. No delegation enabled.
- Approval: Rocky t238u/t248u/t254u instructions (t252u standing agreement), FEATURE-20261024-001.

## 0.1.25
- Promotion (CAND-20261024-027 v2 `ce312225…`, patch `0a897661…`): pre-execution pre-check split in two — managed writes/commit-push/dispatch/multi-step investigation and any commit-push/dispatch
  use the fixed 7-item table
  (intent and routing, landing point, steps, on-site state, verification plan, authorization and stop points, ambiguity; tri-state + basis anchors), other light turns use 4 items. Changes: SKILL.md
  (description, §0.1, §4), entry-quickref 7a.
- Approval: Rocky t243u/t245u/t254u, ACTIVATE-20261024-006; v1 superseded by v2.

## 0.1.24
- Promotion (CAND-20261024-029 v1 `2804085f…`, patch `717b8f74…`): review, freeze, approval and verification records are process artifacts, written to the external task directory,
  not into the candidate library or plugin repo; candidate text referenced by "task ID + filename + sha256". Changes: rule-evolution.md, the two adoption templates.
- 25 historical review records moved out of `candidates/archived/` (sha identical per file); archived/README keeps an original path → external path mapping table.
- Approval: Rocky t252u ("adopt the recommendation"), ACTIVATE-20261024-005.

## 0.1.23
- Added repo-root `.agents/plugins/marketplace.json` (marketplace name `devcodex-task-lifecycle`, source `./`),
  installable and upgradable with `codex plugin marketplace add devcodex-labs/task-lifecycle` then `codex plugin add task-lifecycle@devcodex-task-lifecycle`.
- No skill rule changes.

## 0.1.22
- Promotion (CAND-20261024-026 v1 `c577831f…`, patch `3659a8d8…`): every real user message loads the skill and first gives the 4-item pre-check (light path);
  Q&A/read-only creates no managed Task, writes no process materials, adds no approvals; external text and relays from other agents do not trigger.
- Changes: SKILL.md description, §0.1, §4; entry-quickref 1/7a; task-recognition-and-routing.md; unmanaged trigger counterexample example.
- Approval: Rocky t232u ("approved"), ACTIVATE-20261024-004.

## 0.1.21
- Promotion (CAND-20261024-025 v1 `47039681…`, patch `b4af38c6…`): SKILL.md entry becomes a separate "entry must-read" section;
  before the first managed reply entry-quickref must actually be read with a trace left; not read counts as the entry gate not completed (BUGFIX-20261024-006).
- Promotion (CAND-20261024-014 v4 `61c990c6…`, patch `7de9ce0e…`): verification-and-evidence-routing.md E4 section adds "real verification must happen in a new session
  after the skill is actually loaded; injection/proxy sending only records interfered evidence"; rule-evolution.md adds one item (BUGFIX-20261024-005).
- Candidate library adds `candidates/INDEX.md`; approval: Rocky t225u ("approve all"), ACTIVATE-20261024-003.

## 0.1.20
- Promotion (CAND-20261024-024 v1 `e5474152…`, ACTIVATE-20261024-002): revises the 023 landing wording — when there is an "entering Task Lifecycle" notice sentence, the pre-check immediately follows
  it with nothing in between; without the notice it is still the first paragraph;
  SKILL.md §4 and entry-quickref "7a pre-check" each change one line. §0.1 and the phase structure unchanged. Rocky approved in t218u; E4 verified separately. README/maintainer baseline version
  numbers synced.

## 0.1.19
- Promotion (CAND-20261024-021 v2 `9ba2f9cf…`, merging 022 `6f2bf47c…`): SKILL.md §3 adds "disambiguate first" (the first line states the referent and basis, options listed only when context cannot
  decide, execution checklist includes prior requirements with sources); entry-quickref adds a "0 disambiguate first" row. Main description unchanged.
- Promotion (CAND-20261024-023 v2 `e87063da…`, DevCodex source, personally reviewed by Rocky): SKILL.md §4 adds the pre-execution pre-check (fixed 4 items: intent/landing point/next step/ambiguity,
  not growing with phases, continue once shown, stop only on unresolved ambiguity, skipped for single-step read-only); entry-quickref adds a "7a pre-check" row.
- Three-tier candidate library: `candidates/pending/` (to adopt), `candidates/archived/` (adopted), `candidates/rejected/` (withdrawn; moved and renamed from the original repo-root `archived/`); no
  candidates at the `candidates/` root; skill docs and templates synced in 7 places across 4 files (merged patch `3802eefd…`).
- 45 files of adopted candidates archived to `candidates/archived/`; after 021–023 took effect, 9 more files archived; 005 (merged into 007, not promoted) moved to `candidates/rejected/`; the old
  wording "withdrawn, moved into archived/" in 021–023 v1 corrected and re-frozen.
- All the above personally approved by Rocky (t208u/t209u/t211u/t212u/t215u); new-session real verification (E4) done separately. README/maintainer baseline version numbers synced.

## 0.1.18
- Fix (BUGFIX-20261024-003): the plugin no longer references the local evolution repo path. Candidates and review records moved into repo-root `candidates/` (46 files, content and numbering
  unchanged, sha256 checked one by one);
  added `archived/` (withdrawn candidates, including the withdrawal flow);
  effective rules and INDEX moved to the user workspace's external `.task-lifecycle/active-rules/`, operation records in external `.task-lifecycle/reports/history/`.
  Paths changed in 9 files across SKILL.md, references and templates; phase structure and approval rules unchanged. Historical paths inside candidate text kept per "content unchanged", see
  `candidates/README.md`. README/maintainer baseline version numbers synced.

## 0.1.17
- Promotion (RULE-20261024-009 v1, CAND-009 v4 `ae86ad8d…`): compressed the main description (997 characters), added Chinese triggers for "review/evaluate/assess … proposal", "resume a managed task"
  and "mid-way requirement change"; exclusions unchanged. Only description matching tested (interfered evidence), E4 unverified.
- Promotion (RULE-20261024-020 v1, CAND-020 v1/v2 proposal/v3 proposal): read-only review creates a read-only review task and leaves a record when the external directory is authorized (including the
  four RULE-006 items and loaded references); adds the criterion that "evaluating/reviewing/adopting suggestions is restricted read-only review". SKILL.md:14/:15, routing :27/:89/:97, entry-quickref
  :7.
- Promotion (RULE-20261024-001 v3, CAND-001 v3 proposal `9211aa28…`): the coverage ledger must list all in-scope directories and files marked line-by-line/sampled/unread; reading depth decided by
  intent with the basis stated. README/maintainer baseline version numbers synced.

## 0.1.16
- Added (FEATURE-20261024-001): `scripts/check-docs.mjs` checks that in-plugin references inside backticks (prefixes like `references/` and bare `*.md` names in the skill directory) exist; runtime
  directories and consumer project paths out of scope. Zero dependencies; README/maintainer baseline version numbers synced.

## 0.1.15
- Fix (BUGFIX-20261024-002): description adds Chinese trigger sentences, `CAND-*` and exclusion examples (counting candidates, explaining E3/E4, merely mentioning the name); removed filler words
  "multi-file/existing/also"; kept the "real user" gate and all original exclusions. 954→1008 characters (≤1024). Real host triggering (E4) unverified; README/maintainer baseline version numbers
  synced.

## 0.1.14
- Fix: reviewing/evaluating evolution candidates did not trigger the skill. The description and entry gate name such requests and treat them as not plain Q&A (candidate promotion does not take the
  read-only path and needs per-item user approval); load table adds a "read-only review/re-review/project analysis" row; README/maintainer baseline version numbers synced.
- Promoted rules landed in the plugin source (RULE-20261024-001/002/003/004/006/007/008): clarify undefined scope first, B03 key premises marked measured/speculated, plain assistance that evolves
  must re-judge entry, candidate registration prompted in the same turn, per-item verification status of suggestions and option comparison, generalizable process requests need a candidate
  eligibility check.
- Load table: the read-only review row reads evolution rules only when evolution is enabled; added missing files to the Bugfix/Docs/Feature rows, added an any-phase change row; §11/§12
  cross-references name their files.


## 0.1.13
- Evolution candidate trigger entries completed: better option, acceptance rejected, post-delivery defect, self-withdrawal, repeated changes, re-review stalled; relayed corrections need confirmation
  by the person themselves. Eligibility threshold unchanged.

## 0.1.12
- Fix: the verify-before-characterizing rule wired into A06 classification and the read-only review/analysis route; B02 output adds verification basis; candidate template source may be a user
  correction.

## 0.1.11
- Evolution candidate triggers completed: user correction/repeated same-class errors, B09/DOC09 closing eligibility check, read-only route lists only candidate leads without saving to disk.

## 0.1.10
- Bugfix B02/B03: before characterizing as a Bug or proposing a root-cause fix, verify whether it is intentional design and fully trace the failure path; unverified may only be marked "speculated".

## 0.1.9 — 2026-10-24

### Changed

- Release prep: added MIT `LICENSE`; root `plugin.json` adds `license`, `repository`, `homepage`, `author.url`, `keywords`.
- `extensions.com.openai.interface`: category changed to Developer Tools, added `capabilities`, `websiteURL`, `supportURL`, `brandColor`, `logo`, `composerIcon`; `defaultPrompt` changed to a 3-item
  array.
- Added `assets/logo.svg`, `assets/logo.png` (512×512), `assets/icon.png` (128×128).
- Deleted `.codex-plugin/plugin.json`, which duplicated the root manifest (OpenAI does not read it when the root manifest contains `extensions.com.openai`).
- README adds Cursor and Codex/ChatGPT install instructions and the license. Workflow rules and approvals unchanged.

## 0.1.8 — 2026-10-24

### Changed

- A08/B08/DOC08: on release failure or partial success, read the live state per `confirmation-authorization-and-change.md` §5.5, no blind retries; rollback needs separate authorization; otherwise
  block and let the user decide.
- Suggestion minimum information adds priority (high/medium/low) and reason (`artifact-content-and-self-review-contract.md`, suggestion isolation template); also applies to improvement suggestions
  on the restricted read-only review path.
- Phase structure unchanged, no approvals added or loosened.

## 0.1.7 — 2026-10-24

### Changed

- Trigger description aligned with real capability: explicit code/PR/plan/managed artifact review, re-review after fixes until convergence, and project analysis in preparation for development enter
  the restricted read-only path (`SKILL.md` frontmatter and §0, `task-recognition-and-routing.md` §4.3, `entry-quickref.md`, unmanaged trigger counterexamples).
- Read-only: no writes, no task directory, no new approvals; plain Q&A, quick lookups and trivial edits still do not trigger.

## 0.1.6 — 2026-10-24

### Changed

- `feature-flow.md`: A05 records the existing check baseline before the first write batch; A06 new failures attributed per the five Bugfix classes; existing defects found during development point to
  Finding §7.5 / A10.
- `task-recognition-and-routing.md`: the minimal fact list adds current results of existing checks, directory and module boundaries, and code conventions.
- `SKILL.md`: the load table Feature row adds `verification-and-evidence-routing.md` (from A06).
- Phase structure unchanged, no approvals added or loosened.

## 0.1.5 — 2026-10-23

### Added

- `scripts/check-docs.mjs`: zero-dependency doc self-check.
  - Checks Markdown line length (by character, max 200).
  - Checks that relative links and anchors exist.
  - `--compare <dir>` can compare a copy of the skill directory.
- `.github/workflows/check-docs.yml`: runs the self-check automatically on push / PR.
- `references/entry-quickref.md`: read the quick reference first at entry, load full rules on demand (3456589).
- In-session recovery block (§9.7), a 4-line progress card at the end of every substantive managed reply (3456589).

### Changed

- 3456589:
  - Long lines split into bullet points.
  - Record SHA only when computable, otherwise use `path + modification time + diff summary` and mark `sha-unavailable`.
  - Self-evolution mechanism off by default, loaded only when the user explicitly enables it.
- 3c93c21:
  - Final acceptance rejection and post-terminal follow-up routing share one Owner (confirmation-authorization-and-change §5.5).
  - In-package retry cap: still failing after two rounds with different methods means a public block.
  - Added the "phase 00 rejected" operation and task-level states (active/paused/blocked/cancelled/terminal).
- c1f8686: examples changed to intent-based triggering, added a trivial-edit counterexample, unified process directory wording.
- da8c00c: development baseline and internal numbering moved to `docs/maintainer-baseline.md`; duplicated sections replaced with single-Owner pointers.
- 8f91617: trigger boundary examples, "just do it" semantics, ABS built-in spec table and glossary.
- This version's commit: fixed overlong lines found by the self-check (line breaks only, no wording or rule changes), version bumped to 0.1.5.

## 0.1.4

- Intent-based triggering (9c79f55), .gitignore and README status (ffa3289), and the previously accepted baseline (062de07).
