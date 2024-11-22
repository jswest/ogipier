import Module from "./../module.js";

export default class String extends Module {
  constructor() {
    super("core_string");
    this.types = [
      { regex: /^CONCAT$/, name: "CONCAT" },
      { regex: /^UPPERCASE$/, name: "UPPERCASE" },
      { regex: /^LOWERCASE$/, name: "LOWERCASE" },
      { regex: /^TRIM$/, name: "TRIM" },
      { regex: /^REPLACE$/, name: "REPLACE" },
      { regex: /^LENGTH$/, name: "LENGTH" },
      { regex: /^INCLUDES$/, name: "INCLUDES" },
      { regex: /^STARTS_WITH$/, name: "STARTS_WITH" },
      { regex: /^ENDS_WITH$/, name: "ENDS_WITH" },
      { regex: /^PAD_LEFT$/, name: "PAD_LEFT" },
      { regex: /^PAD_RIGHT$/, name: "PAD_RIGHT" },
      { regex: /^PRINT$/, name: "PRINT" },
    ];
  }

  CONCAT() {
    const a = this.variable("a");
    const b = this.variable("b");
    return `const ${a} = stack.pop(); const ${b} = stack.pop(); stack.push(${a}.toString() + ${b}.toString());`;
  }

  // TODO: Think this through.
  SPLIT() {
    const delimiter = this.variable("delimiter");
    const str = this.variable("str");
    return `const ${delimiter} = stack.pop(); const ${str} = stack.pop(); stack.push(...${str}.split(${delimiter}));`;
  }

  // TODO: Think this through, and add a number of indices to convert to to string.
  JOIN() {
    const delimiter = this.variable("delimiter");
    const arr = this.variable("arr");
    return `const ${delimiter} = stack.pop(); const ${arr} = stack.pop(); stack.push(${arr}.join(${delimiter}));`;
  }

  UPPERCASE() {
    const str = this.variable("str");
    return `const ${str} = stack.pop(); stack.push(${str}.toUpperCase());`;
  }

  LOWERCASE() {
    const str = this.variable("str");
    return `const ${str} = stack.pop(); stack.push(${str}.toLowerCase());`;
  }

  TRIM() {
    const str = this.variable("str");
    return `const ${str} = stack.pop(); stack.push(${str}.trim());`;
  }

  REPLACE() {
    const replacement = this.variable("replacement");
    const search = this.variable("search");
    const str = this.variable("str");
    return `const ${replacement} = stack.pop(); const ${search} = stack.pop(); const ${str} = stack.pop(); stack.push(${str}.replaceAll(${search}, ${replacement}));`;
  }

  LENGTH() {
    const str = this.variable("str");
    return `const ${str} = stack.pop(); stack.push(${str}.length);`;
  }

  INCLUDES() {
    const search = this.variable("search");
    const str = this.variable("str");
    return `const ${search} = stack.pop(); const ${str} = stack.pop(); stack.push(${str}.includes(${search}));`;
  }

  STARTS_WITH() {
    const search = this.variable("search");
    const str = this.variable("str");
    return `const ${search} = stack.pop(); const ${str} = stack.pop(); stack.push(${str}.startsWith(${search}));`;
  }

  ENDS_WITH() {
    const search = this.variable("search");
    const str = this.variable("str");
    return `const ${search} = stack.pop(); const ${str} = stack.pop(); stack.push(${str}.endsWith(${search}));`;
  }

  PAD_LEFT() {
    const char = this.variable("char");
    const length = this.variable("length");
    const str = this.variable("str");
    return `const ${char} = stack.pop(); const ${length} = stack.pop(); const ${str} = stack.pop(); stack.push(${str}.padStart(${length}, ${char}));`;
  }

  PAD_RIGHT() {
    const char = this.variable("char");
    const length = this.variable("length");
    const str = this.variable("str");
    return `const ${char} = stack.pop(); const ${length} = stack.pop(); const ${str} = stack.pop(); stack.push(${str}.padEnd(${length}, ${char}));`;
  }

  PRINT() {
    return `console.log(stack.pop());`;
  }
}
