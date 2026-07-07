# 13 – Hardware registry

This file is the **canonical current-rig device registry**.

For the broader field library of everything that can be remembered, taught, loaned, patched, revived, or mustered, use `equipment/INDEX.md`.

Use it to answer:

- what a box is in this ecosystem,
- whether it matters right now,
- where its source of truth lives,
- and what still needs to be documented.

This is intentionally flatter and more operational than the lane docs.

---

## Registry

| Node | Status | Primary role | Audio truth | MIDI / clock truth | Source of truth | Next documentation move |
|------|--------|--------------|-------------|--------------------|-----------------|--------------------------|
| DrumKid | `core/live` | Rhythmic core | Audio source | May lead or follow clock depending on set | `README`, `01`, `03`, `07`, `equipment/AUDIO/drumkid.md` | Keep show-specific clock choices in `07` / `08` |
| SQ-64 | `core/live` | Main sequencer | No primary audio role | Sequences AE rack; current default voice lane is Ch 16 | `README`, `01`, `03`, `notes/manuals/sq64*.pdf`, `equipment/CONTROL/sq64.md` | Add per-track default assignments if they stabilize |
| AE rack | `core/live` | Modular voices | Audio source | Follows SQ-64 note/gate patterns | `README`, `01`, `03`, `equipment/MODULAR_SYNTH/ae-rack.md` | Document voice groups if they stabilize |
| DR550 | `core/live` | Drum source / drum box in the current diagram | Audio source | MIDI and clock role not yet captured here | `RigMap.drawio.png`, `notes/manuals/DR-550_OM.pdf`, `notes/manuals/dr550_drrhytm.pdf`, `equipment/AUDIO/dr550.md` | Add its real routing and sync role once confirmed |
| Electribe Sampler (`E2S`) | `core/live` | Sampler plus processor | Audio source and processor for another line | Treat as MIDI-clock slave; route carefully because it appears broadly responsive | `notes/scratch-questions.md`, `notes/manuals/electribe_sampler_MIDIimp.txt`, `equipment/AUDIO/electribe-e2s.md` | Fill in current audio I/O, clock source, and active pattern/bank |
| Microgranny | `core/live` | Sample texture / shrapnel voice | Audio source | MIDI role not yet captured here | `RigMap.drawio.png`, `07`, `08`, `equipment/AUDIO/microgranny.md` | Add actual routing and trigger path |
| Kaossilator | `core/live` | Phrase synth / texture source | Audio source | MIDI role not yet captured here | `RigMap.drawio.png`, `notes/manuals/kaossilator_dynamic_phrase_synthesizer.pdf`, `equipment/AUDIO/kaossilator.md` | Capture whether it is clocked, free, or both |
| FreqFM | `core/live` | FM voice / sound source in the current diagram | Audio source | MIDI role not yet captured here | `RigMap.drawio.png`, `notes/manuals/MeeBleeps-Freaq-FM-Synth-master.zip`, `equipment/MODULAR_SYNTH/freaq-fm.md` | Lock exact naming and patch path |
| Kastle 1.5 / Drum | `core/live` | Small drum / synth voice | Audio source | MIDI role likely minimal or none | `RigMap.drawio.png`, `notes/manuals/kastle-master.zip`, `equipment/MODULAR_SYNTH/kastle.md` | Capture actual patching behavior if it remains active |
| Korg Volca Modular | `core/live` | Modular voice / texture source | Audio source | Clock and sync behavior not yet captured here | `RigMap.drawio.png`, `equipment/MODULAR_SYNTH/volca-modular.md` | Add actual routing if it remains part of the core rig |
| Kastle2 - stackBrain | `core/live` | Small synth / modulation object in current diagram | Audio source or modulation source | MIDI role not yet captured here | `RigMap.drawio.png`, `equipment/MODULAR_SYNTH/kastle.md` | Clarify whether it is an audio source, control source, or both |
| greyBox / Growser family | `core/live` | Custom sound object / instrument family | Audio source / texture box | MIDI role not yet documented here | `vendor/greyBox/`, original source in `../arduinoSketches/experiments/greybox`, `equipment/CUSTOM/greybox.md` | Fill in active sketch, wiring, and known-good control state |
| 4-track / tape / radio / boombox cluster | `core/live` | Playback and found-sound source family | Audio source | No stable MIDI role expected | `RigMap.drawio.png`, `07`, `08`, `equipment/AUDIO/found-sound-cluster.md` | Split into individual rows only if their roles stabilize |
| Microphone | `core/live` | Live input source | Audio source | No stable MIDI role expected | `RigMap.drawio.png`, `equipment/AUDIO/microphone.md` | Document whether it feeds FX, analysis, or tape paths |
| FieldKitFX | `core/live` | External FX / processing node | Audio processor | MIDI role not yet captured here | `RigMap.drawio.png`, `notes/manuals/FieldKitFX-master.zip`, `equipment/AMPS_MIXERS_FX/fieldkitfx.md` | Capture insert/return behavior |
| circuitBend | `core/live` | External processing node | Audio processor | MIDI role not yet captured here | `RigMap.drawio.png`, `equipment/AMPS_MIXERS_FX/circuitbend.md` | Clarify whether this is a device, chain, or category label |
| FXloop | `core/live` | FX send/return or pedal loop node | Audio processor path | MIDI role not yet captured here | `RigMap.drawio.png`, `equipment/AMPS_MIXERS_FX/fxloop.md` | Lock where it sits relative to mixer, E2S, and amps |
| DFX12 | `core/live` | Rack / amp / processing stage in current diagram | Audio processor or amp stage | MIDI role not yet captured here | `RigMap.drawio.png`, `notes/manuals/dfx_series.pdf`, `equipment/AMPS_MIXERS_FX/dfx12.md` | Confirm exact identity and routing |
| FM212R | `core/live` | Amp / speaker stage in current diagram | Audio amplification | No stable MIDI role expected | `RigMap.drawio.png`, `equipment/AMPS_MIXERS_FX/fm212r.md` | Capture where it sits relative to DFX12 and `RECORD_ME` |
| other amp | `core/live` | Secondary amplification path | Audio amplification | No stable MIDI role expected | `RigMap.drawio.png`, `equipment/AMPS_MIXERS_FX/other-amp.md` | Capture actual destination and reason it exists |
| Edirol PCM-30 | `core/live` | Visual macro control surface | No primary audio role | Ch 10 visual macros by convention | `README`, `01`, `03`, `08`, `notes/manuals/pcr30*.pdf`, `equipment/CONTROL/edirol-pcm30.md` | Lock any current hardware template offsets if needed |
| frZone | `core/live` | Audio analysis node | Listens to post-fader audio feed | Emits Ch 15 analysis CCs | `README`, `01`, `03`, `06`, `equipment/CUSTOM/frzone.md` | Keep per-band mappings in `06` and show maps in `08` |
| Maschine MK1 | `present/dormant` | Scene / event deck | No primary audio role | Narrow semantic lane only; should not own transport | `10_maschine-mk1-lane.md`, `equipment/CONTROL/maschine-mk1.md` | Revisit only when the deck is back in active use |
| Akai S900 | `present/dormant` | Legacy sampler / processor candidate | Likely source and/or processor, but not captured yet | MIDI behavior not yet captured here | `notes/manuals/S900ownersmanual_text.pdf`, `equipment/AUDIO/s900.md` | Fill in real patching notes before promoting it to active use |
| x0xb0x | `planned` | Future acid voice | Future source | Future clock / MIDI participant | `notes/xOxbOx/x0xb0x_BOM.md`, `equipment/MODULAR_SYNTH/x0xb0x.md` | Do not over-document until it exists physically |

---

## Runtime / compute nodes in the current diagram

These are not hardware instruments, but they are active enough to deserve explicit naming.

| Node | Status | Current role | Source of truth | Next documentation move |
|------|--------|--------------|-----------------|--------------------------|
| Macmini | `core/live` | Current computer host in the rig map | `RigMap.drawio.png`, `equipment/COMPUTE/macmini.md` | Document what actually runs here |
| liverigControl | `core/live` | Performer-facing control runtime | `RigMap.drawio.png`, `live-rig-control` repo, `equipment/CONTROL/live-rig-control.md` | Document whether it is active in the current patch or just available |
| nw_wrld/wrld_on | `core/live` | Current project/runtime endpoint | `RigMap.drawio.png`, `11_repo-roles-failover.md`, `equipment/VIDEO/nw-wrld.md` | Lock naming consistency across repos |
| MSVP | `core/live` | Peer visual/runtime endpoint | `RigMap.drawio.png`, `11_repo-roles-failover.md`, `equipment/VIDEO/msvp.md` | Keep failover relationship explicit |
| SC_InputAmplifier | `core/live` | SCapps utility / front-end stage | `RigMap.drawio.png`, `equipment/VIDEO/scapps.md` | Add to SCapps docs if it stays in the chain |
| Interstream | `core/live` | SCapps processing node | `RigMap.drawio.png`, `04`, `05`, `equipment/VIDEO/scapps.md` | Already partially documented; keep naming consistent |
| Maelstrom | `core/live` | SCapps processing node | `RigMap.drawio.png`, `04`, `05`, `equipment/VIDEO/scapps.md` | Already partially documented; keep naming consistent |
| SC_VideoMixer | `core/live` | Visual mix/output node | `RigMap.drawio.png`, `04`, `05`, `equipment/VIDEO/scapps.md` | Keep endpoint role explicit |
| DISPLAY | `core/live` | Final visual endpoint | `RigMap.drawio.png`, `equipment/VIDEO/scapps.md` | No deeper doc needed unless output routing gets tricky |

---

## Naming guidance

Use the following distinction consistently:

- **Node name** = stable human label in this repo, such as `E2S`, `greyBox`, `Maschine MK1`
- **Lane role** = what that node does in the rig, such as `clock leader`, `voice`, `processor`, `scene deck`
- **Implementation detail** = channel number, note map, firmware variant, or exact runtime host

This avoids mixing identity, role, and wiring into one fragile sentence.

---

## When a node deserves its own page

Create or update a dedicated equipment passport when a node is:

- core to the live rig,
- tricky enough to forget under pressure,
- sensitive to clock or routing mistakes,
- or backed by code/manuals that you already rely on.

The first equipment-passport pass now lives under `equipment/`.

Use `equipment/MUSTER_MATRIX.md` to decide what can be called into service and what still needs verification.
