# REAPER Host

## Identity

- Category: compute runtime / DAW.
- Status: situational.
- Aliases: REAPER.

## What it is

DAW host and possible clock/router in DAW-led sets.

## Current rig relationship

REAPER can own clock in some setups, but it must not silently compete with DrumKid or another boss.

## I/O

- Audio: interface routing, recording, or processing.
- MIDI/clock: may send clock/SPP in DAW-led sets.
- Control: may route MIDI between devices.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Decide whether REAPER owns clock tonight.
2. If it owns clock, enable the intended MIDI output and send clock/SPP.
3. If it does not own clock, keep it out of transport ownership.
4. Document any MIDI routing it performs.

## How to remove it safely

1. Stop its transport/clock output first.
2. Assign another single clock boss if needed.
3. Confirm audio path still survives if REAPER was in the audio lane.

## Failure modes

- REAPER and DrumKid both send clock.
- MIDI device enabled for input/output unintentionally.
- Audio routing depends on a project not captured in the repo.

## Evidence

- `README.md`
- `03_midi-clock-video.md`
- `docs/PREFLIGHT.md`

- Photo slots:
  - `equipment/photos/reaper-host-front.jpg`
  - `equipment/photos/reaper-host-back.jpg`
  - `equipment/photos/reaper-host-power.jpg`
  - `equipment/photos/reaper-host-current-patch-2026-07-08.jpg`

## Open questions

- Current project/template.
- Current MIDI device names.
- Whether it is audio-critical or only routing/clock.
