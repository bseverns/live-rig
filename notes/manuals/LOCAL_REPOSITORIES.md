# Local Reference Repositories

This index makes the nearby development repositories discoverable from the
field-manual repo without pretending they are all user manuals.  The copies in
`notes/manuals/` are portable reference snapshots; the paths below are the
editable local sources available on this workstation.

Last indexed: 2026-07-26.  Repository revisions are recorded so a future
update can tell whether a reference changed.

| Device / family | Local source | Revision | What to use it for | Portable reference here |
|---|---|---:|---|---|
| Original Kastle / Kastle 1.5 family | `../kastle/` | `6cb8ba3` | Legacy firmware variants, schematic, and build reference. `readMe.rtf` identifies `kastleSynthe_VCO` and `kastleSynth_LFO` as the original synth firmware. | `kastle-master.zip` |
| Kastle 2 / StackBrain | `../kastle2/` | `3c0f06e` | Hardware I/O, USB-MIDI/clock behavior, app list, StackBrain artifact, and schematic. Start with `README.md`, `MIDI_MAPPINGS.md`, and `artifacts/stackbrain/README.md`. | No separate snapshot yet; use the local source until a deliberately chosen portable snapshot is added. |
| Field Kit FX | `../FieldKitFX/` | `1850d2a` | Firmware/source reference for the looper, bit crusher, sample-rate reduction, frequency shifter, and CV matrix. This is not a substitute for a front-panel user manual. | `FieldKitFX-master.zip` |
| DrumKid | `../drumkid/` | `be1cdce` | Current V1.2 source baseline, manual, kit instructions, firmware, PCB, and schematics. It receives CC 16–31 on any channel; this revision also adds program-change beat selection. Start with `docs/v6/manual.md`. | `drumkid-master/` |

## Rules for using these sources

- Treat a source-tree statement as a firmware/version-specific fact, not proof
  of the state of the physical unit.
- Record the installed firmware/app before copying a control mapping into a
  show file. This is especially important for DrumKid MIDI behavior and
  Kastle 2 app-specific controls.
- For show-night operation, prefer the equipment page and known-good card. Use
  the source tree for exact behavior, repairs, firmware work, or a disputed
  fact.
- When a local source materially changes, update its revision in this table.
  Add a new portable snapshot only when the repo must remain usable away from
  this workstation; do not automatically vendor every development file.
