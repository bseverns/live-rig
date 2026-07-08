# SCapps Chain Known-Good Card

## Use case

Video endpoint chain receiving semantic control from the bridge.

## Patch

- Video input: unknown until physical verification.
- Display output: unknown until physical verification.
- Control in: unknown host/port until physical verification.
- Audio in: none unless a specific app uses analysis directly.
- Clock source: none; should follow semantic control, not own rig clock.

## Settings

- App order: unknown until physical verification.
- Current project/preset: unknown until physical verification.
- Capture source: unknown until physical verification.
- Bridge output host/port: unknown until physical verification.

## Test

- [ ] Confirm video input is visible.
- [ ] Confirm `scene.intro` changes the endpoint.
- [ ] Confirm `state.blackout` blacks out the output.
- [ ] Confirm `scene.clean_camera` reaches a clean camera state.
- [ ] Confirm display/projector feed can be physically removed if software fails.
