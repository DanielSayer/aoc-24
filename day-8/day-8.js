const fs = require("fs");

const input = fs.readFileSync("./day-8/input.txt", "utf8");
const lines = input.split("\n").map((x) => x.trim());

const locations = {};

for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines[i].length; j++) {
    const point = lines[i][j];
    if (point !== ".") {
      locations[point] = [...(locations[point] || []), [i, j]];
    }
  }
}

function solve(antiNodeFn) {
  const boundAntinodes = new Set();
  Object.keys(locations).forEach((point) => {
    const value = locations[point];

    const pairs = getPairs(value);
    const antiNodes = pairs
      .flatMap((pair) => [...antiNodeFn(pair[0], pair[1])])
      .filter(Boolean);

    antiNodes.forEach((node) => {
      boundAntinodes.add(`${node[0]},${node[1]}`);
    });
  });

  return boundAntinodes.size;
}

function getPairs(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      pairs.push([list[i], list[j]]);
    }
  }

  return pairs;
}

function generateAntiNodes(a, b) {
  const [row1, col1] = a;
  const [row2, col2] = b;

  const rowDiff = row2 - row1;
  const colDiff = col2 - col1;

  const upperAntiNode = [row1 - rowDiff, col1 - colDiff];
  const lowerAntiNode = [row2 + rowDiff, col2 + colDiff];

  return [
    isInBounds(upperAntiNode) && upperAntiNode,
    isInBounds(lowerAntiNode) && lowerAntiNode,
  ];
}

function generateRepeatingAntiNodes(a, b) {
  const [row1, col1] = a;
  const [row2, col2] = b;

  const rowDiff = row2 - row1;
  const colDiff = col2 - col1;

  let upperAntiNode = [row1 - rowDiff, col1 - colDiff];
  let lowerAntiNode = [row2 + rowDiff, col2 + colDiff];

  const antiNodes = [a, b];
  while (isInBounds(upperAntiNode)) {
    antiNodes.push(upperAntiNode);
    upperAntiNode = [upperAntiNode[0] - rowDiff, upperAntiNode[1] - colDiff];
  }

  while (isInBounds(lowerAntiNode)) {
    antiNodes.push(lowerAntiNode);
    lowerAntiNode = [lowerAntiNode[0] + rowDiff, lowerAntiNode[1] + colDiff];
  }

  return antiNodes;
}

function isInBounds(point) {
  return (
    point[0] >= 0 &&
    point[0] < lines.length &&
    point[1] >= 0 &&
    point[1] < lines[0].length
  );
}

function partOne() {
  return solve(generateAntiNodes);
}

function partTwo() {
  return solve(generateRepeatingAntiNodes);
}

console.log(partOne());
console.log(partTwo());
