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

- Pattern/firmware/sample state: unknown until physical verification.
- Clock: boss or follower, never both.
- MIDI filtering: unknown until physical verification.
- Output level: unknown until physical verification.

## Test

- [ ] Confirm sound reaches mixer.
- [ ] Confirm the chosen clock role.
- [ ] Confirm no second device is also sending transport.
- [ ] Confirm downstream followers respond only when DrumKid is intentionally boss.
- [ ] Confirm main audio survives if DrumKid is muted/bypassed.
