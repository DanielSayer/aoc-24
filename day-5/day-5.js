const fs = require("fs");

function readRules() {
  const lines = fs.readFileSync("./day-5/rules.txt", "utf8").split("\n");
  return lines.map((line) => line.split("|").map((x) => parseInt(x)));
}

function readUpates() {
  const lines = fs.readFileSync("./day-5/updates.txt", "utf8").split("\n");
  return lines.map((line) => line.split(",").map((x) => parseInt(x)));
}
const forbiddenAfter = {};
const input = readRules();

for (let i = 0; i < input.length; i++) {
  const [a, b] = input[i];
  forbiddenAfter[b] = forbiddenAfter[b]?.add(a) || new Set([a]);
}

function isValid(series) {
  let isValid = true;

  for (let i = 0; i < series.length; i++) {
    const val = series[i];

    for (let j = i + 1; j < series.length; j++) {
      const nextVal = series[j];
      if (forbiddenAfter[val]?.has(nextVal)) {
        isValid = false;
        break;
      }
    }
  }

  return isValid;
}

function partOne() {
  const seriesList = readUpates();
  const validSeries = seriesList.filter(isValid);
  const validSeriesCenter = validSeries.map(
    (series) => series[(series.length - 1) / 2]
  );

  return validSeriesCenter.reduce((a, b) => a + b, 0);
}

function partTwo() {
  const seriesList = readUpates();
  const invalidSeries = seriesList.filter((series) => !isValid(series));

  const invalidSeriesCenters = invalidSeries.map(getMiddle);
  return invalidSeriesCenters.reduce((a, b) => a + b, 0);

  function getMiddle(series) {
    for (let i = 0; i < series.length; i++) {
      const seriesTemp = [...series];
      const val = series[i];
      seriesTemp.splice(i, 1);
      const forbiddenAfterVal = forbiddenAfter[val] || new Set();

      const focusedFAV = forbiddenAfterVal.intersection(
        new Set([...seriesTemp])
      );

      if (focusedFAV.size === (series.length - 1) / 2) {
        return val;
      }
    }

    return middle;
  }
}

console.log(partOne());
console.log(partTwo());
