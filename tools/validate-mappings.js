#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const args = process.argv.slice(2);
let mappingsPath;
let schemaPath;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--schema") {
    schemaPath = args[i + 1];
    i += 1;
    continue;
  }
  if (!mappingsPath) {
    mappingsPath = arg;
  }
}

if (!mappingsPath) {
  console.error("Usage: node tools/validate-mappings.js <mappings.json> [--schema interop/interop.schema.json]");
  process.exit(1);
}

const resolvedSchemaPath = schemaPath
  ? path.resolve(schemaPath)
  : path.resolve(__dirname, "..", "interop", "interop.schema.json");

const schema = readJson(resolvedSchemaPath, "schema");
const data = readJson(path.resolve(mappingsPath), "mappings");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(data);

let ok = Boolean(valid);
if (!valid) {
  console.error("Schema validation failed:");
  const errors = validate.errors || [];
  for (const err of errors) {
    const where = err.dataPath || "(root)";
    console.error(`- ${where} ${err.message}`);
  }
}

const normalized = normalizeMappings(data);
const toggleErrors = validateToggleSemantics(normalized.mappings);
if (toggleErrors.length) {
  ok = false;
  console.error("Toggle semantics check failed:");
  for (const err of toggleErrors) {
    console.error(`- ${err}`);
  }
}

if (!ok) {
  process.exit(1);
}

console.log(`OK: ${normalized.mappings.length} mapping(s) validated.`);

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

function validateToggleSemantics(mappings) {
  const errors = [];
  for (const mapping of mappings) {
    if (!isToggle(mapping)) {
      continue;
    }
    const oscBindings = toArray(mapping.osc);
    for (const binding of oscBindings) {
      if (!binding) {
        continue;
      }
      const hasOnArgs = Array.isArray(binding.onArgs) || Array.isArray(binding.args);
      const hasOffArgs = Array.isArray(binding.offArgs);
      if (!hasOnArgs || !hasOffArgs) {
        errors.push(
          `${mapping.id || "<unknown>"} osc binding at ${binding.address || "<unknown address>"} needs onArgs/args and offArgs.`
        );
      }
    }
    const midiBindings = toArray(mapping.midi);
    for (const binding of midiBindings) {
      if (!binding) {
        continue;
      }
      const hasOnValue = Number.isInteger(binding.onValue) || Number.isInteger(binding.value);
      const hasOffValue = Number.isInteger(binding.offValue);
      if (!hasOnValue || !hasOffValue) {
        errors.push(
          `${mapping.id || "<unknown>"} midi binding on channel ${
            binding.channel !== undefined ? binding.channel : "<unknown>"
          } needs onValue/value and offValue.`
        );
      }
    }
  }
  return errors;
}

function isToggle(mapping) {
  if (!mapping) {
    return false;
  }
  return mapping.interaction === "toggle" || mapping.type === "toggle" || mapping.toggle === true;
}

function toArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
