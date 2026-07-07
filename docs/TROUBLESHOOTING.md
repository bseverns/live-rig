# Troubleshooting

This page starts from symptoms. Use it when the room is loud, the path is unclear, or another person needs evidence instead of lore.

## First rule: recover the room

1. Trigger `state.blackout`.
2. If blackout fails, remove the projector/display feed physically.
3. Confirm the audio lane can survive without visuals.
4. Rebuild clock, controller, endpoint, and analysis layers one at a time.
5. Do not chase optional enrichment until blackout, clean camera, audio, and one endpoint are understood.

## Symptom: no audio at PA

Likely causes:

- Main mix is not reaching Horizon, PA, or interface.
- Mixer channel, subgroup, or main out is muted.
- Horizon or interface input/output is patched wrong.
- Gain is staged too low or clipping into silence downstream.

Check:

- Mixer channel meters, main meters, mute states, and main output cable.
- Horizon input/output path.
- PA/interface input selection and gain.
- [sheets/minimal-audio-patch.md](../sheets/minimal-audio-patch.md).

Evidence to capture:

- Photo of mixer channels and main section.
- Photo of Horizon I/O.
- Note which outputs feed PA/interface.

## Symptom: audio works, visuals dead

Likely causes:

- Visual endpoint is closed, listening on the wrong port, or not consuming semantic messages.
- Display/projector input is wrong.
- Bridge is not running or is sending to the wrong host/port.
- Exported runtime profile is stale.

Check:

- `npm run doctor:json`
- `npm run validate:rig-profile`
- `npm run bridge:simulate:intro`
- Endpoint host/port against `RIG_OSC_OUT_HOST` and `RIG_OSC_OUT_PORT`.
- Physical display input and cable.

Evidence to capture:

- Screenshot of endpoint/runtime.
- Doctor JSON or `npm run collect:debug` output folder.
- Photo of display/projector input path.

## Symptom: visuals work, controller dead

Likely causes:

- Edirol is not connected to the expected MIDI input.
- The runtime is listening to a different MIDI port.
- Controller map changed but profile/export did not.
- MIDI channel does not match the controller map.

Check:

- `controllers/edirol-pcm30.yaml`
- `npm run validate:controllers`
- `npm run doctor:helper`
- `RIG_MIDI_CONTROL_PORT`
- Whether Button 4 reaches `state.blackout` and Button 5 reaches `scene.clean_camera`.

Evidence to capture:

- Photo of controller and any MIDI interface.
- Screenshot of MIDI routing.
- Exact MIDI input port name visible in the runtime.

## Symptom: Edirol messages arrive but wrong scenes fire

Likely causes:

- Raw MIDI note/channel no longer matches the controller map.
- Another routing layer is transposing, remapping, or duplicating messages.
- Runtime profile export is stale.
- Endpoint is interpreting transport details directly instead of semantic IDs.

Check:

- `controllers/edirol-pcm30.yaml`
- `scenes/minimal-scenes.yaml`
- `interop/exports/live-rig.default.json`
- `npm run export:rig-profile`
- `npm run validate:rig-profile`

Evidence to capture:

- Which physical control was pressed.
- What semantic ID fired.
- Any MIDI monitor output showing channel and note/CC.

## Symptom: frZone active but not influencing visuals

Likely causes:

- frZone hears audio but its analysis output is not routed to the bridge or endpoint.
- Analysis CC channel does not match the expected lane.
- Current scene weights or influence values are low.
- Endpoint treats analysis as optional and is ignoring it.

Check:

- [06_frzone-linelight.md](../06_frzone-linelight.md)
- Scene `analysis.influence` and `analysis.weights`.
- Audio feed into frZone.
- MIDI/OSC path from frZone to the consuming runtime.

Evidence to capture:

- Screenshot or meter proof that frZone is receiving audio.
- Current scene ID.
- Routing screenshot for analysis output.

## Symptom: clock is doubled, drifting, or starting wrong devices

Likely causes:

- More than one device owns Start/Stop or MIDI clock.
- A follower is also forwarding clock.
- REAPER, DrumKid, SQ-64, or another sequencer is unintentionally the boss.
- Endpoint transport is being controlled by a device that should only follow.

Check:

- [03_midi-clock-video.md](../03_midi-clock-video.md)
- The selected profile `clock_doctrine`.
- Hardware clock send/receive settings.
- Whether each device is boss, follower, or ignored.

Evidence to capture:

- Name the single intended clock boss.
- Photo/screenshot of sync settings for each sequencer or runtime.
- Note which device starts first and which devices respond.

## Symptom: blackout unavailable

Likely causes:

- Controller mapping for `state.blackout` is missing or unreachable.
- Endpoint does not implement blackout.
- Bridge/export is stale.
- Physical display feed needs to be killed because software recovery failed.

Check:

- Button/control mapped to `state.blackout`.
- `npm run bridge:simulate:blackout`
- `npm run doctor:strict`
- Whether the endpoint receives `/rig/state/blackout` or the exported semantic state.

Evidence to capture:

- The fastest physical way to remove display feed.
- Which control was tried.
- Runtime log or screenshot showing whether the state arrived.

## Symptom: clean camera unavailable

Likely causes:

- `scene.clean_camera` is missing from scene file, export, endpoint, or controller map.
- Endpoint camera input is unavailable.
- Another scene or manual override keeps burying the clean view.

Check:

- `scenes/minimal-scenes.yaml`
- `controllers/edirol-pcm30.yaml`
- `npm run bridge:simulate:intro`
- `npm run validate:scenes`
- Camera input and endpoint source selection.

Evidence to capture:

- Photo/screenshot of camera source in the endpoint.
- Exact control used for `scene.clean_camera`.
- Whether `state.blackout` still works.

## Symptom: export/profile mismatch

Likely causes:

- Scene, controller, or profile files changed after export.
- Wrong profile was selected.
- `interop/exports/live-rig.default.json` was edited by hand.

Check:

- `npm run doctor:json`
- `npm run export:rig-profile`
- `npm run validate:rig-profile`
- `git diff -- interop/exports/live-rig.default.json`

Evidence to capture:

- Selected profile path.
- Current export fingerprint.
- Doctor export freshness warning, if present.

## Symptom: hardware changed and the source of truth is unclear

Likely causes:

- Hardware registry row exists but dedicated node page does not.
- Real patch differs from current-state docs.
- Show notes captured a one-night routing but it was not promoted to stable docs.

Check:

- [13_hardware-registry.md](../13_hardware-registry.md)
- [12_current-studio-rig.md](../12_current-studio-rig.md)
- Any matching `hardware/*.md` page.
- Show-specific docs and sheets.

Evidence to capture:

- Device name, role, audio I/O, MIDI/clock behavior.
- Photo of the new patch.
- Smallest change since last known-good state.

## What to collect before asking for help

Run:

```bash
npm run doctor:helper
npm run collect:debug
npm run validate:scenes
npm run validate:profiles
npm run validate:controllers
npm run check:sheets
```

Attach:

- The `logs/live-rig-debug-*` folder path or relevant files from it.
- Photos of mixer, controller, endpoint/runtime, and MIDI/clock routing.
- Whether `state.blackout` and `scene.clean_camera` were hand-tested.
- The smallest thing that changed since the last known-good state.
