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

## Open questions

- Audio path.
- Trigger path.
- Known-good sample state.
