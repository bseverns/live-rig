# FieldKitFX

## What it is

External FX / processing node.

## Current role

- Status: `core/live` in the hardware registry.
- Role: audio processor.
- Exact insert/return behavior: unknown until current patch is captured.

## Audio in/out

- Input: unknown.
- Output: unknown.
- Likely position: send/return, insert, or dedicated processing branch.

## MIDI / clock behavior

- MIDI role is not captured.
- Treat as audio processing until proven otherwise.

## What can go wrong

- Wet path is accidentally the only audible path.
- Feedback or gain staging makes bypass unsafe or too quiet.
- A send/return patch changes the main mix without being documented.

## Known-good settings

- Patch position: unknown.
- Wet/dry state: unknown.
- Gain staging: unknown.

## Manual/source reference

- `notes/manuals/FieldKitFX-master.zip`

## How to remove it safely

1. Determine whether it is insert, send/return, or parallel.
2. If insert, bypass it and confirm level at the next device.
3. If send/return, mute the return first, then remove the send.
4. Confirm the room still has audio before changing visual/control layers.
