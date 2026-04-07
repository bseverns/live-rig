# 14 – External sources

This file tracks where rig knowledge lives **outside the main prose docs**.

The goal is not to eliminate outside sources.
The goal is to make their locations explicit so the rig stays usable when only this repo is available.

Current diagram artifact:

- `RigMap.drawio.png`

---

## Vendored into this repo

### `greyBox` family

- Vendored path: `vendor/greyBox/`
- Original local source path at time of vendoring: `../arduinoSketches/experiments/greybox`
- Reason for vendoring:
  - this hardware family is part of the real studio picture,
  - the names matter now,
  - and having the sketches in this repo reduces “wrong repo” friction during setup or troubleshooting.

Current vendored files:

- `vendor/greyBox/README.md`
- `vendor/greyBox/greyBox_Growser/greyBox_Growser.ino`
- `vendor/greyBox/greyBox_GrowserSwitch/greyBox_GrowserSwitch.ino`
- `vendor/greyBox/greyBox_Growser_delay/greyBox_Growser_delay.ino`
- `vendor/greyBox/greyBox_instructableEx/greyBox_instructableEx.ino`

---

## Manuals already in this repo

These are the most immediately relevant hardware references for the current documentation pass:

- `notes/manuals/electribe_sampler_MIDIimp.txt`
- `notes/manuals/electribe_sampler.pdf`
- `notes/manuals/electribe_sampler_PG.pdf`
- `notes/manuals/S900ownersmanual_text.pdf`
- `notes/manuals/sq64.pdf`
- `notes/manuals/sq64_full.pdf`
- `notes/manuals/pcr30_full.pdf`
- `notes/manuals/pcr30QS.pdf`
- `notes/manuals/dfx_series.pdf`
- `notes/manuals/DR-550_OM.pdf`
- `notes/manuals/dr550_drrhytm.pdf`

Use the manuals for factual behavior.
Use the lane docs for rig role.
Use show files for one-night deviations.

---

## Local repos still acting as sources of truth

At minimum:

- `../arduinoSketches/`
  - still appears to be the broader home for custom hardware sketches
  - `greyBox` originated there

If other local repos become operationally necessary for this rig, add them here with:

- repo path,
- which node/runtime they describe,
- and whether they should be partially vendored or merely referenced.

---

## Public firmware / reference bundles already captured here

The `notes/manuals/` area already includes a mix of manuals, firmware snapshots, and public bundles for devices and adjacent hardware.

Examples:

- `notes/manuals/drumkid-master/`
- `notes/manuals/FieldKitFX-master.zip`
- `notes/manuals/kastle-master.zip`
- `notes/manuals/MeeBleeps-Freaq-FM-Synth-master.zip`

These are useful references, but they are not automatically part of the active rig contract.
Promote them into the main docs only when they become part of the real setup.

---

## Provenance rules

- If a device is core and the source code is local-only elsewhere, vendor a snapshot here.
- If a manual answers a rig-critical behavior question, cite the manual file in the relevant node or lane doc.
- If a device is only aspirational, keep it in planning docs until it exists physically.
- If a vendored source changes materially elsewhere, update both the vendored copy and this provenance note.
