# skill-discovery-matching-and-degradation

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when the current professional claim in an approved task cannot find sufficient capability, or the user explicitly names/asks about a specialist Skill.

**Sole primary responsibility**: primary/auxiliary selection of really available Skills, hard admission of trusted sources, failure degradation and legal user-visible handling of Gaps

**Direct consumers**: on-demand phase roles/specialist reviews, failure degradation, general Gap registration.

**Linked References**: `roles-and-specialist-review.md`, `rule-evolution.md`.

## Execute item by item when applicable

1. First look at Skills **installed/available** in the current real host, existing project conventions, tools and evidence-based review capability; reuse them if they meet the necessary standard,
   without repeatedly going online because names differ.
2. When insufficient, search **trusted official directories** within legal network permission and the host's existing capability; record discovery source, publisher, version and evidence of real
   install/load support. A directory provided officially ≠ entries developed officially; discovered ≠ installed ≠ loaded.
3. Candidates first pass hard thresholds: project/host compatibility, actually necessary role/claim, trusted source, extra permissions and security, conflicts and license/restrictions. Then pick the
   minimal primary Skill by project language/task cost and necessary verification quality, adding non-conflicting auxiliaries when needed.
4. Without a specialist Skill but with an equivalent check method, state the degradation honestly; if it is necessary for key quality but capability/permission is missing, block only the affected
   node and propose precise evidence/review/install proposals; never fake a pass.
5. Record Gaps by real `whatFailed / whyMissed / candidateVersions / checkedSources / affectedGate / fallback`; a one-off task situation is not automatically promoted to a general Skill.
   **Gap attribution gate (REQ-019/031/033)**: distinguish case by case `invocation-gap` (an existing Skill/rule was not correctly discovered, triggered or loaded), `rule-gap` (evidence proves an
   executable general check rule is actually missing), `specialist-skill-gap` (an independent specialist Skill truly needed but unavailable in the current host) and `tool-or-environment-gap`
   (missing tools,
   permissions, network, environment or observable execution evidence);
   - with insufficient evidence mark `classification-unverified` rather than forcing `rule-gap`. First verify installed Skills, actual calls and current rules, permissions and substitute verifiers;
     the first two kinds cannot be replaced by installing new plugins instead of fixing root causes, and the last two do not automatically become general conventions.
   - only a real `rule-gap` passing the generality eligibility check may propose an evolution candidate; others are handled as invocation fixes, maintenance suggestions or evidence/local blocks.

6. If a new Skill/upgrade/install later turns out truly necessary, only propose an independent maintenance suggestion pending actual user and host authorization; never write automatically into
   DevCodex or the plugin directory.
   When the user has explicitly asked for that maintenance and the host allows it, reuse the existing scope without asking for tool permission again because of this section; a professional
   suggestion itself cannot expand the current task or replace the real request for install/release.

## Counterexamples that must be rejected

- Finding a Skill in an official directory and stating it is installed and usable; automatically downloading/running third-party Skills without user consent; running unfamiliar commands under the
  guise of "security review"; still marking passed when required specialist verification cannot be done; a one-off gap automatically becoming an active rule.

## Minimal information of an independent Skill maintenance suggestion (REQ-041)

When there truly is a specialist capability gap, the independent maintenance suggestion fills in the minimal suggestion information of `artifact-content-and-self-review-contract.md`: why current
real evidence and existing capability are insufficient, needed checks/tools and expected benefit, applicable and non-applicable situations, alternatives of reusable rules or existing Skills,
introduction/execution/long-term maintenance cost and risk, consequences of not adopting, affected gates and precise pending items.
- Without reliable cost/compatibility evidence mark unknown.
- A suggestion may coexist with legal substitute review, but writing a proposal does not create/install a Skill, modify DevCodex or claim the gap solved; maintenance implementation remains an
  independently authorized task.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 8.1 Roles, Skills and executors are three different concepts

The sole Owner of this section's body is [roles-and-specialist-review §8.1](roles-and-specialist-review.md#81-roles-skills-and-executors-are-three-different-concepts); re-read its **full body**
before execution, never filling in or loosening from this section's heading.

---

### 8.2 On-demand discovery and competitive selection of similar Skills

```text
Necessary roles/quality claims of the current phase and real project facts
  -> check currently installed Skills / project conventions / References / tools
  -> if the necessary capability suffices: use it directly, no going online for a same-named Skill
  -> insufficient: per host and network permission, discover candidates on demand in trusted official directories
  -> hard admission filter: actually available in the host, trusted source, required permissions allowed, version fit, meets necessary checks
  -> remaining candidates: choose the primary Skill by current tech stack/user goal/task cost/verification quality
  -> if complementing is needed: add non-conflicting auxiliary Skills on demand, stating each one's duty
  -> capability/evidence still insufficient: legal degradation + local block + Gap record
```

Entries in an official directory may be published by third parties; **directory ownership does not mean official development or automatic trust**. Skills the user has currently named should be
preferred after meeting hard safety and quality thresholds; incompatible or overreaching ones may not be forced. When candidate rules conflict, confirmed requirements/usage contracts/built-in core
conventions prevail; the rest needs fact-checking, and product trade-offs go to the real user.

**Recommended concise selection record**: current task/phase and capability claim, candidate names and versions, actual install/load evidence, admission failure reasons, chosen primary Skill,
auxiliary Skills, exclusions and conflicts, extra tool permissions, actually used/unused and quality results. This record may be merged into the current review plan, with no new dedicated scheduling
data table.

---

### 8.3 When there is no Skill or a skill fails

| Situation | Legal degradation |
|---|---|
| No same-named Skill, but reliable existing conventions and executable verifiers | Run the dynamic review directly; record the actual method, register no false gap |
| Official directory unreachable | `discovery-unverified` rather than "officially nonexistent"; fall back to existing tools/rules |
| Existing Skill not triggered/failed to load | Record the real capability-usage defect; fix the trigger or load facts first, do not create a new Skill immediately |
| Specialist Skill missing but not affecting required quality conclusions | Use reliable substitute review and state limits; capability improvement may be registered on evidence |
| Required specialist capability/tools/permissions all insufficient | Block only the affected quality gates, precisely requesting the needed materials, authorization or expert review |
| A Skill requires install, running code or network | Execute only after explicit user/host permission; discovery is not install authorization |

---

### 8.4 Gap records and long-term handling

Preferably written in the current 《审查报告》 or 《任务交接说明》, with fields at least
`Gap ID`/`target specialist capability`/`candidate checks`/`concrete failure evidence`/`current review degradation`/`impact and block`/`recommended remedy path`/`status`. When reuse value is
confirmed across tasks, an external workspace 《能力缺口索引.md》 may be created on demand; **it is not `.task-lifecycle/active-rules/INDEX.md` and is never loaded as active rules**.

Handling triage: one-off project differences stay in the current task; insufficient existing general References may get revision proposals; existing Skill usage/trigger failures are fixed first;
when a new specialist Skill/tool is truly needed form a maintenance suggestion, separately launched by the user or maintainer, then developed/installed/verified per authorization. Never
automatically create native Skills, plugins or push to DevCodex from the current review's Gap.
