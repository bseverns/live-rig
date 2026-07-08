# Horizon

## Identity

- Category: audio processor / master bus or FX.
- Status: active in rig docs.
- Aliases: Horizon.

## What it is

Processor in the main audio path or master bus area.

## Current rig relationship

Current docs use mixer -> Horizon -> PA/interface as a reference audio path.

## I/O

- Audio input: main mix or processor send, depending on patch.
- Audio output: PA/interface or downstream mix path.
- MIDI: no current required role; channel 9 is only a mental reserve in README.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Confirm whether it is insert, send/return, or main-bus processor.
2. Patch input/output and label the route.
3. Confirm bypass/removal path before relying on it.
4. Gain-stage main audio before troubleshooting visuals.

## How to remove it safely

1. Bypass it or repatch mixer output directly to PA/interface.
2. Confirm audio-only survival.
3. Document the temporary bypass if used live.

## Failure modes

- Main mix stops because Horizon is unpowered or mispatched.
- Bypass path is not known.
- It is blamed for a mixer mute/gain issue.

## Evidence

- `README.md`
- `02_audio-mixer-fx.md`
- `sheets/minimal-audio-patch.md`

- Photo slots:
  - `equipment/photos/horizon-front.jpg`
  - `equipment/photos/horizon-back.jpg`
  - `equipment/photos/horizon-power.jpg`
  - `equipment/photos/horizon-current-patch-2026-07-08.jpg`

## Open questions

- Current exact patch position.
- Known-good gain staging.
