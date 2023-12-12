#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { compile, lex } from "./compiler.js";

const argv = yargs(hideBin(process.argv))
	.usage("Usage: $0 <inputFile> [options]")
	.command("$0 <inputFile> [outputFile]", "Run the program", (yargs) => {
		yargs
			.positional("inputFile", {
				describe: "Path to input Ogipier file.",
				type: "string",
			})
			.positional("outputFile", {
				describe: "Path to the compiled JavaScript file",
				type: "string",
			});
	})
	.option("run", {
		alias: "r",
		describe: "Run the program immediately",
		type: "boolean",
		default: false,
	})
	.help().argv;

const input = readFileSync(argv.inputFile).toString();

const tokens = lex(input);

const compiled = compile(tokens);

if (process.argv.includes("--run")) {
	eval(compiled);
} else {
	writeFileSync(argv.outputFile, compiled);
}
