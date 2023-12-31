#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import * as prettier from "prettier";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { compile } from "./compiler.js";

const argv = yargs(hideBin(process.argv))
	.usage("Usage: $0 <inputFile> [options]")
	.command(
		"$0 <inputFile> [outputFile]",
		"Compile an Ogipier program to; JavaScript.",
		(yargs) => {
			yargs
				.positional("inputFile", {
					describe: "Path to input Ogipier file.",
					type: "string",
				})
				.positional("outputFile", {
					describe: "Path to the compiled JavaScript file",
					type: "string",
				});
		},
	)
	.option("run", {
		alias: "r",
		describe: "Run the program immediately",
		type: "boolean",
		default: false,
	})
	.help().argv;

(async () => {
	const input = readFileSync(argv.inputFile).toString();

	const compiled = compile(input);

	if (process.argv.includes("--run")) {
		eval(compiled);
	} else {
		try {
			const nice = await prettier.format(compiled, { parser: "babel" });
			writeFileSync(argv.outputFile, nice);
		} catch (error) {
			console.log(error);
			writeFileSync(argv.outputFile, compiled);
		}
	}
})();
