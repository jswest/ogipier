#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import * as prettier from "prettier";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import Compiler from "./../lib/compiler.js";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <inputFile> [options]")
  .command(
    "$0 <inputFile> [outputFile]",
    "Compile an Ogipier program to JavaScript.",
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
  try {
    // Read input file
    const input = readFileSync(argv.inputFile).toString();
    
    // Create compiler instance
    const compiler = new Compiler();
    
    // Compile the input
    const compiled = compiler.compile(input);

    if (argv.run) {
      // Run the compiled code
      eval(compiled);
    } else {
      try {
        const formatted = await prettier.format(compiled, { parser: "babel" });
        writeFileSync(argv.outputFile, formatted);
      } catch (error) {
        console.error("Formatting failed:", error);
        writeFileSync(argv.outputFile, compiled);
      }
    }
  } catch (error) {
    console.error("Compilation failed:", error);
    process.exit(1);
  }
})();