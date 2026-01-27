# Interop Play Rules

This folder is the shared contract for **mappings**, **routing**, and **endpoint behavior** across the rig.
It exists so that UI mappings, bridge logic, and endpoint apps all agree on the same rules.

## Transport ownership (clock invariant)

- **REAPER owns transport.**
- **DrumKid is the clock target** and can fan clock to other devices.
- **Endpoints follow clock; they never generate it.**
  - SCapps, Processing sketches, and any other endpoints only **consume** control data.
  - If an endpoint needs time, it should derive it from incoming CC/OSC or forwarded clock,
    never as the origin.

This invariant keeps timing unambiguous and avoids multiple masters.

## Control lanes (macro vs analysis)

The interop contract assumes two primary control lanes:

- **Macro lane (Ch 10)**: human-driven, big/fine moves from Edirol.
- **Analysis lane (Ch 15)**: audio-reactive bias from frZone.

These are combined in the bridge using the endpoint wiring model
(`09_scene-system.md`), then routed to endpoints via OSC/MIDI.

## Naming conventions

Keep identifiers and OSC addresses predictable so mappings can be shared across tools.

### Mapping IDs

- **Lowercase, dot-delimited**: `namespace.category.action`
- Examples:
  - `nw_wrld.feed.enable`
  - `nw_wrld.scene.intro`
  - `vid.scene.intro`
  - `macro.fb_feedback`

### OSC addresses

- **Slash-delimited, app-first**: `/app/feature/action`
- Examples:
  - `/nw_wrld/feed/enable`
  - `/nw_wrld/scene/intro`
  - `/framebuffer/feedback`

### Groups (radio / exclusive)

Scene selection should be mutually exclusive:

- Use `group` on each mapping.
- Mark the group as `exclusive: true` in the mappings file.

## Endpoint wiring model (Processing included)

All endpoints follow the same bridge contract:

1. **Inputs**: Ch 10 macros + Ch 15 analysis.
2. **Scene logic**: scene table -> ramp -> combiner.
3. **Output router**: maps logical params to OSC/MIDI endpoints.

For **Processing endpoints**, treat them like SCapps:

- Receive OSC/MIDI **from the bridge output router**.
- Do **not** generate transport or clock.
- If you need timing, accept **incoming control** or forwarded clock from the bridge.

Routing note for Processing:

- CC/notes arrive via the **bridge output router** (virtual MIDI port or OSC).
- If clock is required, forward it **from REAPER/bridge** into the same port.

See the model in `09_scene-system.md` for the router mapping examples.

## Rig doctor env + ports

`tools/rig-doctor.js` expects these environment variables (or CLI flags):

- `RIG_MAPPINGS` - path to the current `mappings.json`.
- `RIG_OSC_OUT_HOST` - hostname/IP to send OSC to endpoints.
- `RIG_OSC_OUT_PORT` - port for OSC output.
- `RIG_OSC_IN_PORT` - port for OSC input/state queries.
- `RIG_MIDI_CONTROL_PORT` - name of the virtual MIDI port feeding the bridge.

These are just **interop defaults**; show docs can override with explicit notes.
