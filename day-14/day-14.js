const fs = require("fs");

const WIDTH = 101;
const HEIGHT = 103;

function calculatePosition(x, y, dx, dy, n) {
  const newX = x + dx * n;
  const newY = y + dy * n;

  const scaledX = newX % WIDTH;
  const scaledY = newY % HEIGHT;

  return {
    x: scaledX < 0 ? WIDTH - Math.abs(scaledX) : scaledX,
    y: scaledY < 0 ? HEIGHT - Math.abs(scaledY) : scaledY,
  };
}

function sortByQuadrant(pos) {
  const { x, y } = pos;
  const halfWidth = (WIDTH - 1) / 2;
  const halfHeight = (HEIGHT - 1) / 2;

  if (x < halfWidth && y < halfHeight) {
    return "top-left";
  }
  if (x < halfWidth && y > halfHeight) {
    return "bottom-left";
  }
  if (x > halfWidth && y < halfHeight) {
    return "top-right";
  }
  if (x > halfWidth && y > halfHeight) {
    return "bottom-right";
  }
}

const input = fs.readFileSync("./day-14/input.txt", "utf8");
const instructions = input.split("\n").map((line) => line.trim().split(" "));

const coords = instructions.map(([position, velocity]) => {
  const [px, py] = position.substring(2).split(",").map(Number);
  const [vx, vy] = velocity.substring(2).split(",").map(Number);

  return { px, py, vx, vy };
});

function partOne() {
  const locations = new Map();

  for (const { px, py, vx, vy } of coords) {
    const pos = calculatePosition(px, py, vx, vy, 100);
    const quadrant = sortByQuadrant(pos);
    if (!quadrant) continue;

    if (locations.has(quadrant)) {
      locations.set(quadrant, locations.get(quadrant) + 1);
    } else {
      locations.set(quadrant, 1);
    }
  }

  const values = Array.from(locations.values());
  return values.reduce((a, b) => a * b, 1);
}

function partTwo() {
  function showPicture(positions) {
    const map = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(" "));

    for (const { x, y } of positions) {
      map[y][x] = "X";
    }

    return map.map((row) => row.join("")).join("\n");
  }

  let i = 0;
  while (true) {
    const positions = coords.map(({ px, py, vx, vy }) =>
      calculatePosition(px, py, vx, vy, i)
    );

    const robotsWithNeighbours = positions.filter(({ x, y }) => {
      return positions.some((other) => {
        if (other.x === x && other.y === y) return false;

        const { x: ox, y: oy } = other;
        const dx = Math.abs(x - ox);
        const dy = Math.abs(y - oy);

        return dx <= 1 && dy <= 1;
      });
    }).length;

    // Check for patterns
    if (robotsWithNeighbours > positions.length * 0.69) {
      console.log(showPicture(positions));
      return i;
    }

    i++;
  }
}

console.log(partOne());
console.log(partTwo());
