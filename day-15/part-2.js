const fs = require("fs");

let startingPos = [-1, -1];
const warehouseInput = fs.readFileSync("./day-15/warehouse.txt", "utf8");
const warehouseLines = warehouseInput.split("\n").map((line) => line.trim());
const warehouse = warehouseLines.map((line, col) => {
  const values = line.split("");
  return values.flatMap((char, row) => {
    if (char === "#") {
      return ["#", "#"];
    }
    if (char === "@") {
      startingPos = [row * 2, col];
      return ["@", "."];
    }
    if (char === "O") {
      return ["[", "]"];
    }

    return [".", "."];
  });
});

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

  if (itemInNextPos === "[" || itemInNextPos === "]") {
    if (direction === "<" || direction === ">") {
      return pushHorizontal(pos, direction);
    }

    const canPush = canPushVertical(nextPos, direction);
    if (!canPush) {
      return pos;
    }
    pushVertical(nextPos, direction);
    warehouse[nextPos[1]][nextPos[0]] = "@";
    warehouse[pos[1]][pos[0]] = ".";
    return nextPos;
  }
}

function canPushVertical(pos, direction) {
  const obj = warehouse[pos[1]][pos[0]];
  const positions = [{ pos, obj }, fillBlock(pos)];
  let canPush = true;

  while (positions.length > 0 && canPush) {
    const movingPos = positions.shift();
    const nextPos = getNextPos(movingPos.pos, direction);
    const itemInNextPos = warehouse[nextPos[1]][nextPos[0]];

    if (itemInNextPos === "#") {
      canPush = false;
      break;
    }

    if (itemInNextPos === "[" || itemInNextPos === "]") {
      positions.push({ pos: nextPos, obj: itemInNextPos });
      if (itemInNextPos !== movingPos.obj) {
        positions.push(fillBlock(nextPos));
      }
    }
  }

  return canPush;
}

function fillBlock(pos) {
  const val = warehouse[pos[1]][pos[0]];
  if (val === "[") {
    return { pos: getNextPos(pos, ">"), obj: "]" };
  }
  if (val === "]") {
    return { pos: getNextPos(pos, "<"), obj: "[" };
  }
  return { pos, obj: "." };
}

function pushVertical(pos, direction) {
  const obj = warehouse[pos[1]][pos[0]];
  const positions = [{ pos, obj }, fillBlock(pos)];
  const pushedPostitions = new Set();

  while (positions.length > 0) {
    const movingPos = positions.shift();
    const nextPos = getNextPos(movingPos.pos, direction);
    const itemInNextPos = warehouse[nextPos[1]][nextPos[0]];

    if (itemInNextPos === "[" || itemInNextPos === "]") {
      positions.push({ pos: nextPos, obj: itemInNextPos });
      if (itemInNextPos !== movingPos.obj) {
        positions.push(fillBlock(nextPos));
      }
    }

    if (!pushedPostitions.has(`${movingPos.pos[0]},${movingPos.pos[1]}`)) {
      warehouse[movingPos.pos[1]][movingPos.pos[0]] = ".";
    }
    warehouse[nextPos[1]][nextPos[0]] = movingPos.obj;
    pushedPostitions.add(`${nextPos[0]},${nextPos[1]}`);
  }
}

function pushHorizontal(pos, direction) {
  const line = getLine(pos, direction);
  const canPush =
    line.filter((char) => char !== "]" && char !== "[")[0] === ".";

  if (!canPush) {
    return pos;
  }

  warehouse[pos[1]][pos[0]] = ".";
  const gap = line.indexOf(".");
  line.splice(gap, 1);
  line.unshift("@");
  updateWarehouse(pos, direction, line);
  return getNextPos(pos, direction);
}

function calcScore() {
  let score = 0;

  for (let i = 0; i < warehouse.length; i++) {
    for (let j = 0; j < warehouse[i].length; j++) {
      if (warehouse[i][j] === "[") {
        score += 100 * i + j;
      }
    }
  }

  return score;
}

function partTwo() {
  let currentPos = startingPos;
  for (let i = 0; i < moves.length; i++) {
    const direction = moves[i];
    const nextPos = move(currentPos, direction);
    currentPos = nextPos;
  }
  return calcScore();
}

console.log(partTwo());
