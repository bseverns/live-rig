# Mac mini

## Identity

- Category: compute host.
- Status: `core/live` in the current diagram.
- Aliases: Macmini.

## What it is

Computer host for some combination of bridge, visual runtimes, REAPER, and utility software.

## Current rig relationship

Named in `RigMap.drawio.png`, but exact hosted processes need capture per setup.

## I/O

- MIDI/USB: depends on connected controllers/interfaces.
- Audio: possible interface or REAPER host.
- Video: possible endpoint host or display output.
- Network/OSC: bridge and endpoint traffic.

## How to muster it

1. Name which processes it hosts tonight.
2. Confirm MIDI devices and audio interface.
3. Confirm bridge profile/export if it hosts the bridge.
4. Confirm display/endpoint role if it hosts visuals.

## How to remove it safely

1. Confirm which lanes depend on it.
2. Preserve audio-only survival if visual/bridge processes fail.
3. Move clock/control ownership deliberately before shutdown.

## Failure modes

- Too many responsibilities are assumed but not named.
- MIDI/OSC ports differ between launches.
- Display output or capture permissions change.

## Evidence

- `RigMap.drawio.png`
- `12_current-studio-rig.md`
- `docs/PREFLIGHT.md`

## Open questions

- Current hosted runtimes.
- Audio interface.
- MIDI interface names.
