const fs = require("fs");

const fileRegex = new RegExp(
  /Button A: X\+(\d+), Y\+(\d+)\s*Button B: X\+(\d+), Y\+(\d+)\s*Prize: X=(\d+), Y=(\d+)/
);

const input = fs.readFileSync("./day-13/input.txt", "utf8");
const puzzle = input.split("\n\r\n");

const info = puzzle.map((puzzle) => {
  const match = puzzle.match(fileRegex);
  const [, ax, ay, bx, by, targX, targY] = match.map(Number);

  return { ax, ay, bx, by, targX, targY };
});

function solve(targX, targY, ax, ay, bx, by) {
  const a = (by * targX - bx * targY) / (by * ax - bx * ay);
  const b = (ax * targY - ay * targX) / (by * ax - bx * ay);
  return { a, b };
}

function partOne() {
  let sum = 0;

  for (const { ax, ay, bx, by, targX, targY } of info) {
    const { a, b } = solve(targX, targY, ax, ay, bx, by);

    if (Number.isInteger(a) && Number.isInteger(b)) {
      sum += 3 * a + b;
    }
  }

  return sum;
}

function partTwo() {
  let sum = 0;

  for (const { ax, ay, bx, by, targX, targY } of info) {
    const { a, b } = solve(
      targX + 10000000000000,
      targY + 10000000000000,
      ax,
      ay,
      bx,
      by
    );
    if (Number.isInteger(a) && Number.isInteger(b)) {
      sum += 3 * a + b;
    }
  }
  return sum;
}

console.log(partOne());
console.log(partTwo());
