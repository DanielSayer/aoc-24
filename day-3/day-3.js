const fs = require("fs");

const mulRegex = new RegExp(/mul\((\d{1,3}),(\d{1,3})\)/g);
const doRegex = new RegExp(/\bdo\(\)/g);
const dontRegex = new RegExp(/\bdon't\(\)/g);

function getFile() {
  return fs.readFileSync("./day-3/input.txt", "utf8");
}

function partOne() {
  const input = getFile();
  const matches = Array.from(input.matchAll(mulRegex)).map((match) => [
    parseInt(match[1]),
    parseInt(match[2]),
  ]);
  let total = 0;

  for (const match of matches) {
    const [num1, num2] = match;
    total += num1 * num2;
  }

  return total;
}

function partTwo() {
  const input = getFile();

  let enabled = true;
  const matches = [];
  const parts = input.split(/(do\(\)|don't\(\))/g);

  for (const part of parts) {
    if (doRegex.test(part)) {
      enabled = true;
    } else if (dontRegex.test(part)) {
      enabled = false;
    } else if (enabled) {
      for (const match of part.matchAll(mulRegex)) {
        matches.push([parseInt(match[1]), parseInt(match[2])]);
      }
    }
  }

  let total = 0;

  for (const match of matches) {
    const [num1, num2] = match;
    total += num1 * num2;
  }

  return total;
}

console.log(partOne());
console.log(partTwo());
