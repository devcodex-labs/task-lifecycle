# Known gaps ledger

Maintainer document; it is not loaded when the Skill runs. Formerly “docs/已知缺口.md” (renamed when docs/ moved to English in 0.2.2; see [old-path-map.md](old-path-map.md)).

Entries are registered per `skills/task-lifecycle/references/formal-review-and-findings.md` §7.5 and §7.10. An entry is closed only with an actual revision, suitable
verification and re-review evidence; a commit does not replace evidence, and future commit IDs are never pre-filled. External history paths are relative to
`/home/box/task-lifecycle-records/` (outside this repository; many keep their original Chinese names and are quoted here as data).
The V1.2 revision rules do not retroactively sign these historical entries; fixes already made in current code/docs and missing historical originals are recorded
separately. Entries without the original review/confirmation record keep their original state and are not closed as a same-root batch.

**Codes used in this file** (defined once here):
- Severity: **P0/P1** blocking; **P2** should fix, not blocking; **P3** optional.
- Evidence levels: **E1/E2** recorded/reasoned; **E3** design or static evidence (reading files, running static scripts); **E4** real-environment evidence
  (a fresh session on a real host). "E4 unverified" means no real-host live test was done.
- **CAND-YYYYMMDD-NNN**: a rule candidate (proposed rule change) in `candidates/`; **vN** its version; **rN** a review round.
- **First leg / second leg / verifier**: the three sessions of a relay review (`formal-review-and-findings.md` §7.10).
- **KG-…**: a known-gap item number; **UC-…**: a frozen use case of a candidate; **INV-…**: an invariant; **F…/M-…/R…**: review findings.
- **tNNNu / tNNNsNNNN**: IDs of the owner's messages or decision cards in the maintainer's chat history, kept as the approval source.
- **D/A/I/H**: verification routes (demonstration/analysis/inspection/human); **Confirm/Auto**: the plugin's two working modes.
- Chinese text in 「」 or “” is a verbatim quote kept as evidence; an English gloss follows in brackets.

> 2026-10-27 t622s3573 A: per the assessment draft, closed/archived lagging ledger items (KG-016-09; 018/021 withdrawn with their candidates; the 013 wording about
> verbal Auto and "no Auto in the card"; KG-004). No product rule changed. Spot checks: external `DIRECT-20261027-已知缺口处置/03-优先抽测计划.md`.

## Current open index (added 2026-10-27; index only, the body is authoritative)

Lists sections that still contain open or unverified items; line numbers drift with edits, so only section names are given.
- "0.1.53 relay keeps original qualifiers": KG-016-01–08 (P2) open; E4 unverified.
- "CAND-20261026-015 three-round cap stop, residue": section marked closed, but the body still has 3 open items (UC-01 path, cross-repo sub-tasks, relayed
  authorization) — to be confirmed.
- "CAND-20261026-016 and CAND-20261026-017 r3 cap …": section marked closed, but the body still has 5 open items — to be confirmed.
- "CAND-20261026-011 narrowed to CAND-20261026-016, residue": 4 open items (anchors for external capability claims, literal qualifier check, etc.).
- "CAND-20261026-012 narrowed to CAND-20261026-017, residue": 1 open item (search for and reuse existing implementations first).
- "CAND-20261026-013 start-card scope reduction, residue": 2 open items (013 r3 first-leg P1, F1, F7, etc.).
- "CAND-20261026-014 round-3 cap stop …": section marked closed, but the body still has 1 open item (widget questions missing a recommended tier read two ways) —
  to be confirmed.
- "CAND-20261026-010 narrowed to CAND-20261026-014, residue": 1 open item (description duty for single options / disambiguate-first).
- "CAND-20261026-006 not adopted … residue": 1 open item (table C answer-state residue).
- Retained-item sections "0.1.52", "0.1.51", "0.1.48", "0.1.47", "0.1.46", "0.1.45": E4 unverified and no gate (not marked open; whether to count them is to be confirmed).
- "0.1.44 items retained in this delivery" and "Historical entries (original state kept)": several open rows in the historical table
  (CAND-20261025-002/007/008/009/010/011/012, etc.) and 8 issues pending verification.
- "Candidates moved in with 0.1.56": KG-003, 013+019 and 015 edge cases not landed (no state marked) — to be confirmed.
- "Real runs cannot be isolated while the global plugin is enabled": 1 open item.
- "README acceptance boundary": 3 open items (historical).
- "0.1.68 README review register": M-13 (P3), M-09 (P2 residue), M-02 (E4 unverified) open.
- "Host support status": Cursor marked tested by owner decision D12 (t794u).
- Note: the Page layout clause (`verification-and-evidence-routing.md`) is not split out for now; no new clauses before CI turns green (2026-10-27, owner t783s4386).

## Host support status (added 2026-10-27, in 0.2.2)

- Grok Build and Codex: live-tested on 0.2.0/0.2.1 in fresh sessions (records `DIRECT-20261027-英文正本迁移/50-第5步实测.md`).
- Cursor: no fresh Cursor session was run on the box (no Cursor agent CLI available). Marked tested by owner decision D12 (t794u, 2026-10-27 23:24 UTC+8;
  same behavior as Grok Build). This is an owner judgment, not a recorded Cursor transcript.

## 0.1.53 relay keeps original qualifiers (CAND-20261026-016 v10) retained items

- open (KG-016-01, P2, first leg-1): the exclusion of “第” + number directly followed by “部分” [“part N”] only recognizes the no-space form; “第 2 部分”, “第　2　部分”,
  “第（2）部分” and other non-adjacent forms still match “部分” [“part”], and a relay that drops it is wrongly rejected. Source: CAND-20261026-016 v10, external
  REVIEW-20261026-017-CAND-016 r10 first leg-1.
- open (KG-016-02, P2, first leg-2): “引号内的不算” [“text inside quotes does not count”] gives no quote glyphs (curly double quotes or corner brackets 「」); with an unclosed quote, whether the
  following text is inside quotes is unstated, so sentence count reads two ways. Source: same, r10 first leg-2.
- open (KG-016-03, P2, second leg-1): a half-width “.” always breaks a sentence, so file names and versions in a claim (file.xlsx, v1.2) are cut into fragments
  without the matched word, causing wrong rejection. Source: same, r10 second leg-1.
- open (KG-016-04, P2, second leg-2): “编号” [“number”] does not settle digits vs “十” [“ten”]; dropping “部分” from “第10部分” or “第十一部分” [“part 10/11”] reads both as
  reject and not reject. Source: same, r10 second leg-2.
- open (KG-016-05, P2, second leg-3): matching is by substring, so “没有条件” [“no conditions”] and “组成部分” [“component”] still match “有条件” [“conditional”] and “部分”
  [“part”]; a relay that drops them is wrongly rejected. Source: same, r10 second leg-3.
- open (KG-016-06, P2, second leg-4): the left/right boundary of “合为一句” [“merged into one sentence”] for command text and output excerpts is unstated; whether an
  upgrade sentence on either side of a full stop is excluded reads two ways. Source: same, r10 second leg-4.
- open (KG-016-07, P2, second leg-5): the object of “引号内的不算” is omitted: it can mean sentence breaks inside quotes do not break, or matched words inside quotes
  do not count. Source: same, r10 second leg-5.
- open (KG-016-08, P2, second leg-7, raised from P3 to P2 at final check): “输出摘录（含报错）” [“output excerpt (incl. errors)”], the self-check “报错输出摘录”
  [“error output excerpt”] and the card “关键输出” [“key output”] differ in scope; whether successful output without errors is excluded reads two ways. Source: same,
  r10 second leg-7.
- closed (KG-016-09, P3, second leg-8) [2026-10-27 t622s3573]: line-number meta debt; no product rule change.
  History: this entry inserted 4 lines after SKILL.md line 131, so the line this ledger's F3 entry called “SKILL:140” moved to line 144; the ledger's old number was
  left as historical text. Source: same, r10 second leg-8.
- E4 unverified: rejection of relay sentences was not live-tested in a fresh session on a real host; the rule is a text constraint with no gate script.

## CAND-20261026-021 r2 stopped-review open items (closed: handled in 0.1.53/0.1.56; archived with the candidate's withdrawal)

- archived (P1) [2026-10-27 t622s3573]: withdrawn with CAND-20261026-021 in 0.1.56; not actionable against current rules. Originally open: general instructions vs
  specific instructions named by the owner were split only by "named or not"; "default" at line 228 had no boundary (same root as r1 second leg-2).
- archived (P1, introduced in v2) [2026-10-27 t622s3573]: withdrawn with the candidate. Originally open: "line 250" in item 4 moved after an insertion; when the owner
  explicitly allowed round 4, the dispatch prompt had to include cap-lifting content, and item 2 made UC-08 read two ways.
- Source: external REVIEW-20261026-023-CAND-021 r2 first leg; stopped 2026-10-26 21:0x UTC+8 under the coordinator's tightening (same-root P1 stop; not a plugin rule).
- Archive basis: CHANGELOG 0.1.56 "018, 021, 023, 006 withdrawn"; assessment draft + owner t622s3573 A.

## CAND-20261026-018 same-root P1 stopped-review open items (closed: handled in 0.1.53/0.1.56; archived with the candidate's withdrawal)

- archived (P1) [2026-10-27 t622s3573]: withdrawn with CAND-20261026-018 in 0.1.56; not actionable. Originally open: the replay table's "duty cell → rejection cell"
  function conflicted with independent criteria (same root as r1 R1-3); the "not-applicable counterexample" column referred to two templates ambiguously (r1 R1-5).
- archived (P1) [2026-10-27 t622s3573]: withdrawn with the candidate. Originally open: the re-added sentence of item 3 had no item number, so rejection did not cover
  it; the replay table sat in the "file-level self-review" cell and vanished behind a placeholder in the review copy; `confirmation-authorization-and-change.md:48`
  was not registered for restating-style rejection.
- Source: external REVIEW-20261026-020-CAND-018 r1, r2 first leg; same-root P1 stop 2026-10-26 20:0x UTC+8.
- Disposition: owner 2026-10-26 20:02 UTC+8 card t547s3142 「A：6 条全部保持停审，P1 留在已知缺口，以后先实测再改」 [“A: keep all 6 stopped; P1s stay in known
  gaps; later, live-test first, then change”].
- Archive basis: CHANGELOG 0.1.56 "018, 021, 023, 006 withdrawn"; assessment draft + owner t622s3573 A (do not revise the old drafts again).

## CAND-20261026-015 three-round cap stop, residue (closed: handled in 0.1.53/0.1.56)

- open (r3 first leg verified P1, not fixed): ① the default record path does not yield UC-01; ② the sub-task directory mirrors the Task directory and triggers the
  current Task identity rules; ③ section D's "backfill after push" and "leaving `{}` means not filled" are worded inconsistently; ④ "confirmed/governed" makes UC-03
  read two ways.
- open: cross-repo sub-task record location and numbering, carrying long-term agreements on re-dispatch, the executor's own-repo commit exception, notifying after
  push and syncing per-repo state, and a joint-push checklist template are not in the rules.
- open: authorization ownership of relayed tasks touches the authorization boundary; awaits the owner's direction.
- Source: external REVIEW-20261026-019-CAND-015 r1–r3; three-round cap stop 2026-10-26 19:4x UTC+8 (t532u does not lift the cap). Group chat coordination belongs to
  the channel admin and is not in the ledger.
- Disposition: owner card t547s3142 (quoted above) — live-test first, then change.

## CAND-20261026-016 and CAND-20261026-017 r3 cap awaiting the owner (rounds from r4 exceeded the cap; results reference only) (closed: handled in 0.1.53/0.1.56)

- open: rounds from r4 exceeded the three-round cap (the coordinator misread t532u), which was not compliant; state corrected to "r3 cap, awaiting the owner";
  the P1s from the over-cap rounds below are reference evidence only. Source: owner t537u (2026-10-26 19:40 UTC+8); fix candidate CAND-20261026-021.
- open: 016 v7 (relay keeps original qualifiers) r7 first leg P1: sentence boundaries only recognize full-width “。？！”, so a "previous sentence / conclusion"
  separated by a newline or half-width mark forms one sentence and frozen UC-03 can yield "do not reject"; also P2: “第…部分” [“part …”] has no upper bound,
  sentence boundaries split error excerpts, substring false matches.
- open: 017 v6 (new runtime dependency: list comparable libraries and live-test) r6 first leg P1: the pause object written as "package list" vs frozen UC-06
  "pause dependency writes" reads two ways; rejection only rejects the plan's wording, so a correct plan that still writes to the package list slips through.
- Source: first-leg results of the over-cap rounds (016 r7, 017 r6), reference only (the earlier "stopped per t532u" was corrected by t537u); records
  REVIEW-20261026-017-CAND-016, REVIEW-20261026-018-CAND-017.
- open (016 r3 first leg-1 P1, verified): “给出该结论的每一句” [“every sentence that gives this conclusion”] can read as an empty set when the claim becomes
  "not supported/needed/all"; UC-01/03/05/06 read two ways. Source: REVIEW-20261026-017-CAND-016 r3.
- open (017 r3 first leg-1/2 P1, verified): the applicability sentence lacks "not in runtime artifacts", UC-04 reads two ways; what item 3 must say when item 2 does
  not apply reads two ways (UC-05). Source: REVIEW-20261026-018-CAND-017 r3.
- Disposition: owner card t547s3142 (quoted above) — live-test first, then change.

## CAND-20261026-011 narrowed to CAND-20261026-016, residue

- open: non-relayed claims about external systems, libraries or platform capabilities (positive or negative) must carry an anchor sufficient to derive them,
  otherwise be marked "unverified" with a way to verify; live-test first when cheap.
- Source: owner card t528s3067, verbatim 「011 和 012 选 A：两条都缩小范围重来，011 只管转述保留原限定，012 只管新增依赖前列同类库并实测，其余记进已知缺口」
  [“011 and 012: choose A — narrow both and redo; 011 only covers relays keeping original qualifiers, 012 only covers listing comparable libraries and live-testing
  for new dependencies; record the rest in known gaps”] (2026-10-26 17:52 UTC+8); the P1s of 011 r1–r3 all concerned the scope of exceptions and rejection
  sentences; open a narrow candidate if it causes trouble.
- open: CAND-20261026-016 only checks qualifier words literally: a sentence that lists the original qualifier but still makes a definite claim (e.g. “没测成，所以不支持”
  [“couldn't test it, so unsupported”]) is not rejected; a rewording that keeps the qualification without the original word is rejected; the exception for live
  output in the same sentence still holds when that output is unrelated to the claim.
- Source: CAND-20261026-016 r1 R1-2, R1-3, r3 first leg-3; recorded 2026-10-26 18:33 UTC+8 under owner t532u auto-advance; open a narrow candidate if needed.
- open: CAND-20261026-016 decides "relay" by "conclusion from a cited source"; an author who calls the basis their own knowledge and omits the source bypasses it.
  Source: 016 r4 first leg-4, r5 first leg-1 (the "same topic" clause withdrawn), recorded 2026-10-26 19:05 UTC+8 under t532u.
- open: CAND-20261026-016 isolates by source sentence: a sentence where the source itself already dropped the qualifier (e.g. the second sentence of
  “xlsx 没测成。所以不支持。” [“xlsx couldn't be tested. So it is unsupported.”]) is not rejected when copied. Source: 016 r6 first leg-5, recorded 2026-10-26
  19:25 UTC+8 under t532u.

## CAND-20261026-012 narrowed to CAND-20261026-017, residue

- open: before writing new functions, modules or call chains, search the project for existing implementations and prefer reuse; when adding a dependency, offer
  "replace and unify" to the user as a pending option.
- Source: owner card t528s3067 (quoted above, 2026-10-26 17:52 UTC+8); the P1s of 012 r1–r2 were all about exemptions and the option list not being carried into
  the rejection sentence; open a narrow candidate if needed.

## CAND-20261026-013 start-card scope reduction, residue

- closed [2026-10-27 t622s3573]: verbal Auto is not a mode source — current `task-recognition-and-routing.md` §4.4 (0.1.56/0.1.58) already says only selecting Auto
  on this card counts; verbal Auto does not; it rejects "verbal Auto taken as the mode source".
  Historical gap description: when creating a managed task, Auto said verbally (even with the task ID and all five elements) was not a mode source and the start
  card was still shown; the user had to select the card's Auto option.
- Source (historical): owner 2026-10-26 17:45 UTC+8 card t528s3054 「013 选 B…」 [“013: choose B…”]; the P1s of 013 r1, r2 concerned recognizing the task ID in verbal
  Auto. Closure basis: the assessment draft's ledger-mismatch table + t622s3573 A.
- closed (historical note) [2026-10-27 t622s3573]: the former wording "the card offers no Auto" is outdated. Current §4.4 (0.1.58): the start card **offers** Auto,
  only forbidding Auto as recommended/default; verbal Auto still does not count.
  History: when 013 was narrowed to CAND-20261026-019 in r5, the depth card stated only this task's mode (default Confirm) and offered no Auto; edge cases (intended
  task ID, selecting means delegating, local commit exception) may still not have landed (see open items below and the 0.1.56 edge cases); the "no Auto" debt is not
  repeated here.
- Source (historical): 2026-10-26 19:00 UTC+8 narrowed per recommendation under owner t532u; verified P1s of 013 r3–r5 concentrate on task ID and exhaustive pointers,
  see external REVIEW-20261026-014-CAND-013. Closure/rewrite basis: CHANGELOG 0.1.58 + §4.4 + t622s3573 A.
- open (013 r3 first leg, four P1s, verified): F1 the routing:57 verbatim text "keep delegation without changing number" can read as keeping Auto; F2 the README
  verbatim text did not limit itself to new tasks, so continuing a task re-sends the card; F3 the SKILL:140 pre-check continuation records an already-selected
  continuing turn as unanswered.
- open (same): F7 selecting Auto always includes a local commit, conflicting with `confirmation-authorization-and-change.md:68` and lacking a pointer. Source:
  REVIEW-20261026-014-CAND-013 r3.
- Disposition: owner card t547s3142 (quoted above) — live-test first, then change.

## CAND-20261026-014 round-3 cap stop (not converged) open items (closed: handled in 0.1.53/0.1.56)

- open (P1, r3 verified): when the widget question body lacks a recommended tier per option, "none written" reads two ways; when a list and a table coexist, which
  one counts is undecided; "list item or table row + paragraph does not count" wrongly hits the legal numbered options at :39.
- Reference (over-cap r4–r6, non-compliant, not counted toward convergence): whether a short reply code counts as one, locking the recommended item, bypassing via
  "what/why" placeholders, etc.; see external verification records.
- Source: REVIEW-20261026-015-CAND-014 r1–r3; corrected 2026-10-26 19:58 UTC+8 to "round-3 cap, awaiting the owner".
- Disposition: owner card t547s3142 (quoted above) — live-test first, then change.

## CAND-20261026-010 narrowed to CAND-20261026-014, residue

- open: the option-description duty does not cover single options or disambiguate-first: a pending item with only one option, and the disambiguate-first case at
  `confirmation-authorization-and-change.md` line 34 (regardless of count), do not require descriptions; only the existing duties of lines 31–35 apply.
- Source: owner 2026-10-26 17:27 UTC+8 card t527s3042 「010 选 A：缩小范围，作为新的低风险候选重来，只管两个以上的选项，单选项和消歧记进已知缺口」 [“010: choose A —
  narrow it and redo as a new low-risk candidate covering only two or more options; record single options and disambiguation in known gaps”]; the P1s of 010
  r1–r4 were all about exemptions and placement for these two; open a narrow candidate if needed.

## CAND-20261026-006 not adopted (covered by CAND-20261026-007), residue

- open: the table C answer-state residue of 006 has not landed: a card that was sent but not answered, or a user saying skip/defer, is not evidence that it was not
  displayed, does not trigger 007's "not displayed → resend as numbered options" downgrade, and records no agree, reject, close or not-shown.
- Source: CAND-20261026-006 not adopted (owner 2026-10-26 17:21 UTC+8, card t527s3030); 007's current text does not say "no answer ≠ not visible"; no failure seen so
  far; open a narrow candidate if needed.

## 0.1.52 report Pages (CAND-20261026-009 v8r1) retained items

- E4 unverified: not live-tested in a fresh Grok Bot session that reports get a separate Page, dispatched sessions make no Page, the 968px sidebar/drawer switch and
  body width; small fixes after v8r1 converged (P2×4, P3×3) were not re-reviewed.
- Platform limit: public pages.grok.bot links do not support floating elements (fixed, sticky and IntersectionObserver have no effect), so only a top table of
  contents plus a per-section "↑ contents" link is possible; filed as product feedback, awaiting platform support.
- The rule is a text constraint; no gate script checks whether a Page is generated or styled correctly.
- Platform limit (Rocky t242u width floor): public pages.grok.bot links are capped at 960px, so the 1024px desktop floor cannot hold there and they are exempt;
  the sidebar contents threshold has two measurements (968px item 7, 1100px Rocky 2026-10-28), not reconciled by a fresh live test.

## 0.1.51 narrowed test-run cap (CAND-20261026-004) retained items

- E4 unverified (gray-zone behavior): not live-tested in a fresh session that the main session refuses to hand the A05 start baseline and DOC07 static-script slices
  to the `test-run` executor.
- T6, T7 and the new sentence at :171 (T9) have no test lock; drift tests only lock the cap cell and constants.

## 0.1.48 unattended delegation allowlist (CAND-20261026-005 v5) retained items

- E4 unverified: not live-tested in a fresh session after reload that unattended Grok Build delegation follows the per-task-type allow list and explicit deny list
  and stops when out of bounds.
- The rule is a text constraint; out-of-bounds judgment depends on model and host permission behavior; the v5 stop-when-out-of-bounds clause was not re-reviewed
  (per the 003 v5 precedent).

## 0.1.47 option widget presentation (CAND-20261026-003 v5) retained items

- The v5 small fixes (r4-F1/F2, lines 17 and 21) were not independently re-reviewed; see `REVIEW-20261026-002/00-审查报告.md`.
- E4 unverified: not live-tested in fresh sessions on hosts with and without widgets: three presentation tiers, multi-step item by item, rejection counterexamples.
- The rule is a text constraint; host capability tiers are judged by the model; no gate script checks how replies are presented. New tests only check that rule
  text exists, not model behavior.

## 0.1.46 delegation triage (CAND-20261026-001 v7) retained items

- The v7 small change (r3 second leg P2 B-1 fix, lines 42, 45, 46) was not re-reviewed; see `REVIEW-20261026-001/r3-00-审查报告.md`.
- E4 unverified: not live-tested in a fresh session after reload that "purely deterministic changes are not delegated; behavior changes are delegated with behavior
  evidence".
- closed (FEAT-20261026-001) [2026-10-27]: the two hard thresholds were removed in 0.1.72 (commit ca07987); the code-level check requirement has no object; closed.
  History: the code-level check of the two hard-threshold live records (candidate D2) had become feature request FEAT-20261026-001 (use cases frozen (t477s2567),
  not implemented); `validate-config.mjs` does not check it; for the narrowed `test-run` cap see the CAND-20261026-004 retained items.
- New tests only check that rule text exists, not model behavior.

## 0.1.45 loop-risk fix (CAND-20261025-017) retained items

- The receiver gate is a rule-text constraint, not technical isolation by the host; whether a dispatched session complies depends on model behavior. Re-test results:
  `LOOPFIX-20261026-001/` (Grok Build host only; no behavior re-test on Codex/Cursor hosts).
- Relays where an agent says it was "dispatched" but carries no dispatch header are recognized only semantically; there is no deterministic detection.
- New regression tests only check that document text exists, not model behavior.

## 0.1.44 items retained in this delivery

2026-10-25: the user explicitly asked to commit and push the existing results first and update the plugin. This delivery used existing evidence, added no extra test
rounds, and does not treat the update as a full V1.2 acceptance pass.
Of the original 82 acceptance items, 57 passed and 25 are not fully verified; of the original 21 issues, 13 are verified closed and 8 pending verification (7 P2,
1 P3). These numbers do not cover the whole historical ledger below.

| Follow-up verification scope | Retained acceptance IDs |
|---|---|
| Host, Auto and material-reading boundaries | AC-000-03, AC-002-02, AC-008-02 |
| Lifecycle, content decisions and issue closure | AC-001-04, AC-001-07, AC-008-03, AC-012-02, AC-012-03 |
| Entry, bootstrap, delegation and actual config consumption | AC-009-02, AC-009-03, AC-009-04, AC-011-01, AC-011-02, AC-011-03, AC-018-03 |
| Same-package rollback, check exceptions and Windows binding | AC-004-10, AC-004-11, AC-017-02 |
| Miss causes and out-of-scope risk triage | AC-013-02, AC-013-03, AC-014-02, AC-014-03 |
| Historical originals, review intensity and independent evidence | AC-019-01, AC-019-02, AC-019-03 |

Issues still pending verification: R02, R04, R05, R06, R12, R13, BHV-ENTRY-01, BHV-ENTRY-02; observed entry deviations are kept and not closed by new positive cases or
this update. The maintainer re-checks them when planning the next maintenance version, before enabling related features, or when the missing originals are obtained;
re-assess immediately on a related failure or major risk. No technical isolation switch for optional features was added, and no claim is made that skills-only
installation, untested hosts or the full behavior matrix passed.

## Historical entries (original state kept)

Columns: ID, severity, source candidate/commit, issue, whyMissed summary or link (external record paths keep their Chinese names), state.

| ID | Severity | Source candidate/commit | Issue | whyMissed summary or link | State |
|---|---|---|---|---|---|
| CAND-20261025-002/F04 | P2 | CAND-20261025-002 v6 / e38a10b (0.1.32) | External references not bound to versions | CAND-20261025-002/r1/第1轮裁决.md line 11 (earlier review plan did not check source binding) | open |
| CAND-20261025-002/F05 | P2 | same | Insufficient verification strategy | same, line 12 | open |
| CAND-20261025-002/F06 | P2 | same | Incomplete rollback | same, line 13 | open |
| CAND-20261025-002/N02 | P2 | same | rule-gap attribution lacks pre-classification and loading basis | same, line 17 | open |
| CAND-20261025-002/F07 | P3 | same | Cost without basis | same, line 14 (P3, optional) | open |
| CAND-20261025-002/N01 | P3 | same | Locating regex misses 00 | same, line 16 (P3, optional) | open |
| CAND-20261025-004/A10-01 | P2 | CAND-20261025-004 v16 / 9c173ad (0.1.28) | No body consistency check after converting the original to the review copy | CAND-20261025-004/rounds/v16-r10/whyMissed-协调方补写.md line 4 (introduced by the v16 revision) | open |
| CAND-20261025-004/A10-02 | P3 | CAND-20261025-004 v16 / 9c173ad (0.1.28) | Version revision notes in the three relay templates' review copies/diffs were not replaced with placeholders | same, line 5 (P3, optional) | open |
| CAND-20261025-007/F1 | P2 (residue) | CAND-20261025-007 v1 / 2dab7bf (0.1.30) | Shared permission boundary not explicitly referenced (the credentials part is covered by effective text) | CAND-20261025-007/r1/第1轮裁决.md line 10 (cross-round N/A, first reviewed version) | open |
| CAND-20261025-007/F3 | P2 | same | Verification strategy lacks D/A/I/H, failure conditions, E4 loaded version | same, line 12 | open |
| CAND-20261025-007/F4 | P2 | same | Inconsistent rollback wording; missing history/permissions/consumers | same, line 13 | open |
| CAND-20261025-007/N2 | P2 | same | Tier argument misses the "public behavior" judgment | same, line 17 (review plan C5 scope reduced) | open |
| CAND-20261025-007/F2 | P3 | same | Source facts not marked as parent-session statements | same, line 11 (P3, optional) | open |
| CAND-20261025-007/F5 | P3 | same | Cost estimate | same, line 14 (P3, optional) | open |
| CAND-20261025-007/F6 | P3 | same | "User only wants the path" not in rejection or the proposed sentence | same, line 15 (P3, optional) | open |
| CAND-20261025-008/A1-01 | P2 | CAND-20261025-008 v3 / this promotion commit (0.1.34) | INDEX line numbers written from the worktree, not HEAD | CAND-20261025-008/r1/第1轮裁决.md line 8 | open |
| CAND-20261025-008/A1-02 | P2 | same | Closing-commit timing inconsistent with the table header | same, line 9 | open |
| CAND-20261025-008/A1-03 | P2 | same | Closing on the fix commit conflicts with the §7.5 closing contract | same, line 10 | open |
| CAND-20261025-008/A1-05 | P2 | same | Facts from other tasks' reviews exceed the two exception fields; missing full sha | same, line 12 | open |
| CAND-20261025-008/A1-06 | P2 | same | CHANGELOG history-retention exception not in the effective clause | same, line 13 | open |
| CAND-20261025-008/A1-08 | P2 | same | Verification does not cover the closing path; E4 not bound to the loaded version | same, line 15 | open |
| CAND-20261025-008/B2-12 | P2 | same | Completeness check only compares two places; a missed sync registration can pass | same, line 19 | open |
| CAND-20261025-008/A1-09 | P3 | same | Maintenance cost without basis | same, line 16 (P3, optional) | open |
| CAND-20261025-008/A1-10 | P3 | same | Tier state inconsistent | same, line 17 (P3, optional) | open |
| CAND-20261025-001/G1 | to verify (residue) | CAND-20261025-001 v11 / this promotion commit (0.1.35) | Approval scope statement: t292u's original words were not kept; the registered authorization is only a statement | CAND-20261025-001/v11-外置叙述.md (B3-006 revision note) | open |
| CAND-20261025-001/G2 | to verify (residue) | same | Whether term definitions were checked at §7.10 promotion cannot be proven | same (B3-007 revision note) | open |
| CAND-20261025-001/G3 | process (residue) | same | v11 changes were not independently re-reviewed; only the change scope was checked | CAND-20261025-001/v11-改动映射表.md | open |
| CAND-20261025-001/G4 | process (residue) | same | All review rounds used the same model (codex) in two independent sessions; no cross-model coverage | CAND-20261025-001/r3/第3轮裁决.md | open |
| CAND-20261025-009/A1-06/B2-06 | P3 | CAND-20261025-009 v4 / this promotion commit (0.1.36) | Cost lacks estimation basis and maintenance cost | CAND-20261025-009/r2/第2轮裁决.md line 18 (P3, optional) | open |
| CAND-20261025-009/B2-08 | P3 | same | "Line 31 kept verbatim" does not match the patch | same, line 19 (P3, optional) | open |
| CAND-20261025-009/B2-09 | P3 | same | Example A's recommendation reason is still an ellipsis placeholder | same, line 20 (P3, optional) | open |
| CAND-20261025-009/B2-004 | P3 | same | "Recent real examples" lists names only (round 1) | CAND-20261025-009/r1/第1轮裁决.md line 11 (P3, optional) | open |
| CAND-20261025-010/A1-09 | P3 | CAND-20261025-010 v4 / this promotion commit (0.1.37) | Use case F13 note “停在‘存在’” should be “存” [a one-character wording fix] | CAND-20261025-010/r2/第2轮裁决.md line 22 (P3, optional) | open |
| CAND-20261025-010/B2-13 | P3 | same | The user's original words are information-isolated and not sent for review, so reviewers cannot independently check C8 | same, line 26 (P3, optional) | open |
| CAND-20261025-010/G1 | process (residue) | same | v4 revision not re-reviewed; only change scope checked and use cases run | CAND-20261025-010/v4-改动映射.md | open |
| CAND-20261025-011/A1-05 | P3 | CAND-20261025-011 v2 / this promotion commit (0.1.38) | Candidate line 9 "applies to all formal reviews" is wider than the §7.10 trigger (R:139) | CAND-20261025-011/r1/第1轮裁决.md (P3, optional) | open |
| CAND-20261025-011/B2-07 | P3 | same | Candidate line 15 cost not split into introduction/execution/maintenance | same (P3, optional) | open |
| CAND-20261025-012/A1-01 | P2 | CAND-20261025-012 v2 / this promotion commit (0.1.39) | "Plugin root is three levels up" does not hold for hosts that install only the skill directory; a source checkout has no unique identification | CAND-20261025-012/r1/第1轮裁决.md | open |
| CAND-20261025-012/A1-02 | P2 | same | Relation between the "script unreachable" review exit and line 245 (before ready) / line 250 (must run after ready) unclear | same | open |
| CAND-20261025-012/A1-03 | P2 | same | The candidate's root cause states as certain an attribution that marked E4 as an assumption; the 010 control failure has no source (candidate body) | same | open |
| CAND-20261025-012/A1-04 | P2 | same | The candidate cites transcript-0:1262, which is a probe command; the "three times not ready" count is inaccurate (candidate body) | same | open |
| CAND-20261025-012/A1-05 | P2 | same | The recommendation content t399u relied on was not provided with the source; approval scope cannot be checked independently | same | open |
| CAND-20261025-012/A1-06 | P2 | same | The two rollback branches do not separately cover host, INDEX and partial failure | same | open |
| CAND-20261025-012/A1-07 | P3 | same | Generalization "all … always happen" without evidence | same (P3, optional) | open |
| CAND-20261025-012/A1-08 | P3 | same | The not-applicable counterexample is actually an applicable scenario | same (P3, optional) | open |
| E4-0.1.37/T7-T8 | host limit (Codex host sandbox) | E4 Codex live test (0.1.37); FEAT-20261024-001 A05/E4 items needing nested codex sessions belong here too (owner 2026-10-25 17:02 chose A) | Root cause: the outer `codex exec -s workspace-write` runs inside bwrap, so the inner codex cannot create its own bwrap sandbox (loopback `NETLINK_ROUTE` socket EPERM, e4-scratch/T7/evidence/transcript-1.txt:916) or write `~/.codex` (EROFS os error 30, same file :1460); the §7.10 relay flow (T7, T8) cannot run on a sandboxed Codex host. Host behavior was correct (recorded blocked, no fake completion); not re-tested with outer danger-full-access (declined). Not a rule failure | external E4-实测结果-codex-0.1.37.md, pending item 1 | open |
| FEAT-20261024-001/E4-unverified | host limit | FEAT-20261024-001 E4 (0.1.40, coordinator codex exec sign-off) | E14 (truncated stdout needs injection), E17, E42, E43, T-B (host writes home global config), T-C (grok), T-D (-m/-c) not live-tested: limited by the Codex host sandbox and the "no grok, no -m/-c" constraint; 8 tested items passed | FEAT-20261024-001/evidence-E4/E4-实测结果-FEAT-001-0.1.40.md | open |
| FEAT-20261024-001/Cursor-skills-only | host limit | same / 0.1.40 | The Cursor host syncs only `skills/`, so the plugin-root `scripts/validate-config.mjs` is not installed → consumers get `validator-unavailable` and all delegation settings stay off (fail-safe); same root cause as CAND-20261025-012/A1-01 | FEAT-20261024-001/00-任务记录.md, 17:20 entry | open |
| CAND-20261025-014/A02-lead | contract lead gap | CAND-20261025-014 v2 / 0.1.41 | The rule text already says "conflicting multiple values of the same log-header field = log-unverifiable; repeated identical values are still compared with config"; FEAT-20261024-001 Usage Contract (A02) v13 §5 item 8 has not merged it; a contract semantics change, not eligible for a self-review small fix; to merge in the next A02 version with tiered review | CAND-20261025-014/第1轮裁决.md | open |
| CAND-20261025-016/G1 | process (residue) | CAND-20261025-016 v4 / 0.1.43 | The v4 sentence fixing U1-001 (self-review tier must still cover the checklist and whyMissed read-back) was only re-checked by the coordinator against UC-05/INV-01, not sent for independent re-review; the change only tightens (owner 2026-10-25 17:55: no extra review by default) | CAND-20261025-016/冻结件修订独立核查.md | open |

## CAND-20261026-021 three-round cap stop, residue (r3, 2026-10-26) (closed: handled in 0.1.53/0.1.56; archived with the candidate's withdrawal)

- archived (P1 r3 first leg-1) [2026-10-27 t622s3573]: withdrawn with CAND-20261026-021 in 0.1.56. Originally: v3 defined a specific instruction as "naming both the
  candidate and the round or stop point", narrower than line 228's "a specific instruction for a given review (e.g. a set number of rounds)", conflicting with INV-04.
- archived (P1 r3 first leg-2) [2026-10-27 t622s3573]: withdrawn with the candidate. Originally: the general-instruction "does not lift" list was closed and did not list
  the line 240 invariant confirmation or the line 284 quality exception; it could read two ways.
- P2×5 and P3×3: see external REVIEW-20261026-023 r3 records (also withdrawn with the candidate; no further fixes scheduled).
- Archive basis: CHANGELOG 0.1.56; assessment draft + owner t622s3573 A.

## Candidates moved in with 0.1.56 (2026-10-27, owner t576u)

- KG-003: the wording where rejection sentences cite only the item number without restating exceptions (CAND-20261026-003) did not become a rule; it arose from the
  coordinator's ambiguous wording, with no real failure. Method: static review, not run for real.
- closed (KG-004) [2026-10-27 t622s3573]: the use-case replay table value system and revising existing criteria (CAND-20261026-004) did not become a rule; **the new
  flow has dropped frozen replay tables**, there is no current consumer, closed. Historically recorded as "not a rule; the new flow no longer uses frozen replay tables".
- The 013+019 merged draft took only their common core; the "other" entry details and Docs task exception of the original 013 did not land.
- 015's template section D was not added separately; the checklist columns are written in item 3 of the rule body.

## Real runs cannot be isolated while the global plugin is enabled (registered 2026-10-27)

- open: on the box, Grok enables task-lifecycle globally (`~/.grok/config.toml` `[plugins] enabled`), so a test session cannot load only the version under test; 0.1.55
  stopped running the 014 use cases for this reason, and the out-of-bounds file read in 017 r10 has the same source.
- Current practice: when the global copy's sha256 matches HEAD, use it for real runs and state "not isolated" in the report; temporarily disabling the global plugin
  for isolation needs the owner's approval. Method: static review, not run for real. (Since 0.2.0, isolated runs use a separate `GROK_HOME`; see the 0.2.0 records.)

## F11 length caps (closed)
check-docs checks SKILL.md ≤600 lines (raised from ≤180 in 0.2.0, D4; to ≤600 by Rocky t949u) and references/*.md ≤600 lines (raised from ≤300 in 0.2.0, D7; to ≤600 by Rocky t948u).

## F09 / F12 / F13 (closed) and F10 (dropped)
- F09 closed: absolute line numbers named in self-review were changed to content anchors (0.1.64).
- F12 closed: the three kinds of real use cases run only the kind hit this time; no cases are invented for kinds not hit (0.1.64).
- F13 closed: FormalReview's "stop when two rounds of the same method make no progress" and the relay's "at most 3 times" have different objects; whichever comes
  first stops (0.1.64).
- F10 relay detail compression (dropped): the original suggestion was summary into Finding, details into templates; the owner dropped it (t615u); not scheduled; do not
  treat it as a to-do. The relay detail text is unchanged.

## README acceptance boundary (moved from README in 0.1.68, D1=A t720s4033)

- open (historical, former README line 13): restricted CLI behavior, isolated report/Task writes, config consumption samples and independent static re-review evidence
  were obtained; of 82 acceptance items 57 passed and 25 are not fully verified; this cannot be extrapolated to full host acceptance.
- open (same): untested scope for desktop install/cache loading, parallel execution, WebStorm HTTP Client, real APIs, browsers or native Agent Eval remains, judged by
  the actual version SHA and item-by-item evidence.
- open (same, former README line 10): delivered with existing results per the user's decision; full V1.2 acceptance still has items awaiting evidence. Source push,
  account save and actual host loading are verified separately.

## 0.1.68 README review register (t723s4066)

- open (M-13, P3): the "location" line of the consumption protocol in `task-split-parallel-and-integration.md` gives the project layer
  `<workspace>/.task-lifecycle/<Project ID>/config.json`, and the POSIX invocation line gives `--workspace <parent directory of the bound project root>`; the two are
  side by side but do not state that `<workspace>` is the `--workspace` value.
  The README states "the same directory (the parent of the project root)"; the protocol text is unchanged pending clarification. Source: README review
  03-自审与复审.md M-13 (re-review R-12).
- open (M-09, P2 residue): `.cursor-plugin/plugin.json` was checked against the field table in Cursor's official docs cursor.com/docs/plugins/building (read
  2026-10-27), removing the undocumented `displayName` and `author.url`; there is no downloadable JSON Schema, so only the doc field table is checked and T60 locks
  the key set. Not live-loaded in a real local Cursor (E4 unverified).
- closed (M-02) [2026-10-27]: `host-sync.sh`'s sparse-checkout exclusion step (backup, non-git error, skills integrity check, rollback command) has since run on the
  real Codex and Grok installs (HOSTSYNC-20261027-0200 and -0201: `EXCL ok` on both, `candidates/` absent after each sync). Historically: only simulated in a temp directory. Still
  untested: whether a host plugin update alone, without host-sync, keeps the sparse setting.
