#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const process = require("process");
const { promisify } = require("util");
const { execSync } = require("child_process");
const chalk = require("chalk");

const configFileName = "config.io.json";

let config;
const configPath = path.join(process.cwd(), configFileName);

if (!fs.existsSync(configPath)) {
  console.log(chalk.red(`${configFileName} not found in the root directory`));
  process.exit(1);
}

config = require(configPath);
// console.log(config);

if (config.compile) {
  try {
    execSync(config.compile, { stdio: "pipe" });
    console.log(chalk.yellow("Compilation successful!"));
  } catch (err) {
    console.log(chalk.red(err.stderr.toString()));
  }
}

const ioDir = "io";
const ioPath = path.join(process.cwd(), ioDir);

try {
  const ioFiles = fs.readdirSync(ioPath);

  if (ioFiles.length === 0) {
    throw Error("No in-out files present in the io directory");
  }

  let inFiles = [];
  let outFiles = [];
  ioFiles.forEach((file) => {
    if (file.startsWith("in")) {
      inFiles.push({ index: file.substring(2), in: file });
    }

    if (file.startsWith("out")) {
      outFiles.push({ index: file.substring(3), out: file });
    }
  });

  const ioTargetFiles = [];
  for (let i = 0; i < inFiles.length; i++) {
    for (let o = 0; o < outFiles.length; o++) {
      if (inFiles[i].index === outFiles[o].index) {
        ioTargetFiles.push({
          index: inFiles[i].index,
          in: inFiles[i].in,
          out: outFiles[o].out,
        });
      }
    }
  }

  console.log(chalk.grey(`Found ${ioTargetFiles.length} in-out-test files`));
} catch (err) {
  console.log(chalk.red(err));
  process.exit(1);
}
