#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const args = process.argv.slice(2);
let contractPath;
let mappingsPath;
let outPath;
let contractSchemaPath;
let profileSchemaPath;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--contract") {
    contractPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--mappings") {
    mappingsPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--out") {
    outPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--contract-schema") {
    contractSchemaPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--profile-schema") {
    profileSchemaPath = args[i + 1];
    i += 1;
  }
}

const rootDir = path.resolve(__dirname, "..");
const resolvedContractPath = path.resolve(
  contractPath || path.join(rootDir, "interop", "rig.contract.json")
);
const resolvedMappingsPath = path.resolve(mappingsPath || path.join(rootDir, "mappings.json"));
const resolvedOutPath = path.resolve(
  outPath || path.join(rootDir, "interop", "exports", "live-rig.default.json")
);
const resolvedContractSchemaPath = path.resolve(
  contractSchemaPath || path.join(rootDir, "interop", "rig.contract.schema.json")
);
const resolvedProfileSchemaPath = path.resolve(
  profileSchemaPath || path.join(rootDir, "interop", "rig.profile.schema.json")
);

const contract = readJson(resolvedContractPath, "contract");
const mappings = normalizeMappings(readJson(resolvedMappingsPath, "mappings"));

validateContract(contract, readJson(resolvedContractSchemaPath, "contract schema"), mappings.mappings);

const profile = buildProfile(contract, mappings, resolvedContractPath, resolvedMappingsPath);
validateProfile(profile, readJson(resolvedProfileSchemaPath, "profile schema"));

fs.mkdirSync(path.dirname(resolvedOutPath), { recursive: true });
fs.writeFileSync(resolvedOutPath, JSON.stringify(profile, null, 2) + "\n", "utf8");
console.log(`Exported runtime profile to ${resolvedOutPath}`);

function buildProfile(contractData, mappingsData, contractFilePath, mappingsFilePath) {
  const mappingById = new Map();
  for (const mapping of mappingsData.mappings) {
    if (mapping && mapping.id) {
      mappingById.set(mapping.id, mapping);
    }
  }

  const bindings = [];
  const refs = Array.isArray(contractData.bindingRefs) ? contractData.bindingRefs : [];
  for (const ref of refs) {
    const mapping = mappingById.get(ref.mappingRef);
    bindings.push({
      semanticId: ref.semanticId,
      mappingRef: ref.mappingRef,
      supported: Boolean(mapping),
      transport: Array.isArray(ref.transport) ? ref.transport : [],
      interaction: mapping && mapping.interaction ? mapping.interaction : mapping && mapping.type ? mapping.type : "unknown",
      group: mapping && mapping.group ? mapping.group : undefined,
      label: mapping && mapping.label ? mapping.label : undefined,
      midi: mapping ? toArray(mapping.midi) : [],
      osc: mapping ? toArray(mapping.osc) : [],
      notes: ref.notes
    });
  }

  return {
    "$schema": "../rig.profile.schema.json",
    snapshotVersion: contractData.contractVersion,
    exportedAt: new Date().toISOString(),
    source: {
      contractVersion: contractData.contractVersion,
      contractPath: relativeFromRoot(contractFilePath),
      mappingsPath: relativeFromRoot(mappingsFilePath),
      generatedBy: "tools/export-rig-profile.js"
    },
    authority: contractData.authority,
    survivabilityTiers: contractData.survivabilityTiers,
    controlLanes: contractData.controlLanes,
    endpointRules: contractData.endpointRules,
    semanticCatalog: contractData.semanticCatalog,
    bindings,
    repoRegistry: contractData.repoRegistry,
    healthContract: contractData.healthContract
  };
}

function validateContract(contractData, schema, mappingsList) {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(contractData);
  if (!valid) {
    printErrors("Contract schema validation failed:", validate.errors || []);
    process.exit(1);
  }

  const semanticIds = collectCanonicalSemanticIds(contractData.semanticCatalog);
  const mappingIds = new Set(mappingsList.map((mapping) => mapping.id).filter(Boolean));

  const errors = [];
  const refs = Array.isArray(contractData.bindingRefs) ? contractData.bindingRefs : [];
  for (const ref of refs) {
    if (!semanticIds.has(ref.semanticId)) {
      errors.push(`Unknown semanticId in bindingRefs: ${ref.semanticId}`);
    }
    if (!mappingIds.has(ref.mappingRef)) {
      errors.push(`Unknown mappingRef in bindingRefs: ${ref.mappingRef}`);
    }
  }

  if (errors.length) {
    console.error("Contract logical validation failed:");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }
}

function validateProfile(profileData, schema) {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(profileData);
  if (!valid) {
    printErrors("Profile schema validation failed:", validate.errors || []);
    process.exit(1);
  }
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

function normalizeMappings(data) {
  const mappings = [];
  const source = data && data.mappings;
  if (Array.isArray(source)) {
    for (const mapping of source) {
      mappings.push(mapping);
    }
  } else if (source && typeof source === "object") {
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const mapping = source[key];
      if (mapping && typeof mapping === "object") {
        const withId = mapping.id ? mapping : Object.assign({ id: key }, mapping);
        mappings.push(withId);
      }
    }
  }
  return { mappings };
}

function collectCanonicalSemanticIds(catalog) {
  const ids = new Set();
  const groups = ["scenes", "states", "events", "macros", "analysis"];
  for (const group of groups) {
    const items = catalog && Array.isArray(catalog[group]) ? catalog[group] : [];
    for (const item of items) {
      if (item && item.id) {
        ids.add(item.id);
      }
    }
  }
  return ids;
}

function toArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function relativeFromRoot(targetPath) {
  return path.relative(rootDir, targetPath) || ".";
}
