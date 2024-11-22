import Module from "./../module.js";

export default class Stack extends Module {
  constructor() {
    super("stack");
    this.types = [
      { regex: /^DUPLICATE$/, name: "DUPLICATE" }, // Duplicate top item
      { regex: /^DROP$/, name: "DROP" }, // Remove top item
      { regex: /^SWAP$/, name: "SWAP" }, // Swap top two items
      { regex: /^OVER$/, name: "OVER" }, // Copy second item to top
      { regex: /^PICK$/, name: "PICK" }, // Copy nth item to top
      { regex: /^ROLL$/, name: "ROLL" }, // Move nth item to top
      { regex: /^DEPTH$/, name: "DEPTH" }, // Push stack depth
      { regex: /^CLEAR$/, name: "CLEAR" }, // Clear entire stack
    ];
  }

  DUPLICATE() {
    return `stack.push(stack[stack.length - 1]);`;
  }

  DROP() {
    return `stack.pop();`;
  }

  SWAP() {
    const b = this.variable("b");
    const a = this.variable("a");
    return `const ${b} = stack.pop(); const ${a} = stack.pop(); stack.push(${b}); stack.push(${a});`;
  }

  OVER() {
    return `stack.push(stack[stack.length - 2]);`;
  }

  PICK() {
    const n = this.variable("n");
    return `const ${n} = stack.pop(); stack.push(stack[stack.length - ${n} - 1]);`;
  }

  ROLL() {
    const n = this.variable("n");
    return `
      const ${n} = stack.pop();
      const item = stack[stack.length - ${n} - 1];
      stack.splice(stack.length - ${n} - 1, 1);
      stack.push(item);
    `;
  }

  DEPTH() {
    return `stack.push(stack.length);`;
  }

  CLEAR() {
    return `stack.length = 0;`;
  }
}
