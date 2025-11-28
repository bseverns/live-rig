# 08 – MIDI / OSC / Param Mapping – 2025-03-15 Basement Noise

## 1. Global CC Map

> Goal: keep a small but expressive set of “macro” controls that don’t collide.

| Function                        | Device / Source | Ch | CC/Note | Target param                                  | Range / Notes                                      |
|---------------------------------|-----------------|----|---------|-----------------------------------------------|----------------------------------------------------|
| Master visual glitch amount     | VIS_CTRL        | 10 | CC 21   | Interstream “mosh intensity” + VidMix stutter | 0–127 → none → subtle → full melt                  |
| Master video feedback           | VIS_CTRL        | 10 | CC 22   | FrameBuffer feedback                          | 0–127 → clean → deep trails                        |
| Geometry orbit / camera (future)| VIS_CTRL        | 10 | CC 23   | VMass/ReTrace orbit (not used this show)      | Reserved                                           |
| Horizon scene select (future)   | VIS_CTRL        | 9  | CC 10   | Horizon scene recall via DAW macro            | Reserved for later rev                             |
| DiceLoop feedback density       | — (not present) | —  | —       | —                                             |                                                    |
| frZone low-band → trails        | frZone          | 15 | CC 20   | FrameBuffer feedback (slow mod)               | 0–127 mapped to 0.0–0.8 feedback                   |
| frZone mid-band → maelstrom     | frZone          | 15 | CC 22   | Maelstrom depth / radius                      | 0–127 mapped to 0.0–0.7                            |
| frZone high-band → mosh         | frZone          | 15 | CC 24   | Interstream mosh intensity (slow underlying)  | layered with VIS_CTRL CC 21                        |

Notes:

- Ch **10** = VIS_CTRL “performance macros”.  
- Ch **15** = frZone “analysis lane” (don’t use it for anything else).  
- Where both VIS_CTRL and frZone touch the same parameter (e.g. Interstream mosh), VIS_CTRL CC is a **performer macro**, frZone CC is a slower underlying bias.

---

## 2. frZone Band Mapping

> Using 5 bands, tuned for this “noise night” profile.

| Band | Freq Range (approx) | CC  | Note | Mapped To                                       | Behavior / Notes                                              |
|-----:|----------------------|-----|------|-------------------------------------------------|---------------------------------------------------------------|
| 0    | 30–120 Hz            | 20  | 36   | FrameBuffer feedback                            | Low thumps / subs deepen video trails                         |
| 1    | 120–500 Hz           | 21  | 38   | (unused for now)                                | Available later for additional shaping                        |
| 2    | 500–2k Hz            | 22  | 40   | Maelstrom depth / tunnel radius                 | Busy midrange (voices, snares, FM) pull visuals “into tunnel” |
| 3    | 2k–6k Hz             | 23  | 42   | ReTrace density (when that scene is active)     | Wireframe fills in more as upper mids get busier              |
| 4    | 6k–12k Hz            | 24  | 44   | Interstream mosh intensity (slow underlying amt)| High fizz/noise slowly biases more glitch                     |

- **Channel:** 15 for all frZone CC/Note output.
- **Notes:**  
  - 36/38/40/42/44 are also available as **momentary “hit” triggers** in DAW/bridge patches if needed (e.g., to fire one-shot events on strong peaks).  
  - For this show, main focus is CC 20, 22, 24.

---

## 3. Device-Specific Mapping

### 3.1 Visual Controller (VIS_CTRL)

> Placeholder for whatever USB MIDI controller keyboard / knob box you bring.

Assumptions:
- Connected via USB to Mac.
- Exposed in DAW / TD / Max as `VIS_CTRL` MIDI device.
- We use Ch 10 for visual macros so audio gear can stay on other channels.

| Control / Key / Knob     | Ch | Note/CC | Target (SC / DAW / etc.)                    | Notes                                        |
|--------------------------|----|---------|---------------------------------------------|----------------------------------------------|
| Knob 1                   | 10 | CC 21   | Master visual glitch macro                  | Drives Interstream mosh + VidMix stutter     |
| Knob 2                   | 10 | CC 22   | Master video feedback macro                 | Drives FrameBuffer feedback                  |
| Knob 3                   | 10 | CC 23   | Geometry / orbit macro (future)             | For VMass/ReTrace scenes                     |
| Button / Pad 1           | 10 | Note 60 | Cut to “crash/glitch” VidMix scene          | TD/Max maps Note 60 → scene index            |
| Button / Pad 2           | 10 | Note 61 | Cut to “clean” VidMix scene                 | TD/Max maps Note 61 → scene index            |
| Button / Pad 3           | 10 | Note 62 | Optional: blackout / hard cut to black      |                                              |
| Extra keys 63–72         | 10 | Notes   | Optional: trigger visual one-shots / motifs | map as needed per show                       |

### 3.2 DrumKid (for sync)

- DrumKid receives **MIDI clock + start/stop** from DAW.  
- Important: clock/start/stop are **system realtime messages**, not channelized, so they **do not conflict** with Ch 10 CCs from VIS_CTRL.  
- DrumKid’s current firmware does **not** listen for arbitrary CCs, so VIS_CTRL macros are safe.

### 3.3 Horizon

For this show, Horizon stays **panel-driven**; no external MIDI.  
Still, we reserve a future lane so we don’t step on it later.

| Control                  | MIDI? | Ch | CC/Note | Meaning in rig (if automated)           |
|--------------------------|-------|----|---------|-----------------------------------------|
| Scene A/B/C select       | No    | —  | —       | Switched manually at front panel        |
| Tilt / Air               | No    | —  | —       | Left for hands-on feel                  |
| Width / DynWidth         | No    | —  | —       | Hands-on, no CC this show               |
| Brick ceiling / limiter  | No    | —  | —       | Fixed for headroom                      |

If later you want, you could standardize Horizon on **Ch 9** for any future automation, and keep that reserved in this doc.

### 3.4 SCApps

Treat the SCApps side as receiving a small number of CCs and frZone streams via a bridge (Max/TD).

| App        | Parameter                   | Controlled by                      | Addr/CC         | Notes                                                  |
|------------|-----------------------------|------------------------------------|-----------------|--------------------------------------------------------|
| FrameBuffer| Feedback                    | frZone Band 0 (CC 20, Ch 15)       | `/fb/feedback`  | VIS_CTRL CC 22 adds/subtracts on top                   |
| FrameBuffer| Delay length                | (manual in UI)                     | —               | Leave static per scene for this show                   |
| Maelstrom  | Depth / radius              | frZone Band 2 (CC 22, Ch 15)       | `/mael/depth`   | Drives “tunnel” feeling in Piece 2 / 4                 |
| ReTrace    | Point/line density          | frZone Band 3 (CC 23, Ch 15)       | `/retr/density` | Only used in Scene “Wireframe Choir”                   |
| Interstream| Mosh intensity              | VIS_CTRL CC 21 + frZone CC 24      | `/inter/mosh`   | VIS_CTRL is main control; frZone is slow bias          |
| VidMix     | Clean ↔ processed crossfade | VIS_CTRL CC 21                      | `/vidmix/xFade` | Link this to same macro as glitch for simplicity       |
| VidMix     | Scene A/B toggle            | VIS_CTRL Note 60 / 61              | `/vidmix/scene` | 60 = crash scene, 61 = clean scene                     |

---

## 4. Per-Show Overrides

> Differences from your future “global” map, specific to this basement noise night:

- DrumKid is tempo master; Mac is **not** sending MIDI clock to other gear.  
- No MIDI on Horizon yet; scenes changed by hand.  
- DiceLoop not present, so its usual CC lanes are free.  
- VMass and SSSScan not in use; any global CCs for them are ignored tonight.  
- VIS_CTRL Ch 10 CC 21/22 are allowed to be a bit “wild” — no safety clamp yet; trust the room and use ears + Horizon limiter.

Things to revisit after the show:

- Did frZone CC 24 (high band → mosh) feel too aggressive layered with the VIS_CTRL glitch macro?  
- Did any of the CCs feel redundant or unused? Consider trimming for next show.  
- Would it be helpful to add one simple **“visual blackout”** Note or CC from VIS_CTRL for hard cuts to black?

---

## 5. Per-Piece Mapping Snapshot (Basement Noise Night)

### Piece 1 – “Open Hum”

- **Audio focus:**  
  Radios + cassette drone → pedalboard → AE textures. DrumKid comes in late.
- **Visual scene:**  
  “Echo Tunnel (Soft)” – FrameBuffer only, very long trails, water/light clips.  
- **frZone usage:**
  - Band 0 (low) → FrameBuffer feedback (CC 20, Ch 15)  
    - Low, slow drones gradually deepen trails as the piece develops.
  - Other bands mapped but kept subtle; only Band 0 really matters here.
- **VIS_CTRL usage:**
  - CC 21 (glitch macro) ≈ 0 (no glitch yet).
  - CC 22 (feedback macro) gently nudged near the end to thicken trails.
- **Horizon:**
  - Horizon Scene H1 “Clean Glue” – transparent limiting / subtle width.

---

### Piece 2 – “Crash Bloom”

- **Audio focus:**  
  SQ-64 driving Volca + AE, E2S percussion/stabs, Microgranny hits.  
- **Visual scene:**  
  “Crash Bloom” – FrameBuffer + Interstream via VidMix (time + glitch bus).  
- **frZone usage:**
  - Band 0 (low) → FrameBuffer feedback (CC 20, Ch 15)  
    - Kick/bass thumps deepen echoes.
  - Band 2 (mid) → Maelstrom depth (CC 22, Ch 15)  
    - Midrange density pulls image into tunnels during busy patterns.
  - Band 4 (high) → Interstream underlying mosh (CC 24, Ch 15)  
    - Hi-hats/noise gently bias more glitch even when macro is low.
- **VIS_CTRL usage:**
  - CC 21 (Ch 10): **main visual glitch macro** for Interstream + VidMix stutter.  
    - Mid-piece: sweep CC 21 up for “crash bloom” burst, then pull back.
  - CC 22 (Ch 10): pushes FrameBuffer feedback for denser trails around the burst.
  - Notes 60/61 (Ch 10):  
    - 60 → cut to “full crash/glitch” scene in VidMix.  
    - 61 → cut back to cleaner scene.
- **Horizon:**
  - Start in H1 “Clean Glue”, briefly flip to H3 “Clamp & Crunch” during the most extreme section, then back.

---

### Piece 3 – “Wireframe Choir”

- **Audio focus:**  
  GreyBox + Zen box + Microgranny loops; more midrange and voice-like tones.
- **Visual scene:**  
  “Wireframe Choir” – ReTrace-heavy scene (wireframes of live cam + one clip).
- **frZone usage:**
  - Band 2 (mid) lightly → ReTrace rotation or depth (optional).
  - Band 3 (upper mid) → ReTrace density (CC 23, Ch 15)  
    - As the “choir” gets denser in that band, wireframe fills in / grows.
- **VIS_CTRL usage:**
  - CC 21/22 mostly at neutral/low; this piece is more **structured** and less glitchy.
  - Could tap a pad to briefly flip to a more chaotic wireframe setting, but default is calm, slowly breathing geometry.
- **Horizon:**
  - H2 “Wide & Airy” – let stereo image and high-end breathe more for harmonic content.

---

### Piece 4 – “Basement Drone Out”

- **Audio focus:**  
  AE + Volca self-oscillation, slow filter sweeps, tape loop from cassette.
- **Visual scene:**  
  “Tunnel Drone” – Maelstrom tunnel + FrameBuffer trails, low-band emphasis.
- **frZone usage:**
  - Band 0 (low) → FrameBuffer feedback (CC 20, Ch 15)  
    - Slow, heavy drones = deeper tunnel echoes.
  - Band 2 (mid) → Maelstrom depth (CC 22, Ch 15)  
    - Filter sweeps gently change how “deep” the tunnel appears.
  - High band (Band 4) mostly ignored here; keep glitch minimal near the end.
- **VIS_CTRL usage:**
  - CC 21 (glitch) stays near 0 – end should feel more **immersive** than broken.
  - CC 22 may rise slightly to exaggerate tails in the last minute.
- **Horizon:**
  - Mostly H1 “Clean Glue” but may push into H3 “Clamp & Crunch” if the drone gets out of hand; use limiter as safety net for the room.

---

### Quick Cross-Reference Table

| Piece               | Visual Scene         | Key Apps                 | Main frZone Bands Used      | Main Macros Used      |
|---------------------|---------------------|--------------------------|-----------------------------|-----------------------|
| Open Hum            | Echo Tunnel (Soft)  | FrameBuffer              | Band 0 → FB feedback        | VIS_CTRL CC 22 (small)|
| Crash Bloom         | Crash Bloom         | FB + Interstream+Mael    | 0 → FB, 2 → Mael, 4 → mosh  | VIS_CTRL CC 21/22     |
| Wireframe Choir     | Wireframe Choir     | ReTrace                  | 3 → ReTrace density         | VIS_CTRL CC 21/22 low |
| Basement Drone Out  | Tunnel Drone        | FB + Maelstrom           | 0 → FB, 2 → Mael            | VIS_CTRL CC 22 subtle |
