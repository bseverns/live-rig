# Microphone

## Identity

- Category: live audio input.
- Status: `core/live` in the current diagram.
- Aliases: mic, microphone.

## What it is

Live audio input source.

## Current rig relationship

Named in the current diagram. It may feed main audio, FX, analysis, tape, or some combination, but this is not captured.

## I/O

- Audio input: live microphone.
- Audio output: mixer channel or processor path unknown.
- MIDI/clock: none expected.

## How to muster it

1. Confirm mic, cable, and input type.
2. Patch to a labeled mixer channel.
3. Gain-stage before routing to FX or analysis.
4. Record whether it feeds PA, recording, frZone, or processors.

## How to remove it safely

1. Mute the channel before unplugging.
2. Confirm feedback or analysis behavior returns to expected state.
3. Document if it was feeding a processor or recording path.

## Failure modes

- Feedback.
- Phantom/input mismatch.
- Mic feed accidentally drives analysis too hard.

## Evidence

- `RigMap.drawio.png`

## Open questions

- Current channel.
- FX/analysis routing.
- Microphone model/type.
