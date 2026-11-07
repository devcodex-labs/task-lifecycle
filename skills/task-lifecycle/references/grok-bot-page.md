# Grok Bot reading Page adapter

## Scope and delivery state

This file is the sole owner of Grok Bot Page must-create duty, lifecycle and formatting.
The duty table and item 5 decide which content must generate or update a Page.
**Formatting applicability** is separate and does not decide that duty.
Load this file only when the actual current host is Grok Bot and the session delivers directly to the user,
and either a must-create row applies or this session will generate or update a Page.
A CLI named grok, a quoted host name or a dispatch prompt does not establish this context.
Another bot, or this Skill merely being active, does not load this file.
Loading it is not global enforcement and does not make every reply a Page.
Formal Markdown and approval SHA rules remain in
[verification-and-evidence-routing.md](verification-and-evidence-routing.md) §10.5. A Page is a reading copy, never the approval object.
A generic Page is not a governed reading copy and does not gain a formal source by being formatted.

| Current context | Page duty |
|---|---|
| Direct user-facing Grok Bot; review report, plan/proposal, or contract draft awaiting approval | Create or update the reading Page, regardless of length |
| Dispatched session, including Grok CLI | Return material to the coordinator; no Page duty in that session |
| Non-Grok Bot host | Deliver Markdown; Page N/A |
| Ordinary artifacts, casual options, one decision card, CHANGELOG or config notes | No automatic Page |
| Contract already finalized in the repository | No new Page; handle any existing draft reading Page under item 4 |

The duty table is only the must-create list. It does not require a Page for any other reply.
"No automatic Page" still forbids an automatic Page for ordinary artifacts, casual options, one decision card, CHANGELOG or config notes.
An explicit user request for a Page is not automatic and is not a new must-create duty.
Generating or formatting a Page outside item 5 does not by itself create a managed Task or a formal artifact.

**Formatting applicability**: when this file is actually loaded, every Page this session generates or updates uses the formatting items,
including a Page outside item 5. Those items are 6–10 and 12–14, plus item 4a's language, contents order and conclusion order.
Item 11's openable-Page check applies to every such Page. Its source SHA clause, and item 4a's source line, stay under item 1.
Pages this session does not generate or update are unchanged.
Other hosts, dispatched sessions and any bot that did not load this file do not inherit this formatting.
Content-conditioned items still fire only for matching content. Flow diagrams and tabs are only for actual flow segments.
Comparison tables are only for comparisons. Do not invent a conclusion section when the content has none.
Updating an existing Page reuses that Page ID/URL. Do not create a duplicate merely because the content is outside item 5.

If the Page tool or canvas skill is unavailable and item 1 applies, deliver the openable Markdown and record source-delivery=complete and Page-delivery=pending with the actual missing capability.
If item 1 does not apply, do not invent Markdown or a source SHA; record Page-delivery=pending with the actual missing capability.
Do not invent a Page URL, claim a Page was generated, or dispatch its generation to a CLI. Resume only the Page step when the capability is available.
A failed tool call stays failed/pending with its evidence. It does not erase completed Markdown work. Never call the full Page delivery complete until an openable real Page is verified.

## Effective layout and lifecycle rules

The item numbers below retain stable references from earlier rules. Only this consolidated text is effective; superseded source-line, width and floating-contents layouts are historical.

- Item 1 **Formal source**: applies only to a governed artifact that already has formal Markdown, including item 5 artifacts and any other artifact that already has that source.
  The Markdown path and SHA identify content and approval. On disagreement the Markdown prevails. Never invent missing source content in the reading copy.
  A generic Page with no formal Markdown gets no invented path, sha256, line count, or approval SHA.
  A temporary note, chat reply or non-governed Markdown file is not a formal source.
- Item 2 **Session ownership**: the direct user-facing Grok Bot session produces the Page. A dispatched session has no Page duty and its output is not Page-generation evidence.
- Item 3 **Host-neutral delivery**: other hosts deliver the formal Markdown under the core delivery rule. No missing-Page failure is inferred for those hosts.
- Item 4 **Stable document identity and Page reuse**: when item 1 applies, bind one logical Document ID to one current Page ID/URL, independently of changing Markdown filenames and versions.
  When item 1 applies, keep the mapping in the task record: Document ID, current source path/SHA/line count, Page ID/URL, current title/status, prior versions and last successful synchronization.
  With no formal Markdown, do not invent a Document ID, path, sha256, line count or approval SHA; keep any existing Page ID/URL and title, and record source identity as not applicable.
  For a revision of the same governed document, update that same Page, its title/status and, when item 1 applies, its source SHA.
  A new filename or version alone does not create a new Page.
  If the mapping is missing and item 1 applies, first locate the existing Page using current task evidence;
  if ambiguous, deliver Markdown and mark Page synchronization pending rather than creating a duplicate.
  If item 1 does not apply and the existing Page is ambiguous, mark synchronization pending, invent no Markdown, and do not create a duplicate.
  When a chapter is moved for reading, the move is made in the .md itself: chapters are renumbered in sequence and cross-references in the .md are updated;
  the Page follows the .md order and numbering, never shows an out-of-sequence chapter number. Approved bytes remain immutable under the core controlled-revision rules.
  When a pending contract is finalized, create no new Page. An existing draft Page may update its title/status and link to the finalized Markdown; any retained draft body is clearly historical,
  never presented as the finalized contract. This does not require rendering the final contract as a Page.
  For legacy separate Pages, mark an obsolete Page superseded and link the current source; do not mark the reused current Page obsolete merely because its prior source version was superseded.
  Report-type Pages are never deleted unless the user names the Page; deleting a Page (which removes it for everyone it was shared with) counts as an irreversible action needing
    their explicit confirmation.
- Item 4a **Page language, source line placement and conclusion order**:
  A Page whose content is Chinese, Japanese or Korean sets the Page `lang` prop (`zh-Hans`, `zh-Hant`, `ja` or `ko`) as declared by the actual canvas kit;
  the deprecated Page `sources` prop is not used, because it renders nothing.
  The source line (source .md path, sha256 and line count) is the first line inside the collapsed document-header section, not the Page's top line.
  Write that source line only when item 1 applies. A generic Page with no formal Markdown omits it.
  Effective order: inline top table of contents, then body; metadata lives in the document-header section.
  In the conclusion section, Metrics come first, then the Callouts; a Callout lead states the conclusion directly and never repeats the section heading.
  Metrics, leads and Callouts use only facts already in the content.
- Item 5 **Must-create scope**: review reports, technical/implementation/fix/review plans and proposals handed to the user, and contract drafts awaiting approval. Length never changes this scope.
  Item 5 does not limit **Formatting applicability**, and it does not require every reply to become a Page.
- Item 6 **Optional HTML**: follow the core explicit-request-only HTML rule; needing a Page does not imply requesting HTML.
- Item 7 **Inline contents**: always place an inline TableOfContents at the top of the body, whatever the length; never a floating, sticky or side contents.
  Use actual section anchors. Do not add an “↑ Contents” link to each heading or hand-write observers, fixed positioning or pixel calculations. Host-owned surrounding navigation
    needs no custom imitation.
- Item 8 **Width**: for every Page generated or updated while this file is loaded, including a Page outside item 5,
  set width to "wide" or "full", never "column"; on desktop the body must not be narrower than 1024px when the available viewport permits it.
  A session that did not load this file does not inherit this width rule.
  Phones remain a single column; narrow viewports use available width. Tables and flowcharts use body width. Use kit sizing options, not custom pixel calculations.
  Public pages.grok.bot links with the platform 960px cap are exempt from the 1024px floor. The cap is a platform limit, not a selected narrow layout.
- Item 9 **Public-link limitations**: prior measurements found a content-height iframe scrolled by the outer page; fixed/sticky/IntersectionObserver following did not work.
  Use only inline top contents and no custom floating elements. Verify the actual current rendering; historical measurements do not prove current-host compatibility.
- Item 10 **Pages generated by content (Grok Bot host only)**: Pages do not use a fixed template; choose the presentation best for human reading by content. Details (each with a reason):
  - 10a When the content already has conclusions or pending items, the body's first section is those items (after the top contents), and long details are collapsed by default.
    Do not invent that section when the content has none. Reason: first answer "what do you need me to do", details expand on demand.
  - 10b The top contents are always kept (item 7); no "↑ Contents" in each section; contents do not grow or shrink with length or section count.
    Host-owned surrounding navigation retains its defaults; the Page itself adds only inline contents. Reason: contents always usable; no custom floating forms.
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
    especially 10a–10f and item 12). Item 1 and other source or approval metadata apply only when a formal Markdown source already exists.
    Formatting items follow **Formatting applicability**. (2) Within what the rules allow, choose the layout best for human reading given the actual content;
    when item 1 applies, that content is the .md. Only where the rules are silent consult the canvas skill's defaults; on conflict the rules win.
    (3) The plan states per chapter which block is used and which rule it rests on, in a few lines in the delivery note, listing each place where
    the Page structure differs from the .md when a formal .md exists. With no formal .md, list no invented source diff.
    This adds no new confirmation stop point; the plan may not override existing constraints (no omitted content, no invented
    names). Reason: layout decided while writing let rule conflicts surface only at generation time.
  - Criterion: if the same content contains process/comparison/pending items, the Page shows them as 10c/10d/10a respectively (labels per 10f); do not force them in when there is no such content.
- Item 11 **Delivery self-check**: verify the actual Page write/update result and openable Page URL before claiming Page delivery complete.
  Verify the current source SHA only when item 1 applies; never invent one.
  The user-visible reply links the real Page and, when item 1 applies, the formal source.
  Apply the context table and missing-tool fallback above; a source-only delivery is explicitly distinguished from
    a complete Page delivery.
- Item 12 **Flow-type Page layout (Grok Bot host only)**: given a Page is generated or updated under **Formatting applicability**,
  use this layout if readers want to "walk the gates and look up the next hop and basis";
  if readers want to "see conclusions, find issues, approve a draft", do not.
  This item governs layout and does not change the duty table or item 5 "whether to make a Page" (layered with the applicability rules above). It applies only to actual flow segments.
  Item 4's source line and reuse (source line, sha256, same-page updates) still apply when item 1 applies.
  With no formal Markdown, invent neither a source line nor a sha256.
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
    a conclusion section when the source has none.
    10b contents and item 7, 10d comparison tables and 10e letter spacing still apply; phase tabs may not replace the top contents.
- Item 13 **No extra approval stop**: choosing a conforming layout adds no confirmation gate. Existing content, sharing, tool and destructive-action authorization still applies.
- Item 14 **Pages generated by Grok Bot itself**: Pages and real Page-generation cases are generated and delivered by the Grok Bot host itself with the Page tool (WriteCanvas),
  never dispatched to third-party CLI sessions such as grok or Codex to generate on its behalf;
  third-party session output is not a Page, nor real Page-generation evidence. Real Page cases under `formal-review-and-findings.md` §7.10 item 7 follow this item.
  Before generating, load the canvas skill by name with the Skill tool (it is not a disk file) and follow its component rules: blocks are written directly inside Page or Section, and kit
  blocks are not wrapped in custom components rendered as tags; if it cannot be loaded, say so in the delivery note. Reason: the canvas skill was not read before generation.
