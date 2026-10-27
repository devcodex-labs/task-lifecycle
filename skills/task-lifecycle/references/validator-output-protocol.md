# validator-output-protocol (`scripts/validate-config.mjs` stdout)

This file ships with the plugin for the per-field check in item 3 of "Delegation config: JSON and validator (consumption protocol)"; its original basis is the FEAT-20261024-001 usage contract (A02
v13) §4.1. This round syncs current behavior per the approved V1.2; the external A02 original was not obtained, so it is not claimed synced or countersigned.

## Output fields (stdout is the sole authority; object keys in lexicographic order; no timestamps; byte-identical for the same input)

| Field | Type | When present | Notes |
|---|---|---|---|
| `status` | `"valid"`/`"disabled"` | Always | |
| `schemaVersion` | `1` | Always | Output format version |
| `validator` | `{name, version}` | Always | `task-lifecycle-validate-config` / `"1"` |
| `env` | `{accountHome, home}` | Always | `accountHome` is the system account lookup result, `null` on failure; `home` is the actual `HOME` string, `""` when unset, never a guessed value. Only on Windows with HOME unset and a trusted account lookup may it continue; explicit empty/conflict and POSIX unset are still off |
| `reasons` | array of `{code, detail, layer, path, stage}` | Always; `[]` when valid | `code` is a §3.2 code; `stage` ∈ `env`/`locate`/`parse`/`version`/`structure`/`merge`; `layer` ∈ `global`/`project`/`env`; `detail` string (may be `""`); `path` string (`""` if none) |
| `layers.global` / `layers.project` | `{exists, path, readable, realpath, sha256}` | `global` always; `project` present when any project parameter is given | `exists`/`readable`: boolean or `null` (not checked: env stage failed, or project parameters incomplete/identity unverified); `path`: string or `null`: global is `null` on `home-unverifiable`; on `home-mismatch` global is the expected path computed from the **account home** (not `HOME`); project is `null` when project parameters are incomplete; `realpath`, `sha256` (64 lowercase hex): `null` when absent/unreadable/not checked |
| `approvalSources` | array of `{layer, messageId, quote, record}` | Always | Filled for each existing layer (global, then project) only when `status=valid`; **always `[]`** when disabled |
| `effective` | object or `null` | Always; `null` when disabled | |
| `effective.delegation` | `{categories, enabled, executors}` | When valid | categories has all four keys, each `{sourceLayer, value}`; `enabled` is `{sourceLayer, value}`; v11 (K4): `executors.<id>` = `{command, model, reasoningEffort}`, the latter two output `null` when omitted (host default) |
| `effective.review` | `{enabled, fallback, hosts}` | When valid (v11, K4) | `enabled` is `{sourceLayer, value}`; `fallback` three keys with fixed values; `hosts` is an array of `{command, id, model, reasoningEffort}` in config order (`model`/`reasoningEffort` `null` when omitted), `[]` when effective enabled=false; when both global and project omit `review` the output is `{enabled:{sourceLayer:"default",value:false}, fallback:<three fixed values>, hosts:[]}` [Rocky 13:22 decided D4 (as recommended)] |
| `effective.workflowDepth.executionDefault` | `{sourceLayer, value}` | When valid | Without a default `value: null`, `sourceLayer` is `default` or `project` when removed by execution |
| `legacy` | array of `{detail, file, kind, layer, line, suggestedJson}` | Always, may be `[]` | `file` absolute path; `kind` ∈ `delegation-section`/`depth-execution-default`/`legacy-check-skipped`; `detail` string (non-empty only when skipped, otherwise `""`); `layer` ∈ `global` (工作区约定) / `project`; `line` positive integer (from 1; 0 when skipped); `suggestedJson`: an object when kind is `delegation-section`/`depth-execution-default` (the layer's equivalent JSON fragment, fields that cannot be inferred left `null`), `null` when kind is `legacy-check-skipped`; sorted `layer` → `file` → `line` → `kind` |

- `sourceLayer` ∈ `global`/`project`/`default`.
- `effective.delegation.enabled.value` and `effective.review.enabled.value` are both boolean; enabled given directly as a boolean, a missing value, or a value of a wrong type such as string is
  rejected as `validator-failed`, never guessed from object truthiness or strings.
- Consumers first check the required fields and types above; any mismatch is `validator-failed`.

Any field missing or of the wrong type (e.g. `effective.review.enabled` written as a boolean instead of `{sourceLayer, value}`) → `validator-failed`, all off.

When consuming enabled compare `effective.review.enabled.value === true` and `effective.delegation.enabled.value === true` separately; never take the truthiness of the enabled object. Keep each
`sourceLayer`; enabling review does not enable coding delegation, and turning one use off does not cancel other valid settings.

## Reason codes (legal domain of `reasons[].code`, i.e. usage contract §3.2 "codes output by the script")

- `invalid-argument`, `home-unverifiable`, `config-location-forbidden`, `config-missing`, `project-identity-unverified`
- `config-unreadable`, `config-parse-error`, `duplicate-key`, `schema-version-unknown`, `missing-field`
- `invalid-type`, `invalid-value`, `unknown-field`, `forbidden-mapping`, `approval-source-missing`
- `project-layer-widening`; hint-type `legacy-markdown-ignored` (does not affect status)

## `fallback` fixed values (`effective.review.fallback`, three keys verbatim)

- `noIndependentSession`: `"blocked-needs-evidence"`
- `oneExternal`: `"host-fresh-session-else-isolated-sessions-of-external"`
- `zeroExternal`: `"isolated-host-sessions"`

"§3.2 codes" and "three fixed values" in the table above refer to the two sections above in this file; any value outside the legal domain → `validator-failed`.
