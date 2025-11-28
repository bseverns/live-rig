# 02 – Audio, Mixer, and FX Loop Detail

```mermaid
flowchart TB

  subgraph Sources["Core Audio Sources → Mixer"]
    Volca["Volca Modular<br/>(3.5mm mono)"]
    AE["AE Modular Rack<br/>(3.5mm mono)"]
    DrumKid["DrumKid<br/>(mono)"]
    E2S["E2S<br/>(stereo)"]
    KastleD["Kastle Drum<br/>(mono)"]
    Kastle2["Kastle 2<br/>(mono/noise)"]
    Microgranny["Microgranny 2<br/>(mono)"]
    GreyBox["GreyBox Synth"]
    FreqFM["Freq FM Synth"]
    ZenBox["Zen Chant Box"]
    Radios["2× Radios"]
    TapeDeck["Cassette / 4-Track / Reel"]
  end

  Mackie["Mackie 8-ch Mixer<br/>Ch1–4 mono, Ch5–8 stereo, Aux Send/Return"]

  Sources -->|"1/4\" TS / RCA / adapters"| Mackie

  %% FX loop detail
  Mackie -->|"Aux Send 1 (mono)"| DD20["Boss DD-20 Delay (stereo)"]
  DD20 -->|"Output A (L)"| PedalChain["Main Pedal Chain<br/>TS9 → Muff → Flanger → Comp → EQ → DIY"]
  DD20 -->|"Output B (R)"| BentChain["Bent Pedals Chain"]

  PedalChain -->|"stereo return"| Mackie
  BentChain -->|"mono return (e.g. Ch1)"| Mackie

  %% Other FX / DSP on sends
  Mackie -->|"Aux Send 2 / Submix"| FieldKit["Koma Field Kit FX"]
  FieldKit -->|"return to stereo channel"| Mackie

  Mackie -->|"Aux Send 3 / Submix"| LoFiSampler["Lo-Fi Trellis Sampler<br/>(ADC In → Stereo Out)"]
  LoFiSampler -->|"stereo back to mixer"| Mackie

  Mackie -->|"Main Out L/R"| Horizon["Horizon Master FX<br/>(stereo in/out)"]
  Horizon -->|"stereo"| Interface["Audio Interface In 1–2"]

  %% Option: send direct tap to interface/Mac
  Mackie -. optional direct out .->|"Tape Out / Alt Out"| Interface

  classDef box fill:#111,stroke:#999,color:#eee;
  class Mackie,Sources,DD20,PedalChain,BentChain,FieldKit,LoFiSampler,Horizon,Interface box;
```

## Notes

- [ ] Assign fixed channel numbers for a “default” table layout (e.g., Ch1 DrumKid, Ch2 Volca, etc.).
- [ ] Confirm which Aux send(s) you want to dedicate to:
  - [ ] Pedals / DD20
  - [ ] Field Kit FX
  - [ ] Digital send (Lo-Fi Sampler / DiceLoop)
- [ ] Decide where DiceLoop slots in (own aux vs. serial with DD20).
- [ ] Note typical gain staging for noisy sources (radios, tapes).
