#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sheets = [
  "sheets/minimal-preflight.md",
  "sheets/minimal-controller-map.md",
  "sheets/minimal-audio-patch.md",
  "sheets/failover-card.md"
];

const requiredPhrases = [
  "state.blackout",
  "scene.clean_camera"
];

const errors = [];

for (const sheet of sheets) {
  const resolved = path.resolve(rootDir, sheet);
  if (!fs.existsSync(resolved)) {
    errors.push(`Missing sheet: ${sheet}`);
    continue;
  }

  const text = fs.readFileSync(resolved, "utf8");
  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`${sheet} does not mention ${phrase}.`);
    }
  }
}

if (errors.length) {
  console.error("Sheet check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`OK: ${sheets.length} sheet file(s) present and safety anchors mentioned.`);
