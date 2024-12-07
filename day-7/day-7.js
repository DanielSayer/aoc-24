const fs = require("fs");

function parse(input) {
  const [sum, rest] = input.split(":");
  return {
    sum: parseInt(sum),
    parts: rest
      .trim()
      .split(" ")
      .map((x) => parseInt(x.trim())),
  };
}
const input = fs.readFileSync("./day-7/input.txt", "utf8");
const lines = input.split("\n");
const parsed = lines.map(parse);

// For part 1, we remove the || operator
function isEquationTrue(target, numbers) {
  const ops = ["+", "*", "||"];

  function evaluateExpression(index, currentValue) {
    if (index === numbers.length) {
      return currentValue === target;
    }

    for (let op of ops) {
      if (op === "+") {
        if (evaluateExpression(index + 1, currentValue + numbers[index])) {
          return true;
        }
      } else if (op === "*") {
        if (evaluateExpression(index + 1, currentValue * numbers[index])) {
          return true;
        }
      } else if (op === "||") {
        if (
          evaluateExpression(
            index + 1,
            Number(`${currentValue}${numbers[index]}`)
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  return evaluateExpression(1, numbers[0]);
}

function solve() {
  let count = 0;

  for (let line of parsed) {
    if (isEquationTrue(line.sum, line.parts)) {
      count += line.sum;
    }
  }

  return count;
}

console.log(solve());
