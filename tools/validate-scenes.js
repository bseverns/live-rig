#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const { readStructuredFile } = require("./structured-file");

const args = process.argv.slice(2);
let scenePath;
let schemaPath;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--schema") {
    schemaPath = args[i + 1];
    i += 1;
    continue;
  }
  if (!scenePath) {
    scenePath = arg;
  }
}

const rootDir = path.resolve(__dirname, "..");
const resolvedScenePath = path.resolve(scenePath || path.join(rootDir, "scenes", "minimal-scenes.yaml"));
const resolvedSchemaPath = path.resolve(schemaPath || path.join(rootDir, "schemas", "scene.schema.json"));

let sceneData;
try {
  sceneData = readStructuredFile(resolvedScenePath, "scene file");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
const schema = readJson(resolvedSchemaPath, "schema");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(sceneData);

let ok = Boolean(valid);
if (!valid) {
  console.error("Schema validation failed:");
  for (const err of validate.errors || []) {
    const where = err.dataPath || "(root)";
    console.error(`- ${where} ${err.message}`);
  }
}

const logicalErrors = validateSafety(sceneData);
if (logicalErrors.length) {
  ok = false;
  console.error("Safety invariant check failed:");
  for (const err of logicalErrors) {
    console.error(`- ${err}`);
  }
}

if (!ok) {
  process.exit(1);
}

const sceneCount = Array.isArray(sceneData.scenes) ? sceneData.scenes.length : 0;
console.log(
  `OK: ${relativeFromRoot(resolvedScenePath)} validated (${sceneCount} scene entr${sceneCount === 1 ? "y" : "ies"}).`
);

function readJson(targetPath, label) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${label} JSON at ${targetPath}: ${error.message}`);
    process.exit(1);
  }
}

function validateSafety(sceneData) {
  const errors = [];
  const scenes = Array.isArray(sceneData.scenes) ? sceneData.scenes : [];
  const byId = new Map();

  for (const scene of scenes) {
    if (!scene || typeof scene !== "object") {
      continue;
    }

    if (scene.id && byId.has(scene.id)) {
      errors.push(`Duplicate scene id: ${scene.id}`);
      continue;
    }

    if (scene.id) {
      byId.set(scene.id, scene);
    }
  }

  const blackout = byId.get("state.blackout");
  if (!blackout) {
    errors.push("Required safety state state.blackout is missing.");
  } else {
    if (blackout.hard_override !== true) {
      errors.push("state.blackout must set hard_override: true.");
    }
    if (blackout.ramp_ms !== 0) {
      errors.push("state.blackout must set ramp_ms: 0.");
    }
    if (!hasTriggers(blackout)) {
      errors.push("state.blackout must be reachable by at least one trigger.");
    }
  }

  const cleanCamera = byId.get("scene.clean_camera");
  if (!cleanCamera) {
    errors.push("Required scene scene.clean_camera is missing.");
  } else if (!hasTriggers(cleanCamera)) {
    errors.push("scene.clean_camera must be reachable by at least one trigger.");
  }

  return errors;
}

function hasTriggers(scene) {
  return Array.isArray(scene && scene.triggers) && scene.triggers.length > 0;
}

function relativeFromRoot(targetPath) {
  return path.relative(rootDir, targetPath) || ".";
}
