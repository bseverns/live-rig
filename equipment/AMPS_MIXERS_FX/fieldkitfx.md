# FieldKitFX

## Identity

- Category: audio processor / FX.
- Status: `core/live`.
- Aliases: FieldKitFX.

## What it is

External FX / processing node. The local firmware source identifies its core
effects as looper, bit crusher, sample-rate reduction, frequency shifter, and
CV matrix.

## Current rig relationship

It appears in the current diagram, but exact insert/return behavior is not yet captured.

## I/O

- Audio input: unknown.
- Audio output: unknown.
- MIDI/clock: not captured; treat as audio processing until proven otherwise.
- Firmware reference: `../FieldKitFX/` is the editable source; its README
  documents a deliberate firmware-flash path, not day-to-day operation.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

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
- `notes/manuals/LOCAL_REPOSITORIES.md`
- `../FieldKitFX/README.md`

- Photo slots:
  - `equipment/photos/fieldkitfx-front.jpg`
  - `equipment/photos/fieldkitfx-back.jpg`
  - `equipment/photos/fieldkitfx-power.jpg`
  - `equipment/photos/fieldkitfx-current-patch-2026-07-08.jpg`

## Open questions

- Current patch position.
- Power and gain settings.
- Installed firmware/version if firmware behavior becomes operationally relevant.
