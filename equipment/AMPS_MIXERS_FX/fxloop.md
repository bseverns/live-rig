# FXloop

## Identity

- Category: FX send/return or pedal loop.
- Status: `core/live` in the current diagram.
- Aliases: FXloop.

## What it is

Audio processing path, likely a send/return or pedal loop node.

## Current rig relationship

Named in the current diagram. Its position relative to mixer, E2S, and amps needs to be locked.

## I/O

- Audio input: unknown send/source.
- Audio output: unknown return/destination.
- MIDI/clock: not expected unless a device in the loop uses it.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Identify send/source and return/destination.
2. Confirm gain staging.
3. Confirm wet/dry or bypass behavior.
4. Label whether the loop is optional or required.

## How to remove it safely

1. Mute the return.
2. Remove or lower the send.
3. Confirm dry/main path survives.

## Failure modes

- Return is the only audible path.
- Feedback from send/return routing.
- A processor in the loop changes level drastically.

## Evidence

- `RigMap.drawio.png`

- Photo slots:
  - `equipment/photos/fxloop-front.jpg`
  - `equipment/photos/fxloop-back.jpg`
  - `equipment/photos/fxloop-power.jpg`
  - `equipment/photos/fxloop-current-patch-2026-07-08.jpg`

## Open questions

- Send and return points.
- Devices in the loop.
- Optional versus required role.
