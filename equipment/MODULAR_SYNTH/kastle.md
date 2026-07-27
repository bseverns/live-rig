# Kastle Family

## Identity

- Category: small synth / modulation object.
- Status: `core/live` in the current diagram.
- Aliases: original Kastle / Kastle 1.5 / Drum; Kastle 2 / StackBrain.

## What it is

Two distinct generations of small synth/drum/modulation objects used as audio
sources or patch helpers. Do not transfer a control or patch assumption from
one generation to the other without checking the active unit.

### Original Kastle / 1.5 family

- Local source: `../kastle/`; portable snapshot:
  `notes/manuals/kastle-master.zip`.
- The source identifies `kastleSynthe_VCO` and `kastleSynth_LFO` as the
  original synth firmware and includes additional work-in-progress firmware
  variants and a schematic.

### Kastle 2 / StackBrain

- Local source: `../kastle2/`; source index:
  `notes/manuals/LOCAL_REPOSITORIES.md`.
- Has stereo audio input and headphone output, sync in/out, USB-C power and
  MIDI, and a patch header. Its installed app determines much of its behavior.
- Base MIDI behavior documented in the local source: it follows USB MIDI clock
  when present (unless configured to ignore it), outputs USB MIDI clock while
  running from internal or jack/patchbay clock, and reserves CC 7, 9, 22–25
  for base controls. App controls are firmware-specific.

## Current rig relationship

Named in the current diagram, but exact unit roles and audio/control behavior are not captured.

## I/O

- Original Kastle / 1.5: verify exact firmware and panel/patch role before
  assuming audio, modulation, or clock behavior.
- Kastle 2: stereo audio input, stereo headphone output, sync in/out, USB MIDI
  I/O, and patch-header I/O are documented by the local source. Confirm the
  active app and physical cabling before using any of them in the rig.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Identify which Kastle unit is being used.
2. Confirm whether it is an audio source, modulation source, or both.
3. Patch output to a labeled mixer or destination.
4. Photograph patch state if needed.

## How to remove it safely

1. Mute downstream audio.
2. Photograph patch state before unplugging.
3. Confirm no other device was depending on its modulation.

## Failure modes

- Unit identity is unclear.
- Patch behavior is not repeatable.
- Audio and modulation roles are confused.

## Evidence

- `RigMap.drawio.png`
- `notes/manuals/kastle-master.zip`
- `notes/manuals/LOCAL_REPOSITORIES.md`
- `../kastle/readMe.rtf`
- `../kastle2/README.md`
- `../kastle2/MIDI_MAPPINGS.md`

- Photo slots:
  - `equipment/photos/kastle-front.jpg`
  - `equipment/photos/kastle-back.jpg`
  - `equipment/photos/kastle-power.jpg`
  - `equipment/photos/kastle-current-patch-2026-07-08.jpg`

## Open questions

- Confirm whether the active `Kastle2 - stackBrain` diagram label means the
  StackBrain app/artifact is actually installed.
- Audio versus modulation role.
- Output path.
