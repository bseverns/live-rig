# Bridge Host

## Identity

- Category: compute runtime / semantic bridge.
- Status: `core/live` conceptually.
- Aliases: bridge, router.

## What it is

Runtime that translates controller and scene/profile authority into endpoint behavior.

## Current rig relationship

The bridge consumes exported rig profile data and should preserve semantic IDs as the authority layer.

## I/O

- Input: MIDI/control surfaces, possibly OSC.
- Output: OSC/MIDI/control messages to visual endpoints.
- Files: profiles, scenes, controller maps, interop export.

## How to muster it

1. Run `npm run doctor:json`.
2. Confirm selected profile and export freshness.
3. Confirm MIDI input and OSC output host/port.
4. Simulate `state.blackout` and `scene.intro`.

## How to remove it safely

1. Trigger `state.blackout` if possible.
2. Stop bridge output to avoid stale endpoint messages.
3. Use physical display/feed removal if software safety fails.

## Failure modes

- Wrong profile.
- Stale export.
- MIDI input absent.
- OSC target host/port wrong.

## Evidence

- `bridge/README.md`
- `bridge/src/index.js`
- `tools/rig-doctor.js`
- `interop/exports/live-rig.default.json`

## Open questions

- Current host machine.
- Current launch workflow.
