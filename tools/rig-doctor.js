#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
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
  timestamp: new Date().toISOString(),
  readiness: "NOT READY",
  profile: {
    path: relativeFromRoot(resolvedProfilePath)
  },
  env: {},
  files: {},
  system: {},
  git: {},
  devices: {
    required: [],
    optional: []
  },
  controllers: [],
  safety: {},
  export: {},
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
  report.devices.required = Array.isArray(profileData.required_devices) ? profileData.required_devices : [];
  report.devices.optional = Array.isArray(profileData.optional_devices) ? profileData.optional_devices : [];

  checkEnv();
  checkSceneFile(profileData);
  checkProfileValidation(profileFile);
  checkOptionalItems(profileData);
  collectRuntimeContext(profileData);

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

function collectRuntimeContext(profileData) {
  report.system = {
    platform: process.platform,
    release: os.release(),
    arch: process.arch,
    node: process.version,
    npm: getCommandOutput("npm", ["--version"]) || "(unknown)"
  };

  report.git = {
    commit: getCommandOutput("git", ["rev-parse", "--short", "HEAD"]) || "(unknown)",
    dirty: gitIsDirty()
  };

  report.files = {
    dotenv_exists: fs.existsSync(path.join(rootDir, ".env")),
    dotenv_example_exists: fs.existsSync(path.join(rootDir, ".env.example")),
    logs_exists: fs.existsSync(path.join(rootDir, report.env.RIG_LOG_DIR && report.env.RIG_LOG_DIR.value ? report.env.RIG_LOG_DIR.value : defaults.RIG_LOG_DIR))
  };

  report.controllers = summarizeControllers(profileData);
  report.safety = summarizeSafety(profileData, report.controllers);
  report.export = checkExportFreshness(profileData);
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
    strict: cli.strict,
    capture: cli.capture,
    helper: cli.helper
  };

  if (cli.capture) {
    report.capture_path = writeCapture(report);
  }

  if (cli.json) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exit(report.ok ? 0 : 1);
  }

  printSummary(report);
  if (cli.capture && report.capture_path) {
    console.log("");
    console.log(`Capture: ${report.capture_path}`);
  }
  if (cli.helper) {
    printHelperPrompt(report);
  }
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

function printHelperPrompt(data) {
  console.log("");
  console.log("Helper packet:");
  console.log(`- Attach ${data.capture_path || "doctor JSON from npm run doctor:json"}.`);
  console.log(`- Profile: ${data.profile.path}`);
  console.log(`- Scene file: ${data.profile.scene_path || data.profile.scene_file || "(unknown)"}`);
  console.log("- State whether state.blackout and scene.clean_camera fired by hand.");
  console.log("- Add photos of mixer, controller, endpoint/runtime, and any clock/MIDI routing.");
  console.log("- Write the smallest change since the last known-good state.");
  console.log("- Use HELP_REQUEST.md or .github/ISSUE_TEMPLATE/troubleshooting.md.");
}

function summarizeControllers(profileData) {
  const controllerDir = path.join(rootDir, "controllers");
  if (!fs.existsSync(controllerDir)) {
    report.checks.push({ name: "controllers.dir", status: "warn" });
    report.warnings.push("Controller directory is missing.");
    return [];
  }

  const controllerPaths = fs
    .readdirSync(controllerDir)
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .map((file) => path.join(controllerDir, file))
    .sort();

  const summaries = [];
  for (const controllerPath of controllerPaths) {
    try {
      const data = readStructuredFile(controllerPath, "controller file");
      const controls = Array.isArray(data.controls) ? data.controls : [];
      summaries.push({
        source_path: relativeFromRoot(controllerPath),
        controller_name: data.controller_name,
        role: data.role,
        midi_channel: data.midi_channel,
        controls: controls.length,
        semantic_ids: controls.map((control) => control && control.semantic_id).filter(Boolean),
        safety_controls: controls
          .filter((control) => control && control.safety)
          .map((control) => ({
            id: control.id,
            physical_label: control.physical_label,
            semantic_id: control.semantic_id
          }))
      });
    } catch (error) {
      report.warnings.push(error.message);
    }
  }

  report.checks.push({ name: "controllers.summary", status: summaries.length ? "pass" : "warn" });
  if (!summaries.length) {
    report.warnings.push("No controller maps were summarized.");
  }

  return summaries;
}

function summarizeSafety(profileData, controllers) {
  const safetyStates = Array.isArray(profileData.safety_states) ? profileData.safety_states : [];
  const controllerSafety = [];
  for (const controller of controllers) {
    for (const control of controller.safety_controls || []) {
      controllerSafety.push({
        controller_name: controller.controller_name,
        source_path: controller.source_path,
        physical_label: control.physical_label,
        semantic_id: control.semantic_id
      });
    }
  }

  const mappedSafety = safetyStates.map((semanticId) => ({
    semantic_id: semanticId,
    controller_mapped: controllerSafety.some((control) => control.semantic_id === semanticId)
  }));

  const missingMappings = mappedSafety.filter((item) => !item.controller_mapped);
  if (missingMappings.length) {
    report.warnings.push(`Safety states without controller mappings: ${missingMappings.map((item) => item.semantic_id).join(", ")}.`);
    report.checks.push({ name: "safety.controller_mappings", status: "warn" });
  } else {
    report.checks.push({ name: "safety.controller_mappings", status: "pass" });
  }

  return {
    profile_safety_states: safetyStates,
    controller_safety_controls: controllerSafety,
    mapped_safety: mappedSafety
  };
}

function checkExportFreshness(profileData) {
  const exportPath = path.join(rootDir, "interop", "exports", "live-rig.default.json");
  const result = {
    path: relativeFromRoot(exportPath),
    exists: fs.existsSync(exportPath),
    status: "unknown"
  };

  if (!result.exists) {
    report.warnings.push("Runtime profile export is missing. Run: npm run export:rig-profile");
    report.checks.push({ name: "export.exists", status: "warn" });
    result.status = "missing";
    return result;
  }

  report.checks.push({ name: "export.exists", status: "pass" });

  let currentExport;
  try {
    currentExport = JSON.parse(fs.readFileSync(exportPath, "utf8"));
    result.current_fingerprint = currentExport.source && currentExport.source.build_fingerprint;
  } catch (error) {
    report.warnings.push(`Runtime profile export could not be parsed: ${error.message}`);
    report.checks.push({ name: "export.parse", status: "warn" });
    result.status = "unreadable";
    return result;
  }

  report.checks.push({ name: "export.parse", status: "pass" });

  const tempPath = path.join(os.tmpdir(), `live-rig-doctor-export-${process.pid}.json`);
  const exportResult = spawnSync(process.execPath, [
    path.join(rootDir, "tools", "export-rig-profile.js"),
    "--profile",
    resolvedProfilePath,
    "--out",
    tempPath,
    "--pretty"
  ], { encoding: "utf8" });

  if (exportResult.status !== 0) {
    result.status = "could_not_regenerate";
    result.regeneration_output = collectOutput(exportResult);
    report.warnings.push("Could not regenerate runtime profile export for freshness check.");
    report.checks.push({ name: "export.freshness", status: "warn" });
    safeUnlink(tempPath);
    return result;
  }

  try {
    const expectedExport = JSON.parse(fs.readFileSync(tempPath, "utf8"));
    result.expected_fingerprint = expectedExport.source && expectedExport.source.build_fingerprint;
    result.stale = result.current_fingerprint !== result.expected_fingerprint;
  } catch (error) {
    result.status = "could_not_compare";
    report.warnings.push(`Could not compare regenerated export: ${error.message}`);
    report.checks.push({ name: "export.freshness", status: "warn" });
    safeUnlink(tempPath);
    return result;
  }

  safeUnlink(tempPath);

  if (result.stale) {
    result.status = "stale";
    report.warnings.push("interop/exports/live-rig.default.json may be stale. Run: npm run export:rig-profile && npm run validate:rig-profile");
    report.checks.push({ name: "export.freshness", status: "warn" });
  } else {
    result.status = "fresh";
    report.checks.push({ name: "export.freshness", status: "pass" });
  }

  result.source_paths = [
    report.profile.path,
    profileData.scene_file,
    "controllers/",
    "interop/rig.contract.json"
  ];
  return result;
}

function writeCapture(data) {
  const logDirSetting = data.env.RIG_LOG_DIR && data.env.RIG_LOG_DIR.value ? data.env.RIG_LOG_DIR.value : defaults.RIG_LOG_DIR;
  const logDir = path.resolve(rootDir, logDirSetting);
  fs.mkdirSync(logDir, { recursive: true });
  const stamp = data.timestamp.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const capturePath = path.join(logDir, `doctor-${stamp}.json`);
  fs.writeFileSync(capturePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  return relativeFromRoot(capturePath);
}

function getCommandOutput(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    return "";
  }
  return (result.stdout || "").trim();
}

function gitIsDirty() {
  const output = getCommandOutput("git", ["status", "--porcelain"]);
  return output ? true : false;
}

function safeUnlink(targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
  } catch (error) {
    report.warnings.push(`Could not remove temporary file ${targetPath}: ${error.message}`);
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
  let capture = false;
  let helper = false;
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
    if (arg === "--capture") {
      capture = true;
      continue;
    }
    if (arg === "--helper") {
      helper = true;
      capture = true;
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

  return { profile, strict, json, capture, helper, help };
}

function printHelp() {
  console.log("Usage: node tools/rig-doctor.js [--profile path/to/profile.yaml] [--strict] [--json] [--capture] [--helper]");
  console.log("");
  console.log("Preflight checks:");
  console.log("- loads the selected profile");
  console.log("- verifies the referenced scene file exists");
  console.log("- runs profile and scene validation");
  console.log("- checks required environment variables and reports warnings for optional items");
  console.log("- summarizes devices, controllers, safety mappings, export freshness, git, and runtime versions");
  console.log("");
  console.log("Modes:");
  console.log("- --json writes the full report to stdout");
  console.log("- --strict treats warnings as failures");
  console.log("- --capture writes logs/doctor-YYYYMMDDTHHMMSSZ.json");
  console.log("- --helper writes a capture and prints the helper-packet checklist");
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
