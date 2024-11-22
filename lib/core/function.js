import Module from "./../module.js";

export default class Function extends Module {
  constructor() {
    super("core_function");
    this.types = [
      { regex: /^:$/, name: "DEFINE", args: ["previousToken"] },
      { regex: /^\.$/, name: "END_DEFINE" },
    ];

    this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    this.defined = new Set();
  }

  DEFINE(previousToken) {
    const name = previousToken.replace(/^"|"$/g, "");

    if (this.defined.has(name)) {
      throw new Error(`Word "${name}" is already defined`);
    }

    for (const char of name) {
      if (!this.alphabet.includes(char)) {
        throw new Error(
          `Invalid character "${char}" in word "${name}". Words must contain only uppercase letters or underscore`
        );
      }
    }

    this.defined.add(name);
  
    const next = this.variable("next");
    return `
      const ${next} = stack.pop();
      functions.set(${next}, () => {`;
  }

  END_DEFINE() {
    return `  return stack.pop();
    });`;
  }
}
