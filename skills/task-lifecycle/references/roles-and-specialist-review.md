# roles-and-specialist-review

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when an artifact has professional completeness/implementation quality risk, dynamic review check items must be set, or a specialist Skill candidate is found.

**Sole primary responsibility**: dynamically choose phase, artifact and formal review three-level role perspectives and evidence by the actual task and materials, without manufacturing a headcount
of independent Agents

**Direct consumers**: all phases/formal artifacts/dynamic formal review plans, primary/auxiliary selection of applicable Skills.

**Linked References**: `formal-review-and-findings.md` is the authority for review coverage sign-off; `skill-discovery-matching-and-degradation.md` decides available capability.

## Execute item by item when applicable

1. For the current phase state the actual primary responsible perspective and the reverse-risk perspective; at artifact level also state the final real readers/implementation/maintenance consumers;
   at the formal specialist review level choose expert check content and evidence by frozen task facts.
2. Output `role/viewpoint → source clause → check question → expected positive and negative → method/evidence → actual observed status`; a role name itself is not a check result.
3. One model may take several perspectives for a **same-context reverse review**, and must honestly mark it as not a real independent Reviewer; write independent only when a real independent Agent
   is supported by the host, authorized, and has re-readable independent records.
4. Redundant perspectives of the same task type may be merged, but triggered checks such as permissions, tests, compatibility, API fields and user acceptance may never be omitted for brevity.
5. When a specialist Skill is needed first verify current availability and trustworthiness, then choose/degrade per `skill-discovery-matching-and-degradation`; never force-install extra Skills for a
   role name.
6. Verify that conclusions have a reviewable version, real consumers, negative cases and unproven scope; conflicting review opinions are judged by facts and frozen criteria; public product decisions
   may not be settled by a simulated multi-role vote.

## Counterexamples that must be rejected

- Generating a list of "senior tester/security expert" names and judging the specialist review complete; a reverse check by the same model claimed as three independent judges; treating third-party
  entries of an official marketplace as officially certified; approving a public behavior change from an architect perspective before the user has approved it.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 7.3 Three-level role quality contract: phase, artifact, specialist review

| Level | Who chooses | Output and minimal verifiable content |
|---|---|---|
| Phase roles | The main task at 00 and at each phase entry, dynamically by current goal/risk | Primary responsible perspective, necessary reverse perspectives, each one's check duty, failure conditions and exit evidence |
| Artifact consumers | The author, by valid requirements and real use | Primary readers, implementers/maintainers, users' final tasks, Required/Conditional and omission risks |
| Specialist review roles | Dynamically set by a legally approved review plan | `role → check item → actual basis → method → executed/not executed → finding/conclusion`, each traceable |

For example, a technical design usually needs an architect perspective to check design choices, the actual implementer to check implementability, and a tester to check acceptance/counterexamples; a
Docs site may also need first-time user, existing API user and maintainer perspectives. Role perspectives are only professional question sets, **not real staffing, not separate Agent evidence, and
add no product decision authority**. Similar roles in small tasks may merge but must cover the core questions; unrelated roles are `N/A + reason`.

---

### 8.1 Roles, Skills and executors are three different concepts

- **Role**: describes from which kind of consumer or professional responsibility perspective check questions are raised.
- **Skill**: provides possible professional rules/tool usage methods; it is an available capability only when it can really be read and used.
- **Executor**: the current model, a real authorized sub-Agent/Reviewer, an actual tool or a real person; a simulated role does not equal real independent execution or professional qualification.

Proposing an "architect/security engineer" role does not automatically install or create a same-named Skill, and finding a Skill does not skip this plugin's approval, evidence and tool permissions.
