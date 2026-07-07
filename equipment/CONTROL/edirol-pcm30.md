# Edirol PCM-30

## Identity

- Category: controller / visual macro surface.
- Status: `core/live`.
- Aliases: Edirol, PCR-30 in manual filenames.

## What it is

Primary physical macro controller for the video lane. Raw MIDI is transport; semantic IDs are the meaning.

## Current rig relationship

Mapped in `controllers/edirol-pcm30.yaml`, currently using channel 10 for visual macros and safety controls.

## I/O

- MIDI: channel 10 by convention.
- Audio/video: none directly.
- USB/MIDI interface: current port must be confirmed in the room.

## How to muster it

1. Connect to the intended MIDI input.
2. Confirm `RIG_MIDI_CONTROL_PORT` or runtime input selection.
3. Press Button 4 for `state.blackout` and Button 5 for `scene.clean_camera`.
4. Confirm scene buttons fire semantic IDs, not endpoint-specific transport commands.

## How to remove it safely

1. Confirm another controller or web surface can trigger `state.blackout`.
2. Confirm `scene.clean_camera` remains reachable.
3. Remove its MIDI input from the runtime to avoid ghost mappings.

## Failure modes

- Wrong MIDI port selected.
- Channel/template offset changes raw note/CC values.
- Mapping changes without export regeneration.

## Evidence

- `controllers/edirol-pcm30.yaml`
- `docs/CONTROLLERS.md`
- `notes/manuals/pcr30QS.pdf`
- `notes/manuals/pcr30_full.pdf`

## Open questions

- Current hardware template settings.
- Current physical MIDI/USB interface name.
