#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const spawnSync = require("child_process").spawnSync;

const rootDir = path.resolve(__dirname, "..");
const args = parseArgs(process.argv.slice(2));
const profilePath = path.resolve(rootDir, args.profile || "profiles/minimal.yaml");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const outputDir = path.resolve(rootDir, args.out || path.join("logs", `live-rig-debug-${stamp}`));

fs.mkdirSync(outputDir, { recursive: true });

const manifest = {
  generated_at: new Date().toISOString(),
  output_dir: relativeFromRoot(outputDir),
  selected_profile: relativeFromRoot(profilePath),
  files: [],
  commands: []
};

main();

function main() {
  writeCommand("doctor.json", process.execPath, [
    path.join(rootDir, "tools", "rig-doctor.js"),
    "--profile",
    profilePath,
    "--json"
  ]);

  writeCommand("git-status.txt", "git", ["status", "--short"]);
  writeCommand("git-head.txt", "git", ["rev-parse", "HEAD"]);

  copyIfExists("package.json");
  copyIfExists(".env.example");
  copyIfExists("interop/rig.contract.json");
  copyIfExists("interop/exports/live-rig.default.json");
  copyIfExists("schemas/rig-profile.schema.json");
  copyIfExists(relativeFromRoot(profilePath));

  const profile = readStructured(profilePath);
  if (profile && profile.scene_file) {
    copyIfExists(profile.scene_file);
  }

  copyDirFlat("controllers");
  copyIfExists("mappings.json");

  fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Debug packet written to ${relativeFromRoot(outputDir)}.`);
}

function writeCommand(fileName, command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: rootDir,
    encoding: "utf8"
  });
  if (fileName.endsWith(".json") && result.stdout) {
    fs.writeFileSync(path.join(outputDir, fileName), result.stdout, "utf8");
    manifest.commands.push({
      file: fileName,
      command: [command].concat(commandArgs),
      exit_status: result.status
    });
    return;
  }

  const output = [
    `$ ${[command].concat(commandArgs).map(formatArg).join(" ")}`,
    `exit_status=${result.status === null ? "null" : result.status}`,
    "",
    "STDOUT:",
    result.stdout || "",
    "",
    "STDERR:",
    result.stderr || ""
  ].join("\n");

  fs.writeFileSync(path.join(outputDir, fileName), output, "utf8");
  manifest.commands.push({
    file: fileName,
    command: [command].concat(commandArgs),
    exit_status: result.status
  });
}

function copyIfExists(relativePath) {
  const sourcePath = path.resolve(rootDir, relativePath);
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    return;
  }

  const targetPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  manifest.files.push(relativePath);
}

function copyDirFlat(relativeDir) {
  const sourceDir = path.resolve(rootDir, relativeDir);
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    return;
  }

  for (const fileName of fs.readdirSync(sourceDir).sort()) {
    const relativePath = path.join(relativeDir, fileName);
    const sourcePath = path.resolve(rootDir, relativePath);
    if (fs.statSync(sourcePath).isFile()) {
      copyIfExists(relativePath);
    }
  }
}

function readStructured(targetPath) {
  try {
    const { readStructuredFile } = require("./structured-file");
    return readStructuredFile(targetPath, "profile file");
  } catch (error) {
    return null;
  }
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") {
      parsed.profile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--out") {
      parsed.out = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function formatArg(arg) {
  if (/^[A-Za-z0-9_./:-]+$/.test(arg)) {
    return arg;
  }
  return JSON.stringify(arg);
}

function relativeFromRoot(targetPath) {
  return path.relative(rootDir, targetPath) || ".";
}
