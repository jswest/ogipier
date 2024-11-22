import Module from "./../module.js";

export default class Api extends Module {
  constructor() {
    super("sveltekit_api");
    this.types = [
      { regex: /^GET_ROUTE$/, name: "GET_ROUTE", },
      { regex: /^RETURN_JSON$/, name: "RETURN_JSON", },
    ];
  }

  GET_ROUTE() {
    const key = this.variable("key");
    const obj = this.variable("obj");
    const val = this.variable("val");
    return `
      let ${key};
      let ${val};
      const ${obj} = {};
      export async function GET({ url }) {
        for ([${key}, ${val}] of url.searchParams) {
          if (typeof ${val} === "string" && !isNaN(${val}) && !isNaN(parseFloat(${val}))) {
            ${val} = parseFloat(${val});
          }
          ${obj}[${key}] = ${val};
        }
        stack.push(${obj})`;
  }

  RETURN_JSON() {
    const data = this.variable("data");
    return `
        const ${data} = stack.pop();
        return ${data};
      }
    `;
  }
}
