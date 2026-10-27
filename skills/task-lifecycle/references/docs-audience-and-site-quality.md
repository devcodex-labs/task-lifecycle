# docs-audience-and-site-quality

> This file is a Task Lifecycle V1 **execution rule**, not a new requirement approval, actual run record or extra API. Its root basis is the user-approved development requirement V0.18-R2, Usage
> Contract V0.5-R2 and technical design R9-R2. It may not override higher-priority real user decisions or host security permissions.

## Read conditions and responsibility

**Trigger**: when a Docs task has actual user pages or an existing site, or a Feature/Bugfix delivery involves README/API docs/public usage behavior.

**Sole primary responsibility**: G-DOC-01–05 and real user tasks, consistency with source/release, isolation of public and internal docs

**Direct consumers**: DOC03/DOC06/DOC07/DOC09, public contracts of Feature delivery, HTTP examples.

**Linked References**: `docs-flow.md`, `verification-and-evidence-routing.md`, `http-assisted-verification.md`.

## Execute item by item when applicable

1. Identify real readers such as users, integrators, maintainers and internal operations plus the public/internal boundary, confirming goals and testable tasks for each; a public API Reference may
   be technically detailed but must not drown the Quick Start in internal process logs.
2. Check item by item formal contract → real current source/package/API/CLI → doc pages/examples → actual released version; any new default, error code/field needs a real basis; never infer
   available interfaces from docs.
3. For an existing site when the task triggers it, pick verification methods and raw evidence item by item per G-DOC-01 facts, 02 information architecture, 03
   first-success/API-lookup/troubleshooting tasks, 04 real build/pages/navigation/links, 05 applicable specialties (version/language/keyboard/SEO etc.).
4. DOC07 does applicable verification of real-environment execution and user experience along reader paths; a static build only proves the command ran, not that real users can reach their goal. When
   a real browser/relevant host is unavailable keep unverified and block per the necessary quality gates.
5. With only a README and no site requirement, site checks are `N/A+reason`; do not create a site/change frameworks to satisfy a template. Internal approval logs, customer secrets and test
   credentials may not enter public pages.
6. When public product behavior would change, stop the out-of-bounds Docs action and form a suggestion or a legal Feature/Bugfix task, approved by the real user.

## Counterexamples that must be rejected

- Claiming first success from navigation titles alone; pages build but real users cannot click through; creating a doc site without approval; a public Quick Start copying internal Task risk
  records/credentials; Docs modifying implementations of nonexistent SDK APIs.

## Specific constraints of the approved technical baseline (re-read as needed)

Below are excerpts of the approved technical design's **normative design constraints**; old version labels in headings do not mean the current project has passed real tests. Consume them per the
current real task, authorization and trigger conditions; if they disagree with this file's summary, the approved technical baseline prevails, without automatically expanding scope.

### 12.1 Docs document types and source–consumer consistency

Docs inputs are distinguished by audience and purpose: user getting-started/tutorials, public API/SDK/CLI Reference, contributor maintainers, internal interfaces, operations and release, managed
internal process. Public pages may only promise **features that are really approved and actually consumable**, traceable back to the current real source/package exports/CLI or approved external
contracts. Project-internal architecture, build and review logs may not be stuffed into the Quick Start just because they are technical material; but public SDK users need technical parameters and
return types, which may not be deleted wholesale.

The design verifies from the canonical interface source: `currently confirmed public contract → real API/exports/CLI/consumers → actual user pages/examples → actual released version`. Doc-only work
may never modify business code on its own to explain a nonexistent API; when a Bug fix/new capability is needed, propose a separate A/B change. Historically copied pages, generated copies and other
language versions must identify the actual source and final consumption, not just check a single md file.

---

### 12.2 Docs Site Quality Gate (when a site exists and applies)

| Gate | Currently necessary verification | Real failure and handling |
|---|---|---|
| G-DOC-01 Facts | APIs/defaults/errors/examples claimed by public docs checked against real consumers and confirmed contracts | Docs invent interfaces, misuse old versions → back to DOC05/DOC06, upstream change if needed |
| G-DOC-02 Audience/information architecture | First-time/integrator/maintainer reader goals and real navigation, search discoverability (if present) | Quick Start drowned by internal process → content structure revision |
| G-DOC-03 Reader tasks | DOC03 freezes applicable representative "first success/API lookup/troubleshooting" steps and success conditions; DOC07 really executes/visits | Only titles exist but the task cannot be completed → failed, never written passed |
| G-DOC-04 Real site | Actual docs build, page rendering, links/anchors/routes, applicable mobile/keyboard interaction | Build succeeds only, browser cannot open → required I verification incomplete |
| G-DOC-05 Specialty conditions | Version, language, SEO, search, performance, full accessibility etc. triggered by real goals/risk | `unverified` when browser/tools are missing, blocking decided by frozen pass criteria |

When no site exists and the current task only fixes the README, site checks are `N/A + reason`; never install a site generator on your own in the name of quality. When using existing legal tools
such as Playwright/Lighthouse/link checkers, check whether the project already has the dependency and permission; tool names are **optional verification means**, not new dependencies every project
must adopt or a set of fictional mandatory plugins. Real-user comprehensibility of a high-risk public site cannot be independently proven by model simulation.
