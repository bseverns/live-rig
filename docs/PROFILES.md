# Mission Profiles

Profiles are the show-readiness layer.
They bind scenes to the devices, patch assumptions, and operational checks needed to actually use the rig in a room.

## Profile vs scene

A scene says what the rig should do visually.
A profile says what must be present, what is optional, and how the rig is expected to survive the room.

Use scenes for:

- semantic visual states
- safety states
- triggers and params

Use profiles for:

- required devices
- optional devices
- controllers
- visual endpoints
- audio patch assumptions
- clock doctrine
- readiness checks

## Minimal vs full

The repo now ships two mission profiles:

- `profiles/minimal.yaml`
  - smallest viable live rig
  - assumes one controller path, one visual endpoint or placeholder, and a working audio output path
  - treats frZone and Maschine as optional

- `profiles/full-studio.yaml`
  - larger studio/live-rig envelope
  - keeps required and optional devices separated so the rig can degrade cleanly
  - still preserves the same blackout and clean-camera safety anchors

Both profiles point at the same scene authority file for now.
That keeps the profile layer focused on readiness and topology rather than duplicating scene content.

## Show readiness

Profiles help the repo answer a practical question:

Can this rig actually be loaded for the show I am about to play?

The profile layer makes that answer machine-readable by collecting:

- the scene file to load
- what devices are required
- what devices are optional
- how clock should behave
- what safety states must be reachable
- what doctor/readiness checks should pass before the room is green

## Loading order

Future tools should load a profile first, then load the scene file named by that profile, then resolve controllers and endpoints.

That gives the tool a stable order:

1. profile
2. scenes
3. controllers
4. endpoints
5. readiness checks

Do not let downstream tools invent their own version of the rig topology when a profile already exists.

## Validation

Validate the default profile set with:

```bash
npm run validate:profiles
```

Validate the minimal profile only:

```bash
npm run validate:profile:minimal
```

Validate the full-studio profile only:

```bash
npm run validate:profile:full
```

The validator checks:

- schema conformance
- repository-relative scene file existence
- optional scene validation when enabled
- `state.blackout` in `safety_states`
- `scene.clean_camera` in `safety_states`

## Consumption rule

Load profiles before scenes, and load scenes before controller-specific logic.

That keeps the authority layer centered on shared truth instead of transport details or endpoint-specific guesses.
