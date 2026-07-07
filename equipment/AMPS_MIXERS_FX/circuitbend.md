# circuitBend

## Identity

- Category: external processing node or category label.
- Status: `core/live` in the current diagram.
- Aliases: circuitBend.

## What it is

Named processing object or category in the current diagram. Exact identity is unclear.

## Current rig relationship

Treat as an under-specified processing node until the actual device or chain is identified.

## I/O

- Audio input: unknown.
- Audio output: unknown.
- MIDI/clock: unknown, likely none.

## How to muster it

1. Identify whether this is a specific device, chain, or category label.
2. Confirm input/output path.
3. Confirm bypass and gain behavior.
4. Rename/split the passport if it becomes a stable object.

## How to remove it safely

1. Bypass or mute the processing path.
2. Confirm main audio still reaches PA/interface.
3. Document whether it was insert, send/return, or parallel.

## Failure modes

- Label hides multiple devices.
- Processor becomes required without a bypass path.
- Gain/noise behavior changes the whole mix.

## Evidence

- `RigMap.drawio.png`

## Open questions

- Exact identity.
- Patch position.
- Bypass path.
