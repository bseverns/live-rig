---
name: Mapping change
about: Change a controller, scene, MIDI, OSC, or semantic mapping
title: "[mapping] "
labels: mapping
---

## Mapping being changed

- Source file:
- Semantic ID:
- Physical control or transport detail:

## Reason


## Safety check

- [ ] `state.blackout` remains mapped and reachable.
- [ ] `scene.clean_camera` remains mapped and reachable.
- [ ] `npm run validate:controllers` passes.
- [ ] `npm run export:rig-profile` was run if the runtime export depends on this change.
- [ ] `npm run validate:rig-profile` passes.

## Evidence


