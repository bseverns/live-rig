# 03 – MIDI, Clock, and Video / Mac Integration

```mermaid
flowchart TB

  direction TB

  subgraph MacCore["Mac Core"]
    DAW["DAW / Host (Reaper / Live)"]
    ClockApp["MIDI Clock / Router<br/>(inside DAW or separate)"]
    VideoBank["Video Files on Disk"]
    SCApps["Signal Culture Apps<br/>(standalone TD-based)"]
  end

  Hub["USB Hub"]

  %% USB MIDI Devices
  SQ64["SQ-64 (USB MIDI)"]
  E2S_MIDI["E2S (USB MIDI)"]
  LoFiSampler_MIDI["Lo-Fi Sampler (Teensy MIDI)"]
  Horizon_MIDI["Horizon / Teensy FX (MIDI params)*"]
  DiceLoop_MIDI["DiceLoop (MIDI params/tempo)*"]
  OtherCtrl["Optional MIDI Controller / Footswitch*"]

  %% Audio Interface
  Interface["Audio Interface<br/>(In 1–2 from Horizon,<br/>Out 1–2 to Monitors,<br/>Out 3–4 to Mixer)"]

  %% Video Output
  Projector["Projector / Screen"]

  %% Wiring: USB + MIDI clock
  MacCore -->|"USB"| Hub
  Hub --> SQ64
  Hub --> E2S_MIDI
  Hub --> LoFiSampler_MIDI
  Hub --> Horizon_MIDI
  Hub --> DiceLoop_MIDI
  Hub --> OtherCtrl

  ClockApp -->|"MIDI Clock + Start/Stop"| SQ64
  ClockApp -->|"MIDI Clock"| LoFiSampler_MIDI
  ClockApp -->|"MIDI Clock"| E2S_MIDI
  ClockApp -->|"MIDI Clock (optional)"| Horizon_MIDI
  ClockApp -->|"MIDI Clock (optional)"| DiceLoop_MIDI

  %% SQ64 DIN MIDI out to hardware synths
  SQ64 -->|"DIN MIDI Out"| VolcaChain["Volca Modular / AE Rack / other DIN gear"]

  %% Audio to/from Mac
  HorizonAudio["From Horizon (stereo)"] --> Interface
  Interface -->|"USB Audio In"| DAW
  DAW -->|"USB Audio Out 3–4"| Interface
  Interface -->|"Out 3–4 (line)"| MixerReturn["Stereo channel on Mackie<br/>(Mac Instrument)"]

  %% Audio & MIDI into Signal Culture Apps
  Interface -->|"Audio In 1–2"| SCApps
  DAW -->|"Virtual MIDI / OSC"| SCApps
  LoFiSampler_MIDI -->|"MIDI Notes/CC (slice triggers)*"| SCApps
  SQ64 -->|"extra MIDI channel (visual cues)*"| SCApps

  SCApps -->|"Window / Screen"| Projector

  classDef future fill:#333,stroke:#999,color:#ccc,stroke-dasharray: 3 3;
  class Horizon_MIDI,DiceLoop_MIDI,OtherCtrl,VolcaChain future;
```

## Notes

- [ ] Confirm which app (DAW vs. standalone clock tool) is your **tempo master**.
- [ ] Decide which devices actually need clock vs. just note/CC.
- [ ] Define a “visual MIDI” channel for SCApps (SQ64 track, Lo-Fi Sampler events, etc.).
- [ ] List your virtual MIDI bus names (IAC / loopMIDI / etc.).
