# 03 – MIDI, clock & video control

This document pins down:

- Who is the **clock boss**.
- Which device lives on which **MIDI channel**.
- How control reaches the **video lane** (via the bridge and SCapps).
- What REAPER needs to be doing so the whole thing behaves.

It’s the “how timing and control move” counterpart to `02_audio-mixer-fx.md`.

---

## Clock topology

**Current assumption:** REAPER is the transport brain.

- **REAPER**:
  - Runs the timeline.
  - Sends **MIDI clock + Start/Stop** to DrumKid.
- **DrumKid**:
  - Receives clock.
  - Plays its patterns/fills.
  - Can pass clock to other devices if you configure it that way.
- **SQ-64**:
  - Can be a clock follower (from DrumKid) or directly from REAPER,
  - But the **permanent assumption** is: *one* master at a time.

### REAPER configuration (clock)

In REAPER:

1. `Preferences → Audio → MIDI Devices`
   - Enable output to `DrumKid` (or whatever the interface labels that port).
   - Right-click that output → enable:
     - **“Enable output”**
     - **“Send clock/SPP to this device”**
2. If you use a virtual MIDI port (IAC / loopMIDI) for visuals:
   - Enable that as an output too (for CC/notes to the bridge → SCapps).
   - **Do not** send clock to SCapps unless you have a specific need.

Start/Stop:

- Use REAPER’s transport as normal.
- DrumKid starts/stops with the DAW.
- Any other gear that needs transport messages should get them *indirectly* (via DrumKid or secondary routing), unless a show doc explicitly states otherwise.

---

## MIDI channel layout (canonical)

This is the “default grammar” the rest of the rig assumes.

**Realtime (no channel)**

- REAPER → DrumKid: **Clock / Start / Stop**
- DrumKid → optional followers: clock only.

**Channel summary**

| Device        | Role                     | Ch  | Notes                                           |
|---------------|--------------------------|:---:|-------------------------------------------------|
| DrumKid       | Clock target + drums     | —   | Listens to realtime clock only.                 |
| SQ-64         | Main sequencer           | var | Tracks set per-project; AE on 16.               |
| AE Rack       | Modular voices           | 16  | Receives note/gate patterns from SQ-64.         |
| Edirol PCM-30 | Visual “mission control” | 10  | Faders/knobs/buttons → video macros.            |
| frZone        | Audio analysis → CC      | 15  | Band-split CCs; “slow hands” for visuals.       |
| Horizon       | Master FX                | —   | Front panel only (Ch 9 reserved for later).     |
| Lo-Fi Sampler | Clocked texture          | —   | Clock in only; no MIDI CC/note yet.             |
| LineLight     | Audio lamp               | —   | Driven by audio only.                           |
| SCapps        | Video endpoints          | n/a | Receive MIDI/OSC from bridge, not directly.     |

These values are echoed in the README and in `01_system-overview.md` so you don’t have to memorize them.

---

## Channel 10 – Edirol video macros

Channel 10 is the **human hand** into the video rig.

- **Source**: Edirol PCM-30 (faders, knobs, buttons).
- **Destination**: REAPER / bridge → SCapps (via MIDI or OSC).

Typical conceptual mapping:

- **Faders**: big moves
  - Clean ↔ processed mix.
  - Frame Buffer feedback amount.
  - Maelstrom tunnel depth.
  - Interstream mosh intensity.
  - ReTrace line density.
  - Global gain / contrast.
  - Per-show special.
  - Master blackout / “safe” level.

- **Knobs**: fine shape
  - Micro-glitch amount.
  - Fine feedback.
  - Warp / twist / rotation.
  - Wireframe jitter.
  - Texture detail (VMass).
  - Blend: analysis (frZone) vs manual macros.
  - Global hue / color shift.
  - Per-show special.

- **Buttons** (notes, e.g. 60–63):
  - Crash / harsh scene.
  - Soft / clean scene.
  - Clean camera scene.
  - Full blackout.

### Routing to bridge / SCapps

Two basic approaches:

1. **REAPER as MIDI router**
   - Edirol → REAPER track (`Edirol Control`).
   - Track output → virtual MIDI port (`IAC / loopMIDI`).
   - Bridge / SCapp host listens on that virtual port, Ch 10.

2. **Direct to bridge**
   - Edirol → bridge host directly (if it has its own MIDI handling).
   - In that case, REAPER only cares about clock and audio.

Document which mode you’re using per project in:

- `05_scapps-rigs.md` (for the visual chain + mappings), and
- `07_show-…` (for one-off quirks).

---

## Channel 15 – frZone analysis lane

Channel 15 is where **the mix itself** nudges the visuals.

- **Source**: frZone, listening to a post-fader bus from the mixer.
- **Destination**: bridge → SCapps.

Stable mapping:

- **CC 20** – Low band (kick / bass energy).
- **CC 22** – Mid band (snare, main body of mix).
- **CC 23** – Upper mids (presence; harshness / texture).
- **CC 24** – Highs (cymbals, hiss, sparkle).

The bridge / scene engine (see `09_scene-system.md`) uses these to bias parameters like:

- Frame Buffer feedback,
- Maelstrom depth,
- ReTrace density,
- Interstream mosh and VMass detail.

Scene definitions control how strongly these CCs matter via an `analysis.weight` value per scene.

---

## Channel 16 – AE Rack voices

Channel 16 is a **pure note/gate lane**.

- **Source**: dedicated SQ-64 track (Ch 16).
- **Destination**: AE Rack voices.

No visuals or analysis run on this channel; that’s deliberate so the modular’s musical logic doesn’t get tangled with the video logic.

---

## Bridge and SCapps

The bridge (Max, TouchDesigner, REAPER script, etc.) is the **translator** between MIDI land and SCapps.

Responsibilities:

- Listen to:
  - Ch 10 (Edirol macros and scene triggers).
  - Ch 15 (frZone analysis).
- Apply:
  - Scaling, smoothing, and dead-zones as needed (so visuals don’t jitter).
  - Scene selection logic tied to Edirol buttons.
- Forward:
  - Clean, meaningful control signals to SCapps:
    - via OSC,
    - or via their built-in MIDI support.

SCapps themselves:

- Receive video in (camera capture / REAPER output / clip playback).
- Receive control (from the bridge).
- Render to projector / screens.

They never need to know where the clock comes from; they just see a stream of control data.

---

## REAPER: MIDI routing patterns

Minimal REAPER track layout that fits this doc:

1. **Track: `Clock Master`**
   - No input.
   - Used only as a visual anchor; REAPER’s transport is the actual master.

2. **Track: `Edirol Control` (optional)**
   - Input: Edirol MIDI device.
   - Record: off (or MIDI if you want logs).
   - Output: **virtual MIDI port** (`IAC / loopMIDI`), Ch 10.
   - Purpose: route Edirol CC/notes to the bridge / SCapps.

3. **Track: `frZone Monitor` (optional)**
   - Input: the same interface input frZone sees (or its return).
   - For metering; no MIDI.

4. **Track: `Bridge / SCapps`**
   - If the bridge lives in REAPER (JSFX, plugin, etc.), you can host it here.
   - Otherwise, this track can just serve as a meter / label that reminds you what is talking to what.

If you change the layout/logic, update this file so future-you isn’t guessing.

---

## Expansion notes

Some planned growth slots:

- **Channel 9 – Horizon (future)**
  - When/if you add MIDI control to Horizon:
    - Use Ch 9.
    - Add a dedicated section to this file describing:
      - Scene select,
      - Tilt / width / fold,
      - Global wet/dry.

- **Lo-Fi Sampler I/O**
  - If the sampler firmware gains MIDI:
    - Outgoing: give it a dedicated channel (e.g. 11) for possible visual “blips”.
    - Incoming: keep it mostly to clock and a few CCs to avoid clutter.

- **Alternate visual controllers**
  - If the Edirol PCM-30 leaves the rig, keep **Channel 10** as the visual control lane.
  - Swap only the device and its own map, not the channel grammar.

---

## What to change where

- If you move devices between channels or substantially change routing:
  - Update this file **and** the README MIDI cheatsheet.

- If you only change mappings for a specific show:
  - Leave this file alone.
  - Update the relevant:
    - `05_scapps-rigs.md` (for the visual chain), and
    - `08_midi-mapping-…` (for that show’s exact CC/Note map).

This document should feel like the **stable legend** for the whole control + video system: once it’s right, you shouldn’t have to touch it very often.
