import { readFileSync } from 'fs';

// Read and parse input, relative to this scripts location. __dirname doesn't exist in ES modules.
const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const lines = input.split('\n').filter(line => line.trim() !== '');

let pos = 50;
const max = 100;

let nbOfZeroes = 0;

for (const line of lines) {
  const sign = line[0];
  const number = parseInt(line.slice(1), 10);

  if (sign === 'R') {
    pos += number;
  } else if (sign === 'L') {
    pos -= number;
  }

  pos = pos % max;

  if (pos === 0) {
    nbOfZeroes++;
  }
}

console.log(nbOfZeroes);