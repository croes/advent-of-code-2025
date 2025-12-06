import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const lines = input.split('\n').map(line => line.trim());

let answer = 0;

const problems: number[][] = [];
let operators: string[] = lines[lines.length - 1]!.split(' ').filter(l => l.trim() !== '');

for (let i = 0; i < lines.length - 1; i++) {
  const line = lines[i]!;
  const numbers = line.split(' ').filter(c => c.trim() !== '').map( char => parseInt(char, 10));
  for (let j = 0; j < numbers.length; j++) {
    if (!problems[j]) {
      problems[j] = [];
    }
    problems[j].push(numbers[j]);
  }
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function mult(arr: number[]): number {
  return arr.reduce((a, b) => a * b, 1);
}

for (let p = 0; p < problems.length; p++) {
  const problem = problems[p];
  const operator = operators[p];
  answer += operator === "*" ? mult(problem) : sum(problem);
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
