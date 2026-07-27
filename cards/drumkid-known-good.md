# DrumKid Known-Good Card

## Use case

Rhythm core; clock boss or follower must be chosen per session.

## Patch

- Audio in: none expected unless a custom patch says otherwise.
- Audio out: unknown until physical verification.
- Mixer channel: unknown until physical verification.
- MIDI in: unknown until physical verification.
- MIDI out: unknown until physical verification.
- Clock source: unknown until session role is chosen.

## Settings

- Firmware reference baseline: V1.2 source at `../drumkid/` revision `be1cdce`
  (confirm the physical unit matches before relying on it).
- Pattern/sample state: unknown until physical verification.
- Clock: boss or follower, never both.
- MIDI input: clock/start/continue/stop; CC 16–31 on any channel; note-ons set
  drone root; program changes select beats. Keep Edirol and frZone off this
  input unless intentionally controlling DrumKid.
- MIDI output: clock/start/stop plus default drum notes on Ch 10. Keep its
  output out of the visual bridge unless intentionally filtered/mapped.
- Output level: unknown until physical verification.

## Test

- [ ] Confirm sound reaches mixer.
- [ ] Confirm the chosen clock role.
- [ ] Confirm no second device is also sending transport.
- [ ] Confirm Edirol Ch 10 and frZone Ch 15 do not reach the DrumKid input.
- [ ] Confirm DrumKid Ch 10 note output does not trigger visual mappings.
- [ ] Confirm downstream followers respond only when DrumKid is intentionally boss.
- [ ] Confirm main audio survives if DrumKid is muted/bypassed.
