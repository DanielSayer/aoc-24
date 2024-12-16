const fs = require("fs");

const warehouseInput = fs.readFileSync("./day-15/warehouse.txt", "utf8");
const warehouseLines = warehouseInput.split("\n").map((line) => line.trim());
const warehouse = warehouseLines.map((line) => line.split(""));

const startingPos = [24, 24];

const moves = fs
  .readFileSync("./day-15/moves.txt", "utf8")
  .replaceAll("\n", "")
  .replaceAll("\r", "");

const directions = {
  "^": [0, -1],
  "<": [-1, 0],
  ">": [1, 0],
  v: [0, 1],
};

function getNextPos(pos, direction) {
  const [x, y] = pos;
  const [dx, dy] = directions[direction];
  return [x + dx, y + dy];
}

function getLine(pos, direction) {
  const temp = [...warehouse];
  if (direction === "v" || direction === "^") {
    const line = temp.map((row) => row[pos[0]]);

    if (direction === "v") {
      return line.slice(pos[1] + 1);
    }
    return line.slice(0, pos[1]).reverse();
  }

  if (direction === "<" || direction === ">") {
    const line = temp[pos[1]];
    if (direction === ">") {
      return line.slice(pos[0] + 1);
    }
    return line.slice(0, pos[0]).reverse();
  }

  throw new Error("Invalid direction");
}

function updateWarehouse(pos, direction, items) {
  let currentPos = pos;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const nextPos = getNextPos(currentPos, direction);
    warehouse[nextPos[1]][nextPos[0]] = item;
    currentPos = nextPos;
  }
}

function move(pos, direction) {
  const nextPos = getNextPos(pos, direction);
  const itemInNextPos = warehouse[nextPos[1]][nextPos[0]];
  if (itemInNextPos === ".") {
    warehouse[nextPos[1]][nextPos[0]] = "@";
    warehouse[pos[1]][pos[0]] = ".";
    return nextPos;
  }
  if (itemInNextPos === "#") {
    return pos;
  }

  if (itemInNextPos === "O") {
    const line = getLine(pos, direction);
    const canPush = line.filter((char) => char !== "O")[0] === ".";

    if (!canPush) {
      return pos;
    }

    warehouse[pos[1]][pos[0]] = ".";
    const gap = line.indexOf(".");
    line.splice(gap, 1);
    line.unshift("@");
    updateWarehouse(pos, direction, line);
    return nextPos;
  }
}

function calcScore() {
  let score = 0;

  for (let i = 0; i < warehouse.length; i++) {
    for (let j = 0; j < warehouse[i].length; j++) {
      if (warehouse[i][j] === "O") {
        score += 100 * i + j;
      }
    }
  }

  return score;
}

function partOne() {
  let currentPos = startingPos;
  for (let i = 0; i < moves.length; i++) {
    const direction = moves[i];
    const nextPos = move(currentPos, direction);
    currentPos = nextPos;
  }
  return calcScore();
}

console.log(partOne());
