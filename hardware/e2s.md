# E2S

## What it is

Korg Electribe Sampler. In this rig it is a sampler and possible processing node, not a safety dependency.

## Current role

- Status: `core/live` in the hardware registry.
- Role: audio source and processor candidate.
- Survival tier: optional for minimal visual/control survival unless a show patch explicitly depends on it.

## Audio in/out

- Input: unknown until current patch is photographed.
- Output: unknown until current patch is photographed.
- Likely use: sample playback, live processing, or both.

## MIDI / clock behavior

- Treat as a MIDI-clock follower unless a show doc explicitly names it as boss.
- Be careful with broad MIDI responsiveness; do not let it consume visual-control traffic.
- Do not allow it to create a second Start/Stop or clock source.

## What can go wrong

- It follows the wrong clock source.
- It responds to messages meant for another lane.
- Its processor path silently becomes required for the main mix.
- A pattern or sample bank change alters the audio path without being reflected in show notes.

## Known-good settings

- Clock source: unknown.
- MIDI channel/filtering: unknown.
- Active pattern/bank: unknown.

Confirm these in the next known-good snapshot before relying on them live.

## Manual/source reference

- `notes/manuals/electribe_sampler.pdf`
- `notes/manuals/electribe_sampler_PG.pdf`
- `notes/manuals/electribe_sampler_MIDIimp.txt`

## How to remove it safely

1. Confirm the main audio lane still reaches PA/interface without the E2S.
2. Bypass or mute its mixer return.
3. Disable its clock send and receive if it is causing transport confusion.
4. Keep `state.blackout` and `scene.clean_camera` available through the visual controller.
