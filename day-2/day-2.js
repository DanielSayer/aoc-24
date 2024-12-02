const fs = require("fs");

function getReports() {
  const input = fs.readFileSync("./day-2/input.txt", "utf8");
  const lines = input.trim().split("\n");
  return lines.map((line) => line.split(" ").map(Number));
}

function isSafeReport(levels) {
  let isSafe = true;
  let prevDiff;

  levels.forEach((level, i) => {
    if (i === 0) return;
    const prev = levels[i - 1];
    const diff = level - prev;

    if (prevDiff && Math.sign(prevDiff) !== Math.sign(diff)) {
      isSafe = false;
      return;
    }

    prevDiff = diff;
    const diffMagnitude = Math.abs(diff);
    if (diffMagnitude < 1 || diffMagnitude > 3) {
      isSafe = false;
    }
  });

  return isSafe;
}

function partOne() {
  const reports = getReports();
  const safeReports = reports.filter(isSafeReport);
  return safeReports.length;
}

function partTwo() {
  let safeReports = 0;
  const reports = getReports();

  reports.forEach((report) => {
    if (isSafeReport(report)) {
      safeReports++;
      return;
    }

    for (let i = 0; i < report.length; i++) {
      const reportCopy = [...report];
      reportCopy.splice(i, 1);
      if (isSafeReport(reportCopy)) {
        safeReports++;
        break;
      }
    }
  });

  return safeReports;
}

console.log(partOne());
console.log(partTwo());
