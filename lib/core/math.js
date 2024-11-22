import Module from "./../module.js";

export default class Math extends Module {
  constructor() {
    super("math");
    this.types = [
      { regex: /^ADD$/, name: "ADD" },
      { regex: /^SUBTRACT$/, name: "SUBTRACT" },
      { regex: /^MULTIPLY$/, name: "MULTIPLY" },
      { regex: /^DIVIDE$/, name: "DIVIDE" },
      { regex: /^RANDOM$/, name: "RANDOM" },
      { regex: /^FLOOR$/, name: "FLOOR" },
      { regex: /^CEILING$/, name: "CEILING" },
    ];
  }

  ADD() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} + ${b});`;
  }

  SUBTRACT() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} - ${b});`;
  }

  MULTIPLY() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} * ${b});`;
  }

  DIVIDE() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${a} / ${b});`;
  }

  RANDOM() {
    return `stack.push(Math.random());`;
  }

  FLOOR() {
    const a = this.variable("a");
    return `const ${a} = stack.pop(); stack.push(Math.floor(${a}));`;
  }

  CEIL() {
    const a = this.variable("a");
    return `const ${a} = stack.pop(); stack.push(Math.ceil(${a}));`;
  }
}
