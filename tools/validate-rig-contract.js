#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const args = process.argv.slice(2);
let contractPath;
let schemaPath;
let mappingsPath;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--schema") {
    schemaPath = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--mappings") {
    mappingsPath = args[i + 1];
    i += 1;
    continue;
  }
  if (!contractPath) {
    contractPath = arg;
  }
}

if (!contractPath) {
  console.error(
    "Usage: node tools/validate-rig-contract.js <interop/rig.contract.json> [--schema interop/rig.contract.schema.json] [--mappings mappings.json]"
  );
  process.exit(1);
}

const resolvedContractPath = path.resolve(contractPath);
const resolvedSchemaPath = schemaPath
  ? path.resolve(schemaPath)
  : path.resolve(__dirname, "..", "interop", "rig.contract.schema.json");
const resolvedMappingsPath = mappingsPath ? path.resolve(mappingsPath) : null;

const contract = readJson(resolvedContractPath, "contract");
const schema = readJson(resolvedSchemaPath, "schema");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(contract);

let ok = Boolean(valid);
if (!valid) {
  console.error("Schema validation failed:");
  for (const err of validate.errors || []) {
    const where = err.dataPath || "(root)";
    console.error(`- ${where} ${err.message}`);
  }
}

const logicalErrors = [];
logicalErrors.push.apply(logicalErrors, validateRepoRegistry(contract));
logicalErrors.push.apply(logicalErrors, validateSemanticCatalog(contract));
logicalErrors.push.apply(logicalErrors, validateBindings(contract));

if (resolvedMappingsPath) {
  const mappings = normalizeMappings(readJson(resolvedMappingsPath, "mappings"));
  logicalErrors.push.apply(logicalErrors, validateMappingRefs(contract, mappings.mappings));
}

if (logicalErrors.length) {
  ok = false;
  console.error("Logical validation failed:");
  for (const err of logicalErrors) {
    console.error(`- ${err}`);
  }
}

if (!ok) {
  process.exit(1);
}

console.log(
  `OK: contract ${contract.contractVersion} validated with ${contract.repoRegistry.length} repo entr${contract.repoRegistry.length === 1 ? "y" : "ies"}.`
);

function readJson(targetPath, label) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${label} JSON at ${targetPath}: ${error.message}`);
    process.exit(1);
  }
}

function validateRepoRegistry(contractData) {
  const errors = [];
  const registry = Array.isArray(contractData.repoRegistry) ? contractData.repoRegistry : [];
  const seen = new Set();
  for (const repo of registry) {
    if (seen.has(repo.id)) {
      errors.push(`Duplicate repo id: ${repo.id}`);
      continue;
    }
    seen.add(repo.id);
  }
  if (contractData.authority && contractData.authority.repo && !seen.has(contractData.authority.repo)) {
    errors.push(`Authority repo ${contractData.authority.repo} is not present in repoRegistry.`);
  }
  return errors;
}

function validateSemanticCatalog(contractData) {
  const errors = [];
  const catalog = contractData.semanticCatalog || {};
  const seenCanonical = new Set();
  const seenAliases = new Set();
  const groups = ["scenes", "states", "events", "macros", "analysis"];

  for (const group of groups) {
    const items = Array.isArray(catalog[group]) ? catalog[group] : [];
    for (const item of items) {
      if (seenCanonical.has(item.id)) {
        errors.push(`Duplicate semantic id: ${item.id}`);
      }
      seenCanonical.add(item.id);
      const aliases = Array.isArray(item.aliases) ? item.aliases : [];
      for (const alias of aliases) {
        if (seenCanonical.has(alias) || seenAliases.has(alias)) {
          errors.push(`Duplicate or colliding semantic alias: ${alias}`);
        }
        seenAliases.add(alias);
      }
    }
  }

  return errors;
}

function validateBindings(contractData) {
  const errors = [];
  const semanticIds = collectCanonicalSemanticIds(contractData.semanticCatalog);
  const seenBindings = new Set();
  const refs = Array.isArray(contractData.bindingRefs) ? contractData.bindingRefs : [];

  for (const ref of refs) {
    const key = `${ref.semanticId}::${ref.mappingRef}`;
    if (seenBindings.has(key)) {
      errors.push(`Duplicate bindingRef for ${ref.semanticId} -> ${ref.mappingRef}`);
    }
    seenBindings.add(key);
    if (!semanticIds.has(ref.semanticId)) {
      errors.push(`bindingRef semanticId is not declared in semanticCatalog: ${ref.semanticId}`);
    }
  }

  return errors;
}

function validateMappingRefs(contractData, mappings) {
  const errors = [];
  const ids = new Set(mappings.map((mapping) => mapping.id).filter(Boolean));
  const refs = Array.isArray(contractData.bindingRefs) ? contractData.bindingRefs : [];
  for (const ref of refs) {
    if (!ids.has(ref.mappingRef)) {
      errors.push(`bindingRef mappingRef not found in mappings.json: ${ref.mappingRef}`);
    }
  }
  return errors;
}

function collectCanonicalSemanticIds(catalog) {
  const ids = new Set();
  if (!catalog || typeof catalog !== "object") {
    return ids;
  }
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
