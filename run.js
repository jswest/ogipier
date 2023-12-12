#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { compile, lex } from "./compiler.js";

const input = readFileSync(process.argv.slice(2)[0]).toString();

const tokens = lex(input);

const compiled = compile(tokens);

eval(compiled);
