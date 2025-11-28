# 05 – SCApps Rig Templates

Three standard SCApp “rigs” you can recall and adapt for shows.

---

## Rig 1 – Time / Feedback Bus

```mermaid
flowchart LR

  VidBank["Video Bank"]
  AudioIn["Audio In 1–2<br/>(post-Horizon)"]

  InputAmp["InputAmp"]

  FrameBuffer["FrameBuffer<br/>short/med/long echoes"]
  Maelstrom["Maelstrom<br/>directional feedback"]
  SSSScan["SSSScan<br/>slitscan smear"]

  VidMix["VidMix<br/>4-ch mixer"]
  Projector["Projector"]

  VidBank --> InputAmp
  InputAmp -->|"main feed"| FrameBuffer
  InputAmp -->|"secondary"| Maelstrom
  FrameBuffer --> SSSScan
  Maelstrom --> VidMix
  SSSScan --> VidMix
  VidMix --> Projector

  AudioIn --> FrameBuffer
  AudioIn --> Maelstrom
  AudioIn --> SSSScan
```

### Notes

- [ ] Choose 2–3 clips to rotate through in VidBank for this rig.
- [ ] Decide which audio features (kick, snare, overall RMS) modulate which parameters.
- [ ] Map 3–4 MIDI controls:
  - [ ] Global delay/feedback feel
  - [ ] Amount of Maelstrom vs SSSScan in VidMix
  - [ ] One big “wipe/reset” gesture

---

## Rig 2 – Geometry / 3D Bus

```mermaid
flowchart LR

  VidBank["Video Bank"]
  AudioIn["Audio In 1–2"]

  InputAmp["InputAmp"]

  ReTrace["Re:Trace<br/>points/lines/polys"]
  VMass["VMass<br/>video on 3D forms"]

  VidMix["VidMix"]
  Projector["Projector"]

  VidBank --> InputAmp
  InputAmp -->|"base feed"| ReTrace
  ReTrace -->|"geo output"| VMass
  VMass --> VidMix
  VidBank -->|"unprocessed alt feed"| VidMix

  VidMix --> Projector

  AudioIn --> ReTrace
  AudioIn --> VMass
```

### Notes

- [ ] Pick one “figurative” clip and one “abstract” clip for contrast.
- [ ] Define camera/orbit presets in VMass (e.g., calm / orbit / extreme).
- [ ] MIDI ideas:
  - [ ] Fader: crossfade clean vs VMass in VidMix
  - [ ] Knob: rotation speed
  - [ ] Knob: deformation amount

---

## Rig 3 – Texture / Mash Bus

```mermaid
flowchart LR

  VidBank["Video Bank"]
  AudioIn["Audio In 1–2"]

  InputAmp["InputAmp"]

  Interstream["Interstream<br/>datamosh"]
  FrameBuffer["FrameBuffer<br/>soften & trail the mosh"]

  VidMix["VidMix"]
  Projector["Projector"]

  VidBank --> InputAmp
  InputAmp -->|"feed A"| Interstream
  Interstream --> FrameBuffer
  FrameBuffer --> VidMix

  VidBank -->|"clean feed"| VidMix

  VidMix --> Projector

  AudioIn --> Interstream
  AudioIn --> FrameBuffer
```

### Notes

- [ ] Choose clips that look good both clean and broken.
- [ ] Decide how aggressively Interstream should respond to audio (subtle vs brutal).
- [ ] MIDI ideas:
  - [ ] Fader: clean vs mosh crossfade in VidMix
  - [ ] Knob: glitch intensity
  - [ ] Button: “mosh burst” on demand
