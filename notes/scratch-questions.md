# Scratch Notes & Questions

Use this file for things that are unclear while patching on site.

## Open Questions

- Audio routing
  - [ ] Do I ever bypass Horizon and feed the interface directly?
  - [ ] How many aux sends do I *actually* have available at a given venue?

- MIDI / Sync
  - [ ] Who is tempo master in this room (Mac vs DrumKid)?
  - [ ] Which devices really need clock vs can be “free”?

- SCApps
  - [ ] Which rig (time / geometry / mash) am I starting with tonight?
  - [ ] Are there any apps I should *not* run simultaneously due to CPU?

- Hardware choices
  - [ ] Minimal rig for this show vs. full sprawl?
  - [ ] Which pieces are mission-critical? (SQ64? E2S? GreyBox?)

## Planned Use

- Electribe Sampler (E2S)
  - Planned role: percussion, stabs, and one-shot sample hits alongside SQ-64 / AE parts.
  - Core device: it is not optional in this rig because it also acts as a fundamental audio processor for another audio line.
  - Good fallback if I want a self-contained rhythmic layer without leaning on the DAW.
  - Clock: treat it as a MIDI-clock slave; follow external clock/start/stop rather than asking it to lead.
  - Channel behavior: in practice it seems to respond across all MIDI channels, so route it carefully and avoid spraying unrelated note/CC data at it.
  - Needs a show-night decision on mixer channel and exactly which source is feeding its audio-processing path.
