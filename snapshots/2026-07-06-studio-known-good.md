# 2026-07-06 studio known-good

This is a lightweight known-good placeholder for the current documented studio state. Replace unknowns with observed facts after the next physical test.

## Profile

- Worked profile: `profiles/minimal.yaml`
- Scene file: `scenes/minimal-scenes.yaml`
- Runtime export: `interop/exports/live-rig.default.json`

## Physical devices present

- Required minimal controller: Edirol PCM-30 or equivalent
- Required visual endpoint: one endpoint or placeholder endpoint
- Required audio path: mixer/main bus to PA or interface
- Optional analysis: frZone
- Optional semantic deck: Maschine MK1

## Clock

- Clock boss: unknown until physically confirmed
- Rule: exactly one active clock boss
- Followers: controller and visual endpoints

## Visual endpoint

- Known-good endpoint: unknown until physically confirmed
- Required survival state: `state.blackout`
- Required work-light state: `scene.clean_camera`

## Safety anchors

- `state.blackout` hand-tested: unknown
- `scene.clean_camera` hand-tested: unknown
- Audio-only survival tested: unknown
- frZone influenced visuals: unknown

## Weird but acceptable

- Optional devices may be absent.
- Analysis may be absent if manual scene control and safety states work.
- Secondary endpoints may be absent.

## Do not change before next test

- Do not remove `state.blackout` or `scene.clean_camera`.
- Do not let optional analysis become required for visual survival.
- Do not introduce a second clock boss.
- Do not hand-edit the runtime export without regenerating and validating it.
