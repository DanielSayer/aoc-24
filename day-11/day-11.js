const fs = require("fs");

const input = fs.readFileSync("./day-11/input.txt", "utf8");
const stones = input.split(" ").map(Number);

function processStones(stones, iterations) {
  let stoneCounts = new Map();

  for (const stone of stones) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  for (let i = 0; i < iterations; i++) {
    const nextCounts = new Map();

    for (const [stone, count] of stoneCounts.entries()) {
      if (stone === 0) {
        nextCounts.set(1, (nextCounts.get(1) || 0) + count);
      } else if (stone.toString().length % 2 === 0) {
        const numStr = stone.toString();
        const mid = Math.floor(numStr.length / 2);
        const left = Number(numStr.slice(0, mid));
        const right = Number(numStr.slice(mid));
        nextCounts.set(left, (nextCounts.get(left) || 0) + count);
        nextCounts.set(right, (nextCounts.get(right) || 0) + count);
      } else {
        const newStone = stone * 2024;
        nextCounts.set(newStone, (nextCounts.get(newStone) || 0) + count);
      }
    }

    stoneCounts = nextCounts;
  }

  return stoneCounts;
}

function solve(stones, iterations) {
  const result = processStones(stones, iterations);
  const count = Array.from(result.values()).reduce((a, b) => a + b, 0);

  return count;
}

// console.log(solve(stones, 25));
console.log(solve(stones, 75));
