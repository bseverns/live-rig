#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const spawnSync = require("child_process").spawnSync;
const { readStructuredFile } = require("./structured-file");

const rootDir = path.resolve(__dirname, "..");
const defaults = {
  RIG_PROFILE: "profiles/minimal.yaml",
  RIG_OSC_OUT_HOST: "127.0.0.1",
  RIG_OSC_OUT_PORT: "8000",
  RIG_OSC_IN_PORT: "8001",
  RIG_MIDI_CONTROL_PORT: "",
  RIG_SHOW: "",
  RIG_LOG_DIR: "logs"
};

const cli = parseArgs(process.argv.slice(2));
if (cli.help) {
  printHelp();
  process.exit(0);
}

const dotenv = loadDotEnv(path.join(rootDir, ".env"));
const profileSetting = cli.profile || resolveProfileSetting(dotenv);
const resolvedProfilePath = path.resolve(rootDir, profileSetting);

const report = {
  readiness: "NOT READY",
  profile: {
    path: relativeFromRoot(resolvedProfilePath)
  },
  env: {},
  checks: [],
  warnings: [],
  errors: []
};

if (process.platform !== "darwin") {
  report.warnings.push("This rig-doctor is tuned for macOS (IAC ports, REAPER defaults).");
}

main();

function main() {
  const profileFile = checkRequiredFile(resolvedProfilePath, "profile");
  if (!profileFile) {
    finish();
    return;
  }

  const profileData = readProfile(profileFile);
  if (!profileData) {
    finish();
    return;
  }

  report.profile.id = profileData.profile_id;
  report.profile.label = profileData.label;
  report.profile.version = profileData.version;
  report.profile.scene_file = profileData.scene_file;

  checkEnv();
  checkSceneFile(profileData);
  checkProfileValidation(profileFile);
  checkOptionalItems(profileData);

  classifyReadiness();
  finish();
}

function checkRequiredFile(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    report.errors.push(`Missing ${label} file at ${relativeFromRoot(targetPath)}.`);
    report.checks.push({ name: `${label}.exists`, status: "fail" });
    return null;
  }

  report.checks.push({ name: `${label}.exists`, status: "pass" });
  return targetPath;
}

function readProfile(profilePath) {
  try {
    const profileData = readStructuredFile(profilePath, "profile file");
    report.checks.push({ name: "profile.parse", status: "pass" });
    return profileData;
  } catch (error) {
    report.errors.push(error.message);
    report.checks.push({ name: "profile.parse", status: "fail" });
    return null;
  }
}

function checkEnv() {
  const requiredEnv = [
    { key: "RIG_OSC_OUT_HOST", defaultValue: defaults.RIG_OSC_OUT_HOST, type: "string" },
    { key: "RIG_OSC_OUT_PORT", defaultValue: defaults.RIG_OSC_OUT_PORT, type: "port" },
    { key: "RIG_OSC_IN_PORT", defaultValue: defaults.RIG_OSC_IN_PORT, type: "port" }
  ];

  for (const item of requiredEnv) {
    const resolved = resolveEnvValue(item.key, item.defaultValue, dotenv, true);
    report.env[item.key] = resolved;

    if (resolved.source === "default") {
      report.checks.push({ name: `env.${item.key}`, status: "pass", detail: "using default" });
    } else if (resolved.source === "dotenv") {
      report.checks.push({ name: `env.${item.key}`, status: "pass", detail: ".env" });
    } else {
      report.checks.push({ name: `env.${item.key}`, status: "pass", detail: "process env" });
    }

    if (item.type === "port" && !isValidPort(resolved.value)) {
      report.errors.push(`${item.key} must be a valid port number (1-65535).`);
      continue;
    }

    if (item.type === "string" && !resolved.value) {
      report.errors.push(`${item.key} must be set.`);
    }
  }

  const optionalEnv = [
    { key: "RIG_MIDI_CONTROL_PORT", defaultValue: defaults.RIG_MIDI_CONTROL_PORT },
    { key: "RIG_SHOW", defaultValue: defaults.RIG_SHOW },
    { key: "RIG_LOG_DIR", defaultValue: defaults.RIG_LOG_DIR }
  ];

  for (const item of optionalEnv) {
    const resolved = resolveEnvValue(item.key, item.defaultValue, dotenv, false);
    report.env[item.key] = resolved;

    if (!resolved.value) {
      report.warnings.push(`Optional environment variable ${item.key} is not set.`);
      report.checks.push({ name: `env.${item.key}`, status: "warn" });
      continue;
    }

    report.checks.push({ name: `env.${item.key}`, status: "pass", detail: resolved.source });
  }

  const logDir = report.env.RIG_LOG_DIR && report.env.RIG_LOG_DIR.value;
  if (logDir) {
    const resolvedLogDir = path.resolve(rootDir, logDir);
    if (!fs.existsSync(resolvedLogDir)) {
      report.warnings.push(`Log directory is missing: ${relativeFromRoot(resolvedLogDir)}.`);
      report.checks.push({ name: "logdir.exists", status: "warn" });
    } else {
      report.checks.push({ name: "logdir.exists", status: "pass" });
    }
  }
}

function checkSceneFile(profileData) {
  const scenePath = resolveRepoRelativePath(profileData.scene_file);
  report.profile.scene_path = relativeFromRoot(scenePath);

  if (!fs.existsSync(scenePath)) {
    report.errors.push(`Referenced scene file does not exist: ${profileData.scene_file}`);
    report.checks.push({ name: "scene.exists", status: "fail" });
    return;
  }

  report.checks.push({ name: "scene.exists", status: "pass" });
}

function checkProfileValidation(profileFile) {
  if (report.errors.some((message) => message.indexOf("Referenced scene file does not exist") !== -1)) {
    report.checks.push({ name: "profile.validation", status: "skip" });
    return;
  }

  const validate = spawnSync(process.execPath, [path.join(rootDir, "tools", "validate-profiles.js"), profileFile], {
    encoding: "utf8"
  });

  if (validate.status === 0) {
    report.checks.push({ name: "profile.validation", status: "pass" });
    return;
  }

  report.checks.push({ name: "profile.validation", status: "fail" });
  const lines = collectOutput(validate);
  if (lines.length) {
    report.errors.push.apply(report.errors, lines);
  } else {
    report.errors.push("Profile validation failed.");
  }
}

function checkOptionalItems(profileData) {
  const optionalDevices = Array.isArray(profileData.optional_devices) ? profileData.optional_devices : [];
  if (optionalDevices.length) {
    const labels = optionalDevices.map((device) => device && device.label).filter(Boolean);
    if (labels.length) {
      report.warnings.push(`Optional devices not confirmed: ${labels.join(", ")}.`);
      report.checks.push({ name: "optional.devices", status: "warn" });
    }
  }
}

function classifyReadiness() {
  if (report.errors.length) {
    report.readiness = "NOT READY";
    return;
  }

  if (cli.strict && report.warnings.length) {
    report.errors.push("Strict mode treats warnings as failures.");
    report.readiness = "NOT READY";
    return;
  }

  report.readiness = report.warnings.length ? "DEGRADED" : "READY";
}

function finish() {
  report.ok = report.readiness !== "NOT READY";
  report.strict = cli.strict;
  report.args = {
    profile: cli.profile || null,
    json: cli.json,
    strict: cli.strict
  };

  if (cli.json) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(report.ok ? 0 : 1);
  }

  printSummary(report);
  process.exit(report.ok ? 0 : 1);
}

function printSummary(data) {
  console.log("RIG DOCTOR");
  console.log("----------");
  console.log(`Readiness: ${data.readiness}`);
  console.log(`Profile: ${data.profile.id || data.profile.path}`);
  console.log(`Scene file: ${data.profile.scene_path || data.profile.scene_file || "(unknown)"}`);
  console.log("");
  console.log("Checks:");
  for (const check of data.checks) {
    const suffix = check.detail ? ` (${check.detail})` : "";
    console.log(`- ${check.name}: ${check.status.toUpperCase()}${suffix}`);
  }

  if (data.warnings.length) {
    console.log("");
    console.log("Warnings:");
    for (const warning of data.warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (data.errors.length) {
    console.log("");
    console.log("Errors:");
    for (const error of data.errors) {
      console.log(`- ${error}`);
    }
  }

  console.log("");
  console.log("Interpretation:");
  if (data.readiness === "READY") {
    console.log("- Required profile, scene, and environment checks passed.");
  } else if (data.readiness === "DEGRADED") {
    console.log("- Required checks passed, but optional items need attention.");
  } else {
    console.log("- Required checks failed. Do not trust this rig state for show use.");
  }
}

function resolveRepoRelativePath(relativePath) {
  if (!relativePath) {
    return "";
  }

  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }

  return path.resolve(rootDir, relativePath);
}

function resolveEnvValue(key, defaultValue, dotenvSource, allowDefault) {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    const value = process.env[key];
    if (value !== undefined && value !== "") {
      return { value, source: "process.env" };
    }
    if (allowDefault) {
      return { value: defaultValue, source: "default" };
    }
    return { value: value || "", source: "process.env" };
  }

  if (dotenvSource && Object.prototype.hasOwnProperty.call(dotenvSource, key)) {
    const value = dotenvSource[key];
    if (value !== undefined && value !== "") {
      return { value, source: "dotenv" };
    }
    if (allowDefault) {
      return { value: defaultValue, source: "default" };
    }
    return { value: value || "", source: "dotenv" };
  }

  return { value: defaultValue, source: "default" };
}

function resolveProfileSetting(dotenvSource) {
  if (Object.prototype.hasOwnProperty.call(process.env, "RIG_PROFILE") && process.env.RIG_PROFILE) {
    return process.env.RIG_PROFILE;
  }
  if (dotenvSource && Object.prototype.hasOwnProperty.call(dotenvSource, "RIG_PROFILE") && dotenvSource.RIG_PROFILE) {
    return dotenvSource.RIG_PROFILE;
  }
  return defaults.RIG_PROFILE;
}

function loadDotEnv(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return {};
  }

  const env = {};
  const lines = fs.readFileSync(targetPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1);
    env[key] = parseEnvValue(rawValue);
  }

  return env;
}

function parseEnvValue(rawValue) {
  const trimmed = rawValue.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function collectOutput(result) {
  const lines = [];
  const stdout = result.stdout ? result.stdout.trim().split(/\r?\n/) : [];
  const stderr = result.stderr ? result.stderr.trim().split(/\r?\n/) : [];

  for (const line of stdout) {
    if (line) {
      lines.push(line);
    }
  }
  for (const line of stderr) {
    if (line) {
      lines.push(line);
    }
  }
  return lines;
}

function isValidPort(value) {
  const port = Number.parseInt(String(value), 10);
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

function parseArgs(argv) {
  let profile;
  let strict = false;
  let json = false;
  let help = false;
  let positionalConsumed = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") {
      profile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--strict") {
      strict = true;
      continue;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }
    if (!arg.startsWith("-") && !positionalConsumed && !profile) {
      profile = arg;
      positionalConsumed = true;
    }
  }

  return { profile, strict, json, help };
}

function printHelp() {
  console.log("Usage: node tools/rig-doctor.js [--profile path/to/profile.yaml] [--strict] [--json]");
  console.log("");
  console.log("Preflight checks:");
  console.log("- loads the selected profile");
  console.log("- verifies the referenced scene file exists");
  console.log("- runs profile and scene validation");
  console.log("- checks required environment variables and reports warnings for optional items");
  console.log("");
  console.log("Environment defaults:");
  console.log("- RIG_PROFILE=profiles/minimal.yaml");
  console.log("- RIG_OSC_OUT_HOST=127.0.0.1");
  console.log("- RIG_OSC_OUT_PORT=8000");
  console.log("- RIG_OSC_IN_PORT=8001");
  console.log("- RIG_MIDI_CONTROL_PORT=");
  console.log("- RIG_SHOW=");
  console.log("- RIG_LOG_DIR=logs");
}

function relativeFromRoot(targetPath) {
  if (!targetPath) {
    return "(unknown)";
  }
  const relative = path.relative(rootDir, targetPath);
  return relative || ".";
}
