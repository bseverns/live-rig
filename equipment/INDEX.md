# Equipment Atlas

This is the library view of the studio.

It answers a different question than the rig docs:

- Rig truth: what is currently patched, trusted, and show-ready.
- Equipment truth: what exists, what it can do, where its evidence lives, and how it might be called into service.

Do not let this atlas make a dormant or untested object look show-ready. Promotion into the current rig still belongs in `12_current-studio-rig.md`, `13_hardware-registry.md`, profiles, scenes, and show sheets.

## Passport shape

Each equipment page should answer:

- Identity: stable name, aliases, category, status.
- What it is: plain-language role outside any one show.
- Current rig relationship: core, dormant, planned, reference-only, or unknown.
- I/O: audio, video, MIDI, OSC, clock, USB, network, storage.
- Power/media: supplies, batteries, disks, cards, adapters, fragile dependencies.
- How to muster it: the minimum safe steps to bring it into a patch.
- How to remove it safely: the steps that protect audio, clock, visuals, and safety anchors.
- Failure modes: what usually goes wrong.
- Evidence: manuals, vendored source, diagrams, photos, show notes, and known-good snapshots.
- Open questions: facts to verify before treating it as reliable.

## Categories

### Audio sources and processors

- [DrumKid](AUDIO/drumkid.md)
- [DR550](AUDIO/dr550.md)
- [Electribe E2S](AUDIO/electribe-e2s.md)
- [Microgranny](AUDIO/microgranny.md)
- [Kaossilator](AUDIO/kaossilator.md)
- [Akai S900](AUDIO/s900.md)
- [4-track / tape / radio / boombox cluster](AUDIO/found-sound-cluster.md)
- [Microphone](AUDIO/microphone.md)

### Modular synth and small synth objects

- [AE Rack](MODULAR_SYNTH/ae-rack.md)
- [Volca Modular](MODULAR_SYNTH/volca-modular.md)
- [Kastle family](MODULAR_SYNTH/kastle.md)
- [FreqFM](MODULAR_SYNTH/freaq-fm.md)
- [x0xb0x](MODULAR_SYNTH/x0xb0x.md)

### Video and visual endpoints

- [SCapps chain](VIDEO/scapps.md)
- [MSVP](VIDEO/msvp.md)
- [nw_wrld / wrld_on](VIDEO/nw-wrld.md)
- [Cameras and capture](VIDEO/cameras-capture.md)

### Control and sequencing

- [Edirol PCM-30](CONTROL/edirol-pcm30.md)
- [Maschine MK1](CONTROL/maschine-mk1.md)
- [SQ-64](CONTROL/sq64.md)
- [live-rig-control](CONTROL/live-rig-control.md)

### Compute and runtimes

- [Mac mini](COMPUTE/macmini.md)
- [REAPER host](COMPUTE/reaper-host.md)
- [Bridge host](COMPUTE/bridge-host.md)

### Custom systems

- [greyBox / Growser family](CUSTOM/greybox.md)
- [LineLight](CUSTOM/line-light.md)
- [frZone](CUSTOM/frzone.md)

### Amps, mixers, and FX

- [Horizon](AMPS_MIXERS_FX/horizon.md)
- [FieldKitFX](AMPS_MIXERS_FX/fieldkitfx.md)
- [DFX12](AMPS_MIXERS_FX/dfx12.md)
- [FM212R](AMPS_MIXERS_FX/fm212r.md)
- [circuitBend](AMPS_MIXERS_FX/circuitbend.md)
- [FXloop](AMPS_MIXERS_FX/fxloop.md)
- [Other amp](AMPS_MIXERS_FX/other-amp.md)

## Library tools

- [Passport template](PASSPORT_TEMPLATE.md)
- [Manuals and source index](MANUALS.md)
- [Muster matrix](MUSTER_MATRIX.md)
- [Glossary](GLOSSARY.md)

## Promotion rule

An equipment page can say “this box exists.” It cannot say “this box is trusted tonight” by itself.

To promote a box into the active rig, update the relevant current-state doc, profile, show sheet, or known-good snapshot.
