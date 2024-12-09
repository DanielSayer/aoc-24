const fs = require("fs");

const input = fs.readFileSync("./day-9/input.txt", "utf8").trim();

function partOne() {
  let id = 0;
  let spaceUsed = 0;
  const arr = [];
  const freeSpaceIndices = [];
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

  function pushNTimes(n, value) {
    for (let i = 0; i < n; i++) {
      arr.push(value);
    }
  }

  while (freeSpaceIndices.length > 0 && arr.length > spaceUsed) {
    const lastEl = arr.pop();
    if (lastEl === ".") {
      continue;
    }

    const firstAvailableIndex = freeSpaceIndices.shift();
    if (firstAvailableIndex > spaceUsed) {
      continue;
    }
    arr[firstAvailableIndex] = lastEl;
  }

  const spacedArr = arr.map(Number);

  const checkSum = spacedArr.reduce((a, b, i) => a + b * i, 0);

  return checkSum;
}

function partTwo() {
  const startTime = Date.now();

  let id = 0;
  const arr = [];
  const spaces = {};

  for (let i = 0; i < input.length; i++) {
    const num = Number(input[i]);

    if (i % 2 === 0) {
      pushNTimes(num, id);
      id++;
    } else {
      if (num === 0) continue;
      spaces[arr.length] = num;
      pushNTimes(num, 0);
    }
  }

  function pushNTimes(n, value) {
    for (let i = 0; i < n; i++) {
      arr.push(value);
    }
  }

  const lastId = id - 1;
  Array.from({ length: lastId }, (_, i) => lastId - i).forEach((val) => {
    const spacesRequired = Number(input[val * 2]);

    Object.keys(spaces).every((key) => {
      const index = Number(key);
      const spaceAvailable = spaces[index];
      if (spaceAvailable >= spacesRequired) {
        const valIndex = arr.findIndex((el) => el === val);
        if (index > valIndex) return true;

        spaces[index + spacesRequired] = spaceAvailable - spacesRequired;
        delete spaces[index];

        for (let i = 0; i < spacesRequired; i++) {
          arr[valIndex + i] = 0;
          arr[index + i] = val;
        }

        return false;
      }
      return true;
    });
  });

  const checkSum = arr.reduce((a, b, i) => a + b * i, 0);

  const endTime = Date.now();
  console.log((endTime - startTime) * 1000);
  return checkSum;
}

console.log(partTwo());
