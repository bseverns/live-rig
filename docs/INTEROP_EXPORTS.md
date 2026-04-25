# Interop Exports

`live-rig` is the authority layer.
Sibling repos are consumers of exported truth, not inventors of their own semantic maps.

The committed runtime export lives at [`interop/exports/live-rig.default.json`](../interop/exports/live-rig.default.json).
It is the single JSON payload intended for sibling repos to ingest when they need the rig’s semantic runtime view.

## What the export is for

The export combines:

- the selected mission profile
- the scene file named by that profile
- controller semantics
- safety states
- required and optional devices
- endpoint hints
- validation status

That gives downstream repos a single file to read instead of reassembling topology from scattered YAML and docs.

## Consumer rule

Consumers should load the export first, then use the semantic IDs inside it.

Do not treat raw MIDI note numbers, CC numbers, or OSC addresses as meaning.
Treat those as transport bindings under semantic IDs such as:

- `scene.intro`
- `scene.crash`
- `scene.soft`
- `scene.clean_camera`
- `state.blackout`
- `state.manual_override`

## Stable fields

These fields are intended to stay machine-readable and semantically stable:

- `export_version`
- `source`
- `profile`
- `scenes`
- `states`
- `macros`
- `controller_bindings`
- `safety_states`
- `required_devices`
- `optional_devices`
- `visual_endpoints`
- `audio_patch_reference`
- `clock_doctrine`
- `validation_summary`

The `source.build_fingerprint` field is deterministic metadata, not a timestamp.
It should change only when the exported payload changes.

## Experimental fields

The export reserves an optional top-level `experimental` object for preview data.
Do not build sibling-repo behavior on that object unless the field is explicitly documented and versioned.

## Validation

Rebuild the export with:

```bash
npm run export:rig-profile
```

Validate the committed export with:

```bash
npm run validate:rig-profile
```

If validation fails, the export is not ready for consumption.

## Expected consumer behavior

Sibling repos should:

1. Load the committed export.
2. Resolve scenes, states, and macros by semantic ID.
3. Use controller bindings as transport metadata only.
4. Respect `state.blackout` and `scene.clean_camera` as sacred recovery anchors.
5. Preserve the authority layer’s semantics even if their local hardware differs.

If a consumer needs to know whether the rig is ready, it should read the export’s validation summary and then run its own room-specific checks.
