const fs = require("fs");

const rawInput = fs.readFileSync("./day-16/input.txt", "utf-8");
const map = rawInput.split("\n");

const DIRECTIONS = [
  { dx: 0, dy: 1, dir: "E" },
  { dx: 1, dy: 0, dir: "S" },
  { dx: 0, dy: -1, dir: "W" },
  { dx: -1, dy: 0, dir: "N" },
];

function parseMap(map) {
  let start, end;
  map.forEach((row, x) => {
    row.split("").forEach((tile, y) => {
      if (tile === "S") start = { x, y };
      if (tile === "E") end = { x, y };
    });
  });
  return { start, end };
}

function isValid(x, y, map) {
  return (
    x >= 0 && x < map.length && y >= 0 && y < map[0].length && map[x][y] !== "#"
  );
}

function partOne(map) {
  const { start, end } = parseMap(map);
  const pq = [];
  pq.push([0, start.x, start.y, "E"]);
  const visited = new Map();
  const getKey = (x, y, dir) => `${x},${y},${dir}`;
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [score, x, y, dir] = pq.shift();
    if (x === end.x && y === end.y) return score;
    const key = getKey(x, y, dir);
    if (visited.has(key)) continue;
    visited.set(key, score);
    DIRECTIONS.forEach((d) => {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (isValid(nx, ny, map)) {
        const turnCost = d.dir === dir ? 0 : 1000;
        const newScore = score + turnCost + 1;
        pq.push([newScore, nx, ny, d.dir]);
      }
    });
  }
  return -1;
}

function partTwo(map) {
  const bestScore = partOne(map);
  const { start, end } = parseMap(map);
  const pq = [];
  pq.push([0, start.x, start.y, "E", [`${start.x},${start.y}`]]);
  const visited = new Map();
  const getKey = (x, y, dir) => `${x},${y},${dir}`;
  const seats = new Set();
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [score, x, y, dir, path] = pq.shift();
    if (x === end.x && y === end.y) {
      if (score === bestScore) {
        for (let i = 0; i < path.length; i++) {
          seats.add(path[i]);
        }
      }
    }
    const key = getKey(x, y, dir);
    visited.set(key, score);
    DIRECTIONS.forEach((d) => {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (isValid(nx, ny, map)) {
        const turnCost = d.dir === dir ? 0 : 1000;
        const newScore = score + turnCost + 1;
        const newKey = getKey(nx, ny, d.dir);
        if (!visited.has(newKey)) {
          pq.push([newScore, nx, ny, d.dir, [...path, `${nx},${ny}`]]);
        }
      }
    });
  }
  return seats.size;
}

console.log(partOne(map));
console.log(partTwo(map));
