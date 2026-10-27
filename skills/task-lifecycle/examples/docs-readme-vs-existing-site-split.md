# Example: Docs-only fix of a wrong README (demo, not site verification evidence)

User (intent-triggered, plugin not named): "Fix the install instructions in the docs, **don't change business code, don't publish**."

- `00`: after a bounded rule bootstrap and printing the pre-check, verify read-only the README, the real project, package/version and whether a website/other audiences exist; a missing legal depth
  only pauses formal Tasks/plans, and ordinary analysis/report saving is not blocked by this gate.
- `DOC01`: the readers are first-time installers, aiming to complete a first start that is really supported now; not the maintainers' internal release process.
- `DOC02`: verify the real release package and CLI/install method. When the target runtime version cannot be seen, record `unverified` clearly, never assuming current support from the historical
  README.
- `DOC03–05`: after explicit doc write permission, form a minimal content plan and diff and change the README; internal task records go to a safe directory outside the repository. For an ordinary
  README-only task without a website, G-DOC-04 site rendering/navigation is `N/A+reason`.
- `DOC06`: check whether users can find the first step, whether examples match the actual package, and whether internal review content leaks; write conclusions only with a plan and real evidence.
- `DOC07`: with permission and an environment, actually run the first-install steps and keep evidence; without an environment `unverified`, never "user's first run succeeded".
- `DOC08`: because the user explicitly said "don't publish", record `N/A+reason`; no push/deploy.
- `DOC09`: deliver the README diff, source facts and unverified scope, awaiting applicable human acceptance. `DOC10` is inserted only when new facts change.

**Counterexamples**: quietly adding a CLI feature so a fictional CLI command in the README runs correctly; creating a website when there is none; claiming a real newcomer's run passed because the
docs build is green.

## Language boundary positive/negative examples (fictional, not executed)

**Sustained English context**: the user keeps discussing in English and explicitly enables this plugin, with no language preference set and no report language specified verbatim; replies, the
pre-check, confirmations and new process bodies/human-readable filenames continue in English. English code, tool output or quotes are not grounds for switching; existing Chinese history is not
retro-translated, and an explicitly valid local content convention covers only its scope. The counterexample is generating Chinese process documents because of a fixed plugin fallback without any
valid Chinese convention.

**Chinese explanation, English target maintained**: the user asks in Chinese to fix an existing English README, and the project's valid conventions and readers still use English. Explanations, task
descriptions and other new process material continue in this example's Chinese task context; only the approved README revisions are written per the original English convention, with code/commands
kept as technical literals. Counterexamples are translating the whole README into Chinese because the conversation is Chinese, or forcing all process records into English because the target is
English. If the user explicitly changes the target document language, first verify its exact scope and valid conventions; do not infer from this example.

**Local English and short answers**: the user explicitly says "write this release-note section in English", which applies only to that section; later replying `yes`, pasting English code or English
quotes does not automatically switch the whole task's language or write a long-term preference. The counterexample is permanently switching to English on a short answer, auto-bilingual output, or
translating old records.
 Still handle per the valid priority, scope and saving gate of [Preferences and file naming](../references/workspace-versioning-and-recovery.md#preferences-and-file-naming-req-023);
 this example is not an approval event for any real language preference.

**Affirmative short answer to an explicit language question**: the assistant only asks "Switch this task's later replies and process bodies to English?", and the user's next real reply is `yes`.
Here yes points to the single language decision, and later replies and new process bodies use English within this task's scope; it is not a context-free ordinary short answer, nor does it save a
permanent preference, retro-translate history or grant file write permission. The counterexample is asking for another choice merely because the reply is literally yes; if several pending items make
the referent unclear, disambiguate first. This is a fictional teaching example, not actual acceptance evidence.
