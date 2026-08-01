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
- Power: USB or adapter path must be confirmed in the room.

## Current safety mapping

- Current port name: unknown until physical verification.
- Current template/program number: unknown until physical verification.
- Documented Button 4 MIDI mapping: channel 10, note 63, semantic `state.blackout`.
- Actual Button 4 MIDI note/channel: unknown until hand-tested.
- Documented Button 5 MIDI mapping: channel 10, note 64, semantic `scene.clean_camera`.
- Actual Button 5 MIDI note/channel: unknown until hand-tested.
- Controller template/settings photo: not yet captured.
- Date hand-tested: unknown.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: documented mapping for channel/note values; unknown for current physical port and template.
- Still unknown: current port name, current template/program number, actual Button 4 output, actual Button 5 output, power path.

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
- Photo slots:
  - `equipment/photos/edirol-pcm30-front.jpg`
  - `equipment/photos/edirol-pcm30-back.jpg`
  - `equipment/photos/edirol-pcm30-power.jpg`
  - `equipment/photos/edirol-pcm30-current-patch-2026-07-08.jpg`
- Known-good card: `cards/edirol-known-good.md`

## Manual reference

- Sources: `notes/manuals/pcr30QS.pdf` and `notes/manuals/pcr30_full.pdf`.
- The PCR-30 is USB bus-powered and has 16 internal memory locations for
  controller setups.
- Its Panic operation sends All Sound Off, All Notes Off, and Reset All
  Controllers on every MIDI channel. Use that rather than power-cycling a
  shared MIDI chain for stuck notes.

## Open questions

- Current hardware template settings.
- Current physical MIDI/USB interface name.
