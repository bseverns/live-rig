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
- Host/ports: current machine and port names unknown until physical verification.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: repo contract observed; current host/runtime unknown.
- Still unknown: current host machine, launch workflow, MIDI input port, OSC/MIDI output host/port, selected live profile/export.

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
- Photo slots:
  - `equipment/photos/bridge-host-front.jpg`
  - `equipment/photos/bridge-host-back.jpg`
  - `equipment/photos/bridge-host-power.jpg`
  - `equipment/photos/bridge-host-current-patch-2026-07-08.jpg`
- Known-good card: `cards/bridge-host-known-good.md`

## Open questions

- Current host machine.
- Current launch workflow.
