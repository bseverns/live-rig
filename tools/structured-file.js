const fs = require("fs");

function readStructuredFile(targetPath, label) {
  let text;
  try {
    text = fs.readFileSync(targetPath, "utf8");
  } catch (error) {
    throw new Error(`Failed to read ${label} at ${targetPath}: ${error.message}`);
  }

  try {
    return JSON.parse(text);
  } catch (jsonError) {
    try {
      return parseYamlSubset(text);
    } catch (yamlError) {
      throw new Error(`Failed to parse ${label} at ${targetPath}: ${yamlError.message}`);
    }
  }
}

function parseYamlSubset(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter((entry) => entry.line.trim() !== "" && !entry.line.trimStart().startsWith("#"));

  if (!lines.length) {
    throw new Error("Structured file is empty.");
  }

  let cursor = 0;
  const value = parseObject(0);

  if (cursor < lines.length) {
    throw new Error(`Unexpected trailing content at line ${lines[cursor].index}.`);
  }

  return value;

  function parseObject(indent) {
    const obj = {};
    while (cursor < lines.length) {
      const current = lines[cursor];
      const currentIndent = countIndent(current.line);
      if (currentIndent < indent) {
        break;
      }
      if (currentIndent > indent) {
        throw new Error(`Unexpected indentation at line ${current.index}.`);
      }

      const trimmed = current.line.trim();
      if (trimmed.startsWith("-")) {
        break;
      }

      const colonIndex = trimmed.indexOf(":");
      if (colonIndex === -1) {
        throw new Error(`Expected key/value pair at line ${current.index}.`);
      }

      const key = trimmed.slice(0, colonIndex).trim();
      const rawValue = trimmed.slice(colonIndex + 1).trim();
      cursor += 1;

      if (!rawValue) {
        if (cursor >= lines.length) {
          obj[key] = {};
          continue;
        }

        const nextIndent = countIndent(lines[cursor].line);
        if (nextIndent <= indent) {
          obj[key] = {};
          continue;
        }

        obj[key] = lines[cursor].line.trimStart().startsWith("-") ? parseArray(nextIndent) : parseObject(nextIndent);
        continue;
      }

      obj[key] = parseScalar(rawValue);
    }
    return obj;
  }

  function parseArray(indent) {
    const items = [];
    while (cursor < lines.length) {
      const current = lines[cursor];
      const currentIndent = countIndent(current.line);
      if (currentIndent < indent) {
        break;
      }
      if (currentIndent > indent) {
        throw new Error(`Unexpected indentation at line ${current.index}.`);
      }

      const trimmed = current.line.trim();
      if (!trimmed.startsWith("-")) {
        break;
      }

      const rawItem = trimmed.slice(1).trim();
      cursor += 1;

      if (rawItem) {
        items.push(parseScalar(rawItem));
        continue;
      }

      if (cursor >= lines.length) {
        items.push(null);
        continue;
      }

      const nextIndent = countIndent(lines[cursor].line);
      if (nextIndent <= indent) {
        items.push(null);
        continue;
      }

      items.push(lines[cursor].line.trimStart().startsWith("-") ? parseArray(nextIndent) : parseObject(nextIndent));
    }
    return items;
  }

  function parseScalar(raw) {
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      return unquote(raw.slice(1, -1), raw[0]);
    }

    if (/^(true|false)$/i.test(raw)) {
      return raw.toLowerCase() === "true";
    }

    if (/^(null|~)$/i.test(raw)) {
      return null;
    }

    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(raw)) {
      return Number(raw);
    }

    return raw;
  }

  function unquote(value, quoteChar) {
    if (quoteChar === '"') {
      return value.replace(/\\(["\\nrt])/g, (match, escaped) => {
        if (escaped === '"') {
          return '"';
        }
        if (escaped === "\\") {
          return "\\";
        }
        if (escaped === "n") {
          return "\n";
        }
        if (escaped === "r") {
          return "\r";
        }
        if (escaped === "t") {
          return "\t";
        }
        return escaped;
      });
    }

    return value.replace(/\\'/g, "'");
  }

  function countIndent(line) {
    const match = line.match(/^ */);
    return match ? match[0].length : 0;
  }
}

module.exports = {
  parseYamlSubset,
  readStructuredFile
};
