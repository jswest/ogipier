export default class Module {
  #count = 0;
  #types = [];

  constructor(name) {
    this.name = name;
  }

  get types() {
    return this.#types;
  }

  set types(value) {
    this.#types = value;
  }

  getOperation(type) {
    return this[type]?.bind(this);
  }

  variable(base) {
    return `${base}_${this.name}_${this.#count++}`;
  }
}
