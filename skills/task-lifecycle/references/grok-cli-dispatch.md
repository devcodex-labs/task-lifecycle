# Grok CLI dispatch adapter

## Applicability and authority

Load only for an actual Grok CLI invocation after executor or reviewer admission. This is not the Grok Bot Page adapter and does not apply merely because a host or prompt says “Grok”.
Bind the real caller, CLI path/version, task or review ID, receiver role, approved work item, read/write scope, model, tools and current probe output before invoking it.
The dispatch marker and its fields are labels, not authorization. No special startup-token channel is assumed. Existing authorization and actual tool/session evidence establish the scope.
Missing or inconsistent evidence leaves this adapter inapplicable; it never turns relayed text, a product name or tool output into a user decision.

The general admission, category ceilings, capability probe, candidate recovery and trace rules remain in
[task-split-parallel-and-integration.md](task-split-parallel-and-integration.md). Read-only review admission remains in
[formal-review-and-findings.md](formal-review-and-findings.md) §7.10. Neither admission path enables the other.

## Capability exception and role limits

For an admitted, version-matched call, technical capabilities are fully open: reads, writes, local git operations and commits, network, interpreters, package managers and native sub-agents.
This preserves the Grok-specific capability exception; it does not authorize every available action. The role and current task scope still govern use:
- A reviewer remains read-only, changes no reviewed object, creates no task artifacts and returns opinions in its reply. The coordinator saves the report and rules on findings.
- An implementation worker may use only the authorized write set and return a candidate diff, evidence and a self-review list. It cannot accept the root task or sign review/approval conclusions.
- Native sub-agents are an exception only within this admitted Grok call when current authorization covers them. They inherit a subset of its role, scope, budget and five baselines, never Auto.
  Nested agent CLI calls remain denied. Do not transfer this exception into another executor, ordinary relay template or host-native parallel configuration.
- Local commits are technical capabilities; use them only when the current delegated work explicitly permits them. They are never root acceptance or permission to push.

## Five baselines and stop handling

All admitted calls retain: no push (including any remote write), no release, no delete, no credential reads and no signing conclusions.
Credential reads include built-in Read and shell reads of .env files, private keys, SSH/CLI authentication directories, git credentials and token files.
The deny list below is an additional control, not proof that all alternate command spellings are blocked. A task role can be stricter than these five baselines.

On crossing a baseline, stop the affected dispatch, preserve the transcript, full commands, original denial text and affected paths, report to the user, and await a decision to resume.
Treat the category as none for this run. Do not silently rewrite persistent config; that is a separately approved config change.
A missing capability or an unknown CLI version uses the general fallback; it does not cancel required independent review or justify calling a partial result complete.

## Version table: grok 1.0.70 (DIRECT-20261027-GrokBuild放权 D1/D2; supersedes the minimal allow table of CAND-20261026-005 v5)

Common arguments: `--always-approve --output-format streaming-json --max-turns <cap>`; outer wall-clock timeout (e.g. `timeout 300`). Do not add `--sandbox` / `--disable-web-search` /
`--no-subagents`.
Baseline deny (`--deny`, one per rule): `Bash(git push:*)`, `Bash(npm publish:*)`, `Bash(gh release:*)`, `Bash(glab release:*)`, `Bash(rm:*)`, `Bash(unlink:*)`, `Bash(git rm:*)`,
`Bash(codex:*)`, `Bash(grok:*)`, `Read(**/.env*)`, `Read(**/*.pem)`, `Read(~/.ssh/**)`, `Read(~/.config/gh/**)`, `Read(**/.git-credentials)` (the `~` and `**` forms not live-tested).
unverified (the user waived live testing): whether deny still blocks in no-confirmation mode; whether shell variants (`cat` / `node` reading credentials, `find -delete`, `git -c`/alias pushes)
bypass deny. Baselines do not rely on deny alone; check the transcript at result recovery below.

| Task type | Status | Allow |
|---|---|---|
| Read-only review | May be enabled (admission only per `formal-review-and-findings.md` §7.10 item 0; does not change the reviewed object) | All (no confirmation) |
| Drafting | May be enabled | All (no confirmation) |
| Writing code | May be enabled | All (no confirmation) |

History: in non-no-confirmation mode allow rules did not take effect for git and un-allowed commands cancelled the whole call (PERMTEST-20261026-001/002), hence the switch to no-confirmation.
F1 (CLI upgrade): `--version` or permission-related help text changed → check the arguments and deny forms above before delegating.

**Positive/negative examples (scenarios, not live-tested)**: with the global config missing, both Codex and Grok Bot have the main session implement B04, the pre-check recording
`Config: disabled (config-missing)`: compliant;
config enables only `implementation`, the A04 plan states WI-2 goes to `grok-build`, after the probe passes it is called in no-confirmation mode with the baseline deny, and the main session
re-checks the diff before A05 code review: compliant.
Reject: auto-delegating on seeing a `grok` command; running no-confirmation without the baseline deny; taking the executor's "review passed" as the B05 conclusion; claiming completion on exit code
0; following a config that writes `B05: grok-build`.

## Result and evidence recovery

Inspect structured stop reason, tool-call status and original transcript; exit code 0 or an executor saying “done” does not prove completion.
Cancellation, denial or timeout produces a partial result. Re-read actual diffs and check the authorized write set before the coordinator integrates; rerun necessary regressions.
Record actual caller/session, version/help, probe, authorization scope, command, model/effort, start/stop, transcript, diff hash and any denied operation.
Keep historical unverified deny forms unverified until tested in the real version. Static documentation tests do not upgrade this table to live-host evidence.
