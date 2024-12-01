const fs = require("fs");

function getLists() {
  const input = fs.readFileSync("./day-1/part-1-input.txt", "utf8");
  const lines = input.trim().split("\n");

  const a = [];
  const b = [];

  lines.forEach((line) => {
    const [first, second] = line.split("   ").map(Number);
    a.push(first);
    b.push(second);
  });

  return { a, b };
}

function partOne() {
  const { a, b } = getLists();
  const aSorted = a.sort((a, b) => a - b);
  const bSorted = b.sort((a, b) => a - b);

  const diffs = aSorted.map((el, i) => Math.abs(el - bSorted[i]));
  return diffs.reduce((a, b) => a + b, 0);
}

function partTwo() {
  const { a, b } = getLists();

  let bFrequencies = {};

  b.forEach((el) => {
    if (bFrequencies[el]) {
      bFrequencies[el]++;
    } else {
      bFrequencies[el] = 1;
    }
  });

  const similarities = a.map((el) => {
    const frequency = bFrequencies[el];
    if (!frequency) {
      return 0;
    }
    return el * frequency;
  });

  return similarities.reduce((a, b) => a + b, 0);
}

console.log(partOne());
console.log(partTwo());
