# re-review-performer-choice

> Body of `formal-review-and-findings.md` §7.11 (CAND-20261028-004 v4, user-ruled rule, not a technical-baseline excerpt). It governs only the extra independent re-review chosen here; everything
> else, including the plan, legs and degradation of a full relay, follows `formal-review-and-findings.md` §7.10.
> Bare section numbers (§7.4, §7.5, §7.10) refer to `formal-review-and-findings.md`.

## Scope

Exactly the formal artifacts of A01–A04, B03 and DOC03–DOC04 of a managed task; this rule does not apply to rule or candidate revisions (§7.10 item 7). The choice applies only to these artifacts.

## Rules

1. **Additive only**: the choice decides only who performs one extra independent re-review; mandatory self-review, required formal review (§7.4) and any independent session an existing rule
   requires still run. None of the options may mean "skip everything except the user's glance".
2. **Options** (each states what it does, does not do and costs): (a) the user reviews it themself; (b) one fresh clean current-host session, one read-only review, labeled "same model, one
   independent session", shown only when the host can open one; (c) one third-party reviewer host session, one read-only review, using the first host in `hosts` order that passes the checks, or
   the CLI the user named.
3. **One session, no relay**: (b) and (c) each open one session for one read-only review. The full §7.10 relay runs only when the artifact's review plan already requires an independent reviewer
   (§7.10 Trigger); the choice never starts one. `reReviewPerformer` never satisfies the §7.10 Trigger, never uses the two-seat rule of `task-split-parallel-and-integration.md` "Delegation config"
   item 9 and never uses `review.fallback`; (c) may still read the `review` config for its host list and checks.
3a. **Re-review count cap** (additive): the extra re-review of rule 3 and every recheck after its accepted fixes count toward this artifact's review count: default 1,
    at most 3; before the 2nd, state the reason for re-review. At the cap, unresolved issues go to the user at once, with no further round; a review by the user themself ((a)) also
    counts as 1. Keeping an independent re-review for high-risk changes means the §7.10 Trigger and §7.10 item 6, with no separate definition here; this item adds a count only,
    and never waives a review rule 1 keeps.
4. **Checks and failure**: (b) runs no validator and only checks that the host can open a clean session. Each use of (c) reruns the validator fresh and §7.10 item 0 admission, including the
   capability probe (`task-split-parallel-and-integration.md` "External coding executor delegation" item 3) and read-tier checks ("Delegation config" items 9-10); these probes run at use time,
   never when the card is shown. If (c) fails, open one fresh clean current-host session for one read-only review, labeled "same model, one independent session"; if that is impossible, write "no
   independent session (chosen reviewer unavailable)" in the final report's residual risk; it is not `blocked` and is never re-asked. Never enter a relay and never ask again because of a failure.
5. **Session inputs and timing**: a (b) or (c) session gets the prompt of `templates/relay-review-first-leg-prompt.md` under the §7.10 item 1 information boundary (self-review only as a
   placeholder). It runs after the artifact's required self-review and formal review and before the artifact is confirmed; its findings are verified per §7.5 before that confirmation.
6. **(a) human review**: hand the artifact over when it is ready; any wait stays within the existing Confirm wait; under Auto there is no wait, and opinions given later are handled as a change
   (A10/B10/DOC10). No opinion is recorded as "no opinion"; user review is not approval (§7.5). Factual findings are verified per §7.5; product decisions are decision sources and are not verified.
   The label "no independent session (user chose human review)" is used only when the user chose (a), covers only the extra re-review, is not `blocked`, is never re-asked, and goes into the final
   report's residual risk; when the plan already requires an independent reviewer, §7.10 item 6 still governs that reviewer.
7. **When to ask**: ask once, separately, never in the same turn as the Kickoff card: before the review plan of the first in-scope artifact is confirmed, or, when that phase has no review plan
   (B03, DOC03, DOC04), before that artifact is confirmed. This first question is a genuinely new protected decision (`confirmation-authorization-and-change.md` item 9). The answer goes into
   that plan, or into the artifact record when there is no plan, as `reReviewPerformer` with its source, and is confirmed with it. Reuse it for later in-scope artifacts of the same task; the user
   may change it at any time, recorded the same way, and a change applies only to in-scope artifact versions whose confirmation is not yet recorded; a session already opened finishes and its
   result is kept. Never re-ask per artifact or because a report was produced (SKILL.md §0 item 7). Until answered, existing review rules apply unchanged.
8. **Unanswered card**: when a shown card expires, is dismissed or gets no selection, that plan or artifact is not confirmed until the user selects an option or gives a no-card instruction (rule
   9); the outcome is recorded in `reReviewPerformer`.
9. **No card**: on an explicit "just do it" or "as recommended" for this task given before the card appears, or Auto clicked on the Kickoff card (a verbal Auto is not an Auto source,
   `task-recognition-and-routing.md` Kickoff card), show no card, apply existing rules, and write "re-review mode not chosen" on the progress card's Done line; such a general instruction picks no
   option. When neither (b) nor (c) can be shown, show no card and write "re-review mode not chosen (no session available)" on the Done line, adding that the user may still name a CLI (§7.10 item
   0). Either outcome is also recorded in `reReviewPerformer` with its source.
10. **When (c) is shown**: only when the validator, run fresh this run, gives a valid config, approval verification passes and `effective.review.enabled.value === true` with hosts
    (`task-split-parallel-and-integration.md` "Delegation config" item 9). Otherwise (c) is not shown and the question adds one line that the user may name a CLI via Other. A CLI named on the card
    stays valid for this task's in-scope re-reviews; each call is admitted anew per §7.10 item 0 and re-probed (rule 4). A dispatched session (SKILL.md §0 item 1 receiver gate) never offers (c)
    and never asks this question.
11. **Form**: a single-question card per "Two or more options" and "Pending decisions preferably use a choice widget" in `confirmation-authorization-and-change.md`; recommend (c) if shown, else
    (b); never recommend (a). On this card only, the reply "as recommended" is the explicit selection of the recommended option; the §7.10 item 7 instruction boundary still governs every other
    wait and every review cap.
    - **Exception, explicit rotation** (additive): when the user has set a rotation sequence per rule 13, the card preselects the sequence's current option, which may be
      (a); the user may still choose another. Under rule 9 the agent still picks nothing itself, but a sequence the user set counts as their explicit selection.
12. **Labels**: the Chinese forms of these labels are in `entry-quickref.md` LABELS.
13. **Explicit rotation sequence** (additive): the user may explicitly set a reviewer rotation sequence (for example "third-party host → the user themself"). It is written into
    `reReviewPerformer` with its source, and the task record notes who performs this time and who performed last time. Within one task, rule 7 reuse still applies; the
    sequence advances only per its own setting. When no sequence is set, everything stays as before.
