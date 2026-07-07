# Maschine MK1

## Identity

- Category: controller / semantic deck.
- Status: `present/dormant`.
- Aliases: Maschine.

## What it is

Optional scene/event deck. It should stay narrow and semantic, not become transport authority.

## Current rig relationship

Documented as a dormant safe subset in `controllers/maschine-mk1.yaml` and `10_maschine-mk1-lane.md`.

## I/O

- MIDI/control: semantic pads only.
- Audio: no primary role.
- Clock/transport: should not own transport.

## How to muster it

1. Load only the safe subset.
2. Confirm `state.blackout` and `scene.clean_camera` pad mappings.
3. Keep transport disabled or ignored unless a future doc explicitly changes that.
4. Confirm it does not duplicate Edirol messages unexpectedly.

## How to remove it safely

1. Disable its MIDI input.
2. Confirm Edirol or web control still covers safety anchors.
3. Keep the current clock boss unchanged.

## Failure modes

- Accidentally becomes transport owner.
- Pads send raw values the runtime interprets directly.
- Dormant mappings are assumed active without testing.

## Evidence

- `10_maschine-mk1-lane.md`
- `controllers/maschine-mk1.yaml`

## Open questions

- Whether it should return to active use.
- Exact runtime input path when active.
