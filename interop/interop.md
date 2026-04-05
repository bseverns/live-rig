# Interop Play Rules

This folder is the shared contract for **mappings**, **routing**, and **endpoint behavior** across the rig.
It exists so that UI mappings, bridge logic, and endpoint apps all agree on the same rules.

## Authority artifacts

The authority-side files in this folder now have separate jobs:

- `interop.schema.json`
  - schema for transport-level mapping files such as `mappings.json`
- `rig.contract.json`
  - authority contract for repo roles, survivability tiers, semantic IDs, and failover doctrine
- `rig.contract.schema.json`
  - schema for that authority contract
- `exports/live-rig.default.json`
  - exported runtime snapshot for sibling repos to mirror or import

Rule of thumb:

- `mappings.json` answers **how do we send it**
- `rig.contract.json` answers **what does it mean**
- `exports/live-rig.default.json` answers **what should a runtime consumer ingest**

## Transport ownership (clock invariant)

- **One device owns clock at a time.**
- **DrumKid may be the active clock controller** and can fan clock to other devices.
- **REAPER may own transport in DAW-led sets**, but it is not assumed in every configuration.
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

An optional **Maschine semantic lane** may sit beside them:

- dedicated to scene/state commands and bounded event triggers,
- separate from Ch 10 macro shaping,
- separate from Ch 15 analysis bias,
- and never a source of transport or clock.

## Optional Maschine semantic lane

If a Maschine MK1 is present, document it as a **semantic deck**, not just a bag of MIDI notes.

Rules:

- Use stable mapping IDs such as:
  - `masch.safe.blackout`
  - `masch.scene.intro`
  - `masch.event.noise_burst`
  - `masch.section.a`
- Prefer **OSC-first** routing for scene/state commands.
- Allow **hybrid MIDI+OSC** only where a one-shot event genuinely benefits from both.
- Keep raw note numbers, pad indices, and MIDI channel assignments marked as **TODO** until the hardware template is locked.
- Route Maschine directly to the computer MIDI bus that the bridge listens to; do not require REAPER to be in that path.
- Maschine must still respect the transport invariant:
  - no clock generation,
  - no global Start/Stop ownership,
  - no endpoint acting as a second transport boss.

## Naming conventions

Keep identifiers and OSC addresses predictable so mappings can be shared across tools.

### Mapping IDs

- **Lowercase, dot-delimited**: `namespace.category.action`
- Examples:
  - `scene.intro`
  - `state.blackout`
  - `event.noise_burst`
  - `macro.fb_feedback`
  - `analysis.low_band`

For legacy or endpoint-specific transport bindings, keep the transport ID stable and map it back to the shared semantic ID in the exported snapshot.

### OSC addresses

- **Slash-delimited, app-first**: `/app/feature/action`
- Examples:
  - `/video/scene/intro`
  - `/rig/state/blackout`
  - `/framebuffer/feedback`
  - `/analysis/low_band`
  - `/rig/event/noise_burst`

### Groups (radio / exclusive)

Scene selection should be mutually exclusive:

- Use `group` on each mapping.
- Mark the group as `exclusive: true` in the mappings file.

## Endpoint wiring model (Processing included)

All endpoints follow the same bridge contract:

1. **Inputs**: Ch 10 macros + Ch 15 analysis + optional semantic scene/event triggers.
2. **Scene logic**: scene table -> ramp -> combiner.
3. **Output router**: maps logical params to OSC/MIDI endpoints.

For **Processing endpoints**, treat them like SCapps:

- Receive OSC/MIDI **from the bridge output router**.
- Do **not** generate transport or clock.
- If you need timing, accept **incoming control** or forwarded clock from the bridge.

Routing note for Processing:

- CC/notes arrive via the **bridge output router** (virtual MIDI port or OSC).
- If clock is required, forward it from the **active clock boss / bridge** into the same port.

See the model in `09_scene-system.md` for the router mapping examples.

## Neutral degradation rules

The authority contract assumes the rig degrades in this order:

1. analysis can disappear first
2. the secondary endpoint can disappear next
3. the preferred UI can disappear as long as shared semantic IDs remain reachable

That means:

- if `frZone` goes away, continue from scene base + manual macros only
- if `MSVP` or `nw_wrld` goes away, switch to the peer endpoint or utility visual path
- if `live-rig-control` goes away, direct MIDI or OSC still targets the same scene and state vocabulary

See `11_repo-roles-failover.md` for the operator-facing failover matrix.

## Exported snapshot rule

Runtime repos should consume a committed snapshot generated from this repo instead of hand-copying mappings.

Authority-side commands:

```bash
node tools/validate-rig-contract.js interop/rig.contract.json --mappings mappings.json
node tools/export-rig-profile.js
node tools/validate-rig-profile.js interop/exports/live-rig.default.json
```

## Rig doctor env + ports

`tools/rig-doctor.js` expects these environment variables (or CLI flags):

- `RIG_MAPPINGS` - path to the current `mappings.json`.
- `RIG_OSC_OUT_HOST` - hostname/IP to send OSC to endpoints.
- `RIG_OSC_OUT_PORT` - port for OSC output.
- `RIG_OSC_IN_PORT` - port for OSC input/state queries.
- `RIG_MIDI_CONTROL_PORT` - name of the virtual MIDI port feeding the bridge.

These are just **interop defaults**; show docs can override with explicit notes.
