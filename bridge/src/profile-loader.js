const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..", "..");
const defaultProfilePath = path.join(rootDir, "interop", "exports", "live-rig.default.json");

function loadProfile(profilePath) {
  const resolvedPath = profilePath
    ? (path.isAbsolute(profilePath) ? profilePath : path.resolve(rootDir, profilePath))
    : defaultProfilePath;

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Exported rig profile not found: ${relativeFromRoot(resolvedPath)}`);
  }

  let profile;
  try {
    profile = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  } catch (error) {
    throw new Error(`Failed to parse exported rig profile at ${relativeFromRoot(resolvedPath)}: ${error.message}`);
  }

  validateProfile(profile, resolvedPath);

  return {
    profile,
    path: resolvedPath
  };
}

function validateProfile(profile, resolvedPath) {
  const errors = [];
  if (!profile || typeof profile !== "object") {
    errors.push("Profile payload is not an object.");
  }

  if (profile.export_version !== "1.0.0") {
    errors.push("export_version must be 1.0.0.");
  }

  if (!profile.validation_summary || profile.validation_summary.status !== "pass") {
    errors.push("validation_summary.status must be pass.");
  }

  if (!hasSemanticId(profile.safety_states, "state.blackout")) {
    errors.push("safety_states must include state.blackout.");
  }

  if (!hasSemanticId(profile.safety_states, "scene.clean_camera")) {
    errors.push("safety_states must include scene.clean_camera.");
  }

  if (!hasSemanticId(profile.scenes, "scene.clean_camera")) {
    errors.push("scenes must include scene.clean_camera.");
  }

  if (!hasSemanticId(profile.states, "state.blackout")) {
    errors.push("states must include state.blackout.");
  }

  if (!hasControllerSemantic(profile.controller_bindings, "state.blackout")) {
    errors.push("At least one controller binding must map state.blackout.");
  }

  if (!hasControllerSemantic(profile.controller_bindings, "scene.clean_camera")) {
    errors.push("At least one controller binding must map scene.clean_camera.");
  }

  if (!profile.source || profile.source.profile_path !== "profiles/minimal.yaml") {
    errors.push("source.profile_path must point at profiles/minimal.yaml for the default export.");
  }

  if (!profile.profile || profile.profile.profile_id !== "profile.minimal") {
    errors.push("profile.profile_id must be profile.minimal for the default export.");
  }

  validateSourceFiles(profile, errors);

  if (errors.length) {
    const message = ["Exported rig profile failed validation:"].concat(errors.map((error) => `- ${error}`)).join("\n");
    throw new Error(message);
  }

  if (resolvedPath !== defaultProfilePath) {
    // Nothing else to check here; the default export path is the only supported bridge input in this task.
  }
}

function validateSourceFiles(profile, errors) {
  const source = profile && profile.source ? profile.source : {};
  const paths = [
    source.profile_path,
    source.scene_path,
    source.contract_path
  ].filter(Boolean);

  for (const relativePath of paths) {
    const resolvedPath = resolveRepoRelativePath(relativePath);
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`Missing source file: ${relativePath}`);
    }
  }

  const controllerPaths = Array.isArray(source.controller_paths) ? source.controller_paths : [];
  for (const relativePath of controllerPaths) {
    const resolvedPath = resolveRepoRelativePath(relativePath);
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`Missing controller source file: ${relativePath}`);
    }
  }
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

module.exports = {
  defaultProfilePath,
  loadProfile
};
