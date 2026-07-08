# MSVP

## Identity

- Category: visual/runtime endpoint.
- Status: `core/live` in failover docs.
- Aliases: MSVP.

## What it is

Peer visual/runtime endpoint in the broader visual ecosystem.

## Current rig relationship

Named as part of the failover relationship, but current endpoint role and inputs need capture.

## I/O

- Video input/output: unknown.
- Control: likely semantic scene/state messages or endpoint-specific bridge path.
- Host: unknown.

## Verification

- Last physically verified: unknown.
- Verified by: unknown.
- Confidence: unknown until physical verification.
- Still unknown: see Open questions and muster notes.

## How to muster it

1. Confirm host/runtime.
2. Confirm input source and display output.
3. Send `state.blackout` and `scene.clean_camera`.
4. Record whether it is primary, secondary, or fallback.

## How to remove it safely

1. Route display to another endpoint or blackout.
2. Stop sending bridge output to it.
3. Confirm remaining endpoint still handles safety anchors.

## Failure modes

- Treated as active because named in docs but not actually running.
- Endpoint protocol differs from current export.
- Display output is selected but no scene messages arrive.

## Evidence

- `11_repo-roles-failover.md`
- `RigMap.drawio.png`

- Photo slots:
  - `equipment/photos/msvp-front.jpg`
  - `equipment/photos/msvp-back.jpg`
  - `equipment/photos/msvp-power.jpg`
  - `equipment/photos/msvp-current-patch-2026-07-08.jpg`

## Open questions

- Current host.
- Current protocol.
- Primary or fallback status.
