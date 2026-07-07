# FieldKitFX

## Identity

- Category: audio processor / FX.
- Status: `core/live`.
- Aliases: FieldKitFX.

## What it is

External FX / processing node.

## Current rig relationship

It appears in the current diagram, but exact insert/return behavior is not yet captured.

## I/O

- Audio input: unknown.
- Audio output: unknown.
- MIDI/clock: not captured; treat as audio processing until proven otherwise.

## How to muster it

1. Decide whether it is insert, send/return, or parallel.
2. Patch and label input/output.
3. Confirm wet/dry and gain.
4. Confirm the dry or bypass path survives.

## How to remove it safely

1. Determine whether it is insert, send/return, or parallel.
2. If insert, bypass it and confirm level at the next device.
3. If send/return, mute the return first, then remove the send.
4. Confirm the room still has audio before changing visual/control layers.

## Failure modes

- Wet path is accidentally the only audible path.
- Feedback or gain staging makes bypass unsafe or too quiet.
- A send/return patch changes the main mix without being documented.

## Evidence

- `RigMap.drawio.png`
- `notes/manuals/FieldKitFX-master.zip`

## Open questions

- Current patch position.
- Power and gain settings.
