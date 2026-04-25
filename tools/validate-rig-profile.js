#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const rootDir = path.resolve(__dirname, "..");
const defaultSchemaPath = path.join(rootDir, "schemas", "rig-profile.schema.json");

const args = process.argv.slice(2);
let profilePath;
let schemaPath;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--schema") {
    schemaPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--help" || arg === "-h") {
    printHelp();
    process.exit(0);
  }
  if (!profilePath) {
    profilePath = arg;
  }
}

if (!profilePath) {
  console.error(
    "Usage: node tools/validate-rig-profile.js <interop/exports/live-rig.default.json> [--schema schemas/rig-profile.schema.json]"
  );
  process.exit(1);
}

const resolvedProfilePath = path.resolve(profilePath);
const resolvedSchemaPath = path.resolve(schemaPath || defaultSchemaPath);

const profile = readJson(resolvedProfilePath, "profile");
const schema = readJson(resolvedSchemaPath, "schema");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

let ok = Boolean(validate(profile));
if (!ok) {
  printErrors("Schema validation failed:", validate.errors || []);
}

const logicalErrors = validateExport(profile);
if (logicalErrors.length) {
  ok = false;
  console.error("Logical validation failed:");
  for (const error of logicalErrors) {
    console.error(`- ${error}`);
  }
}

if (!ok) {
  process.exit(1);
}

console.log(
  `OK: runtime profile ${profile.export_version} validated with ${Array.isArray(profile.controller_bindings) ? profile.controller_bindings.length : 0} controller binding group(s).`
);

function validateExport(profileData) {
  const errors = [];

  if (!hasSemanticId(profileData.safety_states, "state.blackout")) {
    errors.push("safety_states must include state.blackout.");
  }
  if (!hasSemanticId(profileData.safety_states, "scene.clean_camera")) {
    errors.push("safety_states must include scene.clean_camera.");
  }
  if (!hasSemanticId(profileData.scenes, "scene.clean_camera")) {
    errors.push("scenes must include scene.clean_camera.");
  }
  if (!hasSemanticId(profileData.states, "state.blackout")) {
    errors.push("states must include state.blackout.");
  }
  if (!hasControllerSemantic(profileData.controller_bindings, "state.blackout")) {
    errors.push("At least one controller binding must map state.blackout.");
  }
  if (!hasControllerSemantic(profileData.controller_bindings, "scene.clean_camera")) {
    errors.push("At least one controller binding must map scene.clean_camera.");
  }
  if (!profileData.source || profileData.source.build_fingerprint !== `sha256:${fingerprintFrom(profileData)}`) {
    errors.push("source.build_fingerprint must match the exported profile payload.");
  }
  if (!profileData.validation_summary || profileData.validation_summary.status !== "pass") {
    errors.push("validation_summary.status must be pass.");
  }
  if (!Array.isArray(profileData.validation_summary && profileData.validation_summary.validators) || !profileData.validation_summary.validators.length) {
    errors.push("validation_summary.validators must contain at least one result.");
  } else if (profileData.validation_summary.validators.some((item) => !item || item.status !== "pass")) {
    errors.push("validation_summary.validators must all pass.");
  }

  const sourceErrors = validateSourceFiles(profileData);
  errors.push.apply(errors, sourceErrors);
  return errors;
}

function validateSourceFiles(profileData) {
  const errors = [];
  const source = profileData.source || {};
  const pathsToCheck = [];

  if (source.profile_path) {
    pathsToCheck.push({ label: "source.profile_path", value: source.profile_path });
  }
  if (source.scene_path) {
    pathsToCheck.push({ label: "source.scene_path", value: source.scene_path });
  }
  if (source.contract_path) {
    pathsToCheck.push({ label: "source.contract_path", value: source.contract_path });
  }

  const controllerPaths = Array.isArray(source.controller_paths) ? source.controller_paths : [];
  for (const controllerPath of controllerPaths) {
    pathsToCheck.push({ label: "source.controller_paths", value: controllerPath });
  }

  for (const item of pathsToCheck) {
    const resolvedPath = resolveRepoRelativePath(item.value);
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`Missing file referenced by ${item.label}: ${item.value}`);
    }
  }

  if (profileData.profile && profileData.profile.scene_file) {
    const resolvedProfileScene = resolveRepoRelativePath(profileData.profile.scene_file);
    const resolvedSourceScene = resolveRepoRelativePath(source.scene_path || "");
    if (resolvedProfileScene !== resolvedSourceScene) {
      errors.push("profile.scene_file must match source.scene_path.");
    }
  }

  return errors;
}

function hasSemanticId(items, semanticId) {
  return Array.isArray(items) && items.some((item) => {
    if (typeof item === "string") {
      return item === semanticId;
    }
    return item && item.id === semanticId;
  });
}

function hasControllerSemantic(controllerBindings, semanticId) {
  for (const controller of Array.isArray(controllerBindings) ? controllerBindings : []) {
    const controls = Array.isArray(controller && controller.controls) ? controller.controls : [];
    for (const control of controls) {
      if (control && control.semantic_id === semanticId) {
        return true;
      }
    }
  }
  return false;
}

function fingerprintFrom(profileData) {
  const payload = {
    export_version: profileData.export_version,
    source: {
      profile_path: profileData.source && profileData.source.profile_path,
      scene_path: profileData.source && profileData.source.scene_path,
      controller_paths: profileData.source && profileData.source.controller_paths,
      contract_path: profileData.source && profileData.source.contract_path,
      generated_by: profileData.source && profileData.source.generated_by
    },
    profile: profileData.profile,
    scenes: profileData.scenes,
    states: profileData.states,
    macros: profileData.macros,
    controller_bindings: profileData.controller_bindings,
    safety_states: profileData.safety_states,
    required_devices: profileData.required_devices,
    optional_devices: profileData.optional_devices,
    visual_endpoints: profileData.visual_endpoints,
    audio_patch_reference: profileData.audio_patch_reference,
    clock_doctrine: profileData.clock_doctrine,
      validation_summary: profileData.validation_summary
    };

  return sha256(JSON.stringify(payload));
}

function sha256(text) {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function printErrors(prefix, errors) {
  console.error(prefix);
  for (const err of errors) {
    const where = err.dataPath || "(root)";
    console.error(`- ${where} ${err.message}`);
  }
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

function printHelp() {
  console.log("Usage: node tools/validate-rig-profile.js <interop/exports/live-rig.default.json> [--schema schemas/rig-profile.schema.json]");
  console.log("Validates the exported runtime profile schema, source references, safety states, and controller reachability.");
}
