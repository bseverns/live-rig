# nw_wrld / wrld_on

## Identity

- Category: visual/runtime endpoint.
- Status: `core/live` in current diagram.
- Aliases: nw_wrld, wrld_on.

## What it is

Named current project/runtime endpoint in the visual lane.

## Current rig relationship

Appears in the current studio diagram and failover docs, but naming and current protocol should be locked.

## I/O

- Video input/output: unknown.
- Control: likely bridge-driven scene/state messages.
- Host: unknown.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Start the runtime on the intended host.
2. Confirm it loads the expected scene/state vocabulary.
3. Send `scene.intro`, `state.blackout`, and `scene.clean_camera`.
4. Confirm display output.

## How to remove it safely

1. Trigger `state.blackout`.
2. Route display away or switch to a fallback endpoint.
3. Stop bridge output to avoid stale messages.

## Failure modes

- Naming mismatch across repos.
- Runtime starts but uses stale export or scene vocabulary.
- Endpoint opens but receives no scene.

## Evidence

- `RigMap.drawio.png`
- `11_repo-roles-failover.md`

- Photo slots:
  - `equipment/photos/nw-wrld-front.jpg`
  - `equipment/photos/nw-wrld-back.jpg`
  - `equipment/photos/nw-wrld-power.jpg`
  - `equipment/photos/nw-wrld-current-patch-2026-07-08.jpg`

## Open questions

- Canonical name.
- Host and launch command.
- Expected input protocol.
