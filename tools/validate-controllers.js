#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const { readStructuredFile } = require("./structured-file");

const rootDir = path.resolve(__dirname, "..");
const defaultControllerPaths = [
  path.join(rootDir, "controllers", "edirol-pcm30.yaml"),
  path.join(rootDir, "controllers", "maschine-mk1.yaml"),
  path.join(rootDir, "controllers", "live-rig-control.yaml")
];

const args = process.argv.slice(2);
let schemaPath;
let contractPath;
let profilePath;
const controllerPaths = [];

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--schema") {
    schemaPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--contract") {
    contractPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--profile") {
    profilePath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--help" || arg === "-h") {
    printHelp();
    process.exit(0);
  }
  if (arg.startsWith("-")) {
    continue;
  }
  controllerPaths.push(arg);
}

const resolvedSchemaPath = path.resolve(schemaPath || path.join(rootDir, "schemas", "controller.schema.json"));
const resolvedContractPath = path.resolve(contractPath || path.join(rootDir, "interop", "rig.contract.json"));
const resolvedProfilePath = path.resolve(
  profilePath || process.env.RIG_PROFILE || path.join(rootDir, "profiles", "minimal.yaml")
);
const resolvedControllerPaths = controllerPaths.length ? controllerPaths.map((target) => path.resolve(target)) : defaultControllerPaths;

const schema = readJson(resolvedSchemaPath, "schema");
const contract = readJson(resolvedContractPath, "contract");
const semanticCatalog = collectContractSemanticIds(contract);
const sceneSemanticSet = loadActiveSceneSemanticIds(resolvedProfilePath);

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const report = {
  controllers: [],
  warnings: [],
  errors: []
};

for (const controllerPath of resolvedControllerPaths) {
  validateControllerFile(controllerPath);
}

if (!hasControllerMapping("state.blackout")) {
  report.errors.push("No controller maps state.blackout.");
}

if (!hasControllerMapping("scene.clean_camera")) {
  report.errors.push("No controller maps scene.clean_camera.");
}

if (report.errors.length) {
  printFail();
  process.exit(1);
}

printPass();

function validateControllerFile(controllerPath) {
  const entry = {
    path: relativeFromRoot(controllerPath),
    controls: 0,
    warnings: [],
    errors: []
  };

  if (!fs.existsSync(controllerPath)) {
    entry.errors.push(`Controller file not found: ${relativeFromRoot(controllerPath)}`);
    report.errors.push.apply(report.errors, entry.errors);
    report.controllers.push(entry);
    return;
  }

  let controllerData;
  try {
    controllerData = readStructuredFile(controllerPath, "controller file");
  } catch (error) {
    entry.errors.push(error.message);
    report.errors.push.apply(report.errors, entry.errors);
    report.controllers.push(entry);
    return;
  }

  const schemaValid = Boolean(validate(controllerData));
  if (!schemaValid) {
    entry.errors.push(`Schema validation failed for ${relativeFromRoot(controllerPath)}:`);
    for (const err of validate.errors || []) {
      const where = err.dataPath || "(root)";
      entry.errors.push(`${where} ${err.message}`);
    }
    report.errors.push.apply(report.errors, entry.errors);
    report.controllers.push(entry);
    return;
  }

  const normalizedControls = normalizeControls(controllerData.controls);
  entry.controls = normalizedControls.length;

  const logicalErrors = [];
  logicalErrors.push.apply(logicalErrors, validateSemanticIds(normalizedControls, semanticCatalog, sceneSemanticSet, controllerData));
  logicalErrors.push.apply(logicalErrors, validateDuplicates(normalizedControls, controllerData));

  if (logicalErrors.length) {
    entry.errors.push(`Logical validation failed for ${relativeFromRoot(controllerPath)}:`);
    for (const err of logicalErrors) {
      entry.errors.push(err);
    }
    report.errors.push.apply(report.errors, entry.errors);
  }

  report.controllers.push(entry);
}

function validateSemanticIds(controls, semanticCatalogSet, sceneSet, controllerData) {
  const errors = [];
  for (const control of controls) {
    if (!control || !control.semantic_id) {
      continue;
    }
    if (semanticCatalogSet.has(control.semantic_id)) {
      continue;
    }
    if (sceneSet.has(control.semantic_id)) {
      continue;
    }
    errors.push(
      `${controllerData.controller_name || "<unknown>"} control ${control.id || control.physical_label || "<unknown>"} references unknown semantic_id ${control.semantic_id}.`
    );
  }
  return errors;
}

function validateDuplicates(controls, controllerData) {
  const errors = [];
  const seen = new Map();
  const controllerChannel = Number.isInteger(controllerData.midi_channel) ? controllerData.midi_channel : null;

  for (const control of controls) {
    const allowDuplicate = Boolean(control && control.allow_duplicate);
    const keys = physicalKeysForControl(control, controllerChannel);
    for (const key of keys) {
      if (!key) {
        continue;
      }
      if (seen.has(key)) {
        const existing = seen.get(key);
        if (!allowDuplicate && !existing.allow_duplicate) {
          errors.push(
            `Duplicate physical mapping in ${controllerData.controller_name || "<unknown>"}: ${key} is used by ${existing.id} and ${control.id}.`
          );
        }
      } else {
        seen.set(key, control);
      }
    }
  }

  return errors;
}

function physicalKeysForControl(control, controllerChannel) {
  const keys = [];
  if (control && control.midi) {
    const channel = Number.isInteger(control.midi.channel)
      ? control.midi.channel
      : controllerChannel;
    if (control.midi.type === "note" && Number.isInteger(channel) && Number.isInteger(control.midi.note)) {
      keys.push(`midi.note:${channel}:${control.midi.note}`);
    }
    if (control.midi.type === "cc" && Number.isInteger(channel) && Number.isInteger(control.midi.cc)) {
      keys.push(`midi.cc:${channel}:${control.midi.cc}`);
    }
  }
  if (control && control.osc && control.osc.address) {
    keys.push(`osc:${control.osc.address}`);
  }
  return keys;
}

function normalizeControls(rawControls) {
  if (Array.isArray(rawControls)) {
    return rawControls;
  }
  if (rawControls && typeof rawControls === "object") {
    return Object.keys(rawControls).map((key) => {
      const value = rawControls[key] || {};
      if (!value.id) {
        return Object.assign({ id: key }, value);
      }
      return value;
    });
  }
  return [];
}

function collectContractSemanticIds(contractData) {
  const ids = new Set();
  const catalog = contractData && contractData.semanticCatalog ? contractData.semanticCatalog : {};
  const groups = ["scenes", "states", "events", "macros", "analysis"];
  for (const group of groups) {
    const items = Array.isArray(catalog[group]) ? catalog[group] : [];
    for (const item of items) {
      if (item && item.id) {
        ids.add(item.id);
      }
    }
  }
  return ids;
}

function loadActiveSceneSemanticIds(activeProfilePath) {
  const ids = new Set();
  if (!fs.existsSync(activeProfilePath)) {
    report.warnings.push(`Active profile not found, skipping scene-file cross-check: ${relativeFromRoot(activeProfilePath)}`);
    return ids;
  }

  let profileData;
  try {
    profileData = readStructuredFile(activeProfilePath, "profile file");
  } catch (error) {
    report.warnings.push(error.message);
    return ids;
  }

  const scenePath = resolveRepoRelativePath(profileData.scene_file);
  if (!scenePath || !fs.existsSync(scenePath)) {
    report.warnings.push(`Active profile scene file not found, skipping scene-file cross-check: ${profileData.scene_file}`);
    return ids;
  }

  let sceneData;
  try {
    sceneData = readStructuredFile(scenePath, "scene file");
  } catch (error) {
    report.warnings.push(error.message);
    return ids;
  }

  const scenes = Array.isArray(sceneData.scenes) ? sceneData.scenes : [];
  for (const item of scenes) {
    if (item && item.id) {
      ids.add(item.id);
    }
  }

  return ids;
}

function hasControllerMapping(semanticId) {
  for (const controllerPath of resolvedControllerPaths) {
    if (!fs.existsSync(controllerPath)) {
      continue;
    }
    let controllerData;
    try {
      controllerData = readStructuredFile(controllerPath, "controller file");
    } catch (error) {
      continue;
    }
    const controls = normalizeControls(controllerData.controls);
    for (const control of controls) {
      if (control && control.semantic_id === semanticId) {
        return true;
      }
    }
  }
  return false;
}

function printPass() {
  console.log(`OK: ${resolvedControllerPaths.length} controller file(s) validated.`);
  if (report.warnings.length) {
    console.log("Warnings:");
    for (const warning of report.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

function printFail() {
  if (report.warnings.length) {
    console.log("Warnings:");
    for (const warning of report.warnings) {
      console.log(`- ${warning}`);
    }
    console.log("");
  }
  console.error("Validation failed:");
  for (const error of report.errors) {
    console.error(`- ${error}`);
  }
}

function printHelp() {
  console.log("Usage: node tools/validate-controllers.js [controller.yaml ...] [--profile profiles/minimal.yaml] [--contract interop/rig.contract.json] [--schema schemas/controller.schema.json]");
  console.log("Validates controller maps against the controller schema, the active scene file, and the shared rig contract.");
}

function readJson(targetPath, label) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${label} JSON at ${targetPath}: ${error.message}`);
    process.exit(1);
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

function relativeFromRoot(targetPath) {
  return path.relative(rootDir, targetPath) || ".";
}
