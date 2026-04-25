# Minimal Audio Patch

Profile: `profile.minimal`

Last updated from repo truth:
`profiles/minimal.yaml`, `docs/PREFLIGHT.md`, `interop/interop.md`

What to check:

- Audio output path is connected to the PA or interface.
- One active clock boss only.
- The room stays audible even if optional gear disappears.
- `state.blackout` remains available while audio continues.
- `scene.clean_camera` remains available while audio continues.

What failure looks like:

- silence at the PA
- clock is confused or duplicated
- the only safe visual path is gone
- optional gear is mistaken for a required patch

What to do next:

- patch the audio path first
- confirm the active clock boss
- restore blackout and clean camera access
- then reopen the room
