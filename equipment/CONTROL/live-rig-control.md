# live-rig-control

## Identity

- Category: performer-facing control runtime.
- Status: `core/live` in the current diagram.
- Aliases: liverigControl, live-rig-control.

## What it is

Software control surface/runtime adjacent to this repo. It can act as a semantic control surface, but this repo remains the authority layer for the rig contract.

## Current rig relationship

Named in the current diagram and represented by `controllers/live-rig-control.yaml`.

## I/O

- Input: user interaction.
- Output: semantic scene/state/macro controls.
- Network/MIDI/OSC: current path unknown.

## How to muster it

1. Confirm the app/repo location and launch path.
2. Confirm it uses the current exported rig profile or compatible semantic IDs.
3. Trigger `state.blackout` and `scene.clean_camera`.
4. Confirm it does not conflict with Edirol control.

## How to remove it safely

1. Close or disconnect its control output.
2. Confirm Edirol still covers safety anchors.
3. Keep the current bridge/export state unchanged.

## Failure modes

- App uses stale mappings.
- It duplicates or conflicts with physical controller messages.
- It is available in theory but not active in the current patch.

## Evidence

- `controllers/live-rig-control.yaml`
- `RigMap.drawio.png`
- `13_hardware-registry.md`

## Open questions

- Current repo path.
- Current launch workflow.
- Current transport protocol.
