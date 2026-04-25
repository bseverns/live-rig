#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Ajv = require("ajv");
const { spawnSync } = require("child_process");
const { readStructuredFile } = require("./structured-file");

const rootDir = path.resolve(__dirname, "..");
const defaults = {
  profile: path.join(rootDir, "profiles", "minimal.yaml"),
  out: path.join(rootDir, "interop", "exports", "live-rig.default.json"),
  schema: path.join(rootDir, "schemas", "rig-profile.schema.json"),
  contract: path.join(rootDir, "interop", "rig.contract.json"),
  controllersDir: path.join(rootDir, "controllers")
};

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const resolvedProfilePath = resolveInputPath(args.profile || defaults.profile);
const resolvedOutPath = resolveInputPath(args.out || defaults.out);
const resolvedSchemaPath = resolveInputPath(args.schema || defaults.schema);
const resolvedContractPath = resolveInputPath(args.contract || defaults.contract);
const resolvedControllerPaths = discoverControllerPaths(args.controllersDir || defaults.controllersDir);
const pretty = Boolean(args.pretty);

const contract = readJson(resolvedContractPath, "contract");
const profile = readStructuredFile(resolvedProfilePath, "profile file");
const resolvedScenePath = resolveRepoRelativePath(profile.scene_file);
if (!fs.existsSync(resolvedScenePath)) {
  console.error(`Referenced scene file does not exist: ${profile.scene_file}`);
  process.exit(1);
}
const scene = readStructuredFile(resolvedScenePath, "scene file");
if (resolvedControllerPaths.length === 0) {
  console.error(`No controller maps were found in ${relativeFromRoot(args.controllersDir || defaults.controllersDir)}.`);
  process.exit(1);
}

const validationResults = [
  runValidator("contract", [path.join(rootDir, "tools", "validate-rig-contract.js"), resolvedContractPath], relativeFromRoot(resolvedContractPath)),
  runValidator("profile", [path.join(rootDir, "tools", "validate-profiles.js"), resolvedProfilePath], relativeFromRoot(resolvedProfilePath)),
  runValidator("scene", [path.join(rootDir, "tools", "validate-scenes.js"), resolvedScenePath], relativeFromRoot(resolvedScenePath)),
  runValidator("controllers", [
    path.join(rootDir, "tools", "validate-controllers.js"),
    "--profile",
    resolvedProfilePath,
    ...resolvedControllerPaths
  ], resolvedControllerPaths.map((controllerPath) => relativeFromRoot(controllerPath)).join(", "))
];

const failedValidation = validationResults.find((result) => !result.ok);
if (failedValidation) {
  printValidationFailure(validationResults);
  process.exit(1);
}

const controllerBindings = loadControllerBindings(resolvedControllerPaths);

const exportData = buildExport({
  contract,
  profile,
  scene,
  controllerBindings,
  sourcePaths: {
    profile: resolvedProfilePath,
    scene: resolvedScenePath,
    controllers: resolvedControllerPaths,
    contract: resolvedContractPath
  },
  validationResults
});

const schema = readJson(resolvedSchemaPath, "schema");
validateExport(exportData, schema, resolvedSchemaPath);

fs.mkdirSync(path.dirname(resolvedOutPath), { recursive: true });
fs.writeFileSync(
  resolvedOutPath,
  (pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData)) + "\n",
  "utf8"
);
console.log(`Exported runtime profile to ${relativeFromRoot(resolvedOutPath)}.`);

function buildExport(input) {
  const scenes = collectSemanticEntries(input.scene.scenes, "scene.");
  const states = collectSemanticEntries(input.scene.scenes, "state.");
  const macros = cloneJson(pathOrEmpty(input.contract, ["semanticCatalog", "macros"]) || []);
  const safetyStates = cloneJson(input.profile.safety_states || []);
  const requiredDevices = cloneJson(input.profile.required_devices || []);
  const optionalDevices = cloneJson(input.profile.optional_devices || []);
  const visualEndpoints = cloneJson(input.profile.visual_endpoints || []);
  const audioPatchReference = cloneJson(input.profile.audio_patch_reference || {});
  const clockDoctrine = cloneJson(input.profile.clock_doctrine || {});

  const exportData = {
    export_version: "1.0.0",
    source: {
      profile_path: relativeFromRoot(input.sourcePaths.profile),
      scene_path: relativeFromRoot(input.sourcePaths.scene),
      controller_paths: input.sourcePaths.controllers.map((controllerPath) => relativeFromRoot(controllerPath)),
      contract_path: relativeFromRoot(input.sourcePaths.contract),
      generated_by: "tools/export-rig-profile.js",
      build_fingerprint: ""
    },
    profile: cloneJson(input.profile),
    scenes,
    states,
    macros,
    controller_bindings: input.controllerBindings,
    safety_states: safetyStates,
    required_devices: requiredDevices,
    optional_devices: optionalDevices,
    visual_endpoints: visualEndpoints,
    audio_patch_reference: audioPatchReference,
    clock_doctrine: clockDoctrine,
    validation_summary: buildValidationSummary(input.validationResults, {
      scenes: scenes.length,
      states: states.length,
      macros: macros.length,
      controller_bindings: input.controllerBindings.length,
      required_devices: requiredDevices.length,
      optional_devices: optionalDevices.length,
      visual_endpoints: visualEndpoints.length,
      safety_states: safetyStates.length
    })
  };

  const buildFingerprint = sha256(
    JSON.stringify({
      export_version: exportData.export_version,
      source: {
        profile_path: exportData.source.profile_path,
        scene_path: exportData.source.scene_path,
        controller_paths: exportData.source.controller_paths,
        contract_path: exportData.source.contract_path,
        generated_by: exportData.source.generated_by
      },
      profile: exportData.profile,
      scenes: exportData.scenes,
      states: exportData.states,
      macros: exportData.macros,
      controller_bindings: exportData.controller_bindings,
      safety_states: exportData.safety_states,
      required_devices: exportData.required_devices,
      optional_devices: exportData.optional_devices,
      visual_endpoints: exportData.visual_endpoints,
      audio_patch_reference: exportData.audio_patch_reference,
      clock_doctrine: exportData.clock_doctrine,
      validation_summary: exportData.validation_summary
    })
  );

  exportData.source.build_fingerprint = `sha256:${buildFingerprint}`;
  return exportData;
}

function buildValidationSummary(results, counts) {
  return {
    status: "pass",
    validators: results.map((result) => ({
      name: result.name,
      status: result.ok ? "pass" : "fail",
      message: result.message,
      target: result.target
    })),
    counts,
    warnings: [],
    errors: []
  };
}

function validateExport(exportData, schema, schemaPath) {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = Boolean(validate(exportData));
  const logicalErrors = logicalExportChecks(exportData);
  if (valid && logicalErrors.length === 0) {
    return;
  }

  console.error(`Export validation failed against ${relativeFromRoot(schemaPath)}:`);
  for (const err of validate.errors || []) {
    const where = err.dataPath || "(root)";
    console.error(`- ${where} ${err.message}`);
  }

  for (const err of logicalErrors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

function logicalExportChecks(exportData) {
  const errors = [];
  if (!hasSemanticId(exportData.safety_states, "state.blackout")) {
    errors.push("safety_states must include state.blackout.");
  }
  if (!hasSemanticId(exportData.safety_states, "scene.clean_camera")) {
    errors.push("safety_states must include scene.clean_camera.");
  }
  if (!hasSemanticId(exportData.scenes, "scene.clean_camera")) {
    errors.push("Exported scenes must include scene.clean_camera.");
  }
  if (!hasSemanticId(exportData.states, "state.blackout")) {
    errors.push("Exported states must include state.blackout.");
  }
  if (!hasControllerSemantic(exportData.controller_bindings, "state.blackout")) {
    errors.push("At least one controller binding must map state.blackout.");
  }
  if (!hasControllerSemantic(exportData.controller_bindings, "scene.clean_camera")) {
    errors.push("At least one controller binding must map scene.clean_camera.");
  }
  if (!exportData.validation_summary || exportData.validation_summary.status !== "pass") {
    errors.push("validation_summary.status must be pass.");
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
  for (const controller of controllerBindings || []) {
    const controls = Array.isArray(controller.controls) ? controller.controls : [];
    for (const control of controls) {
      if (control && control.semantic_id === semanticId) {
        return true;
      }
    }
  }
  return false;
}

function loadControllerBindings(controllerPaths) {
  return controllerPaths.map((controllerPath) => {
    const data = readStructuredFile(controllerPath, "controller file");
    return {
      controller_name: data.controller_name,
      version: data.version,
      role: data.role,
      midi_channel: data.midi_channel,
      notes: data.notes,
      source_path: relativeFromRoot(controllerPath),
      controls: normalizeControls(data.controls)
    };
  });
}

function normalizeControls(rawControls) {
  if (Array.isArray(rawControls)) {
    return rawControls.map((control) => cloneJson(control));
  }

  if (rawControls && typeof rawControls === "object") {
    return Object.keys(rawControls).map((key) => {
      const control = cloneJson(rawControls[key] || {});
      if (!control.id) {
        control.id = key;
      }
      return control;
    });
  }

  return [];
}

function collectSemanticEntries(entries, prefix) {
  const results = [];
  for (const entry of Array.isArray(entries) ? entries : []) {
    if (entry && entry.id && entry.id.indexOf(prefix) === 0) {
      results.push(cloneJson(entry));
    }
  }
  return results;
}

function pathOrEmpty(target, parts) {
  let current = target;
  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function discoverControllerPaths(controllerDir) {
  if (!fs.existsSync(controllerDir)) {
    return [];
  }

  return fs
    .readdirSync(controllerDir)
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .map((file) => path.join(controllerDir, file))
    .sort();
}

function runValidator(name, args, target) {
  const result = spawnSync(process.execPath, args, { encoding: "utf8" });
  const stdout = (result.stdout || "").trim();
  const stderr = (result.stderr || "").trim();
  const ok = result.status === 0;
  const message = ok ? firstMeaningfulLine(stdout) : firstMeaningfulLine(stderr) || firstMeaningfulLine(stdout) || "Validation failed.";
  return {
    name,
    target: target || args[args.length - 1],
    ok,
    message
  };
}

function printValidationFailure(results) {
  for (const result of results) {
    const status = result.ok ? "PASS" : "FAIL";
    console.log(`${status}: ${result.name} - ${result.message}`);
  }
}

function firstMeaningfulLine(output) {
  if (!output) {
    return "";
  }
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0) || "";
}

function resolveInputPath(targetPath) {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(rootDir, targetPath);
}

function readJson(targetPath, label) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${label} JSON at ${targetPath}: ${error.message}`);
    process.exit(1);
  }
}

function cloneJson(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function parseArgs(argv) {
  const result = {
    pretty: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") {
      result.profile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--out") {
      result.out = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--schema") {
      result.schema = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--contract") {
      result.contract = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--controllers-dir") {
      result.controllersDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--pretty") {
      result.pretty = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    }
  }

  return result;
}

function printHelp() {
  console.log("Usage: node tools/export-rig-profile.js [--profile profiles/minimal.yaml] [--out interop/exports/live-rig.default.json] [--pretty]");
  console.log("Builds a deterministic runtime profile export from the selected mission profile, scene file, and controller maps.");
}

function relativeFromRoot(targetPath) {
  return path.relative(rootDir, targetPath) || ".";
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
