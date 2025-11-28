# 06 – frZone + LineLight Integration

These two machines are “glue and glitter” for the rig:

- **LineLight‑1** — a listening lamp for artists; taps a line-level feed and maps a frequency band to LED brightness.
- **frZone** — Freq‑Zone Peak Triggers; listens to audio, slices it into bands, and outputs MIDI CC/notes + OSC based on band energy.

---

## 6.1 LineLight in the Audio / Mixer Layer

The simplest, safest integration is to let LineLight “listen” to a parallel tap of the main mix (Tape/2‑Track Out), so it can never break FOH audio.

```mermaid
flowchart LR

  subgraph MixerCore["Mixer Core"]
    Mackie["Mackie 8-ch Mixer"]
    Horizon["Horizon Master FX"]
    Interface["Audio Interface"]
  end

  PA["PA / Monitors"]
  LineLight["LineLight-1<br/>Listening Lamp"]

  %% Main audio path
  Mackie -->|"Main Out L/R"| Horizon
  Horizon -->|"stereo in 1–2"| Interface
  Interface -->|"Out 1–2"| PA

  %% Parallel tap for LineLight
  Mackie -->|"Tape Out / 2-Track Out"| LineLight

  %% Optional inline use on control room feed
  Mackie -. "Control Room Out L/R" .-> LineIn["LineLight In L/R"]
  LineIn -. "LineLight Out L/R" .-> CRMon["Control Room Monitors*"]

  classDef future fill:#222,stroke:#777,color:#bbb,stroke-dasharray:3 3;
  class LineIn,CRMon future;
```

### Notes – LineLight

- [ ] Decide which **output** from the Mackie to dedicate as LineLight’s “ear”:
  - [ ] Tape Out / 2‑Track Out (recommended simple option)
  - [ ] Control Room Out (if you want it inline with your own monitors)
  - [ ] A dedicated Aux / Submix (for drums‑only, low‑end‑only, etc.)
- [ ] For each show, note which **band** (low/mid/high) you want LineLight listening to.
- [ ] Think about **placement**:
  - [ ] On table facing audience
  - [ ] Behind you, modulating your silhouette
  - [ ] Near projector / screen as a “halo”

---

## 6.2 frZone in the Mac / SCApps Layer

frZone lives entirely on the Mac. It listens to the same post‑Horizon stereo you feed the interface, and emits MIDI + OSC to drive visuals and other software.

```mermaid
flowchart TB

  subgraph AudioIn["Audio Into Mac"]
    HorizonOut["Horizon Out L/R"]
    Interface["Audio Interface<br/>(In 1–2 from Horizon)"]
  end

  subgraph Mac["Mac Laptop"]
    DAW["DAW / Host"]
    FRZONE["frZone – Freq-Zone Peak Triggers<br/>(Processing)"]
    SCApps["Signal Culture Apps"]
    VCV["VCV Rack / Other Instruments*"]
  end

  VirtualMIDI["IAC Bus: FRZONE_MIDI"]
  OSCTarget["OSC Target<br/>(Max/TD/Bridge Patch)*"]
  Projector["Projector / Display"]

  %% Audio flow
  HorizonOut --> Interface
  Interface -->|"USB Audio In 1–2"| DAW
  Interface -->|"USB Audio In 1–2"| FRZONE

  %% frZone outputs
  FRZONE -->|"MIDI CC + Notes"| VirtualMIDI
  FRZONE -->|"OSC: /bandEnergy idx fLo fHi energyN"| OSCTarget

  %% MIDI / OSC fan-out
  VirtualMIDI --> DAW
  VirtualMIDI --> VCV
  VirtualMIDI --> SCApps
  OSCTarget --> SCApps

  %% Video out
  SCApps -->|"window / screen"| Projector

  classDef future fill:#222,stroke:#777,color:#bbb,stroke-dasharray:3 3;
  class VCV,OSCTarget future;
```

### Notes – frZone

- [ ] In frZone, select the **audio input** that corresponds to the interface’s post‑Horizon stereo (In 1–2).
- [ ] Set up an **IAC Bus** (e.g., `FRZONE_MIDI`) and confirm:
  - [ ] DAW can see it and route CC/notes to instruments/FX.
  - [ ] Your SCApps bridge patch (Max/TD/other) can also see it.
- [ ] Define a **band‑to‑meaning map** per show, e.g.:
  - Band 0 (low) → FrameBuffer feedback
  - Band 2 (mid) → Re:Trace/VMass density or deformation
  - Band 4 (high) → Interstream mosh intensity or VidMix stutter
- [ ] Save different frZone profiles (`data/mapping.json`) for:
  - [ ] “Club” set (rhythm‑driven mapping)
  - [ ] “Noise / drone” set (texture‑driven mapping)
- [ ] Decide what frZone should *not* control, so you still have manual “safe” knobs.

---

## 6.3 Mental Layering

- **LineLight** sits on the **physical / stage** layer:
  - A visible, analog indicator of your mix’s energy in a chosen band.
- **frZone** sits on the **logic / control** layer:
  - A programmable bridge from sound → control signals → video and synth behavior.

Together they:

- Make the **audible structure** of your set more visible (LineLight), and
- Make the **spectral structure** of your set more actionable in software (frZone).
