# Controllers

Controller maps bind physical controls to semantic actions.

That distinction matters:

- a physical control is a button, pad, knob, fader, or web UI element
- a semantic action is a named rig truth such as `scene.intro` or `state.blackout`

The repo wants the second thing to stay stable even if the first thing changes.

## Why raw MIDI is not meaning

Raw MIDI note and CC numbers are transport details.
They tell you how a control moves through the wire, not what the rig is supposed to do.

If a show doc says:

- button 4 sends note 63

that is useful wiring information.

If the repo says:

- button 4 means `state.blackout`

that is authority.

Keep both, but never confuse them.

## Current controller maps

- [`controllers/edirol-pcm30.yaml`](../controllers/edirol-pcm30.yaml)
  - primary physical macro surface
  - includes intro, crash, soft, clean camera, blackout, manual override, and a macro CC

- [`controllers/maschine-mk1.yaml`](../controllers/maschine-mk1.yaml)
  - conservative dormant safe subset
  - uses a narrow semantic set and keeps the lower rows unarmed

- [`controllers/live-rig-control.yaml`](../controllers/live-rig-control.yaml)
  - semantic web surface
  - expresses actions directly over OSC instead of pretending to be a MIDI device

## Validation

Validate the controller maps with:

```bash
npm run validate:controllers
```

Validate the broader control-surface surface set with:

```bash
npm run validate:control-surfaces
```

The validator checks:

- schema conformance
- semantic IDs against the shared contract
- semantic IDs against the active scene file when available
- duplicate physical mappings within a controller
- blackout reachability
- clean-camera reachability

## Adding a new controller safely

1. Start from the semantic IDs already present in the contract and scene files.
2. Map blackout first.
3. Map clean camera second.
4. Add one or two obvious scene recalls before adding any dense macro layer.
5. Keep MIDI channel assumptions explicit where you use MIDI.
6. Mark temporary or intentionally mirrored mappings with `allow_duplicate: true`.

If you cannot keep blackout reachable, the controller is not ready.

## Safe subset rule

Some surfaces should stay conservative.

`Maschine MK1` is the example:

- treat it as dormant unless the show doc explicitly arms it
- keep the binding count small
- avoid locking every pad or row too early
- prefer readable safety and scene recall over clever coverage

## Manual safety

No controller map replaces the operator’s hand test.

Always verify these by hand in the room:

- `state.blackout`
- `scene.clean_camera`

If either one is not instantly reachable, stop and fix the map before the room gets louder.
