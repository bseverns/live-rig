# AE Rack

## Identity

- Category: modular synth / voice lane.
- Status: `core/live`.
- Aliases: AE RACK.

## What it is

Modular voice lane fed by sequencer patterns, especially SQ-64.

## Current rig relationship

Current docs describe AE rack voices around SQ-64 sequencing, with channel 16 as the default mental model.

## I/O

- Audio output: unknown mixer path.
- Control input: SQ-64 note/gate/CV/MIDI path, exact details need capture.
- Clock: follows the sequencer/control lane.

## How to muster it

1. Confirm SQ-64 track/channel/voice assignment.
2. Patch audio output to the mixer.
3. Confirm tuning/level before show volume.
4. Record any voice-group conventions if stable.

## How to remove it safely

1. Mute its mixer channels.
2. Stop or reroute SQ-64 tracks targeting it.
3. Confirm other audio sources still carry the set.

## Failure modes

- SQ-64 track assignment changes.
- Voice output is unpatched or too quiet.
- Modular patch state is assumed but not documented.

## Evidence

- `README.md`
- `01_system-overview.md`
- `03_midi-clock-video.md`
- `07_show-2025-12-15-basement-noise.md`

## Open questions

- Current voice groups.
- Current audio outputs.
- Current SQ-64 assignments.
