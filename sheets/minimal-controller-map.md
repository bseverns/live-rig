# Minimal Controller Map

Profile: `profile.minimal`

Last updated from repo truth:
`controllers/edirol-pcm30.yaml`, `scenes/minimal-scenes.yaml`, `docs/CONTROLLERS.md`

What to check:

- Button 4 maps to `state.blackout`.
- Button 5 maps to `scene.clean_camera`.
- Button 1 maps to `scene.intro`.
- Button 2 maps to `scene.crash`.
- Button 3 maps to `scene.soft`.
- Knob 1 maps to `macro.fb_feedback` on MIDI CC 21.

What failure looks like:

- blackout is not on a known physical control
- clean camera is not on a known physical control
- scene recall only works by guessing note numbers
- the macro CC is missing or moved without updating the sheet

What to do next:

- fix `controllers/edirol-pcm30.yaml`
- re-run `npm run validate:controllers`
- keep the semantic IDs stable even if the hardware changes
