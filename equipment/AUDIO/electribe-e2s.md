# Electribe E2S

## Identity

- Category: audio source / sampler / processor.
- Status: `core/live`.
- Aliases: E2S, Electribe Sampler, `electribe2s`.

## What it is

Korg Electribe Sampler. In this rig it is a sampler and possible processing node, not a safety dependency.

## Current rig relationship

It is an active studio object and may be fundamental to an audio line, but it should not be required for minimal visual/control survival.

## I/O

- Audio input: unknown until current patch is photographed.
- Audio output: unknown until current patch is photographed.
- MIDI/clock: treat as a MIDI-clock follower unless a show doc explicitly names it as boss.
- Storage/media: active pattern/bank unknown.

## How to muster it

1. Confirm the intended role: sample voice, processor, or both.
2. Set it to follow the single clock boss unless explicitly leading.
3. Confirm pattern/bank and audio I/O.
4. Filter or route MIDI so it does not consume visual-control traffic.

## How to remove it safely

1. Confirm the main audio lane still reaches PA/interface without the E2S.
2. Bypass or mute its mixer return.
3. Disable its clock send and receive if it is causing transport confusion.
4. Keep `state.blackout` and `scene.clean_camera` available through the visual controller.

## Failure modes

- It follows the wrong clock source.
- It responds to messages meant for another lane.
- Its processor path silently becomes required for the main mix.
- A pattern or sample bank change alters the audio path without being reflected in show notes.

## Evidence

- `notes/scratch-questions.md`
- `notes/manuals/electribe_sampler.pdf`
- `notes/manuals/electribe_sampler_PG.pdf`
- `notes/manuals/electribe_sampler_MIDIimp.txt`

## Open questions

- Current input/output path.
- Active pattern/bank.
- MIDI filtering and clock settings.
