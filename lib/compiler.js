import core from "./core/core.js";
import Module from "./module.js";
import sveltekit from "./sveltekit/sveltekit.js";

export default class Compiler {
  #imports = {
    sveltekit,
  };

  constructor() {
    this.modules = [...core.map((Module) => new Module())];

    this.func = this.modules.find((m) => m.name === "core_function");

    this.types = this.modules.flatMap((module) => {
      return module.types.map((type) => ({
        ...type,
        module,
      }));
    });
  }

  compile(input) {
    const out = ["let stack = [];", "let functions = new Map();"];

    const lines = input.split("\n");

    while (lines[0].startsWith(">")) {
      const line = lines.shift();
      const tokens = line.split(" ");
      const name = tokens[1];
      if (this.#imports[name]) {
        const modules = this.#imports[name].map((Module) => new Module());
        this.types = [
          ...this.types,
          ...modules.flatMap((module) =>
            module.types.map((type) => ({ ...type, module }))
          ),
        ];
      }
    }

    for (const [lineIndex, line] of lines.entries()) {
      // Skip comments
      if (line.startsWith("--")) continue;

      // Split line into tokens
      const tokens = line
        .split(/("[^"]*"|\S+)/)
        .filter(Boolean)
        .filter((t) => !/^\s+$/.test(t));

      // Process each token
      for (const [tokenIndex, token] of tokens.entries()) {
        // Handle numbers
        if (/^-?\d+(\.\d+)?$/.test(token)) {
          out.push(`stack.push(${parseFloat(token)});`);
          continue;
        }

        // Handle strings
        if (/^"[^"]*"$/.test(token)) {
          out.push(`stack.push(${token});`);
          continue;
        }

        // Handle operations
        let matched = false;
        for (const type of this.types) {
          if (type.regex.test(token)) {
            matched = true;

            // Collect any needed args
            const args = [];
            if (type.args) {
              args.push(
                ...type.args.map((arg) => {
                  switch (arg) {
                    case "previousToken":
                      return tokens[tokenIndex - 1];
                    case "nextToken":
                      return tokens[tokenIndex + 1];
                    default:
                      throw new Error(`Unknown argument type: ${arg}`);
                  }
                })
              );
            }

            const operation = type.module.getOperation(type.name);
            if (operation) {
              out.push(operation(...args));
            }
            break;
          }
        }

        if (!matched && this.func?.defined.has(token)) {
          out.push(`stack.push(functions.get("${token}")());`);
          matched = true;
        }

        if (!matched) {
          throw new Error(`Unknown token "${token}" at line ${lineIndex + 1}`);
        }
      }
    }

    return out.join("\n");
  }
}
