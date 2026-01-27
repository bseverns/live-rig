# Mapping Interop Migration (Toggle Off Semantics)

This repo now includes a versioned interop contract (`interop/interop.schema.json`) plus a validator and simulator for `mappings.json`-style files.

## What changed (additive)

Toggles must declare explicit **on/off** semantics:

- OSC bindings should include **`onArgs`** and **`offArgs`** (or legacy `args` + `offArgs`).
- MIDI bindings should include **`onValue`** (or `value`) **and** `offValue`.
- Set `interaction: "toggle"` (or `type: "toggle"` / `toggle: true`) on mappings that should behave like latching toggles.

Momentary mappings do not need `offArgs` / `offValue`.

## Example (legacy → updated)

Before (legacy toggle only sends `[1]`):

```json
{
  "id": "nw_wrld.feed.enable",
  "osc": {
    "address": "/nw_wrld/feed/enable",
    "args": [1]
  }
}
```

After (explicit on/off):

```json
{
  "id": "nw_wrld.feed.enable",
  "interaction": "toggle",
  "osc": {
    "address": "/nw_wrld/feed/enable",
    "onArgs": [1],
    "offArgs": [0]
  }
}
```

MIDI example:

```json
{
  "id": "vid.scene.intro",
  "interaction": "toggle",
  "midi": {
    "type": "note",
    "channel": 10,
    "note": 60,
    "onValue": 127,
    "offValue": 0
  }
}
```

## Optional: Exclusive (radio) groups

If a set of mappings should be mutually exclusive (scene selection), declare a group and mark it `exclusive`.

```json
{
  "groups": {
    "nw_wrld.scene": { "exclusive": true }
  },
  "mappings": [
    { "id": "nw_wrld.scene.intro", "group": "nw_wrld.scene", "interaction": "toggle", "osc": { "address": "/nw_wrld/scene/intro", "onArgs": [1], "offArgs": [0] } },
    { "id": "nw_wrld.scene.outro", "group": "nw_wrld.scene", "interaction": "toggle", "osc": { "address": "/nw_wrld/scene/outro", "onArgs": [1], "offArgs": [0] } }
  ]
}
```

## Validator & Simulator

Install dependencies once:

```bash
npm install
```

Validate a mappings file:

```bash
node tools/validate-mappings.js path/to/mappings.json
```

Simulate a mapping (by id or OSC address):

```bash
node tools/simulate-mapping.js path/to/mappings.json /nw_wrld/feed/enable
```
