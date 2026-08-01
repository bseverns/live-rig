# Kaossilator

## Identity

- Category: audio source / phrase synth / texture.
- Status: `core/live` in the hardware registry.
- Aliases: Kaossilator.

## What it is

Phrase synth and texture source.

## Current rig relationship

It appears in the current studio inventory, but whether it is clocked, free-running, or both is not captured.

## I/O

- Audio output: unknown.
- MIDI/clock: unknown.
- Power/media: confirm power supply or battery state before use.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Confirm power.
2. Decide whether it should be clocked or free.
3. Patch audio to a labeled mixer channel.
4. Record any phrase/preset state needed for the set.

## How to remove it safely

1. Mute its mixer channel.
2. Confirm no clock path depends on it.
3. Capture any phrase state worth preserving before power-down.

## Failure modes

- Free-running phrase drifts against clocked material.
- Audio path is patched through an undocumented processor.
- Battery/power state interrupts use.

## Evidence

- `RigMap.drawio.png`
- `notes/manuals/kaossilator_dynamic_phrase_synthesizer.pdf`

- Photo slots:
  - `equipment/photos/kaossilator-front.jpg`
  - `equipment/photos/kaossilator-back.jpg`
  - `equipment/photos/kaossilator-power.jpg`
  - `equipment/photos/kaossilator-current-patch-2026-07-08.jpg`

## Manual reference

- Source: `notes/manuals/kaossilator_dynamic_phrase_synthesizer.pdf`.
- Power is either four AA batteries or the optional 4.5 V AC adapter. Confirm
  which is installed before relying on it outside the studio.

## Open questions

- Clock behavior.
- Audio path.
- Phrase/preset state.
