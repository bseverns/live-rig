# 4-Track / Tape / Radio / Boombox Cluster

## Identity

- Category: playback / found-sound source family.
- Status: `core/live` in the current diagram.
- Aliases: 4track-tape1, tape2, radio, bhmbox, boombox.

## What it is

A family of playback and found-sound sources used as live audio material.

## Current rig relationship

Named in `RigMap.drawio.png`, but individual roles are not stable enough to split into separate passports yet.

## I/O

- Audio output: unknown mixer channels.
- MIDI/clock: none expected.
- Power/media: tapes, radio tuning, batteries/power supplies unknown.

## How to muster it

1. Identify which source is actually being used.
2. Confirm media/tuning/power.
3. Patch output to a labeled mixer channel.
4. Record whether it feeds main mix, FX, analysis, or recording only.

## How to remove it safely

1. Mute the source channel.
2. Confirm no FX/analysis path depends on it.
3. Preserve any tape/radio state if it matters.

## Failure modes

- Dead battery or missing media.
- Source is feeding analysis or FX unexpectedly.
- Multiple sources get treated as one channel.

## Evidence

- `RigMap.drawio.png`
- Show notes when captured.

## Open questions

- Individual source channels.
- Which sources are actually active.
- Whether any feed frZone or tape/recording paths.
