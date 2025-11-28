# live-rig

Working notes, diagrams, and planning docs for a hybrid audio–video live rig.

This repo collects:

- Signal-flow and MIDI diagrams (audio, MIDI, video, analysis).
- Per-show planning sheets.
- Mapping docs for visual controls and analysis (Edirol PCM-30, frZone, SCApps).
- Scratch space for troubleshooting and post-show notes.

The idea is that future-you can walk into a venue, open this repo, and know:
- what plugs into what,
- which device lives on which MIDI channel,
- and how the visuals are being driven.

---

## Files

- `01_audio-routing.md` – mixer, pedals, FX loop, Horizon, LineLight, etc.
- `02_video-signal.md` – SCApps chains, cameras, projectors.
- `03_midi-clock-video.md` – clock topology + MIDI channel plan + mermaid diagram.
- `04_frZone-mapping.md` – band splits → CCs → visual parameters.
- `05_linelight-notes.md` – how the lamp taps the audio and what it’s “saying”.
- `06_show-templates.md` – generic show / mapping templates.
- `07_show-2025-03-15-basement-noise.md` – specific basement show plan.
- `08_midi-mapping-2025-03-15-basement-noise.md` – matching MIDI/OSC mapping for that show.
- `notes/` – scratch questions, routing experiments, post-show notes, etc.

(Names may drift over time; this is the intended structure.)

---

## MIDI Channel Cheatsheet

Snapshot for the current “basement noise night” ecosystem.  
Use this as the quick reference when patching at a venue.

System realtime (no channel):

    DAW → DrumKid  [Clock, Start, Stop]
    (DrumKid can then fan clock out to SQ-64 or other gear as desired.)

### Device → Channel Summary

| Device              | Role                        | MIDI Channel | How it’s used now                                        |
|---------------------|-----------------------------|-------------:|----------------------------------------------------------|
| DrumKid             | Clock master (this show)    | —            | Listens to system realtime (clock/start/stop only).     |
| SQ-64               | Main sequencer              | varies       | Sends notes/gates; AE Rack is on its track set to Ch 16 |
| AE Rack             | Modular voices              | 16           | Receives note/gate patterns on Channel 16 from SQ-64    |
| Edirol PCM-30       | Visual “mission control”    | 10           | Faders/knobs send CC 1–8 & 21–28 to TD/Max → SCApps     |
| frZone              | Audio analysis → CC         | 15           | Sends CC 20, 22, 23, 24 (bands) to SCApps               |
| Horizon             | Master FX / bus processor   | —            | Front-panel only (no MIDI yet; Ch 9 reserved for later) |
| Lo-Fi Sampler       | Clocked audio texture       | —            | Audio only + MIDI clock in (no CC/note I/O yet)         |
| LineLight           | Audio-reactive lamp         | —            | Follows audio; no MIDI                                  |
| SCApps              | Video processing chain      | n/a          | Receive CCs/OSC from Edirol (Ch 10) + frZone (Ch 15)    |
| Mac / DAW / bridge  | Hub / router                | n/a          | Sends clock to DrumKid, aggregates MIDI for visuals     |

---

## Channel Roles (At A Glance)

### System realtime (no channel)

- DAW → DrumKid: clock, start, stop  
- DrumKid can optionally pass clock along to SQ-64 or other devices.

### Channel 10 – Visual Macros

- Source: **Edirol PCM-30 faders/knobs/buttons**
- Destination: TD/Max bridge → SCApps parameters

Conceptual use:

- Faders (CC 1–8): “big moves”
  - VidMix crossfade (clean ↔ fully processed)
  - FrameBuffer feedback
  - Interstream mosh / glitch amount
  - Maelstrom depth / tunnel feel
  - ReTrace density / line count
  - Global visual contrast / gain
  - Per-show special
  - Master blackout / safe level

- Knobs (CC 21–28): “fine shape”
  - Fine glitch / micro-mosh
  - Fine feedback / pre-feedback
  - Tunnel warp / twist / rotation
  - Wireframe looseness / jitter
  - Texture detail (future SSSScan/VMass/etc.)
  - Blend between frZone (analysis) and manual control
  - Global hue / color shift
  - Per-show special

- Buttons (e.g. notes 60–62):
  - Crash/glitch scene select
  - Clean/soft scene select
  - Blackout

### Channel 15 – Analysis Lane (frZone)

- Source: **frZone** (listens to audio mix)
- Destination: SCApps

Suggested mapping:

- CC 20 = low band → FrameBuffer feedback bias  
- CC 22 = mid band → Maelstrom depth bias  
- CC 23 = upper-mid band → ReTrace density bias  
- CC 24 = high band → Interstream mosh bias  

The Edirol’s macros then “ride on top” of these biases for performance gestures.

### Channel 16 – AE Rack

- Source: SQ-64 track configured for Channel 16
- Destination: AE Rack voices (notes/gates)

This keeps the modular clearly separated from the visual control lanes.

---

## Expansion Notes

- **Horizon automation**
  - When you’re ready, standardize on **Channel 9** for any future Horizon CCs (scene select, tilt, width).
  - This README and the other docs mentally reserve that channel for “master FX control.”

- **Lo-Fi Sampler MIDI (future)**
  - If/when the lo-fi firmware gets MIDI I/O:
    - Outgoing: choose a dedicated channel (e.g., 11) for pad-triggered visual events.
    - Incoming: keep it mostly clock-only or restrict to a few safe CCs to avoid conflicts.

- **Alternate controllers**
  - If the Edirol is ever swapped out, keep **Channel 10** as “visual mission control” and just revise the per-device mapping doc.
  - The rest of the channel grammar (15 = analysis, 16 = AE, 9 reserved for Horizon) can remain stable.

---

For other shows, you can either:

- Keep this README as the “canonical” channel grammar and adapt only the show-specific files (`07_...`, `08_...`), or  
- Fork a custom README variant per show if the channel layout needs to diverge.

Either way, this gives you a single-screen memory jog of what lives where in the current rig.
