#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const process = require("process");
const chalk = require("chalk");

const configFileName = "config.io.json";

let config;
const configPath = path.join(process.cwd(), configFileName);

if (!fs.existsSync(configPath)) {
  console.log(chalk.red(`${configFileName} not found in the root directory`));
  process.exit(1);
}

config = require(configPath);
console.log(config);
