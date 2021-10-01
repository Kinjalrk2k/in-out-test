#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const process = require('process');
const { execSync } = require('child_process');
const chalk = require('chalk');

const configFileName = 'config.io.json';

let config;
const configPath = path.join(process.cwd(), configFileName);

if (!fs.existsSync(configPath)) {
	console.log(chalk.red(`${configFileName} not found in the root directory`));
	process.exit(1);
}

config = require(configPath);
// console.log(config);

if (config.compile_cpp) {
	try {
		execSync(config.compile_cpp, { stdio: 'pipe' });
		console.log(chalk.yellow('CPP file Compilation successful!'));
	} catch (err) {
		console.log(chalk.red(err.stderr.toString()));
	}
}

if (config.compile_java) {
	try {
		execSync(config.compile_java, { stdio: 'pipe' });
		console.log(chalk.yellow('Java File Compilation successful!'));
	} catch (err) {
		console.log(chalk.red(err.stderr.toString()));
	}
}

const ioDir = 'io';
const ioPath = path.join(process.cwd(), ioDir);

try {
	const ioFiles = fs.readdirSync(ioPath);

	if (ioFiles.length === 0) {
		throw Error('No in-out files present in the io directory');
	}

	let inFiles = [];
	let outFiles = [];
	ioFiles.forEach((file) => {
		if (file.startsWith('in')) {
			inFiles.push({ index: file.substring(2), in: file });
		}

		if (file.startsWith('out')) {
			outFiles.push({ index: file.substring(3), out: file });
		}
	});

	const ioTargetFiles = [];
	for (let i = 0; i < inFiles.length; i++) {
		for (let o = 0; o < outFiles.length; o++) {
			if (inFiles[i].index === outFiles[o].index) {
				ioTargetFiles.push({
					index: inFiles[i].index,
					inFileName: inFiles[i].in,
					outFileName: outFiles[o].out,
					in: path.join(process.cwd(), 'io', inFiles[i].in),
					out: path.join(process.cwd(), 'io', outFiles[o].out),
				});
			}
		}
	}

	const ioTestsLength = ioTargetFiles.length;
	console.log(chalk.grey(`Found ${ioTestsLength} in-out-test files`));

	ioTargetFiles.forEach((io, idx) => {
		const input = fs.readFileSync(io.in).toString().trim();

		const output = execSync(config.run, {
			stdio: 'pipe',
			input,
		})
			.toString()
			.trim();

		const outputJava = execSync(config.run_java, {
			stdio: 'pipe',
			input,
		})
			.toString()
			.trim();

		const expectedOutput = fs.readFileSync(io.out).toString().trim();

		if (output === expectedOutput) {
			console.log(chalk.green(`Passed Test Case [${idx + 1}/${ioTestsLength}]`));
		} else {
			const errMsg =
				chalk.red(`Failed Test Case [${idx + 1}/${ioTestsLength}]`) +
				' => ' +
				chalk.blue(`Files(${io.inFileName}/${io.outFileName})`);

			console.log(errMsg);
		}

		if (outputJava === expectedOutput) {
			console.log(
				chalk.green(`Passed Test Case [${idx + 1}/${ioTestsLength}] for Java Code`)
			);
		} else {
			const errMsg =
				chalk.red(`Failed Test Case [${idx + 1}/${ioTestsLength}] for Java Code`) +
				' => ' +
				chalk.blue(`Files(${io.inFileName}/${io.outFileName})`);

			console.log(errMsg);
		}
	});
} catch (err) {
	console.log(chalk.red(err));
	process.exit(1);
}
