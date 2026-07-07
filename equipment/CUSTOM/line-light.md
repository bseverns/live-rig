# LineLight

## Identity

- Category: custom/audio-reactive visual object.
- Status: `core/live` in lane docs.
- Aliases: LineLight.

## What it is

Audio-reactive lamp/object that follows an audio bus rather than MIDI.

## Current rig relationship

Lives near the frZone/audio-analysis lane but should not be required for audio or visual survival.

## I/O

- Audio/control input: audio feed, likely shared with or adjacent to frZone.
- MIDI/OSC: none expected.
- Output: light behavior.

## How to muster it

1. Patch the intended post-fader audio feed.
2. Confirm it reacts to program material.
3. Confirm it does not load down or compromise the frZone feed.
4. Mark it optional in show notes.

## How to remove it safely

1. Remove its audio feed or power.
2. Confirm frZone and main audio are unchanged.
3. Keep visual endpoint safety states separate.

## Failure modes

- Audio feed is absent or too low.
- It is confused with the actual visual endpoint.
- Shared feed disrupts analysis.

## Evidence

- `06_frzone-linelight.md`

## Open questions

- Current feed source.
- Power requirements.
