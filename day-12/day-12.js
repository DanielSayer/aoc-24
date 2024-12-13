const fs = require("fs");

const input = fs.readFileSync("./day-12/input.txt", "utf8");
const farmMap = input.split("\n").map((line) => line.trim().split(""));
const ogMap = input.split("\n").map((line) => line.trim().split(""));
const rows = farmMap.length;
const cols = farmMap[0].length;

const regions = [];

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const char = farmMap[i][j];
    if (char === ".") {
      continue;
    }

    regions.push(createRegion(i, j, char));
  }
}

function isInBounds(row, col) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function createRegion(startRow, startCol, char) {
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const queue = [[startRow, startCol]];
  const region = [[startRow, startCol]];
  farmMap[startRow][startCol] = ".";
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;
      if (isInBounds(newRow, newCol) && farmMap[newRow][newCol] === char) {
        queue.push([newRow, newCol]);
        region.push([newRow, newCol]);
        farmMap[newRow][newCol] = ".";
      }
    }
  }
  return { key: char, region };
}

function calculateBoxPerimeter(boxes) {
  const boxSet = new Set(boxes.map(([x, y]) => `${x},${y}`));
  let perimeter = 0;

  for (const [x, y] of boxes) {
    perimeter += 4;

    const neighbors = [
      [x - 1, y],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y],
    ];

    for (const [nx, ny] of neighbors) {
      if (boxSet.has(`${nx},${ny}`)) {
        perimeter -= 1;
      }
    }
  }

  return perimeter;
}

function countSides(boxes, char) {
  const boxSet = new Set(boxes.map(([x, y]) => `${x},${y}`));
  let sides = 0;
  for (const [x, y] of boxes) {
    const potentialNeighbours = [
      { dir: "l", val: [x - 1, y] },
      { dir: "r", val: [x + 1, y] },
      { dir: "u", val: [x, y - 1] },
      { dir: "d", val: [x, y + 1] },
    ];

    const neighbours = [];

    for (i = 0; i < potentialNeighbours.length; i++) {
      const [nx, ny] = potentialNeighbours[i].val;
      if (boxSet.has(`${nx},${ny}`)) {
        neighbours.push(potentialNeighbours[i]);
      }
    }

    const neighborCount = neighbours.length;
    const neighborDirections = neighbours.map((n) => n.dir);
    if (neighborCount === 0) {
      sides += 4;
    }
    if (neighborCount === 1) {
      sides += 2;
    }

    if (neighborCount === 2) {
      if (isLine(neighborDirections)) {
        sides += 0;
        continue;
      }
      const diags = getDiags(neighborDirections, [x, y]);

      diags.forEach((diag) => {
        if (checkDiag(diag, char)) {
          sides += 1;
        } else {
          sides += 2;
        }
      });
    }

    if (neighborCount === 3) {
      const diags = getDiags(neighborDirections, [x, y]);

      diags.forEach((diag) => {
        if (!checkDiag(diag, char)) {
          sides += 1;
        }
      });
    }

    if (neighborCount === 4) {
      const diags = getDiags(neighborDirections, [x, y]);

      diags.forEach((diag) => {
        if (!checkDiag(diag, char)) {
          sides += 1;
        }
      });
    }
  }

  return sides;
}

function checkDiag(pt, char) {
  return isInBounds(pt[0], pt[1]) && ogMap[pt[0]][pt[1]] === char;
}

function isLine(dirs) {
  if (dirs[0] === "l") return dirs[1] === "r";
  if (dirs[0] === "r") return dirs[1] === "l";
  if (dirs[0] === "u") return dirs[1] === "d";
  if (dirs[0] === "d") return dirs[1] === "u";
}

function getDiags(dirs, pt) {
  const diags = [];
  if (dirs.includes("r") && dirs.includes("d")) {
    diags.push([pt[0] + 1, pt[1] + 1]);
  }
  if (dirs.includes("l") && dirs.includes("d")) {
    diags.push([pt[0] - 1, pt[1] + 1]);
  }
  if (dirs.includes("l") && dirs.includes("u")) {
    diags.push([pt[0] - 1, pt[1] - 1]);
  }
  if (dirs.includes("r") && dirs.includes("u")) {
    diags.push([pt[0] + 1, pt[1] - 1]);
  }

  return diags;
}

function partOne() {
  const regionProperties = regions.map((region) => ({
    area: region.region.length,
    perimeter: calculateBoxPerimeter(region.region),
  }));
  return regionProperties.reduce((a, b) => a + b.perimeter * b.area, 0);
}

function partTwo() {
  const regionProperties = regions.map((region) => ({
    area: region.region.length,
    perimeter: countSides(region.region, region.key),
  }));
  return regionProperties.reduce((a, b) => a + b.perimeter * b.area, 0);
}

console.log(partOne());
console.log(partTwo());
