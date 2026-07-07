# Cameras and Capture

## Identity

- Category: video input / capture infrastructure.
- Status: current use implied by clean camera and SCapps docs.

## What it is

The camera/capture path feeding visual endpoints and the `scene.clean_camera` recovery view.

## Current rig relationship

`scene.clean_camera` is a safety anchor, so the capture path matters even when heavy processing is optional.

## I/O

- Video input: camera or capture device, exact device unknown.
- Video output: endpoint input.
- Control: scene selection should expose clean view.

## How to muster it

1. Connect and identify the camera/capture device.
2. Confirm endpoint sees the feed.
3. Trigger `scene.clean_camera`.
4. Confirm the clean view is not buried under effects or routing.

## How to remove it safely

1. If clean camera is unavailable, rely on `state.blackout`.
2. Mark the rig degraded.
3. Do not claim clean-camera safety until the feed is restored.

## Failure modes

- Wrong capture input selected.
- Camera feed exists but is hidden under processing.
- Endpoint expects a source that is unplugged.

## Evidence

- `09_scene-system.md`
- `docs/SCENES.md`
- `scenes/minimal-scenes.yaml`

## Open questions

- Current camera/capture device.
- Current endpoint input name.
