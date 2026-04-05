# 11 – Repo roles & failover

This document turns the apparatus into a **contract-first system** instead of a brittle chain of repos.

The rule is simple:

> no single named repo should be so fundamental that the whole rig collapses

`live-rig` now acts as the **authority repo** for topology, vocabulary, snapshots, and failover doctrine.
Runtime repos consume exported snapshots from here, but the repo itself is not required to be open on show night.

---

## Repo role registry

| Repo | Role | What it owns | If it disappears |
|------|------|--------------|------------------|
| `live-rig` | authority | topology, scene/state vocabulary, mapping snapshots, failover doctrine | no show-night impact once snapshots are exported |
| `live-rig-control` | controller | preferred performer UI, mapping-driven dispatch, degraded-state messaging | direct hardware or bridge routing still triggers the same semantic IDs |
| `frZone` | analysis | normalized band analysis only | visuals fall back to scene base + manual macros |
| `MSVP` | endpoint | beat-synced visual endpoint | switch to `nw_wrld` or utility visual path |
| `nw_wrld` | endpoint | project-driven runtime endpoint | switch to `MSVP` or utility visual path |
| `wrld_on` | workspace | `nw_wrld` project content and modules | use another workspace or another endpoint |
| `live-rig-3Dvideo` | lab | optional assets, clips, live-source experiments | no minimum-rig impact |

`MSVP` and `nw_wrld` are **peer endpoints**.
Neither repo owns canonical scene naming, transport doctrine, or the rig’s contract language.

---

## Survivability tiers

### Tier A

Minimum outcome:

- audio lane survives independently
- one clock boss remains clear
- an emergency safe visual path is documented

If Tier A fails, the set is effectively over.

### Tier B

Minimum outcome:

- one controller path survives
- one visual endpoint path survives
- shared `scene.*` and `state.*` IDs remain reachable

This is the main anti-collapse tier.
The rig should still function even if the preferred UI or one visual runtime disappears.

### Tier C

Minimum outcome:

- analysis lane is optional
- secondary endpoints are optional
- lab or offline repos are optional

Tier C loss should reduce richness, not stop the set.

---

## Shared contract

The contract lives in:

- `interop/rig.contract.json`
- `interop/rig.contract.schema.json`
- `interop/exports/live-rig.default.json`

The current authority-side rules are:

- shared semantics use stable IDs such as `scene.*`, `state.*`, `event.*`, `macro.*`, and `analysis.*`
- mappings remain transport details beneath the contract
- endpoints consume translated intent instead of inventing private scene languages
- analysis is additive only and can drop to neutral without breaking scene control
- runtime repos should consume the exported snapshot, not hand-copy ad hoc mappings

---

## Failover matrix

### `live-rig-control` unavailable

- fallback: Edirol and Maschine route directly into the bridge
- expected outcome: shared scenes and blackout still fire

### `frZone` unavailable

- fallback: scene base + manual macro control only
- expected outcome: visuals continue without analysis bias

### `MSVP` unavailable

- fallback: `nw_wrld` or clean-camera / blackout utility path
- expected outcome: one visual path remains available

### `nw_wrld` or `wrld_on` unavailable

- fallback: `MSVP` or clean-camera / SCapps utility path
- expected outcome: one visual path remains available

### `live-rig-3Dvideo` unavailable

- fallback: none required
- expected outcome: no minimum-rig impact

### `live-rig` unavailable at runtime

- fallback: exported snapshot already mirrored into consumers
- expected outcome: no runtime impact

---

## Show-night failure cards

### Card A – keep audio alive

- Confirm one clock owner only.
- Keep mixer -> Horizon -> PA intact.
- If visuals are unstable, trigger blackout or utility visual path and keep audio running.

### Card B – keep one control path and one visual path alive

- If the preferred UI dies, use direct hardware or bridge routing.
- If the active endpoint dies, switch to the peer endpoint.
- If neither rich endpoint is stable, hold on clean camera or blackout.

### Card C – drop enrichment first

- Lose `frZone` before you lose scenes.
- Lose the secondary endpoint before you lose the active one.
- Lose lab outputs, clips, and optional control buses before you lose the minimum rig.

---

## Export workflow

Authority-side commands:

```bash
npm run validate:rig-contract
npm run export:rig-profile
npm run validate:rig-profile
```

That workflow keeps the repo in the right order:

1. validate the authority contract
2. export the runtime-facing snapshot
3. validate the committed snapshot that sibling repos should mirror or import
