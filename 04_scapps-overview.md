# 04 – SCApps Overview (Owned Apps Only)

This maps the Signal Culture apps you own into a single “video pedalboard” view.

Owned apps:

- InputAmp
- VidMix
- FrameBuffer
- Maelstrom
- SSSScan
- Re:Trace
- VMass
- Interstream

```mermaid
flowchart LR

  %% VIDEO SOURCES
  subgraph VidSources["Video Sources"]
    VidBank["Video Bank<br/>(pre-recorded clips)"]
    LiveCam["Live Camera*"]
  end

  %% HUB
  InputAmp["SC Input Amplifier<br/>video router (Syphon/Spout)"]

  %% PROCESSORS OWNED
  subgraph TimeCluster["Time / Feedback"]
    FrameBuffer["FrameBuffer<br/>multi-layer delay/feedback"]
    Maelstrom["Maelstrom<br/>multi-directional feedback"]
    SSSScan["SSSScan<br/>slitscan / time smear"]
  end

  subgraph GeoCluster["Geometry / 3D"]
    ReTrace["Re:Trace<br/>points/lines/polys in 3D"]
    VMass["VMass<br/>video → 3D models"]
  end

  subgraph TextureCluster["Texture / Mash"]
    Interstream["Interstream<br/>datamosh / compression melt"]
  end

  VidMix["SC Video Mixer<br/>4-input mixer / keyer"]

  Projector["Projector / Display"]
  Recorder["Syphon/Spout Recorder*"]

  %% FLOW
  VidSources -->|"video via disk / capture"| InputAmp

  InputAmp -->|"feed A"| FrameBuffer
  InputAmp -->|"feed B"| Maelstrom
  InputAmp -->|"feed C"| ReTrace
  InputAmp -->|"feed D"| Interstream
  InputAmp -->|"alt feeds"| SSSScan
  InputAmp -->|"alt feeds"| VMass

  FrameBuffer --> VidMix
  Maelstrom --> VidMix
  SSSScan --> VidMix
  ReTrace --> VidMix
  VMass --> VidMix
  Interstream --> VidMix

  VidMix -->|"Syphon/Spout Out"| Projector
  VidMix --> Recorder

  classDef future fill:#222,stroke:#777,color:#bbb,stroke-dasharray: 3 3;
  class LiveCam,Recorder future;
```

## App Cheat Notes

(Short reminders; expand these with real parameter names and CCs later.)

### InputAmp
- **Analogy:** video patchbay / mult.
- **Use for:** routing multiple clips/cameras into several processors at once.
- **Good MIDI:** source select, simple crossfades (if exposed).

### VidMix
- **Analogy:** Mackie mixer for video.
- **Use for:** blending 2–4 processed feeds, keying, wipes.
- **Good MIDI:** per-channel faders, A/B crossfader, kill-to-black button.

### FrameBuffer
- **Analogy:** multi-tap delay/looper.
- **Use for:** echoes, trails, rhythmic repeats, recursive feedback.
- **Good MIDI:** buffer length / delay time, feedback amount, layer mix.

### Maelstrom
- **Analogy:** complex feedback matrix.
- **Use for:** swirling storms, tunnels, spatial feedback.
- **Good MIDI:** X/Y translation, feedback density, reset/panic.

### SSSScan
- **Analogy:** slitscan / granular timesmear.
- **Use for:** dragging slices of image through time.
- **Good MIDI:** slit position, scan speed/direction, slit thickness.

### Re:Trace
- **Analogy:** additive resynthesis in 3D (points/lines from image).
- **Use for:** wireframes, point clouds, rotating image geometry.
- **Good MIDI:** rotation, zoom, density/line thickness.

### VMass
- **Analogy:** video as texture on 3D synth voice.
- **Use for:** mapping video onto primitives/models, orbiting, deforming.
- **Good MIDI:** orbit angle, scale, “bumpiness” / deformation amount.

### Interstream
- **Analogy:** datamosh / bitcrusher bus.
- **Use for:** melting cuts, blooming glitches, compression smears.
- **Good MIDI:** mosh intensity, decay/reset time, hard “mosh now” button.

## Notes

- [ ] For each app, write down the exact parameter names and MIDI CC numbers you want to use live.
- [ ] Decide which 2–3 apps will be “always armed” in a typical show.
- [ ] Note CPU load expectations when running multiple apps.
