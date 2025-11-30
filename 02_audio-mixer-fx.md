# 02 – Audio mixer & FX

This document answers two questions:

1. **Where does every sound plug in?**
2. **How do we tap the mix for Horizon, frZone, LineLight, and recording without wrecking gain staging?**

It assumes a small analog mixer with:

- mono channels (1–X),
- at least one post-fader aux send,
- a stereo main out,
- and, ideally, a control room / recording out.

Adapt numbers to your actual desk.

---

## Channel layout (full rig template)

Use this as the “normal” mapping when you have the whole rig on the table.

| Ch | Source         | Type  | Notes / EQ bias                                           |
|----|----------------|-------|-----------------------------------------------------------|
| 1  | DrumKid L      | Mono  | Low-cut as needed; keep punch, watch sub build-up.       |
| 2  | DrumKid R      | Mono  | Pan hard R; mirror Ch 1 settings.                         |
| 3  | AE Rack (main) | Mono  | Slight mid push; leave headroom for resonance peaks.      |
| 4  | Lo-Fi Sampler  | Mono  | Treat as texture: tame lows if Horizon will add weight.   |
| 5  | Guest / spare  | Mono  | For pedals / guest synth / noise box.                     |
| 6  | Guest / spare  | Mono  | As needed; can become talk mic or extra synth.           |
| 7  | DAW / laptop L | Mono  | For stems / playback; the “safest” stereo pair.           |
| 8  | DAW / laptop R | Mono  | Pan hard R; keep level conservative.                      |

**Returns:**

- Any external FX returns can use:
  - A stereo return if available, or
  - A spare stereo pair (e.g. 7/8 if not used for DAW).

You can freeze this as a printed block on the show sheet: when you plug in, you’re just filling this table.

---

## Bus structure

Three main busses:

1. **Main L/R** → Horizon → PA / interface.
2. **Post-fader send** → frZone (and LineLight, if they share a feed).
3. **Recording / control out** → interface / recorder.

### Main mix → Horizon → PA

- **Mixer main out L/R** → Horizon input.
- **Horizon output** → PA / venue system (or your interface’s main inputs).

Guidelines:

- Run the mixer’s main fader around **unity** when the rig is loudest.
- Let Horizon handle last-mile shaping; don’t “pre-crush” on the mixer.
- If the venue insists on taking a **pre-Horizon** feed, note that in the show-specific doc (`07_show-…`) and treat Horizon as your monitoring / recording tone instead.

---

## frZone / LineLight feed

frZone wants a **post-fader**, “real world” picture of the mix.

### Preferred routing

- Use **Aux 1** (or equivalent) as a **post-fader send** from each channel that should influence visuals.
  - DrumKid: send medium–high.
  - AE Rack: send medium.
  - Lo-Fi: send medium–low (if highly distorted).
  - DAW / laptop: send as needed.
- Aux 1 output → **frZone input** (or interface input that feeds frZone).

If LineLight needs a feed and can share:

- Use a **Y-split** or route frZone’s thru/monitor back to LineLight.
- Alternatively, run LineLight off a **copy** of the main mix (e.g. Control Room out).

**Key principle:**  
frZone should hear roughly what the audience hears, after fader moves—so avoid pre-fader sends for analysis.

---

## Monitoring / recording

### 1. Simple stereo record

- Use a **Control Room** or **Rec Out** pair from the mixer:
  - Source: main mix post-fader (including Horizon if possible).
  - Destination: interface inputs for REAPER.

In REAPER:

- Track `Live Stereo` = armed, input from mixer L/R, record pre-FX.

### 2. Multitrack (if interface allows)

If your interface has enough channels and the mixer has **direct outs** / inserts:

- Send:
  - DrumKid L/R → interface 1/2.
  - AE Rack → interface 3.
  - Lo-Fi → interface 4.
  - Etc.

Write down any repeatable multitrack scheme in `notes/` or a separate doc if it becomes standard.

### 3. No recorder, PA only

- Treat the main mix → Horizon → PA as the only path.
- Still keep the **frZone send** active so visuals remain linked to the actual sound.

---

## Minimal rig variants

### Minimal audio-only rig

- Ch 1–2: DrumKid L/R.
- Ch 3: AE Rack or single synth.
- Ch 4: Lo-Fi or noise source.
- Aux 1: off (no frZone).
- Main out → PA (Horizon in front if you brought it).

### Minimal audio + single-screen visuals

- Same core channels (1–4).
- Aux 1 post-fader → frZone.
- LineLight on the same or a parallel feed.
- Camera / capture → SCapp → projector.

Note any one-off compromises in the relevant `07_show-…` file (e.g. “no DAW stems tonight”, “sampler and AE share a channel”).

---

## FX loop and “Horizon discipline”

Treat Horizon as the **final shaper**, not an effect you ride constantly.

- If you have **other pedals / outboard FX** in the rig:
  - Place those on **individual channel inserts** or a dedicated FX send/return.
  - Do not loop them between mixer and Horizon unless that’s a deliberate, documented choice.

Recommended:

- Use one **aux send** for time-based or special FX (pedal chain, external box).
- Return that FX to a spare stereo channel so you can:
  - Mute it cleanly.
  - Send it (or not) to frZone.

---

## Gain staging notes

- Set **input gains** so that:
  - Peak hits **yellow, not red**, on the loudest expected moments.
- Keep **channel faders around unity** where possible; use gains and group levels to balance.
- Adjust **Aux 1 levels** so frZone sees a healthy signal without clipping.
- If Horizon has meters:
  - Aim for moderate input, plenty of headroom for its own saturation/glue.

---

## Where to update when the rig evolves

Change this file when:

- You add/remove a core sound source (new synth, different sampler, etc.).
- You change which channels feed frZone or LineLight.
- You adopt a consistent multitrack scheme.

If you do something one-off for a specific show:

- Leave this file alone.
- Capture the deviation in `07_show-…` and/or `notes/`.

This document should stay stable enough that you can **print it once** and trust it for a while.
