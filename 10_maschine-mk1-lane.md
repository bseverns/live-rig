# 10 – Maschine MK1 lane

This document defines a **first-pass role** for a Native Instruments Maschine MK1 in this rig.

The point is not to make Maschine the center of the system.
The point is to give the rig a **small, tactile, high-legibility scene/event deck** with a limited blast radius.

Keep these invariants intact:

- **REAPER remains transport owner.**
- **DrumKid remains the clock target** and can fan clock onward.
- **Endpoints follow clock; they never generate it.**
- **Maschine does not send or own global transport.**
- **Maschine is for discrete gestures, not continuous shaping.**

---

## Purpose

The Maschine lane exists for **clear, discrete performance gestures**:

- safe / show-state actions,
- named scene recalls,
- hybrid audiovisual hits,
- and section / utility cues.

Why it exists:

- The rig already has strong surfaces for other jobs.
- Edirol is good at **continuous macro shaping**.
- frZone is good at **analysis bias**.
- `live-rig-control` is the **canonical mapping-driven performer UI**.
- A 4x4 pad deck is good at **intentional, unmistakable strikes** under pressure.

This makes Maschine useful as:

- a dedicated scene/event deck,
- a fallback surface if another controller goes sideways,
- and a redundancy layer with a deliberately small set of powers.

What it is not for:

- transport,
- clock,
- deep parameter editing,
- replacing Edirol,
- replacing frZone,
- replacing the performer-facing web/iPad surface in `live-rig-control`.

---

## Relationship To Other Control Nodes

| Node | Primary job | Why it stays distinct |
|------|-------------|-----------------------|
| REAPER | Transport and routing hub | Keeps one unambiguous transport boss. |
| Edirol PCM-30 | Continuous macro shaping on Ch 10 | Best for faders/knobs and human-scale parameter riding. |
| frZone | Analysis bias on Ch 15 | Listens to the mix and nudges visuals without human micromanagement. |
| `live-rig-control` | Canonical mapping-driven performer UI | Best place for broader, legible, mapping-backed control. |
| Maschine MK1 | Discrete scene/event deck | Good for deliberate strikes with clear intent and small blast radius. |

Maschine should be thought of as the **button box for meaningful moments**.
It complements the rest of the rig by staying narrow.

---

## Pad Matrix

Assume a simple top-left to bottom-right 4x4 reading order.

**TODO:** lock the exact MK1 pad note numbers, MIDI channel, and any LED feedback scheme once the hardware template is captured.

| Pad | Label | Stable ID | Likely transport | Likely target lane | Rationale | Risk level |
|-----|-------|-----------|------------------|--------------------|-----------|------------|
| 1 | BLACKOUT | `masch.safe.blackout` | OSC-first | safe / state | Fastest way to kill image and return to a known visual state. | High |
| 2 | SAFE CLEAN | `masch.safe.clean` | OSC-first | safe / state | Return to a readable, low-risk visual world without a full stop. | Medium |
| 3 | SOFT RESET | `masch.safe.soft_reset` | OSC-first | safe / state | Clear accumulated chaos without implying a transport reset. | Medium |
| 4 | FREEZE_HOLD | `masch.safe.freeze` | OSC-first | safe / state | Hold the current world still when the room needs stability. | High |
| 5 | INTRO | `masch.scene.intro` | OSC-first | scene | Jump to the opening world with semantic clarity. | Medium |
| 6 | CRASH | `masch.scene.crash` | OSC-first | scene | Hard scene change for impact material. | High |
| 7 | DRIFT | `masch.scene.drift` | OSC-first | scene | Return to motion and spaciousness without continuous shaping. | Medium |
| 8 | HARSH | `masch.scene.harsh` | OSC-first | scene | Enter the more aggressive scene family quickly. | High |
| 9 | NOISE_BURST | `masch.event.noise_burst` | Hybrid MIDI+OSC | event | One-shot audiovisual strike that may need both semantic routing and endpoint-specific triggering. | Medium |
| 10 | VOICE_SHARD | `masch.event.voice_shard` | Hybrid MIDI+OSC | event | Trigger a vocal/spectral hit without changing the whole scene. | Medium |
| 11 | LOW_HIT | `masch.event.low_hit` | Hybrid MIDI+OSC | event | Short, low-register impact gesture aligned to both sound and image. | Medium |
| 12 | HIGH_HIT | `masch.event.high_hit` | Hybrid MIDI+OSC | event | Short, bright impact gesture for cuts, flashes, or upper-band emphasis. | Medium |
| 13 | SECTION_A | `masch.section.a` | OSC-first | section / form | Mark or recall the current section without changing transport. | Low |
| 14 | SECTION_B | `masch.section.b` | OSC-first | section / form | Same job as Section A, for a second stable form marker. | Low |
| 15 | TEXTURE_TOGGLE | `masch.texture.toggle` | OSC-first | utility | Toggle a bounded texture layer or visual family. | Medium |
| 16 | MANUAL_OVERRIDE | `masch.override.manual` | OSC-first | override / utility | Force bridge logic into a predictable manual state when needed. | High |

Provisional OSC naming style:

- `/vid/state/blackout`
- `/vid/state/clean`
- `/vid/state/freeze`
- `/vid/scene/intro`
- `/vid/scene/crash`
- `/rig/section/a`
- `/rig/override/manual`

These are examples, not locked addresses.
The stable contract is the **semantic ID**, not the raw wire format.

---

## Safety / Blast Radius

Maschine excludes transport on purpose.

Reasons:

- A scene deck should not also be able to stop the clock by accident.
- Show-state actions need **semantic clarity**, not generic “some MIDI note happened” ambiguity.
- A small surface is most trustworthy when every pad has an obvious consequence.

That is why this lane stays separate from:

- transport ownership,
- Edirol’s Ch 10 macro lane,
- frZone’s Ch 15 analysis lane,
- and deep endpoint parameter editing.

Fallback logic under venue pressure:

- If the main UI is unavailable, Maschine can still cover a **small set of safe actions and high-value cues**.
- If bridge routing is uncertain, arm only the top row and section cues.
- If the semantic map is not trusted, do not improvise new powers on show night.

Small deck, small blast radius.

---

## Show-Night Usage Guidance

Operator heuristic:

- **Top row rescues the show.**
- **Second row changes the world.**
- **Third row strikes the world.**
- **Fourth row steers the form.**

Read that literally:

- **Top row** should be usable when something is going wrong.
- **Second row** should move between named visual states cleanly.
- **Third row** should fire bounded hits, not permanent mode changes.
- **Fourth row** should help with set structure, not steal transport authority.

If you are overwhelmed:

1. Use the top row first.
2. Use the second row to re-establish a readable scene.
3. Use the third row only when the room can absorb a hit.
4. Use the fourth row to keep the form legible.

---

## Future Integration Notes

Likely near-term shape:

- Maschine feeds a **bridge/router** that converts pad strikes into semantic IDs.
- Safe/state and scene pads stay **OSC-first**.
- Event pads may use **hybrid MIDI+OSC** when a semantic trigger also needs a tightly-coupled endpoint hit.

Likely relationship to scene tables:

- Row 2 can mirror named entries in the OSC scene table.
- Row 1 can map to hard safety states that sit beside the scene table.
- Row 4 can feed section markers or manual override flags consumed by the bridge.

Likely relationship to `live-rig-control`:

- Maschine should be a **mirror or subset**, not a parallel universe.
- If both are present, `live-rig-control` remains the canonical mapping-driven performer surface.
- Maschine should expose only the actions that stay readable without a screen.

Open TODOs:

- **TODO:** lock raw MK1 note numbers / pad indices.
- **TODO:** lock whether the bridge receives Maschine via direct MIDI, REAPER routing, or a dedicated router process.
- **TODO:** lock final OSC address patterns for safe/state, scene, section, and override actions.
- **TODO:** decide whether Row 3 hit pads fan out to endpoint-specific one-shots, a scene-event router, or both.
- **TODO:** document LED feedback behavior if the deck becomes show-critical.
