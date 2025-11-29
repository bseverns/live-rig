# 07 – Show Plan – 2025-12-15 – Basement Noise Night

## 1. Logistics

- **Date / Time:** 2025-12-15, doors 19:30, set ~21:00  
- **Venue:** Friend’s Basement / DIY “noise night”  
- **Room / Stage notes:** 
  - Low ceiling, concrete floor, probably boomy.
  - Power is a bit sketchy; bring extra strips + an extension.  
- **Set length:** 30–35 min  
- **Shared backline / other acts:** 
  - Amp stacks from other bands; I’ll run direct to a small PA + powered speakers.

### Contact

- **FOH contact:** N/A – self-mix  
- **Tech contact:** The friend whose house it is  
- **Promoter / curator:** Same as above

---

## 2. Rig Scope for This Show

### Audio Gear (brought)

- [x] DrumKid
- [x] E2S
- [x] SQ-64
- [x] Volca Modular
- [x] AE Rack (Beginner 16 + EF + Volca IF + Grunge + breadboard) – MIDI on Ch 16
- [ ] Kastle Drum
- [ ] Kastle 2
- [x] Microgranny 2
- [x] GreyBox
- [ ] Freq FM
- [x] Zen box
- [x] Radios (2×)
- [x] Cassette player
- [ ] Tascam 4-track
- [ ] Reel-to-reel
- [x] Lo-Fi Sampler (Trellis) – audio only, clock in
- [ ] DiceLoop (staying home – keep rig simple)
- [x] Horizon
- [x] LineLight
- [x] Koma Field Kit FX
- [x] Pedalboard (TS9, Muff, Flanger, DD20, Comp, EQ, DIY)
- [x] Mixer (Mackie 8-ch)

### Video / Mac

- [x] Mac laptop
- [x] Interface: Focusrite 2i2 (or similar)
- [x] Edirol PCM-30 (MIDI controller keyboard / knob box)
- [x] SCApps in use:
  - [x] InputAmp
  - [x] VidMix
  - [x] FrameBuffer
  - [x] Maelstrom
  - [ ] SSSScan
  - [x] ReTrace
  - [ ] VMass
  - [x] Interstream
- [x] Projector / screen brought by me (small short-throw)
- [ ] Venue projector

### Minimal vs Full

- **Minimal rig description:**  
  DrumKid clock → SQ-64 → Volca/AE, E2S as sample/sequencer, Microgranny for texture stabs, small pedalboard, Horizon on main, one SCApps rig (FrameBuffer+Interstream) fed by the full mix.

- **What I’m actually bringing tonight:**  
  The minimal rig + LineLight, frZone running on the Mac, extra radios and cassette for texture, plus Edirol PCM-30 as visual macro controller.

---

## 3. Clock / Sync Plan

- **Tempo master:**  
  - [ ] Mac (DAW / clock app)  
  - [x] DrumKid  
  - [ ] Other: __________

DrumKid sends clock → SQ-64 (DIN). Mac visuals are “loosely reactive” via audio + frZone, not fully tempo-locked.

- **MIDI Clock destinations:**
  - [x] SQ-64 (from DrumKid DIN)
  - [ ] E2S (free-running patterns)
  - [ ] Lo-Fi Sampler (clock optional via Mac if needed)
  - [ ] DiceLoop
  - [ ] Horizon

- **Visual MIDI (for SCApps):**
  - Source device: Edirol PCM-30 via USB  
  - Channel / CCs reserved:
    - Ch 10, CC 21: “Visual glitch macro”
    - Ch 10, CC 22: “Video feedback macro”
    - Ch 10, CC 23: (optional) “geometry / orbit macro”

- **frZone profile to use:**  
  - [ ] Club / rhythmic  
  - [x] Noise / drone  
  - [ ] Custom: __________  
  Notes: emphasize mid/high bands for glitch bursts; low band for slow FrameBuffer trails.

---

## 4. Audio Routing Snapshot

- **Mixer model:** Mackie 8-ch (4 mono, 4 stereo)

- **Channel assignment:**  
  - Ch1: DrumKid (mono)  
  - Ch2: Volca Modular (mono)  
  - Ch3: AE Rack (mono)  
  - Ch4: Microgranny (mono)  
  - Ch5/6: E2S (stereo)  
  - Ch7/8: Mac return (stereo from interface Out 3/4, if used)

- **Aux Sends:**
  - Aux 1 → DD20 → Pedalboard chain → stereo return  
  - Aux 2 → Field Kit FX → stereo return  
  - Aux 3 → Lo-Fi Sampler (input)  

- **LineLight tap from:**  
  - [x] Tape Out  
  - [ ] Control Room Out  
  - [ ] Aux / subgroup: __________  

- **Horizon in/out:**  
  - In from: Mixer Main Out L/R  
  - Out to: Interface In 1/2 → small PA / powered speakers

---

## 5. Video / SCApps Patch for This Show

- **Base rig:**  
  - [x] Time / feedback bus  
  - [ ] Geometry / 3D bus  
  - [x] Texture / mash bus  
  - [ ] Hybrid: __________

Running two light rigs:
- Rig A: FrameBuffer + Maelstrom → VidMix
- Rig B: Interstream → FrameBuffer → VidMix

- **Video sources:**  
  - Clip set / folder: `~/videos/basement_2025/` (old CRT footage, street lights, water)  
  - Live camera? [x] Yes – USB cam pointing at table

- **App roles:**  
  - FrameBuffer: main echo / smear lane  
  - Maelstrom: occasional tunnel/whirlpool moments  
  - ReTrace: wireframe reinterpretation for one piece  
  - Interstream: glitch blooms on peaks  

- **Key mappings (short list):**
  - frZone Band 0 (low) → FrameBuffer feedback
  - frZone Band 2 (mid) → Maelstrom depth
  - frZone Band 4 (high) → Interstream mosh intensity
  - Edirol PCM-30 CC 21 → VidMix crossfade & glitch macro
  - Edirol PCM-30 CC 22 → “global feedback macro” (FrameBuffer)

---

## 6. Set Shape / Pieces

### Piece 1 – “Open Hum”

- Approx length: 8–10 min  
- Audio focus (rig subset):  
  - Radios, cassette drone through pedalboard → AE textures.  
  - Light DrumKid pattern to establish pulse late in the piece.  
- Visual focus (which SC rig / clips):  
  - FrameBuffer only, long trails, slow motion with water/light clips.  
- Notable gestures / cues:  
  - Start with LineLight set to low-mid band, it barely flickers.  
  - End with a slow fade-in of DrumKid, frZone makes trails deepen.

---

### Piece 2 – “Crash Bloom”

- Approx length: 10–12 min  
- Audio focus:  
  - SQ-64 driving Volca + AE, E2S percussion and stabs.  
  - Occasional Microgranny noise shots.  
- Visual focus:  
  - FrameBuffer + Interstream rig.  
  - High band frZone mapping → glitch blooms on snare / noise.  
- Notable gestures / cues:  
  - At mid-point, slam Edirol PCM-30 macro CC 21 up for “crash bloom” burst, then pull back.  
  - Use Edirol PCM-30 CC 22 to thicken trails around the burst.  
  - Kill almost everything to a simple Volca line, gradually fade glitches back down.

---

### Piece 3 – “Wireframe Choir”

- Approx length: 8–10 min  
- Audio focus:  
  - GreyBox + Zen box + Microgranny loops, mostly midrange and vocals/tones.  
- Visual focus:  
  - ReTrace-only scene, slow rotating wireframes of the live camera + one clip.  
- Notable gestures / cues:  
  - Use mid-band frZone → ReTrace density to make images “fill in” as things get dense.  
  - Let LineLight band climb higher (more upper mids) so lamp appears more “vocal”.

---

### Piece 4 – “Basement Drone Out”

- Approx length: 5 min  
- Audio focus:  
  - AE + Volca self-oscillation, slow filter sweeps, tape loop from cassette.  
- Visual focus:  
  - Maelstrom tunnel + low-band FrameBuffer.  
- Notable gestures / cues:  
  - LineLight fully on low band: lamp as “subwoofer ghost” for the end.  
  - Final move: cut DrumKid clock, let everything free-run into a slow manual fade.

---

## 7. Post-Show Notes

(To fill after set.)

- What went well:  
  - __________________________________________________________  
- What broke or felt fragile:  
  - __________________________________________________________  
- Changes to make next time (routing, mappings, rig scope):  
  - __________________________________________________________
