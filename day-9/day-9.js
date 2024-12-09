const fs = require("fs");

const input = fs.readFileSync("./day-9/input.txt", "utf8").trim();

function partOne() {
  let id = 0;
  let spaceUsed = 0;
  const arr = [];
  const freeSpaceIndices = [];
  const pushNTimes = (n, value) => arr.push(...Array(n).fill(value));

  for (let i = 0; i < input.length; i++) {
    const num = Number(input[i]);

    if (i % 2 === 0) {
      pushNTimes(num, id);
      spaceUsed += num;
      id++;
    } else {
      freeSpaceIndices.push(
        ...Array.from({ length: num }, (_, i) => arr.length + i)
      );
      pushNTimes(num, ".");
    }
  }

  let compactIndex = freeSpaceIndices.shift();
  for (let i = arr.length - 1; i >= spaceUsed; i--) {
    if (arr[i] !== ".") {
      arr[compactIndex] = arr[i];
      compactIndex = freeSpaceIndices.shift();
      arr[i] = ".";
      if (compactIndex === undefined) break;
    }
  }

  return arr.reduce(
    (checksum, block, index) =>
      block === "." ? checksum : checksum + block * index,
    0
  );
}

function partTwo() {
  let id = 0;
  const arr = [];
  const spaces = [];
  const pushNTimes = (n, value) => arr.push(...Array(n).fill(value));

  for (let i = 0; i < input.length; i++) {
    const num = Number(input[i]);

    if (i % 2 === 0) {
      pushNTimes(num, id);
      id++;
    } else {
      if (num === 0) continue;
      spaces.push({ start: arr.length, size: num });
      pushNTimes(num, 0);
    }
  }

  for (let currentId = id - 1; currentId >= 0; currentId--) {
    const spacesRequired = Number(input[currentId * 2]);
    const valIndex = arr.findIndex((el) => el === currentId);

    for (let i = 0; i < spaces.length; i++) {
      const { start, size } = spaces[i];

      if (size >= spacesRequired && start < valIndex) {
        for (let j = 0; j < spacesRequired; j++) {
          arr[start + j] = currentId;
          arr[valIndex + j] = 0;
        }
        if (size === spacesRequired) {
          spaces.splice(i, 1);
        } else {
          spaces[i] = {
            start: start + spacesRequired,
            size: size - spacesRequired,
          };
        }

        break;
      }
    }
  }

  const checkSum = arr.reduce((a, b, i) => a + b * i, 0);
  return checkSum;
}

console.log(partTwo());
