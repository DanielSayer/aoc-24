const fs = require("fs");

const rows = 71;
const cols = 71;

const DIRECTIONS = [
  { dx: 0, dy: 1, dir: "E" },
  { dx: 1, dy: 0, dir: "S" },
  { dx: 0, dy: -1, dir: "W" },
  { dx: -1, dy: 0, dir: "N" },
];

const map = Array.from({ length: rows }, () => Array(cols).fill("."));

const directions = fs.readFileSync("./day-18/input.txt", "utf8").split("\n");
const coords = directions.map((line) => line.trim().split(",").map(Number));

const isValid = (x, y, map) => {
  return x >= 0 && x < rows && y >= 0 && y < cols && map[x][y] !== "#";
};

function shortestPath(map) {
  const start = { x: 0, y: 0 };
  const end = { x: rows - 1, y: cols - 1 };
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
        const newScore = score + 1;
        pq.push([newScore, nx, ny, d.dir]);
      }
    });
  }
  return -1;
}

function makeBytesFall(bytes, noOfBytes) {
  for (let i = 0; i < noOfBytes; i++) {
    const [x, y] = bytes[i];
    map[y][x] = "#";
  }
}

function addByte(byte) {
  const [x, y] = byte;
  map[y][x] = "#";
}

function partOne() {
  makeBytesFall(coords, 1024);
  return shortestPath(map);
}

function partTwo() {
  const bytesPrefallen = 2000;
  makeBytesFall(coords, bytesPrefallen);
  for (let i = bytesPrefallen; i < coords.length; i++) {
    addByte(coords[i]);
    const shortestPathLength = shortestPath(map);

    if (shortestPathLength === -1) {
      return coords[i];
    }
  }
}

console.log(partOne());
console.log(partTwo());
