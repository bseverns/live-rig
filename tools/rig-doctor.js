#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const spawnSync = require("child_process").spawnSync;
const dgram = require("dgram");

const args = process.argv.slice(2);
let mappingsPath;
let schemaPath;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--mappings") {
    mappingsPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--schema") {
    schemaPath = args[i + 1];
    i += 1;
    continue;
  }
}

const rootDir = path.resolve(__dirname, "..");
const resolvedMappingsPath =
  mappingsPath ||
  process.env.RIG_MAPPINGS ||
  (fs.existsSync(path.join(rootDir, "mappings.json")) ? path.join(rootDir, "mappings.json") : null);
const resolvedSchemaPath =
  schemaPath ||
  process.env.RIG_SCHEMA ||
  path.join(rootDir, "interop", "interop.schema.json");

const errors = [];
const warnings = [];
const info = [];

if (process.platform !== "darwin") {
  warnings.push("This rig-doctor is tuned for macOS (IAC ports, REAPER defaults).");
}

if (!resolvedMappingsPath) {
  errors.push("Missing mappings file. Provide --mappings or set RIG_MAPPINGS.");
} else if (!fs.existsSync(resolvedMappingsPath)) {
  errors.push(`Mappings file not found at ${resolvedMappingsPath}.`);
} else {
  info.push(`Mappings: ${resolvedMappingsPath}`);
}

if (!fs.existsSync(resolvedSchemaPath)) {
  errors.push(`Schema not found at ${resolvedSchemaPath}.`);
} else {
  info.push(`Schema: ${resolvedSchemaPath}`);
}

const requiredEnv = [
  { key: "RIG_OSC_OUT_HOST", type: "string" },
  { key: "RIG_OSC_OUT_PORT", type: "port" },
  { key: "RIG_OSC_IN_PORT", type: "port" },
  { key: "RIG_MIDI_CONTROL_PORT", type: "string" }
];

for (const item of requiredEnv) {
  const value = process.env[item.key];
  if (!value) {
    errors.push(`Missing ${item.key}. Set it in your shell env.`);
    continue;
  }
  if (item.type === "port") {
    const port = Number.parseInt(value, 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      errors.push(`${item.key} must be a valid port number (1-65535).`);
    }
  }
}

main();

function checkUdpPort(port, callback) {
  try {
    const socket = dgram.createSocket("udp4");
    socket.once("error", (err) => {
      let status = "unknown";
      if (err && err.code === "EADDRINUSE") {
        status = "in-use";
      }
      socket.close();
      callback(status);
    });
    socket.bind(port, "0.0.0.0", () => {
      socket.close();
      callback("free");
    });
  } catch (error) {
    callback("unknown");
  }
}

function printSummary({ info: infoLines, errors: errorLines, warnings: warningLines, validationOk: validation }) {
  console.log("RIG DOCTOR");
  console.log("----------");

  if (infoLines.length) {
    console.log("Config:");
    for (const line of infoLines) {
      console.log(`- ${line}`);
    }
  }

  console.log("");
  console.log("Checks:");
  console.log(`- Mappings validation: ${validation ? "OK" : "FAILED"}`);
  console.log(`- Env + ports: ${errorLines.length ? "FAILED" : "OK"}`);

  if (warningLines.length) {
    console.log("");
    console.log("Warnings:");
    for (const line of warningLines) {
      console.log(`- ${line}`);
    }
  }

  if (errorLines.length) {
    console.log("");
    console.log("Errors:");
    for (const line of errorLines) {
      console.log(`- ${line}`);
    }
  }

  console.log("");
  console.log("System status (expected running):");
  console.log("- REAPER (clock master)");
  console.log("- DrumKid (clock target; optional fan-out)");
  console.log("- Bridge host (Max/TD/REAPER scripts)");
  console.log("- SCapps + Processing endpoints");
  console.log("- frZone (analysis CC)");
}

function main() {
  let validationOk = false;
  if (resolvedMappingsPath && fs.existsSync(resolvedMappingsPath) && fs.existsSync(resolvedSchemaPath)) {
    const validate = spawnSync(
      process.execPath,
      [path.join(rootDir, "tools", "validate-mappings.js"), resolvedMappingsPath, "--schema", resolvedSchemaPath],
      { encoding: "utf8" }
    );
    if (validate.status === 0) {
      validationOk = true;
    } else {
      errors.push("Mappings validation failed. Run validate-mappings for details.");
      const stderr = validate.stderr ? validate.stderr.trim() : "";
      if (stderr) {
        warnings.push(stderr);
        if (stderr.indexOf("Cannot find module") !== -1 && stderr.indexOf("ajv") !== -1) {
          errors.push("Missing Node dependencies. Run: npm install");
        }
      }
    }
  }

  const oscInPort = Number.parseInt(process.env.RIG_OSC_IN_PORT || "", 10);
  if (Number.isInteger(oscInPort)) {
    checkUdpPort(oscInPort, function (portStatus) {
      if (portStatus === "in-use") {
        info.push("OSC IN port " + oscInPort + " is already in use (endpoint likely running).");
      } else if (portStatus === "free") {
        warnings.push("OSC IN port " + oscInPort + " is free. If endpoints expect input, start them.");
      } else {
        warnings.push("Could not probe OSC IN port " + oscInPort + ".");
      }
      printSummary({
        info: info,
        errors: errors,
        warnings: warnings,
        validationOk: validationOk
      });
      process.exitCode = errors.length ? 1 : 0;
    });
    return;
  }

  printSummary({
    info: info,
    errors: errors,
    warnings: warnings,
    validationOk: validationOk
  });
  process.exitCode = errors.length ? 1 : 0;
}
