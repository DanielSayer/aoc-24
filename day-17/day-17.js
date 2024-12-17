const instructionsInput = "2,4,1,5,7,5,1,6,4,2,5,5,0,3,3,0";
const instructions = instructionsInput.split(",").map((x) => BigInt(x));

let REGISTER_A = 33940147n;
let REGISTER_B = 0n;
let REGISTER_C = 0n;

function getComboOperand(operand) {
  if (operand === 4n) return REGISTER_A;
  if (operand === 5n) return REGISTER_B;
  if (operand === 6n) return REGISTER_C;
  if (operand >= 7n) {
    throw new Error("Invalid operand");
  }

  return operand;
}

function runInstructions(instructions) {
  const results = [];

  for (let i = 0; i < instructions.length; ) {
    const opcode = instructions[i];
    const operand = instructions[i + 1];
    const comboOperand = getComboOperand(operand);

    switch (opcode) {
      case 0n:
        REGISTER_A = REGISTER_A / 2n ** comboOperand;
        break;
      case 1n:
        REGISTER_B ^= operand;
        break;
      case 2n:
        REGISTER_B = comboOperand % 8n;
        break;
      case 3n:
        if (REGISTER_A === 0n) break;
        i = Number(operand);
        continue;
      case 4n:
        REGISTER_B ^= REGISTER_C;
        break;
      case 5n:
        results.push(comboOperand % 8n);
        break;
      case 6n:
        REGISTER_B = REGISTER_A / 2n ** comboOperand;
        break;
      case 7n:
        REGISTER_C = REGISTER_A / 2n ** comboOperand;
        break;
    }

    i += 2;
  }
  return results.map((x) => x.toString()).join(",");
}

function partOne() {
  return runInstructions(instructions);
}

function partTwo() {
  let i = 0n;
  while (true) {
    REGISTER_A = i;
    REGISTER_B = 0;
    REGISTER_C = 0;

    const result = runInstructions(instructions);

    if (result === instructionsInput) {
      return i;
    }

    if (instructionsInput.endsWith(result)) {
      i = i * 8n;
    } else {
      i++;
    }
  }
}

console.log(partOne());
console.log(partTwo());
