#!/usr/bin/env node
const { loadProfile, defaultProfilePath } = require("./profile-loader");
const { printInventory, printSimulation } = require("./event-log");

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

try {
  const loaded = loadProfile(args.profile || defaultProfilePath);
  printInventory(loaded.profile);

  if (args.simulate) {
    console.log("");
    printSimulation(loaded.profile, args.simulate);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function parseArgs(argv) {
  const result = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") {
      result.profile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--simulate") {
      result.simulate = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    }
  }

  return result;
}

function printHelp() {
  console.log("Usage: node bridge/src/index.js [--profile interop/exports/live-rig.default.json] [--simulate scene.intro]");
  console.log("Loads the exported rig profile, prints the semantic inventory, and can simulate a semantic event.");
}
