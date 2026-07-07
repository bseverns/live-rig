# greyBox / Growser family

## What it is

Custom sound-object / instrument family backed by sketches in `vendor/greyBox/`.

## Current role

- Status: `core/live` in the hardware registry.
- Role: texture box or custom instrument family.
- Active sketch: unknown until physically confirmed.

## Audio in/out

- Input: unknown.
- Output: unknown.
- Mixer destination: unknown.

## MIDI / clock behavior

- MIDI role is not documented yet.
- Treat it as an audio source unless the active sketch proves a clock or MIDI role.

## What can go wrong

- The active sketch differs from the documented source.
- Wiring or control assumptions change between greyBox variants.
- It becomes part of a feedback/texture path that is hard to remove under pressure.

## Known-good settings

- Active firmware/sketch: unknown.
- Control positions: unknown.
- Power and I/O requirements: unknown.

## Manual/source reference

- `vendor/greyBox/README.md`
- `vendor/greyBox/greyBox_Growser/greyBox_Growser.ino`
- `vendor/greyBox/greyBox_GrowserSwitch/greyBox_GrowserSwitch.ino`
- `vendor/greyBox/greyBox_Growser_delay/greyBox_Growser_delay.ino`
- `vendor/greyBox/greyBox_instructableEx/greyBox_instructableEx.ino`

## How to remove it safely

1. Mute or bypass its mixer channel.
2. Confirm no clock or transport path depends on it.
3. Leave the rest of the audio lane and visual safety states untouched.
4. Record which sketch and wiring were active before changing firmware.
