# SCapps Chain

## Identity

- Category: video endpoint chain.
- Status: `core/live`.
- Aliases: Signal Culture apps, SC_InputAmplifier, Interstream, Maelstrom, SC_VideoMixer.

## What it is

Modular video endpoint layer that receives capture/video input and reacts to MIDI/OSC or bridge messages.

## Current rig relationship

The SCapps chain is part of the visual lane. It should react to semantic control and analysis without owning global rig logic.

## I/O

- Video input: capture/camera/Syphon-like sources depending on runtime.
- Control: MIDI/OSC through bridge or direct routing.
- Display output: final display/projector path.

## How to muster it

1. Start the required apps in the correct order.
2. Confirm capture/camera input.
3. Confirm bridge sends `scene.intro`, `state.blackout`, and `scene.clean_camera`.
4. Confirm display output path.

## How to remove it safely

1. Trigger `state.blackout`.
2. Remove display/projector feed physically if software blackout fails.
3. Keep audio-only survival intact.

## Failure modes

- Endpoint listens on the wrong port or MIDI source.
- Capture source is absent.
- Display path is patched wrong.
- App chain runs but ignores semantic state.

## Evidence

- `04_scapps-overview.md`
- `05_scapps-rigs.md`
- `09_scene-system.md`
- `docs/TROUBLESHOOTING.md`

## Open questions

- Exact current app order and host.
- Which endpoint is primary for the next known-good snapshot.
