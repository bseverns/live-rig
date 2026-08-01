# Microgranny

## Identity

- Category: audio source / sample texture.
- Status: `core/live` in the current diagram.
- Aliases: Microgranny.

## What it is

Sample texture or shrapnel voice in the audio lane.

## Current rig relationship

Named in the current diagram, but its routing and trigger behavior are not yet captured.

## I/O

- Audio output: unknown.
- MIDI/clock: unknown.
- Media/storage: unknown sample state.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Confirm power and sample/media state.
2. Patch audio to a labeled mixer channel.
3. Decide whether it needs clock, triggers, or free manual control.
4. Record the sample bank or patch state if it matters.

## How to remove it safely

1. Mute its mixer channel.
2. Confirm no sequencer or control lane depends on it.
3. Leave clock and visual safety states untouched.

## Failure modes

- Wrong sample bank.
- Audio output not gained or patched.
- Trigger/control path assumed but absent.

## Evidence

- `RigMap.drawio.png`
- `12_current-studio-rig.md`
- Show notes when captured.

- Photo slots:
  - `equipment/photos/microgranny-front.jpg`
  - `equipment/photos/microgranny-back.jpg`
  - `equipment/photos/microgranny-power.jpg`
  - `equipment/photos/microgranny-current-patch-2026-07-08.jpg`

## Source reference

- Firmware source: <https://github.com/bseverns/microGranny2>. It records
  custom-firmware goals, not verified stock-device behavior.

## Open questions

- Audio path.
- Trigger path.
- Known-good sample state.
