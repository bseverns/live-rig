# greyBox / Growser Family

## Identity

- Category: custom hardware / sound object.
- Status: `core/live`.
- Aliases: greyBox, Growser.

## What it is

Custom sound-object / instrument family backed by sketches in `vendor/greyBox/`.

## Current rig relationship

It is part of the real studio picture and vendored source now lives in this repo. Active sketch and wiring still need physical confirmation.

## I/O

- Audio input: unknown.
- Audio output: unknown.
- MIDI/clock: not documented; treat as audio source unless a sketch proves otherwise.
- Power/firmware: active sketch unknown.

## How to muster it

1. Identify the physical greyBox variant.
2. Record active sketch/firmware if known.
3. Confirm power and wiring.
4. Patch output to a labeled mixer channel.
5. Note whether it has any control or clock role.

## How to remove it safely

1. Mute or bypass its mixer channel.
2. Confirm no clock or transport path depends on it.
3. Leave the rest of the audio lane and visual safety states untouched.
4. Record which sketch and wiring were active before changing firmware.

## Failure modes

- Active sketch differs from the documented source.
- Wiring or control assumptions change between variants.
- It becomes part of a feedback/texture path that is hard to remove under pressure.

## Evidence

- `vendor/greyBox/README.md`
- `vendor/greyBox/greyBox_Growser/greyBox_Growser.ino`
- `vendor/greyBox/greyBox_GrowserSwitch/greyBox_GrowserSwitch.ino`
- `vendor/greyBox/greyBox_Growser_delay/greyBox_Growser_delay.ino`
- `vendor/greyBox/greyBox_instructableEx/greyBox_instructableEx.ino`

## Open questions

- Active sketch.
- Wiring.
- Power requirements.
- Output path.
