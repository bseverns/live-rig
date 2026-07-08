# DrumKid

## Identity

- Category: audio source / rhythm core / possible clock controller.
- Status: `core/live`.
- Aliases: `drumKid`, DrumKid.

## What it is

Rhythmic core for the rig. Depending on the set, it may lead clock or follow another master.

## Current rig relationship

Current docs treat DrumKid as central to rhythm and clock decisions, but the clock boss must be chosen per set.

## I/O

- Audio: drum audio source.
- MIDI/clock: may own or follow clock; can fan clock in some setups.
- Storage/media: see bundled reference material.
- Power: unknown until photographed.
- Mixer channel: unknown until physical verification.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: manual/memory for general role; unknown for current patch.
- Still unknown: power supply, audio output path, mixer channel, MIDI port names, current clock role, current pattern/firmware state.

## How to muster it

1. Decide whether DrumKid is clock boss or follower.
2. Confirm audio output reaches the mixer.
3. Confirm followers respond only if DrumKid is intentionally boss.
4. Record the clock choice in the show sheet or snapshot.

## How to remove it safely

1. Mute or bypass its mixer channel.
2. If it was clock boss, name a new single boss before continuing.
3. Confirm audio-only survival without the drum source.

## Failure modes

- Two devices own clock.
- REAPER and DrumKid both send transport.
- Drum audio is assumed present but muted or unpatched.

## Evidence

- `notes/manuals/drumkid-master/`
- `01_system-overview.md`
- `03_midi-clock-video.md`
- `07_show-2025-12-15-basement-noise.md`
- `08_midi-mapping-2025-03-15-basement-noise.md`
- Photo slots:
  - `equipment/photos/drumkid-front.jpg`
  - `equipment/photos/drumkid-back.jpg`
  - `equipment/photos/drumkid-power.jpg`
  - `equipment/photos/drumkid-current-patch-2026-07-08.jpg`
- Known-good card: `cards/drumkid-known-good.md`

## Open questions

- Which clock role is current for the next known-good snapshot?
