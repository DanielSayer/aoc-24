const fs = require("fs");

function readInput() {
  const lines = fs.readFileSync("./day-6/input.txt", "utf8").split("\n");
  return lines.map((line) => line.trim().split(""));
}
const map = readInput();

const dirs = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function getGuardLocation() {
  const guardRow = map.findIndex((line) => line.includes("^"));
  const guardCol = map[guardRow].indexOf("^");
  return [guardRow, guardCol];
}

function partOne() {
  let dir = dirs[0];
  let [guardRow, guardCol] = getGuardLocation();
  const locations = new Set([guardRow + "," + guardCol]);
  while (true) {
    const nextPos = [guardRow + dir[0], guardCol + dir[1]];

    if (
      nextPos[0] > map[0].length - 1 ||
      nextPos[1] > map.length - 1 ||
      nextPos[0] < 0 ||
      nextPos[1] < 0
    ) {
      break;
    }

    if (map[nextPos[0]][nextPos[1]] === "#") {
      dir = dirs[(dirs.indexOf(dir) + 1) % dirs.length];
    }

    if (
      map[nextPos[0]][nextPos[1]] === "." ||
      map[nextPos[0]][nextPos[1]] === "^"
    ) {
      guardRow = nextPos[0];
      guardCol = nextPos[1];
      locations.add(nextPos.join(","));
    }
  }
  return locations.size;
}
function partTwo() {
  const originalGuardLocation = getGuardLocation();
  const possibleObstructions = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (
        map[row][col] !== "." ||
        (row === originalGuardLocation[0] && col === originalGuardLocation[1])
      ) {
        continue;
      }

      map[row][col] = "#";
      if (causesLoop()) {
        possibleObstructions.push([row, col]);
      }
      map[row][col] = ".";
    }
  }

  return possibleObstructions.length;
}

function causesLoop() {
  const visitedStates = new Set();
  let dir = dirs[0];
  let [guardRow, guardCol] = getGuardLocation();

  while (true) {
    const state = `${guardRow},${guardCol},${dir[0]},${dir[1]}`;
    if (visitedStates.has(state)) {
      return true;
    }
    visitedStates.add(state);

    const nextPos = [guardRow + dir[0], guardCol + dir[1]];

    if (
      nextPos[0] > map.length - 1 ||
      nextPos[1] > map[0].length - 1 ||
      nextPos[0] < 0 ||
      nextPos[1] < 0
    ) {
      break;
    }

    if (map[nextPos[0]][nextPos[1]] === "#") {
      dir = dirs[(dirs.indexOf(dir) + 1) % dirs.length];
    } else if (
      map[nextPos[0]][nextPos[1]] === "." ||
      map[nextPos[0]][nextPos[1]] === "^"
    ) {
      guardRow = nextPos[0];
      guardCol = nextPos[1];
    }
  }

  return false; // No loop detected
}

console.log(partTwo());
