# live-rig

Working notes, diagrams, and show sheets for a hybrid audio–video performance rig.

This repo exists so that **future-you** can walk into a venue, open one page, and remember:

- what plugs into what,
- which device lives on which MIDI channel,
- and how the visuals are being driven by hands and by sound.

It’s not firmware. It’s the **field manual** for the whole ecosystem: audio, MIDI, analysis, and video endpoints.

---

## Quick start (show-night sanity check)

If you’re standing in a basement / club / warehouse right now, start here.

1. **Clock (REAPER → DrumKid)**  
   - In REAPER:  
     - Enable the DrumKid MIDI output in *Preferences → Audio → MIDI Devices*.  
     - Right-click it → **Enable output** + **Send clock/SPP**.  
   - Use DrumKid to fan clock to SQ-64 or other devices if needed.

2. **Audio (mixer → Horizon → PA)**  
   - Patch sources and devices according to `02_audio-mixer-fx.md`.  
   - Confirm **main mix → Horizon → interface / PA**.  
   - Send a **post-fader bus** (e.g. Bus 1) to **frZone** (and LineLight, if it shares that feed).

3. **Video (SCapps chain up)**  
   - Launch the appropriate SCapps chain from `05_scapps-rigs.md`  
     (Frame Buffer, Maelstrom, SC Video Mixer, etc.).  
   - Confirm capture/camera → SCapps is working (or that your bridge app is feeding them).

4. **Control (Edirol + frZone)**  
   - Move each **Edirol** fader/knob on the **video-control channel** and watch the bridge / SCapps respond.  
   - Play audio and confirm **frZone** shows activity and is issuing CC on its analysis channel.

5. **Safety**  
   - Verify you have a reliable **blackout / safe scene** you can trigger instantly.  
   - After the set, jot any weirdness in `notes/` so it can feed back into the docs.

Once those five are green, you can start pushing things into the red.

---

## Mental model

Three lanes, one rig:

- **Audio lane**  
  Sources → mixer → Horizon / other FX → PA / recording.  
  frZone and LineLight tap a post-fader bus here to “listen” to the mix.

- **Control lane**  
  REAPER sends clock to DrumKid.  
  SQ-64 and AE rack handle voices.  
  Edirol sends visual macros.  
  frZone sends analysis CCs.

- **Video lane**  
  Capture / camera feed flows into a chain of **Signal Culture modular video apps** (“SCapps”).  
  These are **video endpoints**:
  - They receive video (capture / Syphon)  
  - They receive control (MIDI/OSC) from Edirol and frZone  
  - They do *not* own the global logic; they just react beautifully.

This repo describes how those three lanes weave together for different shows and projects.

---

## File map (what lives where)

These are the files currently in the repo and their jobs:

- `01_system-overview.md`  
  Big-picture map of the rig: audio, MIDI, and video lanes, plus where SCapps sit.

- `02_audio-mixer-fx.md`  
  Mixer channel layout, FX loop, how Horizon sits on the master bus, and how frZone / LineLight tap the audio.

- `03_midi-clock-video.md`  
  Clock topology and MIDI routing, including which device runs clock (REAPER → DrumKid), and how Edirol / frZone feed the video lane.

- `04_scapps-overview.md`  
  Overview of the SCapps in use (Frame Buffer, Maelstrom, SC Video Mixer, etc.):  
  what each app does, what it expects for video in, and what MIDI/OSC it listens to.

- `05_scapps-rigs.md`  
  “Whole-world” video setups: which SCapps are chained together for a given set or EP, and how Edirol’s controls are mapped for each rig.

- `06_frzone-linelight.md`  
  How frZone and LineLight listen to the audio bus, what CCs frZone emits, and how those CCs bias SCapps parameters.

- `07_show-2025-12-15-basement-noise.md`  
  A specific basement show plan: cabling, minimal rig choices, and one-off routing notes.

- `08_midi-mapping-2025-03-15-basement-noise.md`  
  MIDI / OSC mapping sheet for that set: which controls go where for that particular performance.

- `ep-i-hope-the-sky-will-still-take-us/`  
  EP-specific notes, mappings, and rig snapshots connected to *i hope the sky will still take us*.

- `notes/`  
  Scratch questions, experiments, troubleshooting logs, and post-show notes that should eventually feed back into the main docs.

---

## MIDI channel grammar

This is the **default** mental model for channels. Per-show files can override, but treat this as home base.

### System realtime (no channel)

- **REAPER → DrumKid**: clock, start, stop  
- DrumKid may forward clock to SQ-64 and other devices.

### Device → channel summary

| Device         | Role                             | MIDI Ch | How it’s used now                                            |
|----------------|----------------------------------|:-------:|---------------------------------------------------------------|
| DrumKid        | Clock target + drums             |   —     | Listens to realtime clock; drives drum audio; can fan clock. |
| SQ-64          | Main sequencer                   | varies  | Sends notes/gates; AE rack on its track set to Ch 16.        |
| AE Rack        | Modular voices                   |   16    | Receives note/gate patterns from SQ-64.                      |
| Edirol PCM-30  | Visual “mission control”         |   10    | Faders/knobs/buttons send CC/notes to bridge → SCapps.       |
| frZone         | Audio analysis → CC              |   15    | Emits CCs (bands) for SCapps to use as modulation.           |
| Horizon        | Master FX / bus processor        |   —     | Front-panel for now; Ch 9 mentally reserved for future MIDI. |
| Lo-Fi Sampler  | Clocked audio texture            |   —     | Audio + clock in; no CC/note I/O yet.                        |
| LineLight      | Audio-reactive lamp              |   —     | Follows an audio bus; no MIDI.                               |
| SCapps         | Video processing chain (endpoint)|   n/a   | Receive video + CC/OSC from Edirol (Ch 10) & frZone (Ch 15). |
| REAPER (DAW)   | Hub / router                     |   n/a   | Sends clock to DrumKid, routes audio and MIDI.               |

### Channel 10 – Visual macros (Edirol)

- **Source**: Edirol PCM-30 (faders, knobs, buttons)  
- **Destination**: bridge (TD/Max/etc.) → SCapps

Conceptually:

- Faders: **big moves** (clean ↔ processed, feedback amount, tunnel depth, etc.)
- Knobs: **fine shape** (micro-glitch, warp, hue, bias between analysis and manual control)
- Buttons: **hard switches** (harsh scene, soft scene, blackout)

The exact CC/Note map for each show lives in `03_midi-clock-video.md` and `05_scapps-rigs.md`.

### Channel 15 – Analysis lane (frZone)

- **Source**: frZone, listening to a post-fader bus from the mixer.  
- **Destination**: SCapps.

Typical mapping:

- CC 20 = low band (bass energy)  
- CC 22 = mid band  
- CC 23 = upper-mid band  
- CC 24 = high band

SCapps (via the bridge) treat these as gentle bias inputs; Edirol’s macros ride on top.

### Channel 16 – AE rack voices

- **Source**: SQ-64 track configured for Ch 16  
- **Destination**: AE rack voices

Keeps the modular’s note lane clearly separated from the visual control lanes.

### Channel 9 – Reserved for Horizon (future)

- Planned for any future Horizon MIDI:
  - scene select  
  - tilt / width / fold  
  - wet/dry

Keeping one channel mentally reserved now avoids future routing chaos.

---

## REAPER-specific notes

You don’t need a full how-to here, just a few anchors:

- **MIDI Devices**  
  - Enable DrumKid as an output and turn on **Send clock/SPP**.  
  - Enable a virtual port (IAC / loopMIDI) for sending Edirol/analysis CCs into the bridge → SCapps.

- **Audio buses**  
  - Use a post-fader send from the master or a submix bus to feed frZone / LineLight.  
  - If REAPER is feeding SCapps audio directly (for capture/feedback), document that routing in `02_audio-mixer-fx.md` or `04_scapps-overview.md`.

If you change those assumptions later, update this block and the relevant per-file notes.

---

## How to grow this repo

For each new show / project:

1. Duplicate the latest `07_show-…` and `08_midi-mapping-…` files as a starting point.  
2. Adjust only what really changes:
   - which devices are on the table,
   - which SCapps rig you’re running,
   - any special cabling or safety constraints.
3. After the show, drop quick notes in `notes/` and then:
   - update `01_system-overview.md` if the rig itself has evolved, or  
   - update `03_midi-clock-video.md` / `04_scapps-overview.md` if the logic has shifted.

The goal isn’t to keep this perfectly pristine; it’s to give future-you a **single page of clarity** before you start plugging things in and turning them up.
