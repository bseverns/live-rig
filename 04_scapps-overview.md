# 04 – SCapps overview

This document is a **field guide** to the Signal Culture modular apps (“SCapps”) as they are used in this rig.

It answers:

- What each app does *in this context*.
- What its **inputs/outputs** are.
- Which parameters are under:
  - scene control (from the scene engine),
  - analysis control (frZone, Ch 15),
  - and live control (Edirol, Ch 10).

It is not a full manual; it’s a focused view for this live system.

---

## Common roles and conventions

Across all SCapps in this rig:

- **Video input** usually comes from:
  - a camera / capture chain, or
  - pre-rendered clips / DAW output.

- **Video output** usually goes into:
  - **SC Video Mixer**, and then
  - to the projector / screen.

- **Control input** arrives as:
  - OSC or MIDI CC converted to normalized 0–1 values.
  - Source lanes:
    - **Ch 10** – Edirol: macro gestures, scene triggers.
    - **Ch 15** – frZone: analysis bias from the audio mix.

Naming conventions in docs:

- `scene_base.*` – parameters set by scene system (`09_scene-system.md` + `scenes/*.yaml`).
- `analysis.*` – parameters biased by frZone (Ch 15).
- `macro.*` – parameters ridden live from Edirol (Ch 10).

---

## SC Video Mixer (SCVM)

**Role:**  
The **traffic cop** for video worlds. It decides which chain (or clean feed) is visible and how they blend.

Typical usage in this rig:

- **Input 1** – Chain A: `Camera → Frame Buffer → Maelstrom → (optional Interstream)`.
- **Input 2** – Chain B: `Camera → ReTrace → VMass → (optional Interstream)`.
- **Input 3** – Clean camera / clean source.
- **Input 4** – Black / utility / text overlays.

Key parameters we care about:

- `input1_level` (0–1)
- `input2_level`
- `input3_level`
- `input4_level`
- `wipe_mode` / `wipe_depth` (if used)
- `fade_time` (for crossfades)

Control:

- **Scene system**:
  - Sets **base levels** per scene (e.g. `SOFT_ASH` = 0.8 on Input1, 0.2 on Input2).
- **Edirol (Ch 10)**:
  - One fader reserved as `macro.vmix_morph`:
    - crossfades between current scene’s A/B balance and a more extreme mix.
- **frZone (Ch 15)**:
  - May add subtle fluctuations to `input1_level` vs `input2_level` based on low/mid energy.

This is the primary place where scene changes are felt as **world shifts**.

---

## Frame Buffer

**Role:**  
Delay, feedback, and keying; the app that gives you **echoing ghosts** and feedback trails.

Typical chain position:

- Near the **front** of Chain A: `Camera → Frame Buffer → Maelstrom`.

Key parameters in this rig:

- `feedback` (0–1) – amount of visual memory.
- `key_softness` (0–1) – how soft/hard the key/threshold is.
- `offset` / `shift` parameters (if used for drift).

Control:

- **Scene system**:
  - Sets base `feedback` and `key_softness` per scene.
  - Soft scenes → lower feedback, higher softness; harsh scenes → opposite.
- **frZone (Ch 15)**:
  - Low band (CC 20) typically biases `feedback`:
    - louder bass → slight push toward more echo.
- **Edirol (Ch 10)**:
  - One fader or knob mapped as `macro.fb_feedback`:
    - allows pushing feedback into runaway territory or pulling it back to almost clean.
  - Optional fine control of key softness (`macro.fb_softness`).

Frame Buffer is where the **echo of time** lives; treat it like a reverb tail for image.

---

## Maelstrom

**Role:**  
Tunnel, vortex, and spatial deformation; the app that pulls image into **spirals and wells**.

Typical chain position:

- After Frame Buffer on Chain A:
  - `Camera → Frame Buffer → Maelstrom → (→ Interstream)`

Key parameters in this rig:

- `depth` / `zoom` (0–1) – how deep you fall into the tunnel.
- `rotation` (−1..1 or 0–1 wrapped) – spin of the tunnel.
- `warp` / `distortion` if available.

Control:

- **Scene system**:
  - Sets base `depth` and `rotation` per scene.
- **frZone (Ch 15)**:
  - Mid band (CC 22) biases `depth`:
    - busier midrange → more tunnel.
- **Edirol (Ch 10)**:
  - One fader: `macro.mael_depth` – big gestures for falling in/out.
  - One knob: `macro.mael_spin` – direction + speed of rotation.

Maelstrom is where **structure bends**; keep its patch simple enough that controls remain intuitive in performance.

---

## ReTrace

**Role:**  
Line-based re-drawing, contour emphasis; turns image into **traced outlines and paths**.

Typical chain position (Chain B):

- `Camera → ReTrace → VMass → (→ Interstream)`

Key parameters:

- `density` (0–1) – how many lines are drawn.
- `thickness` or `line_width`.
- `threshold` / `sensitivity` – what qualifies as an edge.
- Any `jitter` / `randomness` option.

Control:

- **Scene system**:
  - Sets base `density` and threshold per scene.
- **frZone (Ch 15)**:
  - Upper-mid band (CC 23) biases `density`:
    - more presence → more lines, more agitation.
- **Edirol (Ch 10)**:
  - Fader: `macro.retrace_density` – push all the way to “everything is lines”.
  - Knob: `macro.retrace_jitter` – how much the lines wiggle.

ReTrace is the place where things become **drawn**, a sketched memory of what’s underneath.

---

## VMass (and similar texture apps)

**Role:**  
Texture and volumetric feel; adds **grain, weight, and motion fields**.

Typical chain position:

- After ReTrace on Chain B:
  - `Camera → ReTrace → VMass → (→ Interstream)`

Key parameters:

- `mass_amount` (0–1) – intensity of the effect.
- `detail` (0–1) – fine texture vs broad blobs.
- `flow_rate` (if available) – how quickly mass is updated/moved.

Control:

- **Scene system**:
  - Sets base `mass_amount` and `detail` per scene; often heavier in harsh scenes.
- **frZone (Ch 15)**:
  - High band (CC 24) can bias `detail` or `mass_amount` so that cymbal/hiss = more shimmer.
- **Edirol (Ch 10)**:
  - Knob: `macro.texture_detail` – fine control for grit vs blur.

If you add SSSScan or similar in future, treat it as a sibling to VMass in this doc.

---

## Interstream

**Role:**  
Glitch, datamosh, stream collisions; the app that lets image **tear and re-stitch**.

Typical chain position:

- Used as **insert** at the end of Chain A or B:
  - `... → (optional Interstream) → SC Video Mixer input`

Key parameters:

- `mosh_amount` (0–1) – how extreme the tearing is.
- `stutter` / `repeat` settings if available.
- Any `blend` parameter that mixes clean vs moshed.

Control:

- **Scene system**:
  - Low/medium values in soft scenes; near-max for harsh scenes.
- **frZone (Ch 15)**:
  - High band (CC 24) biases `mosh_amount`:
    - more treble/noise → more tearing.
- **Edirol (Ch 10)**:
  - One fader: `macro.mosh` – instant push into “too much” for drops.
  - Optional button to toggle a “hard glitch” preset.

Interstream is where the **angels turn feral**; use it sparingly and deliberately.

---

## Other SCapps / utility slots

When you add additional SCapps:

- Document:
  - Where they sit in the chain (A/B/other).
  - 2–4 key parameters that matter for this rig.
  - Which lane touches them:
    - scene base,
    - analysis bias,
    - macro controls.

Suggested pattern for documenting:

```md
### AppName

**Role:** one-line description.

**Position:** where in Chain A/B.

**Key parameters:** list 2–4, with short notes.

**Control:** brief note on which channels/lanes matter.
```

---

## How this file relates to other docs

- `01_system-overview.md`  
  - Describes the **three lanes** (audio, control, video) and where SCapps sit conceptually.

- `03_midi-clock-video.md`  
  - Defines Ch 10 and Ch 15 roles and how control reaches the bridge.

- `05_scapps-rigs.md`  
  - Shows **concrete chains** for specific rigs (EP vs basement vs gallery).

- `09_scene-system.md` + `scenes/*.yaml`  
  - Explains how scenes are defined and how parameters are combined:
    - scene base + analysis + macros.

This file is the **dictionary** of SCapps: what they are and which knobs matter.
