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
  { regex: /^OUTPUT$/, name: "OUTPUT" },
  { regex: /^DUPLICATE$/, name: "DUPLICATE" },
  { regex: /^OVER$/, name: "OVER" },
  { regex: /^LOOP$/, name: "LOOP" },
  { regex: /^BEGIN$/, name: "BEGIN" },
  { regex: /^STOP$/, name: "STOP" },
  { regex: /^END$/, name: "END" },
  { regex: /^IF$/, name: "IF" },
  { regex: /^ELSE$/, name: "ELSE" },
  { regex: /^==$/, name: "==" },
  { regex: /^>$/, name: ">" },
  { regex: /^<$/, name: "<" },
  { regex: /^>=$/, name: ">=" },
  { regex: /^<=$/, name: "<=" },
];

const ignored = [/^\s+$/];

export function lex(input) {
  const result = [];

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
        let matched = false;
        for (const type of types) {
          const match = type.regex.test(token);
          if (match) {
            matched = true;
            result.push({
              type: type.name,
              value: token,
            });
            break;
          }
        }
        if (!matched) {
          throw new Error(
            `Unknown token "${token}" at line index ${lineIndex} and token index ${tokenIndex}!`,
          );
        }
      }
    }
  }

  return result;
}

export function compile(input) {
  const out = [`let stack = [];`];

  for (const token of input) {
    switch (token.type) {
      // Types.
      case "NUMBER":
        out.push(`stack.push(${parseFloat(token.value)});`);
        break;
      case "STRING":
        out.push(`stack.push("${token.value.replace(/^"|"$/g, "")}");`);
        break;
      // Math, etc.
      case "ADD":
        out.push("stack.push(stack.pop() + stack.pop());");
        break;
      case "SUBTRACT":
        out.push("stack.push(stack.pop() - stack.pop());");
        break;
      case "MULIPLY":
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
      // Printing.
      case "PRINT":
        out.push("console.log(stack[stack.length - 1]);");
        break;
      case "OUTPUT":
        out.push("console.log(stack.pop());");
        break;
      // Control.
      case "LOOP":
        out.push(
          "for (const [i] of Array.from({length: stack.pop()}).entries()) {",
        );
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
    }
  }

  return out.join("\n");
}
