# Bridge Host Known-Good Card

## Use case

Semantic bridge host reading the exported rig profile and sending endpoint control.

## Patch

- Host machine: unknown until physical verification.
- MIDI input port: unknown until physical verification.
- OSC/MIDI output host/port: unknown until physical verification.
- Profile/export: `interop/exports/live-rig.default.json` unless a show doc says otherwise.
- Clock source: none; bridge should not own transport.

## Settings

- Launch command: `node bridge/src/index.js` for the reference bridge.
- Simulate blackout: `node bridge/src/index.js --simulate state.blackout`.
- Simulate clean camera: `node bridge/src/index.js --simulate scene.clean_camera`.
- Runtime profile: unknown until physical verification.

## Test

- [ ] Run `npm run doctor:json`.
- [ ] Confirm the selected profile/export is current.
- [ ] Confirm MIDI input receives Edirol Button 4 and Button 5.
- [ ] Confirm output reaches the SCapps endpoint.
- [ ] Confirm stopping the bridge does not harm audio-only survival.
