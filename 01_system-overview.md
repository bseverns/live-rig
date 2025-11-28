# 01 – Top-Level System Overview

```mermaid
flowchart TB

  %% ===== AUDIO SOURCES =====
  subgraph AudioSources["Audio Sources (on table)"]
    DrumKid["DrumKid"]
    E2S["Korg Electribe 2S"]
    SQ64["Korg SQ-64 (MIDI only, no audio)"]
    Volca["Volca Modular"]
    AE["AE Modular Rack<br/>(Beginner 16, EF, Volca IF, Grunge, Breadboard)"]
    KastleD["Bastl Kastle Drum"]
    Kastle2["Bastl Kastle 2"]
    Microgranny["Bastl Microgranny 2"]
    GreyBox["GreyBox Synth"]
    FreqFM["Freq FM Synth"]
    ZenBox["Zen Chant Sample Box"]
    Radios["2× Radios"]
    Cassette["Cassette Player"]
    Tascam["Tascam 4-Track"]
    Reel["Portable Reel-to-Reel*"]
    AkaiS900["Akai S900*"]
  end

  %% ===== MIXER & FX CORE =====
  subgraph MixerCore["Mixer & FX Core"]
    Mackie["Mackie 8-ch Mixer<br/>(4 mono, 4 stereo, Aux Send/Return)"]
    subgraph FXLoop["Pedalboard & FX Loop"]
      DD20["Boss DD-20 Delay<br/>(stereo split)"]
      PedalChain["TS9 → Muff → Flanger → MXR Comp → MXR EQ<br/>+ homebuilt FX"]
      BentChain["Circuit-bent pedal chain<br/>(from DD-20 2nd out)"]
      FieldKit["Koma Field Kit FX"]
      DiceLoop["Teensy DiceLoop / Chaos Delay*"]
    end
    LoFiSampler["Lo-Fi Trellis Sampler"]
  end

  %% ===== MASTER / DSP / MAC / VISUALS =====
  subgraph MasterBus["Master Bus & Digital Bridge"]
    Horizon["Horizon Master FX (Teensy)*"]
    Interface["Audio Interface"]
    Mac["Mac Laptop<br/>(DAW / VCV / Signal Culture Apps)"]
    VideoBank["Video Clip Bank<br/>(pre-recorded + self-made)"]
    SCApps["Signal Culture Modular Video Apps"]
    Projector["Projector / Display"]
  end

  %% ===== AUDIO ROUTING (HIGH LEVEL) =====
  AudioSources -->|"audio (mono/stereo)"| Mackie

  Mackie -->|"Aux Send"| DD20
  DD20 -->|"stereo out A"| PedalChain
  DD20 -->|"stereo out B"| BentChain
  PedalChain -->|"stereo return"| Mackie
  BentChain -->|"mono return"| Mackie

  Mackie -->|"Aux / Insert / Submix"| FieldKit
  FieldKit -->|"return"| Mackie

  Mackie -->|"Aux Send or Submix"| LoFiSampler
  LoFiSampler -->|"stereo out"| Mackie

  Mackie -->|"Main Out (stereo)"| Horizon
  Horizon -->|"stereo"| Interface
  Interface -->|"USB Audio"| Mac
  Mac -->|"HDMI / DisplayPort"| Projector

  %% Video flow inside Mac
  VideoBank --> SCApps
  Interface -->|"Audio into apps"| SCApps

  classDef future fill:#333,stroke:#999,color:#ccc,stroke-dasharray: 3 3;
  class DiceLoop,AkaiS900,Reel,Horizon future;
```

## Notes

- [ ] Add specific connector types (TRS, TS, RCA, etc.) to each edge label.
- [ ] Follow mixer tape marks for live input sorts.
- [ ] Mark any gear that stays home for a minimal rig with a *+*.
- [ ] Horizon always comes *after* the final mix before the interface.
