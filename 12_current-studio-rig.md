# 12 – Current studio rig

This file is the **literal current-state snapshot** for the studio rig.

It exists to answer a different question than `01_system-overview.md`:

- `01_system-overview.md` = the stable architecture
- `12_current-studio-rig.md` = what is actually on the table right now

If a device is only half-integrated, neglected, or still imaginary, say that plainly here.

Current diagram reference:

- `RigMap.drawio.png`

---

## Status legend

Use these labels literally:

- `core/live` – active part of the working rig
- `present/dormant` – physically here, not currently integrated or documented enough
- `planned` – intended node, not yet real in the studio
- `reference-only` – manuals / code / names exist, but current role is not locked

---

## Current truth

As of this pass, the working studio picture looks like this:

| Node | Status | Current role | Where the truth lives |
|------|--------|--------------|------------------------|
| DrumKid | `core/live` | Rhythmic core and possible clock leader depending on set. | `01`, `03`, `07`, `08`, `equipment/AUDIO/drumkid.md` |
| SQ-64 | `core/live` | Main sequencer, especially for AE rack voices. | `README`, `01`, `03`, `equipment/CONTROL/sq64.md` |
| AE rack | `core/live` | Modular voice lane fed by SQ-64. | `README`, `01`, `03`, `07`, `equipment/MODULAR_SYNTH/ae-rack.md` |
| Electribe Sampler (`E2S`) | `core/live` | Sample voice plus fundamental audio processor for another audio line. | `notes/scratch-questions.md`, `notes/manuals/electribe_sampler_MIDIimp.txt`, `equipment/AUDIO/electribe-e2s.md` |
| greyBox / Growser family | `core/live` | Current studio sound object / custom hardware family; names and source now vendored here. | `vendor/greyBox/`, `13_hardware-registry.md`, `equipment/CUSTOM/greybox.md` |
| Edirol PCM-30 | `core/live` | Main continuous visual control surface. | `README`, `01`, `03`, `08`, `equipment/CONTROL/edirol-pcm30.md` |
| frZone | `core/live` | Audio analysis lane feeding the visual side. | `README`, `01`, `03`, `06`, `equipment/CUSTOM/frzone.md` |
| SCapps chain / bridge runtime | `core/live` | Visual endpoint layer and associated bridge logic. | `01`, `04`, `05`, `09`, `11`, `equipment/VIDEO/scapps.md`, `equipment/COMPUTE/bridge-host.md` |
| Maschine MK1 | `present/dormant` | Good conceptual lane, currently neglected in the actual setup. | `10_maschine-mk1-lane.md`, `equipment/CONTROL/maschine-mk1.md` |
| Akai S900 | `present/dormant` | In the room / in scope, but not yet properly integrated into repo docs. | `notes/manuals/S900ownersmanual_text.pdf`, `equipment/AUDIO/s900.md` |
| x0xb0x | `planned` | Future node; not yet real in the studio. | `notes/xOxbOx/x0xb0x_BOM.md` |

---

## Nodes visible in `RigMap.drawio.png`

The root diagram is more concrete than the older prose docs. It currently shows these active or semi-active names:

### Control and infrastructure

- `Edirol`
- `drumKid clock notes`
- `sq64`
- `MIDI_THRU(4)`
- `frZone`
- `Macmini`
- `liverigControl`

### Sound sources and sound objects

- `DR550`
- `KASTLE 1.5 / Drum`
- `AE RACK`
- `KORG VOLCA MOD`
- `microgranny`
- `electribe2s`
- `FreqFM`
- `Kastle2 - stackBrain`
- `kaossilator`
- `greyBox [growser]`
- `4track-tape1`
- `tape2`
- `radio`
- `bhmbox`
- `microphone`

### Audio processing and amplification

- `FieldKitFX`
- `circuitBend`
- `FXloop`
- `DFX12`
- `FM212R`
- `other amp`
- `RECORD_ME`

### Visual / runtime side

- `nw_wrld/wrld_on`
- `MSVP`
- `SC_InputAmplifier`
- `Interstream`
- `Maelstrom`
- `SC_VideoMixer`
- `DISPLAY`

Treat those names as **current inventory and runtime clues**.
If a box or runtime is on the table often enough to matter, it should be named explicitly in this file, added to `13_hardware-registry.md` if it affects the current rig, and given or linked to an equipment passport in `equipment/`.

---

## Deliberately absent from the current diagram

These still matter, but they are **not shown as active nodes** in `RigMap.drawio.png`:

- `Maschine MK1`
- `Akai S900`
- `x0xb0x`

That absence is useful information.
It means the current studio picture is closer to “working rig now” than “full ecosystem eventually.”

---

## Documentation priorities from here

The next useful expansions are:

1. Lock the **audio truth**:
   - which nodes are sources,
   - which nodes are processors,
   - and which paths are inserts, returns, or parallel feeds.

2. Lock the **clock truth**:
   - who can lead,
   - who always follows,
   - and what must be filtered because it responds too broadly.

3. Lock the **compute/runtime truth**:
   - which machine hosts the bridge,
   - which named runtimes are current,
   - and which names are historical leftovers.

4. Lock the **provenance truth**:
   - which code is vendored here,
   - which code still lives elsewhere,
   - and which manuals are the current source of hardware facts.

---

## Working rules

- If something is show-critical, it should be documented in this repo even if the canonical code lives elsewhere.
- If something is only hypothetical, mark it `planned` rather than pretending it is integrated.
- If a device is currently neglected, say so directly rather than leaving its status ambiguous.
