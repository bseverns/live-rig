# Scene System

This repo’s scene layer is the machine-readable authority for show-night visual intent.
It sits below the human docs and above runtime consumers.

## What a scene is

A scene is a named performance configuration with:

- a semantic ID such as `scene.intro` or `scene.clean_camera`
- a human label
- a `ramp_ms` transition time
- a `hard_override` flag
- optional notes
- a `params` object for machine-readable performance state
- an `analysis` section for how much audio-reactive influence should matter
- trigger declarations for MIDI note, MIDI CC, and OSC where useful

The minimal authority file for this repo lives at [`scenes/minimal-scenes.yaml`](../scenes/minimal-scenes.yaml).

## What a state is

A state is a scene-like semantic ID that represents a rig condition rather than a visual flavor.

Examples:

- `state.blackout`
- `state.manual_override`

States still use the same validation and trigger model as scenes, but they are interpreted as operational conditions.

## Sacred states

Two states are treated as non-negotiable safety anchors:

- `state.blackout`
- `scene.clean_camera`

Why they matter:

- `state.blackout` is the fastest safe visual kill. If the room goes wrong, this must still be reachable.
- `scene.clean_camera` is the documentary-safe fallback. It gives the operator a readable, minimal-treatment view for recovery, troubleshooting, or clean capture.

The validator enforces:

- `state.blackout` exists
- `scene.clean_camera` exists
- `state.blackout` has `hard_override: true`
- `state.blackout` has `ramp_ms: 0`
- both are reachable by at least one trigger

## Validation

Validate the default scene file with:

```bash
npm run validate:scenes
```

Validate the explicit minimal file with:

```bash
npm run validate:scenes:minimal
```

You can also pass an alternate scene file directly to the validator:

```bash
node tools/validate-scenes.js path/to/other-scenes.yaml
```

The validator:

- loads the YAML file
- validates it against [`schemas/scene.schema.json`](../schemas/scene.schema.json)
- checks the safety invariants above
- prints clear pass/fail output
- exits nonzero on failure

## Semantic consumption

Other repos should consume scene IDs semantically, not by raw MIDI note number.

Prefer:

- `scene.intro`
- `scene.crash`
- `scene.soft`
- `scene.clean_camera`
- `state.blackout`
- `state.manual_override`

Treat MIDI note, MIDI CC, and OSC addresses as transport bindings underneath those IDs.
That keeps the authority layer stable even if hardware templates or routing change later.
