# Minimal Preflight

Profile: `profile.minimal`

Last updated from repo truth:
`profiles/minimal.yaml`, `scenes/minimal-scenes.yaml`, `controllers/edirol-pcm30.yaml`, `interop/exports/live-rig.default.json`

What to check:

- `state.blackout` is reachable from the Edirol surface.
- `scene.clean_camera` is reachable from the Edirol surface.
- The selected profile is `profiles/minimal.yaml`.
- The scene file validates.
- Audio output reaches the PA or interface.

What failure looks like:

- blackout does not fire instantly
- clean camera is missing or buried
- the scene file is missing or invalid
- the room has no audible path

What to do next:

- fix the profile or scene file first
- re-run `npm run doctor:minimal`
- test blackout and clean camera by hand before opening the room
