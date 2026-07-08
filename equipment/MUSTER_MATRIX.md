# Muster Matrix

Use this when deciding what can be called into service for a patch, lesson, loan, show, or repair.

Status meanings:

- `trusted`: current docs and safety checks are enough for show use.
- `musterable`: usable after a small confirmation ritual.
- `loanable`: understandable enough for someone else to borrow with notes.
- `dormant`: physically or conceptually present, but not ready without focused setup.
- `unknown`: named, but facts need capture before use.

| Equipment | Category | Current rig status | Muster state | Must confirm before use |
|-----------|----------|--------------------|--------------|-------------------------|
| DrumKid | audio/control | `core/live` | musterable | Clock role for the night. |
| SQ-64 | control | `core/live` | musterable | Track/channel assignments and clock follow/lead state. |
| AE Rack | modular | `core/live` | musterable | Voice groups and SQ-64 routing. |
| DR550 | audio | `core/live` | dormant | Sync mode, mixer channel, pattern/kit. |
| Electribe E2S | audio | `core/live` | musterable | Clock follower state, pattern/bank, input/output path. |
| Microgranny | audio | `core/live` | unknown | Audio path and trigger behavior. |
| Kaossilator | audio | `core/live` | unknown | Clock/free-run expectation and audio path. |
| FreqFM | modular | `core/live` | unknown | Exact identity, audio path, and control behavior. |
| Kastle family | modular | `core/live` | unknown | Which unit, patch, and audio destination. |
| Volca Modular | modular | `core/live` | unknown | Sync behavior and audio path. |
| greyBox / Growser | custom | `core/live` | musterable | Active sketch, wiring, power, and output path. |
| FieldKitFX | fx | `core/live` | musterable | Insert/return/parallel role and gain staging. |
| Edirol PCM-30 | control | `core/live` | musterable | MIDI port and channel 10 mapping. |
| frZone | custom/analysis | `core/live` | musterable | Audio feed and analysis output path. |
| SCapps chain | video | `core/live` | musterable | Endpoint, capture source, and bridge output host/port. |
| MSVP | video | `core/live` | unknown | Current endpoint role and inputs. |
| nw_wrld / wrld_on | video | `core/live` | unknown | Current runtime name and expected control protocol. |
| Mac mini | compute | `core/live` | musterable | Which runtimes it hosts tonight. |
| REAPER host | compute | situational | musterable | Whether it owns clock. |
| Bridge host | compute | `core/live` | musterable | Selected profile/export and MIDI/OSC routing. |
| Maschine MK1 | control | `present/dormant` | dormant | Safe subset only; never transport boss. |
| Akai S900 | audio | `present/dormant` | dormant | Media, program, MIDI channel, and output path. |
| Found-sound cluster | audio | `core/live` | unknown | Which source, media/power, and mixer channel. |
| Microphone | audio | `core/live` | unknown | Input type, gain, feedback risk, and routing. |
| Horizon | fx | active in docs | musterable | Main-bus placement and bypass path. |
| DFX12 | amp/fx | `core/live` | unknown | Exact identity and routing. |
| FM212R | amp | `core/live` | unknown | Amp path and relationship to DFX12/recording. |
| circuitBend | fx | `core/live` | unknown | Specific device or chain, patch point, and bypass. |
| FXloop | fx | `core/live` | unknown | Send/return points and whether dry path survives. |
| Other amp | amp | `core/live` | unknown | Exact amp identity and purpose. |
| live-rig-control | control/software | `core/live` | musterable | Launch path, semantic IDs, and conflict with Edirol. |
| x0xb0x | modular/audio | `planned` | dormant | Physical build status before any operational use. |

## Muster ritual

1. Name the intended role before patching.
2. Confirm power, media, and physical I/O.
3. Confirm clock role: boss, follower, ignored, or none.
4. Confirm audio/video/control reaches one known destination.
5. Confirm removal path before relying on the box.
6. If show-facing, confirm `state.blackout`, `scene.clean_camera`, and audio-only survival are still intact.

## Work queue

Use this matrix as the task board for the next bench pass.

### Unknown: quick verification session

Every `unknown` row gets one short session that captures power, I/O, clock/control behavior, and safe removal. Prioritize rows that are both `core/live` and `unknown`:

- [ ] Microgranny
- [ ] Kaossilator
- [ ] FreqFM
- [ ] Kastle family
- [ ] Volca Modular
- [ ] MSVP
- [ ] nw_wrld / wrld_on
- [ ] Found-sound cluster
- [ ] Microphone
- [ ] DFX12
- [ ] FM212R
- [ ] circuitBend
- [ ] FXloop
- [ ] Other amp

### Musterable: known-good card

Every `musterable` row gets one compact known-good card when its configuration is stable enough to repeat.

Spine cards now live in `cards/`:

- [x] `cards/edirol-known-good.md`
- [x] `cards/drumkid-known-good.md`
- [x] `cards/sq64-known-good.md`
- [x] `cards/e2s-known-good.md`
- [x] `cards/greybox-known-good.md`
- [x] `cards/frzone-known-good.md`
- [x] `cards/scapps-known-good.md`
- [x] `cards/bridge-host-known-good.md`

Remaining `musterable` card backlog:

- [ ] AE Rack
- [ ] FieldKitFX
- [ ] Horizon
- [ ] Mac mini, if it is doing more than bridge-host duty.
- [ ] REAPER host
- [ ] live-rig-control

### Dormant: before promoting

Before a `dormant` row becomes active, capture:

- [ ] Power supply and polarity.
- [ ] Audio/video/control I/O.
- [ ] MIDI/clock behavior.
- [ ] Mixer channel or endpoint path.
- [ ] Safe bypass/removal path.
- [ ] Passport verification section updated from observed facts.

### Next physical test

Use `sheets/next-physical-test.md` as the bench checklist for the spine pass.
