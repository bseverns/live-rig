# Failover Card

Profile: `profile.minimal`

Last updated from repo truth:
`profiles/minimal.yaml`, `scenes/minimal-scenes.yaml`, `controllers/edirol-pcm30.yaml`, `docs/CONTROLLERS.md`

What to check:

- `state.blackout` is one gesture away.
- `scene.clean_camera` is one gesture away.
- Audio-only survival still works.
- The remaining endpoint can take semantic scene IDs.
- The controller still reaches safety states.

What failure looks like:

- blackout missing
- clean camera missing
- audio-only survival fails
- endpoint dead
- controller dead
- frZone dead
- clock confusion

What to do next:

- if blackout fails, stop and recover the room immediately
- if clean camera fails, switch to the simplest readable view
- if only audio survives, keep the set usable and reduce visual pressure
- if the endpoint dies, use the remaining semantic path
- if the controller dies, fall back to the surviving control surface
- if frZone dies, ignore analysis and continue from manual macro authority
- if clock is confused, pick one boss and remove the rest
