function printInventory(profile) {
  console.log(`Loaded export: ${profile.profile.profile_id} (${profile.profile.label})`);
  console.log("");
  console.log("Scenes:");
  for (const scene of profile.scenes || []) {
    console.log(`- ${scene.id} :: ${scene.label}`);
  }
  console.log("");
  console.log("States:");
  for (const state of profile.states || []) {
    console.log(`- ${state.id} :: ${state.label}`);
  }
  console.log("");
  console.log("Macros:");
  for (const macro of profile.macros || []) {
    console.log(`- ${macro.id} :: ${macro.label}`);
  }
  console.log("");
  console.log("Controller bindings:");
  for (const controller of profile.controller_bindings || []) {
    console.log(`- ${controller.controller_name} (${controller.role})`);
    for (const control of controller.controls || []) {
      const safety = control.safety ? " [safety]" : "";
      console.log(`  - ${control.semantic_id} <= ${control.physical_label}${safety}`);
    }
  }
}

function printSimulation(profile, semanticId) {
  const entry = resolveSemanticEntry(profile, semanticId);
  if (!entry) {
    throw new Error(`Unknown semantic ID: ${semanticId}`);
  }

  const kind = semanticKind(semanticId);
  console.log(`EVENT ${semanticId} [${kind}] ${entry.label}`);
  if (entry.notes) {
    console.log(`NOTE ${entry.notes}`);
  }
}

function resolveSemanticEntry(profile, semanticId) {
  const collections = [profile.scenes, profile.states, profile.macros];
  for (const collection of collections) {
    for (const entry of collection || []) {
      if (entry && entry.id === semanticId) {
        return entry;
      }
    }
  }
  return null;
}

function semanticKind(semanticId) {
  const prefix = semanticId.split(".")[0];
  if (prefix === "scene" || prefix === "state" || prefix === "macro" || prefix === "event" || prefix === "analysis") {
    return prefix;
  }
  return "semantic";
}

module.exports = {
  printInventory,
  printSimulation
};
