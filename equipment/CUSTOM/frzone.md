# frZone

## Identity

- Category: custom/analysis runtime.
- Status: `core/live`.
- Aliases: frZone.

## What it is

Audio analysis node that listens to the mix and biases visual behavior.

## Current rig relationship

Important enrichment for visuals, but the rig should survive with manual scene control if frZone is absent.

## I/O

- Audio input: post-fader bus from mixer.
- Control output: analysis CCs, conventionally channel 15.
- Visual influence: scene `analysis` weights and endpoint behavior.
- Power/runtime host: unknown until physical verification.
- Port name/protocol: unknown until physical verification.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: documented routing convention; unknown for current runtime and ports.
- Still unknown: current audio feed, input device, output protocol/path, port name, runtime host/project.

## How to muster it

1. Feed it from the intended post-fader bus.
2. Confirm meters/activity.
3. Confirm analysis output reaches bridge or endpoint.
4. Confirm scenes still work without it.

## How to remove it safely

1. Remove or mute its analysis output.
2. Confirm Edirol/manual scene control still works.
3. Confirm audio-only survival is unchanged.

## Failure modes

- It hears audio but output is not routed.
- Endpoint ignores analysis.
- Analysis is treated as required for visual survival.

## Evidence

- `06_frzone-linelight.md`
- `scenes/minimal-scenes.yaml`
- `docs/TROUBLESHOOTING.md`
- Photo slots:
  - `equipment/photos/frzone-front.jpg`
  - `equipment/photos/frzone-back.jpg`
  - `equipment/photos/frzone-power.jpg`
  - `equipment/photos/frzone-current-patch-2026-07-08.jpg`
- Known-good card: `cards/frzone-known-good.md`

## Open questions

- Current audio feed.
- Current output protocol/path.
