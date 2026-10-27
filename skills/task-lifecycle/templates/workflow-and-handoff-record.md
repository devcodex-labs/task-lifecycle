# workflow-and-handoff-record — minimal duties of task description / dynamic workflow / hand-off (content template)

> Generally three formal objects that can be cited independently; this file only lists their minimal content fields together, and the same template cannot merge away real independent approval
> responsibilities.

## A. 《任务描述》: candidate generated at managed entry 00

- Task ID / Project ID / actual project physical root: `{verify}`
- Original user goal and real authorization source, non-goals and unapproved suggestions: `{verify}`
- Classification: `Feature/Bugfix/Docs/read-only assistance`; reasons and legal mapping for Refactor/Migration etc.: `{evidence}`
- This task's Confirm default or explicit Auto delegation: `{actual source}`
- `workflowDepth`: `fast/standard/thorough/custom`; `recommendedDepth` and `selectedDepth` **must be separate**, with preference intent `execution-default/recommendation-only/none` and the real
  decision source.
- Delegation config: validator `status`, `reasons`, each layer's `sha256`, approval verification result; the tier source is the current user's choice or `effective.workflowDepth` (record
  `sourceLayer`).
- Initial risks, Git/dirty, available verifiers and unclear items: `{real}`
- File-level AI self-review and next legal action: `{this self-review actually done}`

## B. 《任务工作流方案》: fixed main phases, dynamic sub-steps and artifacts

The plan consumes the plan execution section of `../references/task-split-parallel-and-integration.md`: goal/basis, prerequisites, steps, expected results, verification/completion and stop/adjust
information may be combined; record which valid step the current action belongs to, actual results and whether dependents may advance; small tasks may abbreviate.

| Phase ID (A/B/DOC/00; read-only assistance RO01–RO03) | Applicability and basis | Current facts and task goal | Required/conditional/optional artifacts | Phase/artifact/specialist role checks | Positive/negative quality/verification gates | Prerequisites and authorization | Current status/next step |
|---|---|---|---|---|---|---|---|
| `{a legal main phase}` | `required/conditional/N/A+reason` | `{actual}` | `{dynamic}` | `{real question set}` | `{D/A/I/H}` | `{trusted}` | `{pending}` |

- `A10/B10/DOC10` is inserted impact analysis, triggered only by substantive change; not forced to rerun after A09/B09/DOC09.
- Read-only Task: `{per-item evidence for the four completion conditions`, `whether manual acceptance of the report was explicitly agreed`,
  `separate conclusions for the report and the object's quality}`; ordinary reports without a Task fill no fictional identity, and saving does not automatically create a Task.
- Evolution enabled state and applicable active rules (`.task-lifecycle/active-rules/`): `Rule ID / Version / approvals / applicability / actual read/load evidence / consumers / reason not loaded`;
  not loaded when not enabled; a materials-only review is not application.
- Applicable WI DAG, four parallel states and unverified records (the task need not be split); sub-tasks may not write the root task's approval records.
- Plans/artifacts needing exact human approval list version and scope separately; validly approved plans are not requested again.

## C. 《任务交接说明》: the resumer's real reading path

- PoC admission for implementation:
  `{verify one by one the four independent originals requirements/Usage Contract/technical design/implementation plan, versions/Hash, applicable reviews and real approval sources`;
  `missing required items means read-only only, never automatically granting source/install/E4 permissions}`
- Bidirectional trace chain: `{Task/requirements→UC→technical→WI→actual code or doc consumers→tests→verification→acceptance`;
  `each node's identity and version, N/A reasons, broken links and reverse diff sources}`
- Workflow changes: `{type re-judgment/trimming/phase adjustment/dependency adjustment`, `before/after versions`, `reasons`, `cited versions`,
  `invalidated scope and re-planning/confirmation per mode}`
- Naming/preferences: `{this time or long-term, root directory/language naming/archiving/review/depth/applicable scope, real scope source and post-write re-read`;
  `replies/new process bodies and human-readable filenames follow the same valid shared-context language rule, keeping target-content local conventions and technical names}`
- Current coordinating writer and conflicts: `{real session/task identity and takeover basis`; `compare versions before writing`; `pause shared writes when coordination is not unique`;
  `no distributed lock guarantee}`
- Upgrade/reload/file relocation: `{actual package/old rule version, compatibility and necessary migration, original history kept, Artifact original/current path byte verification, reference sync`;
  `with originals missing, never rebuild approved content from summaries}`
- Final verifiable current user goal and approved originals: `{actual path/version/Hash/trusted source}`
- Current phase, current legal mode/depth and Task ID: `{real}`
- Current Git/head/dirty and latest writes/tests/unknown side effects: `{site}`
- Artifacts, valid/old confirmation events, pending human options and open Findings: `{exact}`
- Real read-only/executed D/A/I/H evidence and environment limits: `{never fake passes}`
- External process directory and permission verification: `{real path}`
- Upstream the next session must re-read and host capabilities to verify: `{list concretely}`
- Next safe action: `{legally executable/needs separate authorization; never revive Auto through hand-off records}`
