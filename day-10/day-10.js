const fs = require("fs");

const input = fs.readFileSync("./day-10/input.txt", "utf8");
const map = input.split("\n").map((row) => row.trim().split("").map(Number));

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];
const rows = map.length;
const cols = map[0].length;
function isInBounds(row, col) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function partOne(map) {
  function bfs(startRow, startCol) {
    const queue = [[startRow, startCol]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[startRow][startCol] = true;
    let score = 0;
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const currentHeight = map[r][c];
      if (currentHeight === 9) {
        score++;
      }
      for (const [dr, dc] of directions) {
        const newRow = r + dr;
        const newCol = c + dc;
        if (
          isInBounds(newRow, newCol) &&
          !visited[newRow][newCol] &&
          map[newRow][newCol] === currentHeight + 1
        ) {
          visited[newRow][newCol] = true;
          queue.push([newRow, newCol]);
        }
      }
    }
    return score;
  }
  let totalScore = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (map[row][col] === 0) {
        totalScore += bfs(row, col);
      }
    }
  }
  return totalScore;
}

function partTwo(map) {
  function bfs(startRow, startCol) {
    const queue = [[startRow, startCol]];
    let score = 0;
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const currentHeight = map[r][c];
      if (currentHeight === 9) {
        score++;
      }
      for (const [dr, dc] of directions) {
        const newRow = r + dr;
        const newCol = c + dc;
        if (
          isInBounds(newRow, newCol) &&
          map[newRow][newCol] === currentHeight + 1
        ) {
          queue.push([newRow, newCol]);
        }
      }
    }
    return score;
  }
  let totalScore = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (map[row][col] === 0) {
        totalScore += bfs(row, col);
      }
    }
  }
  return totalScore;
}

console.log(partOne(map));
console.log(partTwo(map));
