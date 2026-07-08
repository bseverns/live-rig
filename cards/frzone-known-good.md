# frZone Known-Good Card

## Use case

Audio analysis feeding visual bias; never required for safety.

## Patch

- Audio in: post-fader mixer bus, exact output unknown until physical verification.
- Audio out: none required unless monitoring is patched.
- Mixer channel/send: unknown until physical verification.
- Control out: analysis CCs, conventionally channel 15.
- Clock source: none.

## Settings

- Project/runtime: unknown until physical verification.
- Input device: unknown until physical verification.
- Output protocol/path: unknown until physical verification.
- Analysis weight: scene-dependent; must be bypassable.

## Test

- [ ] Confirm frZone meters respond to the post-fader mix.
- [ ] Confirm analysis output reaches the bridge or endpoint.
- [ ] Confirm Edirol/manual scenes still work with frZone muted or closed.
- [ ] Confirm `state.blackout` ignores or overrides analysis.
