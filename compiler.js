const types = [
  { regex: /^-?\d+(\.\d+)?$/, name: "NUMBER" },
  { regex: /^"([^"]*)"$/, name: "STRING" },
  { regex: /^ADD$/, name: "ADD" },
  { regex: /^SUBTRACT$/, name: "SUBTRACT" },
  { regex: /^MULTIPLY$/, name: "MULTIPLY" },
  { regex: /^DIVIDE$/, name: "DIVIDE" },
  { regex: /^CONCAT$/, name: "CONCAT" },
  { regex: /^PRINT$/, name: "PRINT" },
  { regex: /^SWAP$/, name: "SWAP" },
  { regex: /^DROP$/, name: "DROP" },
  { regex: /^POP$/, name: "POP" },
  { regex: /^OUTPUT$/, name: "OUTPUT" },
  { regex: /^DUPLICATE$/, name: "DUPLICATE" },
  { regex: /^OVER$/, name: "OVER" },
  { regex: /^TIMES$/, name: "TIMES" },
  { regex: /^INDEX$/, name: "INDEX" },
  { regex: /^BEGIN$/, name: "BEGIN" },
  { regex: /^STOP$/, name: "STOP" },
  { regex: /^\.$/, name: "." },
  { regex: /^END$/, name: "END" },
  { regex: /^IF$/, name: "IF" },
  { regex: /^ELSE$/, name: "ELSE" },
  { regex: /^==$/, name: "==" },
  { regex: /^>$/, name: ">" },
  { regex: /^<$/, name: "<" },
  { regex: /^>=$/, name: ">=" },
  { regex: /^<=$/, name: "<=" },
  { regex: /^:/, name: ":" },
];

let reserved = [...types.map((d) => d.name)];

const words = [];

const ignored = [/^\s+$/];

export function compile(input) {
  const result = [];
  const out = ["let stack = [];", "let array = [];", "let index = 0;"];

  const lines = input.split("\n");
  for (const [lineIndex, line] of lines.entries()) {
    if (!line.startsWith("--")) {
      const tokens = line
        .split(/("[^"]*"|\S+)/)
        .filter((d) => d)
        .filter((d) => {
          for (const ignore of ignored) {
            if (ignore.test(d)) {
              return false;
            }
          }
          return true;
        });
      for (const [tokenIndex, token] of tokens.entries()) {
        let result;
        let matched = false;
        for (const type of types) {
          const match = type.regex.test(token);
          if (match) {
            matched = true;
            result = {
              type: type.name,
              value: token,
            };
            break;
          }
        }
        for (const word of words) {
          const match = token === word;
          if (match) {
            matched = true;
            result = {
              type: "VARIABLE",
              value: word,
            };
            break;
          }
        }
        if (!matched) {
          throw new Error(
            `Unknown token "${token}" at line index ${lineIndex} and token index ${tokenIndex}!`,
          );
        }
        switch (result.type) {
          // Variable.
          case "VARIABLE":
            out.push(`stack.push(${result.value}());`);
            break;
          // Types.
          case "NUMBER":
            out.push(`stack.push(${parseFloat(result.value)});`);
            break;
          case "STRING":
            out.push(`stack.push("${result.value.replace(/^"|"$/g, "")}");`);
            break;
          // Math, etc.
          case "ADD":
            out.push("stack.push(stack.pop() + stack.pop());");
            break;
          case "SUBTRACT":
            out.push("stack.push(stack.pop() - stack.pop());");
            break;
          case "MULTIPLY":
            out.push("stack.push(stack.pop() * stack.pop());");
            break;
          case "DIVIDE":
            out.push("stack.push(stack.pop() / stack.pop());");
            break;
          case "CONCAT":
            out.push("stack.push(`${stack.pop()}${stack.pop()}`);");
            break;
          // Stack manipulation.
          case "DUPLICATE":
            out.push("stack.push(stack[stack.length - 1]);");
            break;
          case "OVER":
            out.push("stack.push(stack[stack.length - 2]);");
            break;
          case "SWAP":
            out.push(
              "stack = [...stack.slice(0, -2), stack[stack.length - 1], stack[stack.length - 2]];",
            );
            break;
          case "DROP":
            out.push("stack = [];");
            break;
          case "POP":
            out.push("stack.pop()");
            break;
          // Printing.
          case "PRINT":
            out.push("console.log(stack[stack.length - 1]);");
            break;
          case "OUTPUT":
            out.push("console.log(stack.pop());");
            break;
          // Control.
          case "TIMES":
            out.push("array = Array.from({ length: stack.pop() })");
            out.push("for (let i = 0; i < array.length; i++) {");
            out.push("index = i;");
            break;
          case "INDEX":
            out.push("stack.push(index);");
            break;
          case "STOP":
            out.push("break;");
            break;
          case "END":
            out.push("}");
            break;
          case "==":
            out.push("stack.push(stack.pop() === stack.pop() ? 1 : 0);");
            break;
          case ">":
            out.push("stack.push(stack.pop() < stack.pop() ? 1 : 0);");
            break;
          case "<":
            out.push("stack.push(stack.pop() > stack.pop() ? 1 : 0);");
            break;
          case ">=":
            out.push("stack.push(stack.pop() <= stack.pop() ? 1 : 0);");
            break;
          case "<=":
            out.push("stack.push(stack.pop() >= stack.pop() ? 1 : 0);");
            break;
          case "IF":
            out.push("if (stack.pop()) {");
            break;
          case "BEGIN":
            out.push("while (true) {");
            break;
          case ":":
            out.push("stack.pop()");
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
            const name = tokens[tokenIndex - 1].replace(/^"|"$/g, "");
            let isValid = reserved.includes(name) ? false : true;
            for (const character of name.split("")) {
              if (!alphabet.includes(character)) {
                console.log(character);
                isValid = false;
              }
            }
            if (!isValid) {
              throw new Error(
                "Variables must contain only uppercase letters or the underscore and may not be reserved.",
              );
            }
            words.push(name);
            reserved = ["VARIABLE", ...types.map((d) => d.name)];
            out.push(`const ${name} = () => {`);
            break;
          case ".":
            out.push("return stack.pop(); }");
            break;
        }
      }
    }
  }
  return out.join("\n");
}
