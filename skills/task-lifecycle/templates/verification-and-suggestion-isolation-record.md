# verification-and-suggestion-isolation-record — concrete claim verification / unapproved suggestion isolation (content template)

## A. Verification record for the real current version

| Claim ID / Source ID | Object under test and actual consumers/version | Positive/rejection assertions | D/A/I/H / permission | Actual command or action and execution source | Raw result/environment time | Result / E3-E4 ceiling / Next |
|---|---|---|---|---|---|---|
| `{claim}` | `{real}` | `{actually frozen}` | `{whether really authorized}` | `{actually run; none if not run}` | `{original evidence or unverified}` | `passed/failed/blocked/unverified/N/A+reason` |

**State judgment**: evidence levels E1–E4 are defined in `references/verification-and-evidence-routing.md` §10.5. CI queued/running/flaky cannot count as passed. Agent Eval first needs an authorized
sandbox, rubric and site protection; failure history may not be hidden by one green rerun.

## A.1 General data boundary of Eval / sub-tasks

- Eval/sub-task evidence boundary:
  `{minimal files/inputs allowed to read, redacted or approved test data and impact, approved storage/sharing scope, access and retention conventions, reasons for not running`;
  `local reads do not automatically authorize sending out, and failure history is not rewritten}`; verify per `../references/verification-and-evidence-routing.md`, regardless of whether HTTP exists.

## B. Conditional API `.http` supplement

- Effective policy: `off/suggest/generate`, default `suggest`; record the decision when the user's current explicit request conflicts with a legal preference.
- Current HTTP contract and real interface consumers/version: `{actual}`
- Four artifact levels: `generated / statically-checked / requested / passed` each with evidence and environment; whether requests have authorization for data writes/side effects: `{explicit}`.

## C. Unapproved improvement suggestions (separate from implementation tracking)

| Suggestion ID | Opportunity found and actual basis | Necessity/reasonableness/pros-cons/cost/security risk | Change beyond currently approved requirements | Alternative of keeping the status quo | Priority and reason | Status | Explicit user decision |
|---|---|---|---|---|---|---|---|
| `{proposal}` | `{real facts}` | `{verifiable explanation}` | `{difference}` | `{how to continue without it}` | `{high/medium/low: reason}` | `suggested-unapproved/rejected/deferred/approved-after-upstream-change` | `{never guessed}` |

Rejected/deferred suggestions may not enter actual code, test pass criteria or Auto; if the user approves **new product behavior**, first update the approved upstream via the inserted A10/B10/DOC10,
then really list it as a Work Item.

Each suggestion also states: `{required/optional and basis`; `benefits/drawbacks/risks of the recommendation and each alternative (including doing nothing)`;
`time, introduction and long-term maintenance cost/basis for unknowns`; `upstream/downstream and real consumer impact`; `consequences of not adopting`; `exact pending items}`. Independent Skill
maintenance suggestions also give applicable/non-applicable situations and why existing capability is insufficient; the minimal content is owned by
`../references/artifact-content-and-self-review-contract.md`, and suggestion templates may not expand permissions.
