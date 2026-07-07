# FreqFM

## Identity

- Category: synth / FM voice.
- Status: `core/live` in the current diagram.
- Aliases: FreqFM, MeeBlip/MeeBleeps Freaq FM source bundle name.

## What it is

FM voice or sound source in the current diagram.

## Current rig relationship

The exact naming, patch path, and control behavior need to be locked.

## I/O

- Audio output: unknown.
- MIDI/control: unknown.
- Power: unknown.

## How to muster it

1. Confirm exact device identity/name.
2. Patch audio to a labeled mixer channel.
3. Confirm MIDI/control role, if any.
4. Record preset/knob state if it matters.

## How to remove it safely

1. Mute its mixer channel.
2. Confirm no sequence or control lane depends on it.
3. Capture preset/knob state before changes.

## Failure modes

- Naming mismatch makes source docs hard to find.
- MIDI/control assumptions are wrong.
- Audio path is not captured.

## Evidence

- `RigMap.drawio.png`
- `notes/manuals/MeeBleeps-Freaq-FM-Synth-master.zip`

## Open questions

- Exact name/model.
- Audio path.
- Control behavior.
