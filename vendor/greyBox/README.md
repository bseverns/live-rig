# GreyBox Family

This folder is a **vendored snapshot** of the local `greyBox` family source so the live-rig repo remains useful even when the broader sketch repo is unavailable.

Original local source path at time of vendoring:

- `../arduinoSketches/experiments/greybox`

Why it is here:

- `greyBox` is part of the real studio picture now.
- The sketch names matter for hardware lineage.
- This repo should carry enough truth to support setup, troubleshooting, and documentation without depending on another checkout.

Likely order:

1. `greyBox_instructableEx`
2. `greyBox_Growser`
3. `greyBox_GrowserSwitch`
4. `greyBox_Growser_delay`

Use this folder as the model for future family moves: group related sketches together first, then rename only after the lineage is clear.
