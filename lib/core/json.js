import Module from "./../module.js";

export default class Json extends Module {
  constructor() {
    super("core_json");
    this.types = [
      { regex: /^ARRAY$/, name: "ARRAY" },
      { regex: /^OBJECT$/, name: "OBJECT" },
      { regex: /^GET$/, name: "GET" },
    ];
  }

  ARRAY() {
    const end = this.variable("end");
    const start = this.variable("start");
    return `
      const ${end} = stack.length - 2 - stack.pop();
      const ${start} = stack.length - 1 - stack.pop();
      if (${start} < ${end}) {
        throw new Error('Start index must be less than end index.');
      }
      stack.push(stack.splice(${end}, ${start} - ${end}))`;
  }

  OBJECT() {
    const arr = this.variable("arr");
    const obj = this.variable("obj");
    const key = this.variable("key");
    const value = this.variable("value");
    return `
      const ${arr} = stack.pop();
      if (!Array.isArray(${arr}) || ${arr}.length % 2 !== 0) {
        throw new Error('Input array must be an array with an even number of elements.');
      }
      const ${obj} = {};
      let ${key};
      let ${value};
      while (${arr}.length > 0) {
        ${value} = ${arr}.pop();
        ${key} = ${arr}.pop();
        ${obj}[${key}] = ${value};
      }
      stack.push(${obj})`;
  }

  GET() {
    const obj = this.variable("obj");
    const key = this.variable("key");
    return `
      const ${key} = stack.pop();
      const ${obj} = stack.pop();
      stack.push(${obj}[${key}]);`;
  }
}
