import Module from "./../module.js";

export default class Control extends Module {
  constructor() {
    super("core_control");
    this.types = [
      // Conditionals
      { regex: /^IF$/, name: "IF" },
      { regex: /^ELSE$/, name: "ELSE" },
      { regex: /^THEN$/, name: "THEN" },

      // Comparison
      { regex: /^==$/, name: "EQUALS" },
      { regex: /^!=$/, name: "NOT_EQUALS" },
      { regex: /^>$/, name: "GREATER" },
      { regex: /^<$/, name: "LESS" },
      { regex: /^>=$/, name: "GREATER_EQUAL" },
      { regex: /^<=$/, name: "LESS_EQUAL" },

      // Loops
      { regex: /^BEGIN$/, name: "BEGIN" },
      { regex: /^END$/, name: "END" },
      { regex: /^TIMES$/, name: "TIMES" },
      { regex: /^INDEX$/, name: "INDEX" },
      { regex: /^REPEAT$/, name: "REPEAT" },
      { regex: /^BREAK$/, name: "BREAK" },
      { regex: /^CONTINUE$/, name: "CONTINUE" },

      // Boolean operations
      { regex: /^AND$/, name: "AND" },
      { regex: /^OR$/, name: "OR" },
      { regex: /^NOT$/, name: "NOT" },

      // Early return
      { regex: /^EXIT$/, name: "EXIT" },
    ];

    this.loopDepth = 0;
    this.indices = [];
  }

  IF() {
    return `if (stack.pop()) {`;
  }

  ELSE() {
    return `} else {`;
  }

  THEN() {
    return `}`;
  }

  EQUALS() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} === ${b});`;
  }

  NOT_EQUALS() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} !== ${b});`;
  }

  GREATER() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} > ${b});`;
  }

  LESS() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} < ${b});`;
  }

  GREATER_EQUAL() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} >= ${b});`;
  }

  LESS_EQUAL() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} <= ${b});`;
  }

  BEGIN() {
    this.loopDepth++;
    return `while (true) {`;
  }

  END() {
    this.loopDepth--;
    return `}`;
  }

  TIMES() {
    const count = this.variable("count");
    const i = this.variable("i");
    this.indices.push(i);
    this.loopDepth++;
    return `const ${count} = stack.pop(); for (let ${i} = 0; ${i} < ${count}; ${i}++) {`;
  }

  INDEX() {
    if (this.indices.length === 0) {
      throw new Error("INDEX can only be used inside a TIMES loop");
    }

    const depth = this.variable("depth");
    const target = this.variable("target");
    const indices = `[${this.indices.join(", ")}]`;

    return `
      const ${depth} = stack.pop();
      const ${target} = ${this.indices.length - 1} - ${depth};
      if (${target} < 0 || ${target} >= ${this.indices.length}) {
        throw new Error("Index depth " + ${depth} + " is out of range");
      }
      stack.push(${indices}[${target}]);
    `;
  }

  REPEAT() {
    if (this.indices.length === 0) {
      throw new Error("REPEAT without matching TIMES");
    }
    this.indices.pop();
    this.loopDepth--;
    return `}`;
  }

  BREAK() {
    if (this.loopDepth === 0) {
      throw new Error("BREAK outside of loop");
    }
    return `break;`;
  }

  CONTINUE() {
    if (this.loopDepth === 0) {
      throw new Error("CONTINUE outside of loop");
    }
    return `continue;`;
  }

  AND() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} && ${b});`;
  }

  OR() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} || ${b});`;
  }

  NOT() {
    const a = this.variable("a");
    return `const ${a} = stack.pop(); stack.push(!${a});`;
  }

  EXIT() {
    return `return stack.pop();`;
  }
}
