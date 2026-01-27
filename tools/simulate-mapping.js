#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
let mappingsPath;
let mappingId;
let action = "on";
let valueOverride;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--off") {
    action = "off";
    continue;
  }
  if (arg === "--on") {
    action = "on";
    continue;
  }
  if (arg === "--value") {
    const raw = args[i + 1];
    if (raw === undefined) {
      console.error("Missing value after --value.");
      process.exit(1);
    }
    valueOverride = Number.parseInt(raw, 10);
    if (Number.isNaN(valueOverride) || valueOverride < 0 || valueOverride > 127) {
      console.error("Value must be an integer between 0 and 127.");
      process.exit(1);
    }
    i += 1;
    continue;
  }
  if (!mappingsPath) {
    mappingsPath = arg;
    continue;
  }
  if (!mappingId) {
    mappingId = arg;
    continue;
  }
}

if (!mappingsPath || !mappingId) {
  console.error(
    "Usage: node tools/simulate-mapping.js <mappings.json> <mappingId|oscAddress> [--on|--off] [--value 0-127]"
  );
  process.exit(1);
}

const data = readJson(path.resolve(mappingsPath));
const normalized = normalizeMappings(data);
const mapping = findMapping(normalized.mappings, mappingId);

if (!mapping) {
  console.error(`Mapping not found for id or osc address: ${mappingId}`);
  process.exit(1);
}

const resolvedAction = valueOverride !== undefined ? "value" : action;
const outputs = [];

emitMapping(outputs, mapping, resolvedAction, valueOverride);

if (resolvedAction === "on" && isExclusive(mapping, normalized.groups)) {
  const groupId = mapping.group;
  const others = normalized.mappings.filter(
    (item) => item !== mapping && item.group === groupId
  );
  for (const other of others) {
    emitMapping(outputs, other, "off");
  }
}

printOutputs(mapping.id || mappingId, resolvedAction, outputs);

function readJson(targetPath) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read mappings JSON at ${targetPath}: ${error.message}`);
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
  return { mappings: mappings, groups: (data && data.groups) ? data.groups : {} };
}

function findMapping(mappings, needle) {
  const byId = mappings.find((mapping) => mapping && mapping.id === needle);
  if (byId) {
    return byId;
  }
  for (const mapping of mappings) {
    const oscBindings = toArray(mapping.osc);
    for (const binding of oscBindings) {
      if (binding && binding.address === needle) {
        return mapping;
      }
    }
  }
  return null;
}

function emitMapping(outputs, mapping, act, valueOverrideLocal) {
  const oscBindings = toArray(mapping.osc);
  for (const binding of oscBindings) {
    if (!binding || !binding.address) {
      continue;
    }
    const args = resolveOscArgs(binding, act, valueOverrideLocal);
    outputs.push({
      kind: "osc",
      sourceId: mapping.id ? mapping.id : "<unknown>",
      address: binding.address,
      args
    });
  }
  const midiBindings = toArray(mapping.midi);
  for (const binding of midiBindings) {
    if (!binding) {
      continue;
    }
    const number =
      binding.number !== undefined
        ? binding.number
        : binding.note !== undefined
        ? binding.note
        : binding.cc;
    if (!binding || number === undefined) {
      continue;
    }
    const midiType = binding.type ? binding.type : (binding.note !== undefined ? "note" : "cc");
    const value = resolveMidiValue(binding, act, valueOverrideLocal);
    outputs.push({
      kind: "midi",
      sourceId: mapping.id ? mapping.id : "<unknown>",
      type: midiType,
      channel: binding.channel,
      number,
      value
    });
  }
}

function resolveOscArgs(binding, act, valueOverrideLocal) {
  if (act === "off") {
    return Array.isArray(binding.offArgs) ? binding.offArgs : [0];
  }
  if (act === "value") {
    return [valueOverrideLocal];
  }
  if (Array.isArray(binding.onArgs)) {
    return binding.onArgs;
  }
  if (Array.isArray(binding.args)) {
    return binding.args;
  }
  return [1];
}

function resolveMidiValue(binding, act, valueOverrideLocal) {
  if (act === "off") {
    return Number.isInteger(binding.offValue) ? binding.offValue : 0;
  }
  if (act === "value") {
    return valueOverrideLocal;
  }
  if (Number.isInteger(binding.onValue)) {
    return binding.onValue;
  }
  if (Number.isInteger(binding.value)) {
    return binding.value;
  }
  return 127;
}

function isExclusive(mapping, groups) {
  if (!mapping || !mapping.group) {
    return false;
  }
  if (mapping.exclusive === true) {
    return true;
  }
  if (!groups || !groups[mapping.group]) {
    return false;
  }
  return Boolean(groups[mapping.group].exclusive);
}

function toArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function printOutputs(mappingName, act, outputs) {
  console.log(`Mapping: ${mappingName}`);
  console.log(`Action: ${act}`);
  if (!outputs.length) {
    console.log("No OSC/MIDI bindings to emit.");
    return;
  }
  for (const output of outputs) {
    const sourceLabel =
      output.sourceId && output.sourceId !== mappingName ? " (" + output.sourceId + ")" : "";
    if (output.kind === "osc") {
      console.log(`OSC  ${output.address}  ${JSON.stringify(output.args)}${sourceLabel}`);
      continue;
    }
    console.log(
      `MIDI ${output.type} ch${output.channel !== undefined ? output.channel : "?"} ${output.number} value ${output.value}${sourceLabel}`
    );
  }
}
