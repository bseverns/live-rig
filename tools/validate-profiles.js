#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const spawnSync = require("child_process").spawnSync;
const Ajv = require("ajv");
const { readStructuredFile } = require("./structured-file");

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
  if (!profilePath) {
    profilePath = arg;
  }
}

const rootDir = path.resolve(__dirname, "..");
const resolvedSchemaPath = path.resolve(schemaPath || path.join(rootDir, "schemas", "profile.schema.json"));
const profilePaths = profilePath
  ? [profilePath]
  : [path.join(rootDir, "profiles", "minimal.yaml"), path.join(rootDir, "profiles", "full-studio.yaml")];

const schema = readJson(resolvedSchemaPath, "schema");
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const errors = [];
let validatedCount = 0;

for (const targetPath of profilePaths) {
  const resolvedProfilePath = path.resolve(targetPath);
  let profileData;
  try {
    profileData = readStructuredFile(resolvedProfilePath, "profile file");
  } catch (error) {
    errors.push(error.message);
    continue;
  }

  let ok = Boolean(validate(profileData));
  if (!ok) {
    errors.push(`Schema validation failed for ${relativeFromRoot(resolvedProfilePath)}:`);
    for (const err of validate.errors || []) {
      const where = err.dataPath || "(root)";
      errors.push(`- ${where} ${err.message}`);
    }
    continue;
  }

  const logicalErrors = validateProfile(profileData, resolvedProfilePath);
  if (logicalErrors.length) {
    errors.push(`Logical validation failed for ${relativeFromRoot(resolvedProfilePath)}:`);
    for (const err of logicalErrors) {
      errors.push(`- ${err}`);
    }
    continue;
  }

  validatedCount += 1;
  console.log(`OK: ${relativeFromRoot(resolvedProfilePath)} validated.`);
}

if (errors.length) {
  for (const line of errors) {
    console.error(line);
  }
  process.exit(1);
}

console.log(`OK: ${validatedCount} profile entr${validatedCount === 1 ? "y" : "ies"} validated.`);

function validateProfile(profileData, resolvedProfilePath) {
  const errors = [];
  const scenePath = resolveRepoRelativePath(profileData.scene_file);

  if (!fs.existsSync(scenePath)) {
    errors.push(`Referenced scene file does not exist: ${profileData.scene_file}`);
  } else if (profileData.validate_scene_file) {
    const sceneValidation = spawnSync(
      process.execPath,
      [path.join(rootDir, "tools", "validate-scenes.js"), scenePath],
      { encoding: "utf8" }
    );

    if (sceneValidation.status !== 0) {
      errors.push(`Referenced scene file failed validation: ${profileData.scene_file}`);
      const stderr = sceneValidation.stderr ? sceneValidation.stderr.trim() : "";
      const stdout = sceneValidation.stdout ? sceneValidation.stdout.trim() : "";
      if (stdout) {
        errors.push(stdout);
      }
      if (stderr) {
        errors.push(stderr);
      }
    }
  }

  const safetyStates = new Set(Array.isArray(profileData.safety_states) ? profileData.safety_states : []);
  if (!safetyStates.has("state.blackout")) {
    errors.push("safety_states must include state.blackout.");
  }
  if (!safetyStates.has("scene.clean_camera")) {
    errors.push("safety_states must include scene.clean_camera.");
  }

  return errors;
}

function resolveRepoRelativePath(relativePath) {
  if (!relativePath) {
    return "";
  }
  return path.resolve(rootDir, relativePath);
}

function readJson(targetPath, label) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${label} JSON at ${targetPath}: ${error.message}`);
    process.exit(1);
  }
}

function relativeFromRoot(targetPath) {
  return path.relative(rootDir, targetPath) || ".";
}
