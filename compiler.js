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
  { regex: /^OUTPUT$/, name: "OUTPUT" },
  { regex: /^OVER/, name: "OVER" },
];

export function lex(input) {
  const result = [];

  const lines = input.split("\n");
  for (const [lineIndex, line] of lines.entries()) {
    if (!line.startsWith("--")) {
      const tokens = line.split(/("[^"]*"|\S+)/).filter((d) => d && d !== " ");
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
  const out = [`const stack = [];`];

  for (const token of input) {
    switch (token.type) {
      case "NUMBER":
        out.push(`stack.push(${parseFloat(token.value)});`);
        break;
      case "STRING":
        out.push(`stack.push("${token.value.replace(/^"|"$/g, "")}");`);
        break;
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
      case "OVER":
        out.push("stack.push(stack[stack.length - 2]);");
        break;
      case "SWAP":
        out.push("[...stack.slice(0, -2), stack[stack.length - 1], stack[stack.length - 2]];");
        break;
      // Printing.
      case "PRINT":
        out.push("console.log(stack[stack.length - 1]);");
        break;
      case "OUTPUT":
        out.push("console.log(stack.pop());");
        break;
    }
  }

  return out.join("\n");
}
