# Help request: live-rig

Use this when asking another person for help. Fill it in with the smallest accurate facts available.

## What I am trying to do

Describe the desired rig state in one or two sentences.

Example: I am trying to run the minimal playable rig with Edirol scene control, one visual endpoint, audio to PA, and blackout/clean-camera available.

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

## Commands I ran

```bash
npm run doctor:json
npm run validate:scenes
npm run validate:profiles
npm run validate:controllers
npm run check:sheets
npm run collect:debug
```

Paste output or attach the `logs/live-rig-debug-*` folder contents.

## Current setup

- Profile:
- Clock boss:
- Controller path:
- Visual endpoint:
- Audio path:

## Evidence attached

- [ ] Photo of mixer
- [ ] Photo of controller
- [ ] Photo/screenshot of bridge/runtime
- [ ] Screenshot of MIDI/OSC routing
- [ ] Doctor JSON
- [ ] Show sheet or patch sheet
- [ ] Exact error text

## What changed since the last known-good state?

Write the smallest possible change.

Examples:

- changed MIDI interface
- moved Edirol from direct bridge input to REAPER routing
- changed scene file
- changed endpoint
- changed clock owner
- added frZone
- moved from studio to venue
