const fs = require("fs");
const { queryObjects } = require("v8");

const rows = 71;
const cols = 71;

const DIRECTIONS = [
  { dx: 0, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: -1, dy: 0 },
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
  const queue = [{ ...start, distance: 0 }];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { x, y, distance } = queue.shift();

    if (x === end.x && y === end.y) {
      return distance;
    }

    DIRECTIONS.forEach((d) => {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (isValid(nx, ny, map) && !visited.has(`${nx},${ny}`)) {
        queue.push({ x: nx, y: ny, distance: distance + 1 });
        visited.add(`${nx},${ny}`);
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
  for (let i = 0; i < coords.length; i++) {
    addByte(coords[i]);
    const shortestPathLength = shortestPath(map);

    if (shortestPathLength === -1) {
      return coords[i];
    }
  }
}

console.log(partOne());
console.log(partTwo());
