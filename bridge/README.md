# Bridge Skeleton

This directory holds a small reference consumer for the exported live-rig profile.

It is intentionally minimal:

- it loads [`interop/exports/live-rig.default.json`](../interop/exports/live-rig.default.json)
- it prints the semantic inventory
- it can simulate a single semantic event
- it refuses to run if blackout or clean camera are missing from the export

This is not the final runtime engine.
It is a proof-of-contract bridge showing that sibling consumers can read the authority export directly.

## Run

```bash
node bridge/src/index.js
node bridge/src/index.js --simulate scene.intro
node bridge/src/index.js --simulate state.blackout
```

## Notes

- No MIDI or OSC libraries are required.
- The bridge only consumes the exported JSON profile.
- If the export becomes invalid, the bridge exits nonzero.
