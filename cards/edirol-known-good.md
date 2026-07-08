# Edirol PCM-30 Known-Good Card

## Use case

Visual macro controller and safety surface on MIDI channel 10.

## Patch

- MIDI out/interface: unknown until physical verification.
- Current port name: unknown until physical verification.
- Runtime input: `RIG_MIDI_CONTROL_PORT` or selected bridge/REAPER MIDI input.
- Audio/video: none directly.
- Clock source: none; do not make it transport boss.

## Settings

- Current template/program number: unknown until physical verification.
- Documented Button 4 mapping: channel 10, note 63, semantic `state.blackout`.
- Documented Button 5 mapping: channel 10, note 64, semantic `scene.clean_camera`.
- Actual Button 4 MIDI note/channel: unknown until hand-tested.
- Actual Button 5 MIDI note/channel: unknown until hand-tested.

## Test

- [ ] Confirm the port appears under the expected runtime name.
- [ ] Confirm Button 4 triggers `state.blackout`.
- [ ] Confirm Button 5 triggers `scene.clean_camera`.
- [ ] Confirm scene buttons fire semantic IDs, not endpoint-specific transport.
- [ ] Confirm the rig still has a blackout path if the controller is unplugged.

## Evidence to add

- `equipment/photos/edirol-pcm30-front.jpg`
- `equipment/photos/edirol-pcm30-back.jpg`
- `equipment/photos/edirol-pcm30-power.jpg`
- `equipment/photos/edirol-pcm30-current-patch-2026-07-08.jpg`
