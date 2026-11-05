# Configuration compatibility and migration

Input configuration and validator output are separate protocols. Validator revision `2` reads input `schemaVersion: 1` and `2`; its stdout remains output `schemaVersion: 1`. No config
  is rewritten by the validator.

| Input version | `approvalSource.messageId` | Other approval requirements |
|---|---|---|
| 1 | Original grammar: `t` + digits + `u`, or `t` + digits + `s` + digits | Unchanged |
| 2 (recommended for new configs) | The host's opaque original ID, 1–256 Unicode code points, at least one non-whitespace character, no C0 controls or DEL | Unchanged |

Keep IDs exactly as supplied by the host. Do not manufacture a v1-style ID to represent another host's message. A host without a retrievable message ID cannot supply this config
  approval mechanism; use the current task's explicit authorization within its scope instead of inventing persistent approval evidence.

Both versions require the exact approval quote (1–500 Unicode code points), an existing absolute Markdown record path outside Git, the layer's byte hash, and consumer verification of
  the actual user approval event and scope. Structural validation alone never proves approval. Global and project layers may use different supported versions; the project still only
  narrows the global settings.

## Migration procedure

The full source package includes the schema and examples under `assets/`; they are reference material, not runtime dependencies. A Skill-only install can start from this inactive v2 shape:

```json
{
  "schemaVersion": 2,
  "approvalSource": {
    "messageId": "example-host-message-1",
    "quote": "Example only; replace with the exact user approval words.",
    "record": "/absolute/path/to/approval.md"
  },
  "delegation": { "enabled": false }
}
```

Use an actual absolute record path for the current OS, such as `C:/records/approval.md` on Windows. This example is not approval and is never installed automatically.

1. Confirm that the installed validator revision is `2` and the consumer understands the current output protocol. An older validator rejects v2 with `schema-version-unknown` at the
  version stage; it does not downgrade or partially enable it.
2. Keep existing v1 configs unchanged unless migration is needed. For a new v2 config, use `assets/config.example.json`; `assets/config.v1.example.json` documents the compatible v1
  shape. Both are inactive examples with capabilities disabled.
3. Prepare the intended bytes at the approved config location, retaining all settings and the original approval provenance. A version or ID change changes the hash: bind a current
  approval to the new bytes through the config-write procedure before consuming them.
4. Validate both layers and verify their approval records. Test the effective narrowing before dispatch. Do not alter the prior file or enable delegation merely to make a migration example pass.
5. If the host must use an older validator, retain an already valid and approved v1 config. Do not translate an opaque ID into a fabricated v1 ID or silently roll back approval evidence.
