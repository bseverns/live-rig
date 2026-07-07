---
name: Troubleshooting
about: Capture a live-rig failure with enough evidence to debug it
title: "[troubleshooting] "
labels: troubleshooting
---

## What I am trying to do


## What is failing

- [ ] No audio
- [ ] No visuals
- [ ] Edirol not controlling scenes
- [ ] frZone not affecting visuals
- [ ] Clock / sync problem
- [ ] Blackout or clean camera unavailable
- [ ] Export / profile / validation problem
- [ ] Unsure which doc/source is authoritative

## Current safety state

- Can I trigger `state.blackout`? yes / no / unknown
- Can I trigger `scene.clean_camera`? yes / no / unknown
- Can the audio lane survive without visuals? yes / no / unknown

## Commands run

```bash
npm run doctor:json
npm run collect:debug
npm run validate:scenes
npm run validate:profiles
npm run validate:controllers
npm run check:sheets
```

## Current setup

- Profile:
- Clock boss:
- Controller path:
- Visual endpoint:
- Audio path:

## Evidence

- [ ] Photo of mixer
- [ ] Photo of controller
- [ ] Photo/screenshot of bridge/runtime
- [ ] Screenshot of MIDI/OSC routing
- [ ] Doctor JSON
- [ ] Show sheet or patch sheet
- [ ] Exact error text

## What changed since the last known-good state?


