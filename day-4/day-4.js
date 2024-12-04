const fs = require("fs");

function getLines() {
  const input = fs.readFileSync("./day-4/input.txt", "utf8");
  return input.trim().split("\n");
}

function partOne() {
  const grid = getLines();
  const rows = grid.length;
  const cols = grid[0].length;
  const word = "XMAS";
  const wordLength = word.length;
  let count = 0;

  const isWordAt = (row, col, dirRow, dirCol) => {
    for (let i = 0; i < wordLength; i++) {
      const r = row + dirRow * i;
      const c = col + dirCol * i;
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const directions = [
    [0, 1], // Horizontal right
    [1, 0], // Vertical down
    [1, 1], // Diagonal down-right
    [1, -1], // Diagonal down-left
    [0, -1], // Horizontal left
    [-1, 0], // Vertical up
    [-1, -1], // Diagonal up-left
    [-1, 1], // Diagonal up-right
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (const [dirRow, dirCol] of directions) {
        if (isWordAt(row, col, dirRow, dirCol)) {
          count++;
        }
      }
    }
  }

  return count;
}

function isMas(str) {
  return str === "MAS" || str === "SAM";
}

function partTwo() {
  const grid = getLines();
  const rows = grid.length;
  const cols = grid[0].length;
  let xMasCount = 0;

  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      if (grid[row][col] === "A") {
        const topLeft = grid[row - 1][col - 1];
        const topRight = grid[row - 1][col + 1];
        const bottomLeft = grid[row + 1][col - 1];
        const bottomRight = grid[row + 1][col + 1];

        const diag = `${topLeft}A${bottomRight}`;
        const antiDiag = `${topRight}A${bottomLeft}`;

        if (isMas(diag) && isMas(antiDiag)) {
          xMasCount++;
        }
      }
    }
  }

  return xMasCount;
}

console.log(partOne());
console.log(partTwo());
