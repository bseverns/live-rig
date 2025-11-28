# 02 – Audio, Mixer, and FX Loop Detail

```mermaid
flowchart TB

  subgraph Sources["Core Audio Sources → Mixer"]
    Volca["Volca Modular<br/>(3.5mm mono)"]
    AE["AE Modular Rack<br/>(3.5mm mono, MIDI Ch 16)"]
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

  Mackie["Mackie DFX12 Mixer<br/>12-channel, Aux1 (MON) + Aux2 (EFX), internal FX"]

  Sources -->|"1/4\" TS / RCA / adapters"| Mackie

  %% FX loop detail (DFX12 reality)
  Mackie -->|"Aux 1 (MON)"| DD20["Boss DD-20 Delay (stereo)"]
  DD20 -->|"Output A (L)"| PedalChain["Main Pedal Chain<br/>TS9 → Muff → Flanger → Comp → EQ → DIY"]
  DD20 -->|"Output B (R)"| BentChain["Bent Pedals Chain"]

  PedalChain -->|"stereo return"| Mackie
  BentChain -->|"mono return (e.g. spare mono ch)"| Mackie

  Mackie -->|"Aux 2 (EFX)"| FieldKit["Koma Field Kit FX"]
  FieldKit -->|"return to stereo channel"| Mackie

  %% Lo-Fi Sampler fed from Tape Out (not a third aux)
  Mackie -. "Tape Out" .-> LoFiSampler["Lo-Fi Trellis Sampler<br/>(ADC In → Stereo Out)"]
  LoFiSampler -->|"stereo back to mixer"| Mackie

  Mackie -->|"Main Out L/R"| Horizon["Horizon Master FX<br/>(stereo in/out)"]
  Horizon -->|"stereo"| Interface["Audio Interface In 1–2"]

  classDef box fill:#111,stroke:#999,color:#eee;
  class Mackie,Sources,DD20,PedalChain,BentChain,FieldKit,LoFiSampler,Horizon,Interface box;
```

## Mackie DFX12 Channel Layout – Baseline Map

> Default “home layout” so you can patch quickly and only deviate on purpose.

| Channel | Source                          | Type    | Notes                                                   |
|---------|---------------------------------|---------|---------------------------------------------------------|
| 1       | DrumKid                         | mono    | Main clock/drum brain                                   |
| 2       | Volca Modular                   | mono    | Main weird voice                                        |
| 3       | AE Rack (MIDI Ch 16 from SQ-64) | mono    | Modular voices                                          |
| 4       | Microgranny 2                   | mono    | Texture stabs / grain                                   |
| 5/6     | Korg Electribe 2S (E2S)         | stereo  | Core sample/synth bed                                   |
| 7/8     | Mac / SCApps / VCV audio        | stereo  | Returns from laptop (if needed)                         |
| 9/10    | DD20 + main pedalboard return   | stereo  | Aux 1 (MON) send → DD20/pedals → back here             |
| 11/12   | Field Kit FX / Lo-Fi / wildcard | stereo  | Aux 2 (EFX) return and/or Lo-Fi Sampler return         |

- If Lo-Fi is mono out, you can drop it on the L jack of 11/12 and pan center.
- For very minimal rigs, 7/8 and/or 11/12 can become “guest” channels (radios, tape, GreyBox).

### Aux Sends (How They’re Used on the DFX12)

- **Aux 1 (MON)** → DD20 → main pedal chain → back on **Ch 9/10**

  Path:

      Aux 1 send → DD20 → TS9 → Muff → Flanger → Comp → EQ → DIY → stereo out → Ch 9/10

- **Aux 2 (EFX)** → Field Kit FX → back on **Ch 11/12**

  Path:

      Aux 2 send → Field Kit FX → stereo out → Ch 11/12

- **Lo-Fi Sampler (input)**:

  - Fed from **Tape Out** (whole mix) or from a small splitter if you want a subset.
  - Returns as stereo on **Ch 11/12** alongside or instead of Field Kit, depending on show.

Horizon still sits on the **Main Out L/R** path as your master FX / safety brickwall.

## Notes

- [x] Assign fixed channel numbers for a “default” table layout (see above).
- [x] Confirm which Aux send(s) you want to dedicate to:
  - [x] Aux 1 (MON) → Pedals / DD20
  - [x] Aux 2 (EFX) → Field Kit FX
  - [x] Lo-Fi fed from Tape Out (not its own aux)
- [ ] Decide where DiceLoop slots in (own channel vs. serial with DD20 or Lo-Fi, when it’s in the rig).
- [ ] Note typical gain staging for noisy sources (radios, tapes, GreyBox) once you’ve lived with this layout for a bit.
