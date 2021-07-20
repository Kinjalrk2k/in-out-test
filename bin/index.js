#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const process = require("process");
const { promisify } = require("util");
const exec = require("child_process").exec;
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
  exec(config.compile, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red(stderr));
      process.exit(1);
    } else {
      console.log(chalk.yellow("Compilation successful!"));
    }
  });
}
