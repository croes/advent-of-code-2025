import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const lines = input.split('\n').filter((line) => line.length > 0);

let answer = 0;

const problems: number[][] = [];
const operatorsLine: string = lines[lines.length - 1];
const operators: string[] = [];

let i = 0;
while (i < operatorsLine.length) {
  let operator = operatorsLine[i];
  operators.push(operator);
  let problemWidth = 1;
  while (operatorsLine[i + problemWidth] === ' ') {
    problemWidth++;
  }
  const problem: number[] = [];

  for (let j = problemWidth - 1; j >= 0; j--) {
    let numberStr = "";
    for (let l = 0; l < lines.length - 1; l++) {
      if ((i + j) < lines[l].length) {
        numberStr += lines[l][i + j];
      } else {
        numberStr += " ";
      }
    }
    numberStr = numberStr.trim();
    if (numberStr.length >= 1) {
      const number = parseInt(numberStr, 10);
      problem.push(number);
    }
  }
  problems.push(problem);
  i += problemWidth;
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function mult(arr: number[]): number {
  return arr.reduce((a, b) => a * b, 1);
}

for (let p = problems.length - 1; p >= 0; p--) {
  const problem = problems[p];
  const operator = operators[p];
  answer += operator === "*" ? mult(problem) : sum(problem);
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
