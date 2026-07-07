# Preflight

`rig-doctor` is the first practical show-readiness check for live-rig.
It does not touch hardware yet.
It reads the selected profile, confirms the scene file exists, runs validation, and reports whether the rig is ready to trust.
For failures that need symptom-first recovery, use [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## Readiness levels

- `READY`
  - all required checks pass
  - optional items are present or not relevant

- `DEGRADED`
  - all required checks pass
  - one or more optional items are missing or not confirmed

- `NOT READY`
  - one or more required checks fail

## 5-minute preflight

Use this when you are already on site and need the fastest useful answer.

1. Run:

```bash
npm run doctor
```

2. Confirm the selected profile is the one you expect.
3. Confirm the scene file resolves.
4. Check the readiness level.
5. If the result is `DEGRADED`, note the warnings but keep going only if the missing items are truly optional.
6. If another person needs to help, run:

```bash
npm run doctor:helper
```

## 20-minute preflight

Use this when you still have time to recover from a bad room or a partial failure.

1. Run the minimal or full profile explicitly:

```bash
npm run doctor:minimal
npm run doctor:full
```

2. Confirm required environment variables are populated, either from `.env` or from defaults.
3. Confirm the referenced scene file validates.
4. Check the warnings list for optional devices, log directory, or unconfirmed controller paths.
5. Fix anything that can still be fixed before show time.

## Missing optional gear

Missing optional items should warn, not fail the doctor.

- If `frZone` is missing, the rig should fall back to scene base plus manual macros.
- If `Maschine` is missing, ignore the semantic deck and keep using the controller and scene file that remain.
- If a secondary visual endpoint is missing, keep the remaining endpoint and make sure blackout and clean camera still work.

Optional warnings are acceptable only when the required path still works.

## Manual safety test

`rig-doctor` does not replace the operator’s manual safety check.

Always test these by hand:

- `state.blackout`
- `scene.clean_camera`

If either one is not instantly reachable in the room, the system is not safe enough yet.

## CLI and JSON

Examples:

```bash
node tools/rig-doctor.js --profile profiles/minimal.yaml
node tools/rig-doctor.js --json
node tools/rig-doctor.js --strict
node tools/rig-doctor.js --capture
node tools/rig-doctor.js --helper
node tools/rig-doctor.js --help
```

For automation, `--json` emits parseable JSON with readiness, warnings, and errors.
For collaboration, `--capture` writes `logs/doctor-*.json`, and `npm run collect:debug` creates a fuller `logs/live-rig-debug-*` packet.
